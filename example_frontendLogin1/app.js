// Pixel Adventure - Game UI Logic
const API_BASE_URL = 'http://localhost:8000/api';
let currentUser = null;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Pixel Adventure Initializing...');
    
    // Check which page we're on
    if (document.querySelector('.terms-box')) {
        initTermsPage();
    }
    
    if (document.querySelector('.login-box')) {
        initLoginPage();
    }
    
    // Check for existing session
    checkSession();
    
    // Create pixel particles
    createPixelParticles();
    
    // Add keyboard shortcuts
    setupKeyboardShortcuts();
});

// Initialize Terms Page
function initTermsPage() {
    const termsBox = document.querySelector('.scroll-box');
    const continueBtn = document.getElementById('continueBtn');
    const agreeTerms = document.getElementById('agreeTerms');
    const agreeData = document.getElementById('agreeData');
    
    if (termsBox) {
        termsBox.addEventListener('scroll', function() {
            const scrollPercent = (termsBox.scrollTop + termsBox.clientHeight) / termsBox.scrollHeight;
            
            if (scrollPercent > 0.9 && !agreeTerms.checked) {
                // Auto-check terms when scrolled to bottom
                agreeTerms.checked = true;
                updateContinueButton();
                showToast('📜 Terms scrolled to bottom!');
            }
        });
        
        // Checkbox handlers
        agreeTerms?.addEventListener('change', updateContinueButton);
        agreeData?.addEventListener('change', updateContinueButton);
    }
}

function updateContinueButton() {
    const agreeTerms = document.getElementById('agreeTerms');
    const agreeData = document.getElementById('agreeData');
    const continueBtn = document.getElementById('continueBtn');
    
    if (continueBtn) {
        const isEnabled = agreeTerms?.checked && agreeData?.checked;
        continueBtn.disabled = !isEnabled;
        
        if (isEnabled) {
            continueBtn.innerHTML = '<span class="btn-icon">▶️</span><span class="btn-text">CONTINUE</span>';
            continueBtn.classList.add('pixel-btn-primary');
            continueBtn.classList.remove('pixel-btn-secondary');
        } else {
            continueBtn.innerHTML = '<span class="btn-icon">🔒</span><span class="btn-text">ACCEPT TERMS</span>';
            continueBtn.classList.remove('pixel-btn-primary');
            continueBtn.classList.add('pixel-btn-secondary');
        }
    }
}

function proceedToLogin() {
    // Save acceptance to localStorage
    localStorage.setItem('termsAccepted', 'true');
    localStorage.setItem('termsAcceptedDate', new Date().toISOString());
    
    // Add transition effect
    document.body.style.opacity = '0.7';
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

// Initialize Login Page
function initLoginPage() {
    // Password toggle functionality
    setupPasswordToggles();
    
    // Form submissions
    const loginForm = document.getElementById('loginFormData');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerFormData');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Real-time validation
        setupRealTimeValidation();
    }
    
    // Check if terms were accepted
    if (!localStorage.getItem('termsAccepted')) {
        showToast('⚠️ Please accept terms first!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Setup password toggle buttons
function setupPasswordToggles() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const toggleBtn = input.parentElement.querySelector('.pixel-eye-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                togglePassword(input.id);
            });
        }
    });
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.parentElement.querySelector('.pixel-eye-toggle');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.textContent = '👁️‍🗨️';
    } else {
        input.type = 'password';
        toggleBtn.textContent = '👁️';
    }
    
    // Add visual feedback
    toggleBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        toggleBtn.style.transform = 'scale(1)';
    }, 200);
}

// Setup real-time validation for registration
function setupRealTimeValidation() {
    const regUsername = document.getElementById('regUsername');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    
    if (regUsername) {
        regUsername.addEventListener('input', validateUsername);
        regUsername.addEventListener('blur', checkUsernameAvailability);
    }
    
    if (regPassword) {
        regPassword.addEventListener('input', validatePassword);
    }
    
    if (regConfirmPassword) {
        regConfirmPassword.addEventListener('input', validateConfirmPassword);
    }
}

