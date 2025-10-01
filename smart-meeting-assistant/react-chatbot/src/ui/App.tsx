import React, { useMemo, useRef, useState } from 'react'

type Retrieved = { text: string; source: string; score?: number }

export default function App() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [retrieved, setRetrieved] = useState<Retrieved[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000')
  const scrollRef = useRef<HTMLDivElement>(null)

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading])

  async function send() {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const r = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await r.json()
      const reply: string = data.reply ?? 'No response'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setRetrieved(Array.isArray(data.retrieved) ? data.retrieved : [])
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Chat service unavailable.' }])
    } finally {
      setLoading(false)
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', height: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #eee' }}>
        <header style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ margin: 0 }}>Context-Aware Chatbot</h3>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={backendUrl} onChange={(e) => setBackendUrl(e.target.value)} placeholder="Backend URL" style={{ padding: 6, border: '1px solid #ccc', borderRadius: 6, width: 240 }} />
          </div>
        </header>
        <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: 16, background: '#fafafa' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 8, display: 'flex' }}>
              <div style={{ fontWeight: 600, width: 88, color: m.role === 'user' ? '#2563eb' : '#16a34a' }}>{m.role.toUpperCase()}</div>
              <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 10, maxWidth: 800 }}>{m.content}</div>
            </div>
          ))}
          {loading && <div style={{ color: '#6b7280', fontSize: 14 }}>Generating...</div>}
        </div>
        <footer style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canSend && send()}
            placeholder="Type your message..."
            style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 8 }}
          />
          <button disabled={!canSend} onClick={send} style={{ padding: '10px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8 }}>
            Send
          </button>
        </footer>
      </div>
      <aside style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 12, borderBottom: '1px solid #eee' }}>
          <h4 style={{ margin: 0 }}>Retrieved Context</h4>
        </div>
        <div style={{ padding: 12, overflow: 'auto' }}>
          {retrieved.length === 0 && <div style={{ color: '#6b7280', fontSize: 14 }}>No retrieved messages.</div>}
          {retrieved.map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>[{i + 1}] {r.source}</div>
              <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 10, whiteSpace: 'pre-wrap' }}>{r.text}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}


