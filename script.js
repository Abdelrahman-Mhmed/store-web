// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Add to cart functionality
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        addToCart(productId);
    });
});

function addToCart(productId) {
    const product = getProductById(productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                size: 'M', // Default size
                quantity: 1
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Product added to cart!');
    }
}

function getProductById(id) {
    const products = {
        '1': { name: 'Classic White Shirt', price: 89.00 },
        '2': { name: 'Black Denim Jacket', price: 129.00 },
        '3': { name: 'Minimalist Dress', price: 149.00 },
        '4': { name: 'Premium Sweater', price: 99.00 }
    };
    return products[id];
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #000;
        color: #fff;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Quick view functionality
document.querySelectorAll('.quick-view-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const productCard = e.target.closest('.product-card');
        const productId = productCard.dataset.productId;
        showProductModal(productId);
    });
});

function showProductModal(productId) {
    const modal = document.getElementById('productModal');
    const modalBody = modal.querySelector('.modal-body');
    const product = getProductById(productId);
    
    if (product) {
        modalBody.innerHTML = `
            <div class="product-modal-grid">
                <div class="product-modal-image">
                    <div class="product-placeholder"></div>
                </div>
                <div class="product-modal-info">
                    <h2>${product.name}</h2>
                    <p class="product-modal-price">$${product.price.toFixed(2)}</p>
                    <div class="product-modal-options">
                        <div class="size-selection">
                            <label>Size:</label>
                            <select id="modalSize">
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M" selected>M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>
                        <div class="quantity-selection">
                            <label>Quantity:</label>
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="changeModalQuantity(-1)">-</button>
                                <span id="modalQuantity">1</span>
                                <button class="qty-btn" onclick="changeModalQuantity(1)">+</button>
                            </div>
                        </div>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCartFromModal('${productId}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Reset quantity
        currentQuantity = 1;
        document.getElementById('modalQuantity').textContent = currentQuantity;
    }
}

// Close modal functionality
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Quantity controls
let currentQuantity = 1;

function changeQuantity(change) {
    currentQuantity = Math.max(1, currentQuantity + change);
    document.getElementById('quantity').textContent = currentQuantity;
}

function changeModalQuantity(change) {
    const quantitySpan = document.getElementById('modalQuantity');
    let quantity = parseInt(quantitySpan.textContent);
    quantity = Math.max(1, quantity + change);
    quantitySpan.textContent = quantity;
}

function addToCartFromModal(productId) {
    const selectedSize = document.getElementById('modalSize').value;
    const quantity = parseInt(document.getElementById('modalQuantity').textContent);
    
    const product = getProductById(productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId && item.size === selectedSize);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                size: selectedSize,
                quantity: quantity
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Product added to cart!');
        document.getElementById('productModal').style.display = 'none';
        currentQuantity = 1;
    }
}

// Newsletter form submission
document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    if (email) {
        showNotification('Thank you for subscribing!');
        e.target.reset();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});
