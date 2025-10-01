// main.js - Corrected version
console.log('main.js loaded successfully');

// Import icons from lucide.js
import { 
  MessageSquare, 
  CheckSquare, 
  BarChart3, 
  Calendar, 
  Search, 
  Send,
  User,
  Bot,
  Download,
  Share2,
  createIconElement,
  getIconHTMLByName
} from './lucide.js';

// Mock data for demonstration
const mockMeetingData = {
  transcript: `John: Okay team, let's start the weekly meeting. First item on the agenda is the Q2 budget.
Alice: I've reviewed the projections and we're about 15% over budget in marketing.
John: That's concerning. What's driving that overage?
Alice: Mostly the new digital campaign that we launched last month.
Bob: I suggested we pause that campaign until we reassess our spending.
John: Good idea Bob. Let's put the campaign on hold for two weeks. Alice, can you prepare a revised budget?
Alice: Yes, I'll have it ready by next Tuesday.
John: Great. Now moving to project timelines...`,
  
  summary: {
    keyPoints: [
      "Marketing is 15% over budget for Q2",
      "Digital campaign identified as primary cause",
      "Campaign will be paused for two weeks"
    ],
    actionItems: [
      { id: 1, text: "Alice to prepare revised budget", assignee: "Alice", dueDate: "2023-06-13", status: "todo" },
      { id: 2, text: "Bob to pause digital campaign", assignee: "Bob", dueDate: "2023-06-08", status: "inProgress" }
    ],
    decisions: [
      "Pause digital campaign for two weeks",
      "Reassess marketing budget allocation"
    ]
  }
};

// Helper function to get icon HTML
function getIconHTML(iconName, props = {}) {
  return getIconHTMLByName(iconName, props);
}

