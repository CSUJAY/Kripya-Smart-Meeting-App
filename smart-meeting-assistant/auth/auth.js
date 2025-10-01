// Tab switching logic
document.addEventListener('DOMContentLoaded', function () {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginTab && signupTab && loginForm && signupForm) {
        loginTab.onclick = function () {
            loginTab.classList.add('border-blue-600', 'text-blue-700');
            signupTab.classList.remove('border-blue-600', 'text-blue-700');
            signupTab.classList.add('border-transparent', 'text-gray-500');
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        };
        signupTab.onclick = function () {
            signupTab.classList.add('border-blue-600', 'text-blue-700');
            loginTab.classList.remove('border-blue-600', 'text-blue-700');
            loginTab.classList.add('border-transparent', 'text-gray-500');
            signupForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        };
    }

    // Basic login/signup handlers (stub)
    function handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        if (!email || !password) {
            alert('Please enter email and password.');
            return;
        }
        alert('Login successful (demo only)');
        hideAuthModal();
    }

    function handleSignup() {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        if (!name || !email || !password) {
            alert('Please fill all fields.');
            return;
        }
        alert('Signup successful (demo only)');
        hideAuthModal();
    }

    // Updated social login handler - now uses the new authentication system
    window.socialLogin = function(provider) {
        if (provider === 'google') {
            // Use the new Google account selection system
            if (typeof showGoogleAccountSelection === 'function') {
                showGoogleAccountSelection();
            } else {
                console.log('Google account selection not available');
            }
            return;
        }
        if (provider === 'github') {
            // Use the new GitHub account selection system
            if (typeof showGitHubAccountSelection === 'function') {
                showGitHubAccountSelection();
            } else {
                console.log('GitHub account selection not available');
            }
            return;
        }
        // For other providers, show a message
        alert(`${provider} authentication not implemented yet`);
    }

    // --- Google Meet link generation and calendar storage ---
    window.createAndStoreGoogleMeet = function(meetingData, onLink) {
        // Open Google Meet in a new tab and prompt user to copy the link
        const meetTab = window.open('https://meet.google.com/new', '_blank');
        setTimeout(() => {
            const meetLink = prompt('Paste the Google Meet link here (copied from the new tab):');
            if (meetLink && /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3,}$/i.test(meetLink.trim())) {
                // Store in local calendar (localStorage)
                const calendar = JSON.parse(localStorage.getItem('krsn_calendar') || '[]');
                const event = {
                    id: 'gmeet_' + Date.now(),
                    title: meetingData.title,
                    description: meetingData.description,
                    start: meetingData.startTime,
                    end: meetingData.endTime,
                    link: meetLink.trim(),
                    participants: meetingData.participants || [],
                    created: new Date().toISOString()
                };
                calendar.push(event);
                localStorage.setItem('krsn_calendar', JSON.stringify(calendar));
                if (typeof onLink === 'function') onLink(event);
                alert('Google Meet link saved to your calendar!');
            } else {
                alert('Invalid or no link pasted. Meeting not saved.');
            }
        }, 1000);
    }

    // Utility to get all calendar events (for your in-app calendar UI)
    window.getKrsnCalendarEvents = function() {
        return JSON.parse(localStorage.getItem('krsn_calendar') || '[]');
    }

    // End of DOMContentLoaded event listener
});
