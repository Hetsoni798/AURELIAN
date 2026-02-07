// Login Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Social login buttons
        const socialButtons = document.querySelectorAll('.social-button');
        socialButtons.forEach(button => {
            button.addEventListener('click', handleSocialLogin);
        });
    }
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login process
    const loginButton = e.target.querySelector('.login-button');
    const originalText = loginButton.textContent;
    
    loginButton.textContent = 'Signing In...';
    loginButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        loginButton.textContent = 'Success!';
        loginButton.style.background = '#8b7355';
        
        // Store user session if remember me is checked
        if (remember) {
            localStorage.setItem('aurelianRemember', 'true');
        }
        
        // Redirect to homepage
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }, 1500);
}

// Handle social login buttons
function handleSocialLogin(e) {
    e.preventDefault();
    
    const button = e.currentTarget;
    const provider = button.classList.contains('google') ? 'Google' : 'Apple';
    
    console.log(`${provider} login clicked`);
    
    // Visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
    
    // In a real app, this would trigger OAuth flow
    alert(`${provider} login would be triggered here`);
}