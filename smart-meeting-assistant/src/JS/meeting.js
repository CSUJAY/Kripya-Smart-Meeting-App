// meeting.js - Dynamic functionality for Kripya Meeting Assistant

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initMeetingApp();
});

function initMeetingApp() {
    // Mobile menu functionality
    setupMobileMenu();
    
    // Navigation functionality
    setupNavigation();
    
    // Team selection functionality
    setupTeamSelection();
    
    // New meeting functionality
    setupNewMeeting();
    
    // Search functionality
    setupSearch();
    
    // Notification functionality
    setupNotifications();
    
    // Transcript functionality
    setupTranscript();
    
    // Meeting assistant functionality
    setupMeetingAssistant();
    
    // Action items functionality
    setupActionItems();
    
    // Simulate initial meeting data
    simulateMeetingData();
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');
    
    if (mobileMenuButton && sidebar && overlay) {
        mobileMenuButton.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// Navigation functionality
function setupNavigation() {
    const navItems = document.querySelectorAll('nav ul li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('text-blue-400', 'bg-gray-700');
                navItem.classList.add('text-gray-300');
            });
            
            // Add active class to clicked item
            this.classList.remove('text-gray-300');
            this.classList.add('text-blue-400', 'bg-gray-700');
            
            // Get the section name from the text content
            const sectionName = this.querySelector('span').textContent;
            
            // Update main content header
            updateHeader(sectionName);
            
            // Load section content (would be implemented based on actual app structure)
            loadSectionContent(sectionName.toLowerCase().replace(' ', '-'));
        });
    });
}

// Team selection functionality
function setupTeamSelection() {
    const teamItems = document.querySelectorAll('.flex.items-center.mb-3.p-2.rounded');
    
    teamItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove any existing active state (you might want to add a visual indicator)
            
            // Get the team name
            const teamName = this.querySelector('span').textContent;
            
            // Update the UI based on the selected team
            updateTeamContext(teamName);
        });
    });
}

// New meeting functionality
function setupNewMeeting() {
    const newMeetingBtn = document.querySelector('button:has(i.fa-plus)');
    
    if (newMeetingBtn) {
        newMeetingBtn.addEventListener('click', function() {
            createNewMeetingModal();
        });
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('input[type="text"][placeholder="Search meetings..."]');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    searchMeetings(searchTerm);
                }
            }
        });
    }
}

// Notification functionality
function setupNotifications() {
    const notificationBtn = document.querySelector('button:has(i.fa-bell)');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotifications();
        });
    }
}

// Transcript functionality
function setupTranscript() {
    const transcriptSendBtn = document.querySelector('.transcript-container + div button');
    const transcriptInput = document.querySelector('.transcript-container + div input');
    
    if (transcriptSendBtn && transcriptInput) {
        transcriptSendBtn.addEventListener('click', function() {
            sendTranscriptMessage(transcriptInput.value);
            transcriptInput.value = '';
        });
        
        transcriptInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendTranscriptMessage(this.value);
                this.value = '';
            }
        });
    }
}

// Meeting assistant functionality
function setupMeetingAssistant() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.meeting-assistant + div button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('text-blue-600', 'border-blue-500', 'font-medium');
                btn.classList.add('text-gray-500', 'border-transparent');
            });
            
            // Add active class to clicked tab
            this.classList.remove('text-gray-500', 'border-transparent');
            this.classList.add('text-blue-600', 'border-blue-500', 'font-medium');
            
            // Switch content based on tab
            const tabName = this.textContent.trim().toLowerCase();
            switchAssistantTab(tabName);
        });
    });
    
    // Assistant message sending
    const assistantSendBtn = document.querySelector('.meeting-assistant + div + div button');
    const assistantInput = document.querySelector('.meeting-assistant + div + div input');
    
    if (assistantSendBtn && assistantInput) {
        assistantSendBtn.addEventListener('click', function() {
            sendAssistantMessage(assistantInput.value);
            assistantInput.value = '';
        });
        
        assistantInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAssistantMessage(this.value);
                this.value = '';
            }
        });
    }
}

// Action items functionality
function setupActionItems() {
    // Checkbox toggling
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            toggleActionItem(this);
        });
    });
    
    // Add new action item
    const addActionItemBtn = document.querySelector('button:has(i.fa-plus) + button');
    
    if (addActionItemBtn) {
        addActionItemBtn.addEventListener('click', function() {
            addNewActionItem();
        });
    }
}

