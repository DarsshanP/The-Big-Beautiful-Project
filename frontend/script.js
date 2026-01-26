// ===== DOM Elements =====
// Splash Screen
const startBtn = document.getElementById('startBtn');
const continueBtn = document.getElementById('continueBtn');
const settingsBtn = document.getElementById('settingsBtn');
const creditsBtn = document.getElementById('creditsBtn');
const exitBtn = document.getElementById('exitBtn');
const termsLink = document.getElementById('termsLink');
const loadingScreen = document.getElementById('loadingScreen');
const progressFill = document.getElementById('progressFill');
const loadingText = document.getElementById('loadingText');

// Stats Counter
const heroesCount = document.getElementById('heroesCount');
const demonsSlain = document.getElementById('demonsSlain');
const kingdomsSaved = document.getElementById('kingdomsSaved');

// Modals
const settingsModal = document.getElementById('settingsModal');
const creditsModal = document.getElementById('creditsModal');
const closeModalBtns = document.querySelectorAll('.close-modal');

// Terms Page
const agreeTermsCheckbox = document.getElementById('agreeTerms');
const agreeAgeCheckbox = document.getElementById('agreeAge');
const acceptTermsBtn = document.getElementById('acceptTermsBtn');
const declineTermsBtn = document.getElementById('declineTermsBtn');

// Login Page
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// ===== UTILITY FUNCTIONS =====
function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent) || 0;
    const increment = target > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / (target - start)));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current.toLocaleString();
        
        if (current === target) {
            clearInterval(timer);
        }
    }, stepTime);
}

function showLoading() {
    loadingScreen.style.display = 'flex';
    
    const loadingMessages = [
        'Initializing game engine...',
        'Loading assets...',
        'Preparing levels...',
        'Almost ready...'
    ];
    
    let currentMessage = 0;
    const interval = setInterval(() => {
        if (currentMessage < loadingMessages.length) {
            loadingText.textContent = loadingMessages[currentMessage];
            currentMessage++;
        } else {
            clearInterval(interval);
        }
    }, 500);
    
    // Simulate loading progress
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        progressFill.style.width = `${currentProgress}%`;
    }, 200);
}

function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== SPLASH SCREEN FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Kingdom Chronicles Initialized');
    
    // Animate counters
    setTimeout(() => {
        if (heroesCount) animateCounter(heroesCount, 247);
        if (demonsSlain) animateCounter(demonsSlain, 42500);
        if (kingdomsSaved) animateCounter(kingdomsSaved, 892);
    }, 1000);
    
    // Check if user has accepted terms
    if (localStorage.getItem('acceptedTerms') === 'true' && continueBtn) {
        continueBtn.style.display = 'inline-block';
    }
});

// Start Button - Goes to Terms page
if (startBtn) {
    startBtn.addEventListener('click', () => {
        showLoading();
        setTimeout(() => {
            window.location.href = 'terms.html';
        }, 1500);
    });
}

// Continue Button - Goes directly to login
if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        showLoading();
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

// Settings Button
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        showModal(settingsModal);
    });
}

// Credits Button
if (creditsBtn) {
    creditsBtn.addEventListener('click', () => {
        showModal(creditsModal);
    });
}

// Exit Button
if (exitBtn) {
    exitBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to exit Kingdom Chronicles?')) {
            showLoading();
            setTimeout(() => {
                alert('Thank you for playing Kingdom Chronicles!');
            }, 1000);
        }
    });
}

// Close Modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        hideModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        hideModal(e.target);
    }
});

// ===== TERMS PAGE FUNCTIONALITY =====
// Terms Acceptance Logic
if (agreeTermsCheckbox && agreeAgeCheckbox) {
    function updateAcceptButton() {
        const allRequiredAccepted = agreeTermsCheckbox.checked && agreeAgeCheckbox.checked;
        if (acceptTermsBtn) acceptTermsBtn.disabled = !allRequiredAccepted;
    }
    
    agreeTermsCheckbox.addEventListener('change', updateAcceptButton);
    agreeAgeCheckbox.addEventListener('change', updateAcceptButton);
    
    updateAcceptButton();
}

// Accept Terms Button
if (acceptTermsBtn) {
    acceptTermsBtn.addEventListener('click', () => {
        // Save acceptance to localStorage
        localStorage.setItem('acceptedTerms', 'true');
        
        // Show loading and redirect
        const loading = document.createElement('div');
        loading.className = 'loading-screen';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">
                    <i class="fas fa-crown fa-spin"></i>
                </div>
                <h2>Loading Kingdom Chronicles</h2>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <p class="loading-text">Redirecting to login...</p>
            </div>
        `;
        document.body.appendChild(loading);
        loading.style.display = 'flex';
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

// Decline Terms Button
if (declineTermsBtn) {
    declineTermsBtn.addEventListener('click', () => {
        if (confirm('You must accept the terms and conditions to play Kingdom Chronicles. Would you like to return to the main menu?')) {
            window.location.href = 'index.html';
        }
    });
}

// ===== LOGIN PAGE FUNCTIONALITY =====
// Form Toggle
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginForm) loginForm.classList.remove('active');
        if (registerForm) registerForm.classList.add('active');
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (registerForm) registerForm.classList.remove('active');
        if (loginForm) loginForm.classList.add('active');
    });
}

// Password Toggle
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
if (toggleLoginPassword) {
    toggleLoginPassword.addEventListener('click', () => {
        const passwordField = toggleLoginPassword.previousElementSibling;
        const type = passwordField.type === 'password' ? 'text' : 'password';
        passwordField.type = type;
        toggleLoginPassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
}

// Login Form Submission
const loginFormElement = document.getElementById('loginFormElement');
if (loginFormElement) {
    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        // Basic validation
        if (!username || !password) {
            alert('Please fill in all fields.');
            return;
        }
        
        // For demo purposes
        if ((username === 'admin' && password === 'admin123') || 
            (username === 'player1' && password === 'player123')) {
            alert('Login successful! Welcome to Kingdom Chronicles!');
            // In real implementation, redirect to game.html or dashboard.html
            // For now, just show success and redirect to index
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            alert('Invalid credentials. Use demo accounts: admin/admin123 or player1/player123');
        }
    });
}

// Register Form Submission
const registerFormElement = document.getElementById('registerFormElement');
if (registerFormElement) {
    registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        
        if (!username || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }
        
        // For demo purposes
        alert('Registration successful! Welcome to Kingdom Chronicles!');
        // Switch back to login form
        if (registerForm) registerForm.classList.remove('active');
        if (loginForm) loginForm.classList.add('active');
    });
}

// ===== PAGE TRANSITIONS =====
// Add fade-in effect to all pages
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in-out';

window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});