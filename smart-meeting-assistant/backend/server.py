import os
import re
import json
import sqlite3
import subprocess
from datetime import datetime
from typing import List, Dict, Optional, Tuple

import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance


DEFAULT_MODEL = os.getenv("CHATBOT_MODEL", "mistral")
DB_FILE = os.getenv("CHATBOT_DB", "chat_memory.db")
QDRANT_PATH = os.getenv("CHATBOT_QDRANT_PATH", "./memory_qdrant")
SIMILARITY_THRESHOLD = 0.65

MODEL_CONTEXT_DEFAULTS = {
    "mistral": 8192,
    "mistral:7b": 8192,
    "mistral:8x7b": 32768,
    "llama2": 4096,
    "llama2:7b": 4096,
    "llama2:13b": 4096,
    "llama2:70b": 4096,
    "llama3": 8192,
    "llama3:8b": 8192,
    "llama3:70b": 8192,
    "gemma": 8192,
    "gemma:7b": 8192,
    "gemma:2b": 8192,
    "qwen": 32768,
    "qwen:7b": 32768,
    "qwen:14b": 32768,
}


def get_model_context_window(model_name: str, default: int = 4000) -> int:
    try:
        result = subprocess.run(
            ["ollama", "show", model_name],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
        )
        output = result.stdout.decode("utf-8")
        match = re.search(r"(\d+)\s*(tokens|context length|ctx)", output.lower())
        if match:
            return int(match.group(1))
        try:
            data = json.loads(output)
            if "context_length" in data:
                return int(data["context_length"])
        except Exception:
            pass
    except Exception:
        pass
    for key, val in MODEL_CONTEXT_DEFAULTS.items():
        if model_name.lower().startswith(key):
            return val
    return default


# Load models and clients
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
try:
    tokenizer = AutoTokenizer.from_pretrained("gpt2")
except Exception:
    tokenizer = None

# Qdrant client
os.makedirs(QDRANT_PATH, exist_ok=True)
client = QdrantClient(path=QDRANT_PATH)

MODEL_NAME = DEFAULT_MODEL
sanitized_model = re.sub(r'[^a-zA-Z0-9_]', '_', MODEL_NAME.lower())
if sanitized_model and sanitized_model[0].isdigit():
    sanitized_model = f"model_{sanitized_model}"
COLLECTION_NAME = f"chat_{sanitized_model}"[:64] or "chat_default"


def ensure_qdrant_collection():
    try:
        collections = client.get_collections().collections
        if not any(col.name == COLLECTION_NAME for col in collections):
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )
    except Exception:
        # fallback to default
        global COLLECTION_NAME
        COLLECTION_NAME = "chat_default"
        collections = client.get_collections().collections
        if not any(col.name == COLLECTION_NAME for col in collections):
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )


def ensure_tables():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            input_tokens INTEGER,
            output_tokens INTEGER,
            origin TEXT DEFAULT 'live',
            created_at TEXT DEFAULT (datetime('now'))
        )
        """
    )
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS meta (
            key TEXT PRIMARY KEY,
            value TEXT
        )
        """
    )
    c.execute("INSERT OR IGNORE INTO meta(key, value) VALUES('last_idx', '0')")
    conn.commit()
    conn.close()


def count_tokens(text: str) -> int:
    if tokenizer:
        try:
            return len(tokenizer.encode(text))
        except Exception:
            return len(text.split())
    return len(text.split())


def get_embedding(text: str):
    return embed_model.encode(text).tolist()


def set_meta(key: str, value: str):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)", (key, value))
    conn.commit()
    conn.close()


def get_meta(key: str) -> Optional[str]:
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT value FROM meta WHERE key = ?", (key,))
    row = c.fetchone()
    conn.close()
    return row[0] if row else None


def load_last_idx_from_meta() -> int:
    ensure_tables()
    v = get_meta("last_idx")
    if v is not None:
        return int(v)
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT MAX(id) FROM memory")
    r = c.fetchone()
    conn.close()
    return int(r[0]) if r and r[0] else 0


def log_to_sql(role, content, input_tokens=None, output_tokens=None, origin="live"):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    timestamp = datetime.utcnow().isoformat()
    c.execute(
        "INSERT INTO memory (role, content, input_tokens, output_tokens, origin, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (role, content, input_tokens, output_tokens, origin, timestamp),
    )
    conn.commit()
    conn.close()