// Navigation
function goBack() {
    playSound('click');
    
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

function switchTab(tabName) {
    playSound('click');
    
    const loginTab = document.querySelector('.pixel-tab:nth-child(1)');
    const registerTab = document.querySelector('.pixel-tab:nth-child(2)');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tabName === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

// Validation Functions
function validateUsername() {
    const username = document.getElementById('regUsername');
    const feedback = document.getElementById('usernameFeedback');
    
    if (!username || !feedback) return false;
    
    const value = username.value.trim();
    
    if (value.length < 3) {
        feedback.textContent = 'TOO SHORT (MIN 3)';
        feedback.className = 'pixel-input-feedback invalid';
        return false;
    }
    
    if (value.length > 20) {
        feedback.textContent = 'TOO LONG (MAX 20)';
        feedback.className = 'pixel-input-feedback invalid';
        return false;
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(value)) {
        feedback.textContent = 'LETTERS, NUMBERS, _ ONLY';
        feedback.className = 'pixel-input-feedback invalid';
        return false;
    }
    
    feedback.textContent = 'USERNAME OK';
    feedback.className = 'pixel-input-feedback valid';
    return true;
}

async function checkUsernameAvailability() {
    const username = document.getElementById('regUsername');
    const feedback = document.getElementById('usernameFeedback');
    
    if (!username || !feedback || username.value.length < 3) return;
    
    // In a real app, you'd check with the API
    // For now, simulate checking
    feedback.textContent = 'CHECKING...';
    
    setTimeout(() => {
        // Simulate API call
        const takenUsernames = ['admin', 'player', 'test', 'user'];
        if (takenUsernames.includes(username.value.toLowerCase())) {
            feedback.textContent = 'USERNAME TAKEN';
            feedback.className = 'pixel-input-feedback invalid';
        } else {
            feedback.textContent = 'USERNAME AVAILABLE ✓';
            feedback.className = 'pixel-input-feedback valid';
        }
    }, 800);
}

function validatePassword() {
    const password = document.getElementById('regPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!password || !strengthFill || !strengthText) return false;
    
    const value = password.value;
    let strength = 0;
    
    // Requirements
    const hasLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    // Update UI indicators
    updateRequirement('reqLength', hasLength);
    updateRequirement('reqUppercase', hasUppercase);
    updateRequirement('reqLowercase', hasLowercase);
    updateRequirement('reqNumber', hasNumber);
    
    // Calculate strength (0-100)
    if (hasLength) strength += 25;
    if (hasUppercase) strength += 25;
    if (hasLowercase) strength += 25;
    if (hasNumber) strength += 25;
    
    // Update strength bar
    strengthFill.style.width = strength + '%';
    
    // Update colors and text
    if (strength < 50) {
        strengthFill.style.backgroundColor = 'var(--earth-light)';
        strengthText.textContent = 'WEAK';
        strengthText.style.color = 'var(--earth-light)';
    } else if (strength < 75) {
        strengthFill.style.backgroundColor = 'var(--earth-accent)';
        strengthText.textContent = 'GOOD';
        strengthText.style.color = 'var(--earth-accent)';
    } else {
        strengthFill.style.backgroundColor = 'var(--earth-olive)';
        strengthText.textContent = 'STRONG ✓';
        strengthText.style.color = 'var(--earth-olive)';
    }
    
    return strength >= 75;
}

function updateRequirement(elementId, isValid) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('valid', isValid);
    }
}

function validateConfirmPassword() {
    const password = document.getElementById('regPassword');
    const confirmPassword = document.getElementById('regConfirmPassword');
    const feedback = document.getElementById('confirmFeedback');
    
    if (!password || !confirmPassword || !feedback) return true;
    
    if (password.value !== confirmPassword.value) {
        feedback.textContent = 'PASSWORDS DON\'T MATCH';
        feedback.className = 'pixel-input-feedback invalid';
        return false;
    }
    
    if (confirmPassword.value.length === 0) {
        feedback.textContent = '';
        return false;
    }
    
    feedback.textContent = 'PASSWORDS MATCH ✓';
    feedback.className = 'pixel-input-feedback valid';
    return true;
}

// API Functions
async function handleLogin(e) {
    e.preventDefault();
    playSound('click');
    
    const username = document.getElementById('loginUsername')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    if (!username || !password) {
        showToast('⚠️ FILL ALL FIELDS');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'LOGIN FAILED');
        }
        
        // Save session
        localStorage.setItem('session_id', data.session_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        
        currentUser = data;
        
        showToast(`🎮 WELCOME, ${data.username}!`);
        
        // Add victory animation
        celebrateLogin();
        
        // Redirect to game
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 2000);
        
    } catch (error) {
        showToast(`❌ ${error.message}`);
        playSound('error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    playSound('click');
    
    if (!validateUsername() || !validatePassword() || !validateConfirmPassword()) {
        showToast('⚠️ FIX VALIDATION ERRORS');
        return;
    }
    
    const username = document.getElementById('regUsername')?.value;
    const email = document.getElementById('regEmail')?.value || null;
    const password = document.getElementById('regPassword')?.value;
    
    if (!username || !password) {
        showToast('⚠️ USERNAME & PASSWORD REQUIRED');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'REGISTRATION FAILED');
        }
        
        // Save session
        localStorage.setItem('session_id', data.session_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        
        currentUser = data;
        
        showToast(`✨ ACCOUNT CREATED! WELCOME, ${data.username}!`);
        
        // Add celebration effect
        celebrateRegistration();
        
        // Redirect to game
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 2500);
        
    } catch (error) {
        showToast(`❌ ${error.message}`);
        playSound('error');
    } finally {
        showLoading(false);
    }
}