// Main App Component
function SmartMeetingAssistant() {
  const app = document.createElement('div');
  app.className = 'min-h-screen bg-gray-50';
  
  // State management
  let activeTab = 'transcript';
  let searchQuery = '';
  let chatMessages = [
    { id: 1, text: "Hello! I'm your meeting assistant. Ask me anything about this meeting.", sender: 'bot' }
  ];
  let newMessage = '';
  
  // Create the app UI
  app.innerHTML = `
    ${createHeader()}
    ${createMainContent()}
  `;
  
  // Set up event listeners after rendering
  setTimeout(() => {
    setupEventListeners();
  }, 0);
  
  function createHeader() {
    const downloadIcon = Download({ class: 'w-4 h-4 mr-1' });
    const shareIcon = Share2({ class: 'w-4 h-4 mr-1' });
    
    return `
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-xl font-semibold text-gray-900">Smart Meeting Assistant</h1>
          <div class="flex space-x-3">
            <button class="jira-button jira-button--secondary export-btn">
              ${downloadIcon.outerHTML} Export
            </button>
            <button class="jira-button jira-button--primary share-btn">
              ${shareIcon.outerHTML} Share
            </button>
          </div>
        </div>
      </header>
    `;
  }
  
  function createMainContent() {
    return `
      <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Left Column - Transcript and Summary -->
          <div class="w-full lg:w-2/3">
            ${createTabNavigation()}
            <div class="mt-4 tab-content">
              ${activeTab === 'transcript' ? createTranscriptTab() : 
                activeTab === 'summary' ? createSummaryTab() : 
                createAnalyticsTab()}
            </div>
          </div>

          <!-- Right Column - Q&A Chatbot -->
          <div class="w-full lg:w-1/3">
            ${createChatbot()}
          </div>
        </div>
      </main>
    `;
  }
  
  function createTabNavigation() {
    const transcriptIcon = MessageSquare({ class: 'w-4 h-4 inline mr-1' });
    const summaryIcon = CheckSquare({ class: 'w-4 h-4 inline mr-1' });
    const analyticsIcon = BarChart3({ class: 'w-4 h-4 inline mr-1' });
    
    return `
      <div class="flex border-b border-gray-200">
        <button class="transcript-tab py-3 px-4 font-medium text-sm ${activeTab === 'transcript' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}">
          ${transcriptIcon.outerHTML} Transcript
        </button>
        <button class="summary-tab py-3 px-4 font-medium text-sm ${activeTab === 'summary' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}">
          ${summaryIcon.outerHTML} Summary
        </button>
        <button class="analytics-tab py-3 px-4 font-medium text-sm ${activeTab === 'analytics' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}">
          ${analyticsIcon.outerHTML} Analytics
        </button>
      </div>
    `;
  }
  
  function createTranscriptTab() {
    const searchIcon = Search({ class: 'text-gray-400' });
    
    return `
      <div class="jira-card">
        <div class="flex mb-4">
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              ${searchIcon.outerHTML}
            </div>
            <input type="text" class="search-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search transcript..." value="${searchQuery}">
          </div>
          <button class="search-btn ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            Search
          </button>
        </div>
        <div class="transcript-container h-96 overflow-y-auto p-3 bg-gray-50 rounded-md custom-scrollbar">
          <p class="text-gray-700 whitespace-pre-line">${highlightText(mockMeetingData.transcript, searchQuery)}</p>
        </div>
      </div>
    `;
  }
  
  function createSummaryTab() {
    const calendarIcon = Calendar({ class: 'w-3 h-3 mr-1 inline' });
    
    return `
      <div class="jira-card">
        <div class="jira-grid">
          <!-- Key Points -->
          <div class="jira-card">
            <h3 class="font-medium text-blue-800 mb-2">Key Points</h3>
            <ul class="list-disc list-inside space-y-1 text-blue-700">
              ${mockMeetingData.summary.keyPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
          </div>

          <!-- Action Items -->
          <div class="jira-card">
            <h3 class="font-medium text-green-800 mb-2">Action Items</h3>
            <div class="space-y-2">
              ${mockMeetingData.summary.actionItems.map(item => `
                <div class="action-item jira-card" data-id="${item.id}">
                  <div class="flex items-start">
                    <input type="checkbox" class="mt-1 mr-2" ${item.status !== 'todo' ? 'checked' : ''}>
                    <div class="flex-1">
                      <p class="text-sm text-green-700">${item.text}</p>
                      <div class="flex items-center mt-1 text-xs text-green-600">
                        <span class="jira-user">
                          <span class="jira-user-avatar">${item.assignee.charAt(0)}</span>
                          ${item.assignee}
                        </span>
                        <span class="ml-3">
                          ${calendarIcon.outerHTML}
                          ${item.dueDate}
                        </span>
                        <span class="ml-3 jira-tag jira-tag--${getStatusTagClass(item.status)}">
                          <span class="status-indicator status-indicator--${item.status}"></span>
                          ${item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Decisions -->
          <div class="jira-card">
            <h3 class="font-medium text-yellow-800 mb-2">Decisions</h3>
            <ul class="list-disc list-inside space-y-1 text-yellow-700">
              ${mockMeetingData.summary.decisions.map(decision => `<li>${decision}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }
  
  function getStatusTagClass(status) {
    switch(status) {
      case 'todo': return 'blue';
      case 'inProgress': return 'yellow';
      case 'completed': return 'green';
      default: return 'blue';
    }
  }
  
  function createAnalyticsTab() {
    return `
      <div class="jira-card">
        <h3 class="font-medium text-gray-800 mb-4">Meeting Analytics</h3>
        <div class="jira-grid">
          <div class="jira-card">
            <h4 class="text-sm font-medium text-gray-600 mb-2">Action Items Status</h4>
            <div class="h-48 flex items-center justify-center bg-gray-50 rounded">
              <div class="pie-chart">
                <div class="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-green-500 relative">
                  <div class="absolute inset-4 bg-white rounded-full"></div>
                </div>
                <div class="mt-2 text-center">
                  <div class="flex justify-center items-center space-x-2">
                    <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span class="text-xs">Completed: 1</span>
                  </div>
                  <div class="flex justify-center items-center space-x-2">
                    <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span class="text-xs">In Progress: 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="jira-card">
            <h4 class="text-sm font-medium text-gray-600 mb-2">Meeting Trends</h4>
            <div class="h-48 flex items-center justify-center bg-gray-50 rounded">
              <div class="line-chart w-full px-4">
                <div class="flex items-end h-32 space-x-2 justify-center">
                  <div class="flex flex-col items-center">
                    <div class="w-8 bg-blue-500 rounded-t" style="height: 40px"></div>
                    <span class="text-xs mt-1">Mon</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <div class="w-8 bg-blue-500 rounded-t" style="height: 60px"></div>
                    <span class="text-xs mt-1">Tue</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <div class="w-8 bg-blue-500 rounded-t" style="height: 80px"></div>
                    <span class="text-xs mt-1">Wed</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <div class="w-8 bg-blue-500 rounded-t" style="height: 70px"></div>
                    <span class="text-xs mt-1">Thu</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <div class="w-8 bg-blue-500 rounded-t" style="height: 50px"></div>
                    <span class="text-xs mt-1">Fri</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  function createChatbot() {
    const sendIcon = Send({ class: 'w-4 h-4' });
    const botIcon = Bot({ class: 'w-4 h-4 text-indigo-600' });
    const userIcon = User({ class: 'w-4 h-4 text-gray-600' });
    
    return `
      <div class="chatbot jira-card h-full flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-900">Meeting Assistant</h3>
          <p class="text-xs text-gray-500">Ask questions about this meeting</p>
        </div>
        
        <div class="chat-messages flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          ${chatMessages.map(msg => `
            <div class="flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} chat-message">
              ${msg.sender === 'bot' ? `
                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                  ${botIcon.outerHTML}
                </div>
              ` : ''}
              <div class="max-w-xs md:max-w-md rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}">
                <p class="text-sm">${msg.text}</p>
              </div>
              ${msg.sender === 'user' ? `
                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ml-2">
                  ${userIcon.outerHTML}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        <div class="px-4 py-3 border-t border-gray-200">
          <div class="flex">
            <input type="text" class="chat-input flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ask a question..." value="${newMessage}">
            <button class="send-btn ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
              ${sendIcon.outerHTML}
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  function highlightText(text, query) {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? `<mark class="highlight">${part}</mark>` 
        : part
    ).join('');
  }
  
  function setupEventListeners() {
    // Tab switching
    const transcriptTab = app.querySelector('.transcript-tab');
    const summaryTab = app.querySelector('.summary-tab');
    const analyticsTab = app.querySelector('.analytics-tab');
    
    if (transcriptTab) transcriptTab.addEventListener('click', () => switchTab('transcript'));
    if (summaryTab) summaryTab.addEventListener('click', () => switchTab('summary'));
    if (analyticsTab) analyticsTab.addEventListener('click', () => switchTab('analytics'));
    
    // Search functionality
    const searchBtn = app.querySelector('.search-btn');
    const searchInput = app.querySelector('.search-input');
    
    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }
    
    // Chat functionality
    const sendBtn = app.querySelector('.send-btn');
    const chatInput = app.querySelector('.chat-input');
    
    if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
      });
    }
    
    // Export and share buttons
    const exportBtn = app.querySelector('.export-btn');
    const shareBtn = app.querySelector('.share-btn');
    
    if (exportBtn) exportBtn.addEventListener('click', handleExport);
    if (shareBtn) shareBtn.addEventListener('click', handleShare);
  }
  
  function switchTab(tabName) {
    activeTab = tabName;
    
    // Update tab styles
    const transcriptTab = app.querySelector('.transcript-tab');
    const summaryTab = app.querySelector('.summary-tab');
    const analyticsTab = app.querySelector('.analytics-tab');
    
    if (transcriptTab) {
      transcriptTab.className = `transcript-tab py-3 px-4 font-medium text-sm ${tabName === 'transcript' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`;
    }
    if (summaryTab) {
      summaryTab.className = `summary-tab py-3 px-4 font-medium text-sm ${tabName === 'summary' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`;
    }
    if (analyticsTab) {
      analyticsTab.className = `analytics-tab py-3 px-4 font-medium text-sm ${tabName === 'analytics' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`;
    }
    
    // Update content
    const tabContent = app.querySelector('.tab-content');
    if (tabContent) {
      if (tabName === 'transcript') {
        tabContent.innerHTML = createTranscriptTab();
      } else if (tabName === 'summary') {
        tabContent.innerHTML = createSummaryTab();
      } else if (tabName === 'analytics') {
        tabContent.innerHTML = createAnalyticsTab();
      }
      
      // Reattach event listeners
      setTimeout(() => {
        if (tabName === 'transcript') {
          const searchBtn = app.querySelector('.search-btn');
          const searchInput = app.querySelector('.search-input');
          
          if (searchBtn) searchBtn.addEventListener('click', handleSearch);
          if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') handleSearch();
            });
          }
        }
      }, 0);
    }
  }
  
  function handleSearch() {
    const searchInput = app.querySelector('.search-input');
    if (searchInput) {
      searchQuery = searchInput.value;
      const transcriptContainer = app.querySelector('.transcript-container');
      if (transcriptContainer) {
        transcriptContainer.innerHTML = `<p class="text-gray-700 whitespace-pre-line">${highlightText(mockMeetingData.transcript, searchQuery)}</p>`;
      }
    }
  }
  
  function handleSendMessage() {
    const chatInput = app.querySelector('.chat-input');
    if (chatInput) {
      const message = chatInput.value.trim();
      
      if (message) {
        // Add user message
        chatMessages.push({
          id: chatMessages.length + 1,
          text: message,
          sender: 'user'
        });
        
        // Clear input
        chatInput.value = '';
        newMessage = '';
        
        // Update chat UI
        updateChatMessages();
        
        // Simulate bot response after a short delay
        setTimeout(() => {
          const botResponse = generateBotResponse(message);
          chatMessages.push({
            id: chatMessages.length + 1,
            text: botResponse,
            sender: 'bot'
          });
          updateChatMessages();
          scrollChatToBottom();
        }, 1000);
      }
    }
  }
  
  function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('marketing')) {
      return "Based on the meeting, marketing is 15% over budget for Q2, primarily due to the new digital campaign. The team decided to pause the campaign for two weeks.";
    } else if (lowerMessage.includes('action') || lowerMessage.includes('task')) {
      return "There are 2 action items: 1) Alice needs to prepare a revised budget by next Tuesday, and 2) Bob needs to pause the digital campaign.";
    } else if (lowerMessage.includes('decision')) {
      return "The main decisions were: 1) Pause the digital campaign for two weeks, and 2) Reassess the marketing budget allocation.";
    } else if (lowerMessage.includes('campaign')) {
      return "The digital campaign was identified as the primary cause for the budget overage. It will be paused for two weeks while the budget is reassessed.";
    } else {
      return "I can help answer questions about the budget, action items, decisions, or the digital campaign discussed in the meeting. What would you like to know?";
    }
  }
  
  function updateChatMessages() {
    const chatMessagesContainer = app.querySelector('.chat-messages');
    if (chatMessagesContainer) {
      const botIcon = Bot({ class: 'w-4 h-4 text-indigo-600' });
      const userIcon = User({ class: 'w-4 h-4 text-gray-600' });
      
      chatMessagesContainer.innerHTML = chatMessages.map(msg => `
        <div class="flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} chat-message">
          ${msg.sender === 'bot' ? `
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
              ${botIcon.outerHTML}
            </div>
          ` : ''}
          <div class="max-w-xs md:max-w-md rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}">
            <p class="text-sm">${msg.text}</p>
          </div>
          ${msg.sender === 'user' ? `
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ml-2">
              ${userIcon.outerHTML}
            </div>
          ` : ''}
        </div>
      `).join('');
      
      scrollChatToBottom();
    }
  }
  
  function scrollChatToBottom() {
    const chatMessagesContainer = app.querySelector('.chat-messages');
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  }
  
  function handleExport() {
    alert('Export functionality would generate a PDF or text file with meeting notes and action items.');
  }
  
  function handleShare() {
    alert('Share functionality would allow you to share this meeting summary with colleagues.');
  }

  return app;
}

// Initialize the app
function initApp() {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    try {
      const meetingAssistant = SmartMeetingAssistant();
      appContainer.appendChild(meetingAssistant);
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
      appContainer.innerHTML = `
        <div class="p-4 bg-red-100 text-red-700 rounded">
          <h2 class="font-bold">Error Loading Application</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  } else {
    // If app container doesn't exist yet, wait and try again
    setTimeout(initApp, 100);
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already ready
  initApp();
}