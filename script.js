// Cart state
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartCountElement = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');
const totalPriceElement = document.getElementById('totalPrice');
const quickAddButtons = document.querySelectorAll('.quick-add');
const categoryPills = document.querySelectorAll('.pill');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.getElementById('navbar');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    initializeFilters();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeLoginForm();
});

// Cart Functions
function initializeCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('aurelianCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }

    // Add event listeners
    quickAddButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.dataset.product;
            const productName = button.dataset.name;
            const productPrice = parseFloat(button.dataset.price);
            
            addToCart(productId, productName, productPrice);
            
            // Visual feedback
            button.textContent = 'Added!';
            button.style.background = '#8b7355';
            button.style.color = '#fff';
            setTimeout(() => {
                button.textContent = 'Quick Add';
                button.style.background = '';
                button.style.color = '';
            }, 1000);
        });
    });

    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            closeCartSidebar();
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            closeCartSidebar();
        });
    }
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('aurelianCart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update count
    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    
    // Update total
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalPriceElement) {
        totalPriceElement.textContent = cartTotal.toFixed(2);
    }
    
    // Update cart items display
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image" style="background: linear-gradient(135deg, #f5f3f0 0%, #e0ddd8 100%);"></div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                        <div class="cart-item-quantity">
                            <button class="qty-btn qty-minus" data-id="${item.id}">−</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                    <div class="cart-item-price">
                        <p class="price">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners for quantity buttons
            document.querySelectorAll('.qty-minus').forEach(btn => {
                btn.addEventListener('click', () => {
                    updateQuantity(btn.dataset.id, -1);
                });
            });
            
            document.querySelectorAll('.qty-plus').forEach(btn => {
                btn.addEventListener('click', () => {
                    updateQuantity(btn.dataset.id, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    removeFromCart(btn.dataset.id);
                });
            });
        }
    }
}

function openCart() {
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCartSidebar() {
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Filter Functions
function initializeFilters() {
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Update active pill
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            // Filter products
            const category = pill.dataset.category;
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        const cardCategories = card.dataset.category.split(' ');
        
        if (category === 'all' || cardCategories.includes(category)) {
            card.classList.remove('hidden');
            // Re-trigger animation
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = '';
            }, 10);
        } else {
            card.classList.add('hidden');
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Animate menu toggle
            const spans = menuToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    if (navbar) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
}

// Login Form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Simulate login (in real app, this would be an API call)
            console.log('Login attempt:', { email, remember });
            
            // Show success feedback
            const loginButton = loginForm.querySelector('.login-button');
            const originalText = loginButton.textContent;
            loginButton.textContent = 'Signing In...';
            loginButton.disabled = true;
            
            setTimeout(() => {
                loginButton.textContent = 'Success!';
                loginButton.style.background = '#8b7355';
                
                setTimeout(() => {
                    // Redirect to homepage
                    window.location.href = 'index.html';
                }, 1000);
            }, 1500);
        });
        
        // Social login buttons
        const socialButtons = document.querySelectorAll('.social-button');
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.classList.contains('google') ? 'Google' : 'Apple';
                console.log(`${provider} login clicked`);
                
                // Visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 200);
            });
        });
    }
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const button = newsletterForm.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Subscribed!';
            input.value = '';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }, 1000);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Dynamic price formatting (example of dynamic updates)
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Update all prices on page (example functionality)
function updateAllPrices() {
    document.querySelectorAll('.price-value').forEach(element => {
        const price = parseFloat(element.textContent);
        if (!isNaN(price)) {
            // You can apply discounts, tax, or currency conversion here
            element.textContent = price.toFixed(2);
        }
    });
}

// Call on load
updateAllPrices();

// Add to window for potential external access
window.aurelianShop = {
    addToCart,
    removeFromCart,
    updateQuantity,
    openCart,
    closeCart: closeCartSidebar,
    getCart: () => cart,
    getCartTotal: () => cartTotal
};