// Function to create new meeting modal
function createNewMeetingModal() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modalOverlay.id = 'newMeetingModal';
    
    // Create modal content
    modalOverlay.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Schedule New Meeting</h3>
            </div>
            <div class="px-6 py-4">
                <form id="newMeetingForm">
                    <div class="mb-4">
                        <label for="meetingTitle" class="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                        <input type="text" id="meetingTitle" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div class="mb-4">
                        <label for="meetingDate" class="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <input type="datetime-local" id="meetingDate" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div class="mb-4">
                        <label for="meetingParticipants" class="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                        <select id="meetingParticipants" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" multiple>
                            <option value="js">John Smith</option>
                            <option value="sd">Sarah Davis</option>
                            <option value="mj">Mike Johnson</option>
                            <option value="al">Amy Lee</option>
                        </select>
                        <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple participants</p>
                    </div>
                    <div class="mb-4">
                        <label for="meetingAgenda" class="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
                        <textarea id="meetingAgenda" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                </form>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button type="button" id="cancelMeeting" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="button" id="createMeeting" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Create Meeting</button>
            </div>
        </div>
    `;
    
    // Add modal to document
    document.body.appendChild(modalOverlay);
    
    // Add event listeners for modal buttons
    document.getElementById('cancelMeeting').addEventListener('click', function() {
        document.body.removeChild(modalOverlay);
    });
    
    document.getElementById('createMeeting').addEventListener('click', function() {
        const form = document.getElementById('newMeetingForm');
        if (form.checkValidity()) {
            createNewMeeting();
            document.body.removeChild(modalOverlay);
        } else {
            form.reportValidity();
        }
    });
}

// Function to create a new meeting
function createNewMeeting() {
    // Get form values
    const title = document.getElementById('meetingTitle').value;
    const dateTime = document.getElementById('meetingDate').value;
    const participants = Array.from(document.getElementById('meetingParticipants').selectedOptions)
        .map(option => option.textContent);
    const agenda = document.getElementById('meetingAgenda').value;
    
    // Create meeting object (in a real app, this would be sent to a server)
    const newMeeting = {
        id: 'MRR-' + new Date().getTime(),
        title,
        dateTime,
        participants,
        agenda,
        createdAt: new Date().toISOString()
    };
    
    // Show success message
    showNotification('Meeting scheduled successfully!', 'success');
    
    // In a real app, you would redirect to the new meeting or update the meetings list
    console.log('New meeting created:', newMeeting);
}

// Function to update header based on navigation
function updateHeader(sectionName) {
    const header = document.querySelector('header h2');
    if (header) {
        header.textContent = sectionName;
    }
}

// Function to load section content
function loadSectionContent(section) {
    // This would be implemented based on your application structure
    console.log('Loading section:', section);
}

// Function to update team context
function updateTeamContext(teamName) {
    // Update stats and content based on selected team
    const stats = document.querySelectorAll('.stat-card h3');
    
    // Simulate different data for different teams
    if (teamName === 'Design Team') {
        if (stats[0]) stats[0].textContent = '8';
        if (stats[1]) stats[1].textContent = '45m';
        if (stats[2]) stats[2].textContent = '24';
        if (stats[3]) stats[3].textContent = '15';
    } else if (teamName === 'Engineering') {
        if (stats[0]) stats[0].textContent = '14';
        if (stats[1]) stats[1].textContent = '38m';
        if (stats[2]) stats[2].textContent = '52';
        if (stats[3]) stats[3].textContent = '31';
    } else if (teamName === 'Marketing') {
        if (stats[0]) stats[0].textContent = '6';
        if (stats[1]) stats[1].textContent = '28m';
        if (stats[2]) stats[2].textContent = '18';
        if (stats[3]) stats[3].textContent = '12';
    }
    
    showNotification(`Switched to ${teamName} context`, 'info');
}

// Function to search meetings
function searchMeetings(term) {
    // This would connect to a backend in a real application
    console.log('Searching for:', term);
    showNotification(`Searching meetings for "${term}"`, 'info');
}

// Function to show notifications
function showNotifications() {
    // This would display a notifications panel in a real application
    console.log('Showing notifications');
    showNotification('Notifications panel would open here', 'info');
}

// Function to send transcript message
function sendTranscriptMessage(message) {
    if (!message.trim()) return;
    
    const transcriptContainer = document.querySelector('.transcript-container .space-y-4');
    const currentUser = document.querySelector('.p-5.border-t.border-gray-700 p.text-sm.font-medium').textContent;
    const initials = currentUser.split(' ').map(name => name[0]).join('');
    
    const newMessage = document.createElement('div');
    newMessage.className = 'flex';
    newMessage.innerHTML = `
        <div class="flex-shrink-0 mr-3">
            <div class="participant-avatar bg-blue-100 text-blue-600">${initials}</div>
        </div>
        <div class="message-bubble">
            <div class="font-medium text-gray-900">${currentUser}</div>
            <div class="mt-1 text-sm text-gray-700 bg-white p-3 rounded-lg">${message}</div>
            <div class="mt-1 text-xs text-gray-500">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    
    transcriptContainer.appendChild(newMessage);
    transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
}