def store_turn_in_qdrant(idx: int, user_text: str, assistant_text: Optional[str] = None, origin: str = "live", input_tokens: Optional[int] = None, output_tokens: Optional[int] = None):
    if assistant_text is not None:
        text = f"User: {user_text}\nAssistant: {assistant_text}"
        payload = {
            "role": "pair",
            "user": user_text,
            "assistant": assistant_text,
            "origin": origin,
        }
    else:
        text = user_text
        payload = {"role": "single", "text": text, "origin": origin}

    emb = get_embedding(text)
    client.upsert(collection_name=COLLECTION_NAME, points=[PointStruct(id=idx, vector=emb, payload=payload)])

    if assistant_text is not None:
        log_to_sql("user", user_text, input_tokens, None, origin=origin)
        log_to_sql("assistant", assistant_text, None, output_tokens, origin=origin)
    else:
        log_to_sql("user", user_text, input_tokens, None, origin=origin)
    set_meta("last_idx", str(idx))


def _cosine_similarity_vecs(a: List[float], b: List[float]) -> float:
    a_np = np.array(a, dtype=float)
    b_np = np.array(b, dtype=float)
    if np.linalg.norm(a_np) == 0 or np.linalg.norm(b_np) == 0:
        return 0.0
    return float(np.dot(a_np, b_np) / (np.linalg.norm(a_np) * np.linalg.norm(b_np)))


def retrieve_context(query_text: str, top_k: int = 5, min_score: float = SIMILARITY_THRESHOLD) -> List[Dict[str, str]]:
    try:
        query_vector = get_embedding(query_text)
        results = client.search(collection_name=COLLECTION_NAME, query_vector=query_vector, limit=top_k, with_payload=True)
    except Exception:
        return []

    retrieved: List[Dict[str, str]] = []
    for r in results:
        payload = r.payload or {}
        role = payload.get("role")
        try:
            point = client.retrieve(collection_name=COLLECTION_NAME, ids=[r.id], with_vectors=True)
            if not point:
                continue
            stored_vector = point[0].vector
            sim = _cosine_similarity_vecs(query_vector, stored_vector)
        except Exception:
            continue
        if sim < min_score:
            continue
        if role == "pair":
            retrieved.append({
                "text": f"User: {payload.get('user','')}\nAssistant: {payload.get('assistant','')}",
                "source": f"Qdrant id:{r.id} (sim:{sim:.3f})",
                "score": sim,
            })
        else:
            retrieved.append({
                "text": payload.get("text", ""),
                "source": f"Qdrant id:{r.id} (sim:{sim:.3f})",
                "score": sim,
            })
    return retrieved


def assemble_prompt(active_context: List[Dict[str, str]], retrieved: List[Dict[str, str]], user_input: str) -> str:
    system_message = (
        "You are a helpful assistant with access to both recent conversation context and retrieved past conversations.\n\n"
        "IMPORTANT: Some older messages may have been moved to long-term storage. If asked about previous questions or conversations, check the retrieved messages first.\n\n"
        "When answering questions about previous conversations:\n"
        "1. First check the retrieved messages for relevant history\n"
        "2. If the information isn't in retrieved messages, you can infer from context\n"
        "3. Be honest if you don't have the information\n\n"
        "Cite sources by their number in square brackets, e.g. [1], [2]. If none apply, answer normally.\n"
    )
    parts = [system_message]
    if retrieved:
        parts.append("\nRelevant retrieved messages (with source IDs):\n" + "\n".join([f"[{i+1}] {r['text']}  (Source: {r['source']})" for i, r in enumerate(retrieved)]))
    for msg in active_context:
        parts.append(f"{msg['role'].capitalize()}: {msg['content']}")
    parts.append(f"User: {user_input}")
    parts.append("Assistant:")
    return "\n".join(parts)


def ask_ollama(prompt: str) -> str:
    cmd = ["ollama", "run", MODEL_NAME]
    try:
        result = subprocess.run(cmd, input=prompt.encode("utf-8"), stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return result.stdout.decode("utf-8").strip()
    except subprocess.CalledProcessError as e:
        return f"Error: Ollama CLI failed. {e.stderr.decode('utf-8')}"


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    retrieved: List[Dict[str, str]] = []


@app.on_event("startup")
def on_start():
    ensure_qdrant_collection()
    ensure_tables()


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_NAME}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    # Load recent context from sqlite (last 20 rows)
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT role, content FROM memory ORDER BY id DESC LIMIT 20")
    rows = c.fetchall()
    conn.close()
    active_context = [{"role": r[0], "content": r[1]} for r in reversed(rows)]

    retrieved = retrieve_context(req.message, top_k=5)
    prompt = assemble_prompt(active_context, retrieved, req.message)

    input_tokens = count_tokens(req.message)
    reply = ask_ollama(prompt)
    output_tokens = count_tokens(reply)

    last_idx = load_last_idx_from_meta()
    idx = last_idx + 1
    store_turn_in_qdrant(idx, req.message, reply, origin="live", input_tokens=input_tokens, output_tokens=output_tokens)

    return ChatResponse(reply=reply, retrieved=retrieved)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