async function guestLogin() {
    playSound('click');
    showLoading(true);
    
    // For guest login
    localStorage.setItem('is_guest', 'true');
    localStorage.setItem('guest_id', 'guest_' + Date.now());
    localStorage.setItem('guest_name', 'GUEST_' + Math.floor(Math.random() * 10000));
    
    showToast('🎭 WELCOME, GUEST ADVENTURER!');
    
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1500);
}

function showForgotPassword() {
    playSound('click');
    showToast('📧 CONTACT SUPPORT TO RESET PASSWORD');
}

async function checkSession() {
    const sessionId = localStorage.getItem('session_id');
    
    if (sessionId) {
        try {
            const response = await fetch(`${API_BASE_URL}/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${sessionId}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                currentUser = userData;
                
                // If already logged in on login page, redirect
                if (window.location.pathname.includes('login.html')) {
                    showToast(`⚔️ ALREADY LOGGED IN AS ${userData.username}`);
                    setTimeout(() => {
                        window.location.href = 'main.html';
                    }, 1500);
                }
            }
        } catch (error) {
            // Clear invalid session
            localStorage.removeItem('session_id');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
        }
    }
}

// UI Helper Functions
function showHelp() {
    playSound('click');
    document.getElementById('helpModal').style.display = 'block';
}

function closeHelp() {
    playSound('click');
    document.getElementById('helpModal').style.display = 'none';
}

function showToast(message) {
    const toast = document.getElementById('messageToast');
    if (!toast) return;
    
    const toastText = toast.querySelector('.toast-text');
    toastText.textContent = message;
    
    // Set icon based on message
    const toastIcon = toast.querySelector('.toast-icon');
    if (message.includes('❌') || message.includes('⚠️')) {
        toastIcon.textContent = '⚠️';
    } else if (message.includes('✨') || message.includes('🎮')) {
        toastIcon.textContent = '✨';
    } else if (message.includes('🎭')) {
        toastIcon.textContent = '🎭';
    } else {
        toastIcon.textContent = 'ℹ️';
    }
    
    toast.style.display = 'flex';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function showLoading(show) {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
}

// Celebration Effects
function celebrateLogin() {
    // Add particle explosion
    for (let i = 0; i < 20; i++) {
        createCelebrationParticle('✨');
    }
    
    // Add screen shake
    document.body.style.animation = 'shake 0.5s';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
}

function celebrateRegistration() {
    // Add more intense celebration
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createCelebrationParticle('⭐');
        }, i * 20);
    }
    
    // Color flash
    document.documentElement.style.setProperty('--earth-olive', '#ffd700');
    setTimeout(() => {
        document.documentElement.style.setProperty('--earth-olive', '#8a9a5b');
    }, 1000);
}

// Create pixel particles
function createPixelParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'pixel-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background-color: var(${Math.random() > 0.5 ? '--earth-accent' : '--earth-light'});
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
        `;
        
        // Add custom animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: ${Math.random() * 0.3 + 0.1};
                }
                100% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        container.appendChild(particle);
    }
}

function createCelebrationParticle(symbol) {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    const particle = document.createElement('div');
    particle.textContent = symbol;
    particle.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 20 + 10}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 1;
        pointer-events: none;
        z-index: 10000;
        animation: celebrate ${Math.random() * 1 + 0.5}s ease-out forwards;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebrate {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
    container.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        particle.remove();
        style.remove();
    }, 1000);
}

// Sound Effects
function playSound(type) {
    // In a real game, you'd play actual sounds
    // For now, just log
    console.log(`🔊 Playing ${type} sound`);
    
    // You could add Web Audio API sounds here
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape to close modals
        if (e.key === 'Escape') {
            closeHelp();
        }
        
        // Enter to submit forms
        if (e.key === 'Enter' && !e.target.matches('textarea, input[type="text"], input[type="password"]')) {
            const activeForm = document.querySelector('.pixel-form');
            if (activeForm) {
                activeForm.requestSubmit();
            }
        }
        
        // Ctrl/Cmd + Enter for guest login
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const guestBtn = document.querySelector('[onclick="guestLogin()"]');
            if (guestBtn) guestBtn.click();
        }
    });
}

// Add shake animation for celebration
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Page visibility handling
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        checkSession();
    }
});

// Add some console art for fun
console.log(`
%c
  _____  _  _        ___   __   __        __   ___  
 |_   _|| |(_)      / _ \\  \\ \\ / /       /  \\ |   \\ 
   | |  | || |_____| /_\\ |  \\   /  _____ | () || |) |
   |_|  |_||_|_____|\\___/    |_|  |_____| \\__/ |___/ 
                                                     
%c✨ Pixel Adventure - Earth Tone Edition ✨
%cReady for adventure! 🎮
`, 
'color: #8b5a2b; font-family: monospace; font-size: 12px;',
'color: #d4a574; font-size: 14px; font-weight: bold;',
'color: #6b8c42; font-size: 12px;'
);