// Function to switch assistant tab
function switchAssistantTab(tabName) {
    const assistantContent = document.querySelector('.meeting-assistant');
    
    // Simulate different content for different tabs
    if (tabName === 'transcript') {
        assistantContent.innerHTML = `
            <p class="text-sm text-gray-700 mb-4">Full meeting transcript would appear here.</p>
            <div class="space-y-4">
                <div class="bg-white p-3 rounded-lg">
                    <p class="text-sm text-gray-700"><span class="font-medium">John:</span> Okay team, let's start the weekly meeting. First item on the agenda is the Q2 budget.</p>
                </div>
                <div class="bg-white p-3 rounded-lg">
                    <p class="text-sm text-gray-700"><span class="font-medium">Alice:</span> I've reviewed the projections and we're about 15% over budget in marketing.</p>
                </div>
            </div>
        `;
    } else if (tabName === 'summary') {
        assistantContent.innerHTML = `
            <p class="text-sm text-gray-700 mb-4">Meeting summary would appear here.</p>
            <div class="bg-white p-3 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Key Discussion Points</h4>
                <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Q2 budget overage in marketing department</li>
                    <li>New digital campaign performance review</li>
                    <li>Project timeline adjustments</li>
                </ul>
            </div>
        `;
    } else if (tabName === 'analytics') {
        assistantContent.innerHTML = `
            <p class="text-sm text-gray-700 mb-4">Meeting analytics would appear here.</p>
            <div class="bg-white p-3 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Speaking Time Distribution</h4>
                <div class="space-y-2">
                    <div>
                        <div class="flex justify-between text-sm">
                            <span>John Smith</span>
                            <span>42%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: 42%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm">
                            <span>Sarah Davis</span>
                            <span>28%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-green-600 h-2 rounded-full" style="width: 28%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (tabName === 'meeting assistant') {
        assistantContent.innerHTML = `
            <p class="text-sm text-gray-700 mb-4">Hello! I'm your meeting assistant. Ask me anything about this meeting.</p>
            <div class="space-y-4">
                <div class="bg-white p-3 rounded-lg">
                    <p class="text-sm text-gray-700"><span class="font-medium">John:</span> Okay team, let's start the weekly meeting. First item on the agenda is the Q2 budget.</p>
                </div>
                <div class="bg-white p-3 rounded-lg">
                    <p class="text-sm text-gray-700"><span class="font-medium">Alice:</span> I've reviewed the projections and we're about 15% over budget in marketing.</p>
                </div>
            </div>
        `;
    }
}

// Function to send assistant message
function sendAssistantMessage(message) {
    if (!message.trim()) return;
    
    const assistantContent = document.querySelector('.meeting-assistant .space-y-4');
    if (!assistantContent) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'bg-white p-3 rounded-lg';
    userMessage.innerHTML = `<p class="text-sm text-gray-700"><span class="font-medium">You:</span> ${message}</p>`;
    assistantContent.appendChild(userMessage);
    
    // Simulate assistant response after a short delay
    setTimeout(() => {
        const assistantMessage = document.createElement('div');
        assistantMessage.className = 'bg-blue-50 p-3 rounded-lg';
        assistantMessage.innerHTML = `
            <p class="text-sm text-gray-700"><span class="font-medium">Assistant:</span> Based on the meeting transcript, the team discussed pausing the digital campaign to address the budget overage. Alice is preparing a revised budget due next Tuesday.</p>
        `;
        assistantContent.appendChild(assistantMessage);
        assistantContent.scrollTop = assistantContent.scrollHeight;
    }, 1000);
}

// Function to toggle action item
function toggleActionItem(checkbox) {
    const actionItem = checkbox.closest('.flex.items-start');
    if (checkbox.checked) {
        actionItem.classList.add('opacity-60');
        actionItem.querySelector('p.text-sm.font-medium').classList.add('line-through');
    } else {
        actionItem.classList.remove('opacity-60');
        actionItem.querySelector('p.text-sm.font-medium').classList.remove('line-through');
    }
}

// Function to add new action item
function addNewActionItem() {
    const actionItemsContainer = document.querySelector('.space-y-4');
    
    const newActionItem = document.createElement('div');
    newActionItem.className = 'flex items-start';
    newActionItem.innerHTML = `
        <div class="flex-shrink-0 mt-1 mr-3">
            <input type="checkbox" class="h-4 w-4 text-blue-600 rounded">
        </div>
        <div class="flex-1">
            <input type="text" placeholder="Action item description" class="text-sm font-medium text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500">
            <p class="text-sm text-gray-500 mt-1">
                <input type="text" placeholder="Assigned to" class="inline-block w-32 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500"> · 
                <input type="text" placeholder="Due date" class="inline-block w-24 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500">
            </p>
        </div>
        <div class="flex-shrink-0">
            <select class="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border-none focus:ring-0 focus:outline-none">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
        </div>
    `;
    
    actionItemsContainer.appendChild(newActionItem);
    
    // Add event listener to the new checkbox
    newActionItem.querySelector('input[type="checkbox"]').addEventListener('change', function() {
        toggleActionItem(this);
    });
    
    // Focus on the action item description
    newActionItem.querySelector('input[type="text"]').focus();
}

// Function to show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-md text-white z-50 transition-opacity duration-300 ${
        type === 'success' ? 'bg-green-600' : 
        type === 'error' ? 'bg-red-600' : 'bg-blue-600'
    }`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Function to simulate initial meeting data
function simulateMeetingData() {
    // This would come from a server in a real application
    console.log('Simulating meeting data...');
}