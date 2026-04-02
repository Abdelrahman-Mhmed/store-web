// Collections page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count on page load
    updateCartCount();
    
    // Category filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('productsGrid');
    const products = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.dataset.category;

            // Filter products
            products.forEach(product => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = 'block';
                    product.style.animation = 'fadeIn 0.5s ease';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // Add fade in animation for filtered products
    const fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(fadeInStyle);

    // Enhanced product data for collections page
    window.getProductById = function(id) {
        const products = {
            '1': { name: 'Classic White Shirt', price: 89.00, category: 'tops' },
            '2': { name: 'Black Denim Jacket', price: 129.00, category: 'outerwear' },
            '3': { name: 'Minimalist Dress', price: 149.00, category: 'dresses' },
            '4': { name: 'Premium Sweater', price: 99.00, category: 'tops' },
            '5': { name: 'Silk Blouse', price: 79.00, category: 'tops' },
            '6': { name: 'Cashmere Sweater', price: 159.00, category: 'tops' },
            '7': { name: 'High-Waist Trousers', price: 119.00, category: 'bottoms' },
            '8': { name: 'Skinny Jeans', price: 99.00, category: 'bottoms' },
            '9': { name: 'A-Line Skirt', price: 89.00, category: 'bottoms' },
            '10': { name: 'Evening Gown', price: 299.00, category: 'dresses' },
            '11': { name: 'Summer Dress', price: 129.00, category: 'dresses' },
            '12': { name: 'Wool Coat', price: 249.00, category: 'outerwear' },
            '13': { name: 'Leather Jacket', price: 399.00, category: 'outerwear' },
            '14': { name: 'Leather Handbag', price: 199.00, category: 'accessories' },
            '15': { name: 'Silk Scarf', price: 49.00, category: 'accessories' },
            '16': { name: 'Minimalist Watch', price: 299.00, category: 'accessories' }
        };
        return products[id];
    };

    // Add to cart functionality for collections page
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

    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const styles = {
            success: {
                backgroundColor: '#000',
                color: '#fff',
                borderLeft: '4px solid #4CAF50'
            },
            error: {
                backgroundColor: '#fff',
                color: '#d32f2f',
                borderLeft: '4px solid #d32f2f'
            }
        };
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '5px',
            zIndex: '3000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '400px',
            wordWrap: 'break-word',
            animation: 'slideIn 0.3s ease',
            ...styles[type]
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            addToCart(productId);
        });
    });

    // Quick view functionality for collections page
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.productId;
            showProductModal(productId);
        });
    });

    // Enhanced product modal for collections
    window.showProductModal = function(productId) {
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
                        <p class="category">Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
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
                        <div class="product-description">
                            <h3>Description</h3>
                            <p>Premium quality ${product.name.toLowerCase()} crafted with the finest materials. Perfect for everyday wear and special occasions. Features a timeless design that complements any wardrobe.</p>
                        </div>
                        <div class="product-features">
                            <h3>Features</h3>
                            <ul>
                                <li>Premium materials</li>
                                <li>Timeless design</li>
                                <li>Perfect fit</li>
                                <li>Easy care</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        }
    };

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

    // Enhanced add to cart from modal
    window.addToCartFromModal = function(productId) {
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
        }
    };

    // Add CSS for enhanced modal content
    const enhancedModalStyles = document.createElement('style');
    enhancedModalStyles.textContent = `
        .category {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 20px;
            text-transform: capitalize;
        }
        
        .product-features {
            margin-top: 30px;
        }
        
        .product-features h3 {
            margin-bottom: 15px;
            font-size: 1.1rem;
            font-weight: 600;
        }
        
        .product-features ul {
            list-style: none;
            padding: 0;
        }
        
        .product-features li {
            padding: 5px 0;
            color: #666;
            position: relative;
            padding-left: 20px;
        }
        
        .product-features li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #000;
            font-weight: bold;
        }
        
        .filter-btn {
            padding: 12px 24px;
            margin: 0 10px;
            border: 1px solid #ddd;
            background: #fff;
            color: #000;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .filter-btn:hover,
        .filter-btn.active {
            background: #000;
            color: #fff;
            border-color: #000;
        }
        
        .collections-header {
            padding: 120px 0 80px;
            text-align: center;
            background-color: #f8f8f8;
        }
        
        .collections-header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }
        
        .collections-header p {
            font-size: 1.2rem;
            color: #666;
        }
        
        .category-filter {
            padding: 40px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .filter-buttons {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .products-section {
            padding: 80px 0;
        }
        
        @media (max-width: 768px) {
            .collections-header h1 {
                font-size: 2rem;
            }
            
            .filter-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .filter-btn {
                margin: 5px 0;
                width: 200px;
            }
        }
    `;
    document.head.appendChild(enhancedModalStyles);
});
