// Cart page functionality
let cart = []; // Global cart variable

document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Cart page loaded, initializing...');
        
        // Load cart from localStorage
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        console.log('Cart loaded:', cart);
        console.log('Cart length:', cart.length);
        
        // Initialize cart display
        updateCartDisplay();
        updateCartCount();
        
        // Shipping options
        const shippingOptions = document.querySelectorAll('input[name="shipping"]');
        shippingOptions.forEach(option => {
            option.addEventListener('change', updateCartTotals);
        });
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', proceedToCheckout);
        }
        
        // Add to cart functionality for recommended products
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            });
        });
        
        // Test function to add sample items to cart
        function addTestItems() {
            console.log('Adding test items to cart');
            const testItems = [
                {
                    id: 'test1',
                    name: 'Test Product 1',
                    price: 29.99,
                    size: 'M',
                    quantity: 2
                },
                {
                    id: 'test2',
                    name: 'Test Product 2',
                    price: 49.99,
                    size: 'L',
                    quantity: 1
                }
            ];
            
            cart = testItems;
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Test items added to cart:', cart);
            updateCartDisplay();
            updateCartCount();
        }
        
        // Add test button to the page for debugging
        const testButton = document.createElement('button');
        testButton.textContent = 'Add Test Items';
        testButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000; padding: 10px; background: #000; color: #fff; border: none; cursor: pointer;';
        testButton.addEventListener('click', addTestItems);
        document.body.appendChild(testButton);
        
        // Quick view functionality for recommended products
        document.querySelectorAll('.quick-view-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.productId;
                showProductModal(productId);
            });
        });
        
        console.log('Cart page initialization complete');
        
    } catch (error) {
        console.error('Error initializing cart page:', error);
    }
    
    function updateCartDisplay() {
        console.log('updateCartDisplay called');
        const cartItemsContainer = document.getElementById('cartItems');
        const itemCountElement = document.querySelector('.item-count');
        const recommendedProducts = document.getElementById('recommendedProducts');
        
        console.log('Cart items container:', cartItemsContainer);
        console.log('Item count element:', itemCountElement);
        console.log('Recommended products:', recommendedProducts);
        
        if (cart.length === 0) {
            console.log('Cart is empty, showing empty cart message');
            // Show empty cart
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="collections.html" class="continue-shopping-btn">Continue Shopping</a>
                </div>
            `;
            itemCountElement.textContent = '0 items';
            recommendedProducts.style.display = 'none';
            checkoutBtn.disabled = true;
            return;
        }
        
        console.log('Cart has items, showing cart items');
        // Show cart items
        let cartHTML = '';
        cart.forEach((item, index) => {
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-image">
                        <div class="product-placeholder"></div>
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="item-size">Size: ${item.size || 'One Size'}</p>
                        <p class="item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn decrease-btn" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn increase-btn" data-index="${index}">+</button>
                    </div>
                    <div class="cart-item-total">
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button class="remove-item-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        itemCountElement.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;
        recommendedProducts.style.display = 'block';
        
        // Get checkout button reference
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
        }
        
        console.log('Cart HTML generated:', cartHTML);
        
        // Add event listeners for quantity buttons and remove buttons
        addCartItemEventListeners();
        
        updateCartTotals();
    }
    
    function addCartItemEventListeners() {
        console.log('Adding event listeners for cart items');
        
        // Add event listeners for decrease quantity buttons
        const decreaseButtons = document.querySelectorAll('.decrease-btn');
        console.log('Found decrease buttons:', decreaseButtons.length);
        decreaseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('Decrease button clicked, index:', e.target.dataset.index);
                const index = parseInt(e.target.dataset.index);
                changeCartQuantity(index, -1);
            });
        });
        
        // Add event listeners for increase quantity buttons
        const increaseButtons = document.querySelectorAll('.increase-btn');
        console.log('Found increase buttons:', increaseButtons.length);
        increaseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('Increase button clicked, index:', e.target.dataset.index);
                const index = parseInt(e.target.dataset.index);
                changeCartQuantity(index, 1);
            });
        });
        
        // Add event listeners for remove buttons
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        console.log('Found remove buttons:', removeButtons.length);
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('Remove button clicked, index:', e.target.dataset.index);
                const index = parseInt(e.target.dataset.index);
                removeCartItem(index);
            });
        });
    }
    
    function updateCartTotals() {
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');
        
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Calculate shipping
        const selectedShipping = document.querySelector('input[name="shipping"]:checked').value;
        let shipping = 0;
        if (subtotal < 200) {
            shipping = selectedShipping === 'express' ? 25 : 15;
        }
        
        // Calculate tax (8.5% example)
        const tax = subtotal * 0.085;
        
        // Calculate total
        const total = subtotal + shipping + tax;
        
        // Update display
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    function changeCartQuantity(index, change) {
        console.log('changeCartQuantity called with index:', index, 'change:', change);
        console.log('Cart before change:', cart);
        
        const newQuantity = cart[index].quantity + change;
        console.log('New quantity will be:', newQuantity);
        
        if (newQuantity <= 0) {
            console.log('Quantity will be 0 or less, removing item');
            removeCartItem(index);
        } else {
            cart[index].quantity = newQuantity;
            console.log('Updated cart item quantity:', cart[index]);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    }
    
    function removeCartItem(index) {
        console.log('removeCartItem called with index:', index);
        console.log('Cart before removal:', cart);
        
        cart.splice(index, 1);
        console.log('Cart after removal:', cart);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        
        showNotification('Item removed from cart');
    }
    
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
            updateCartDisplay();
            updateCartCount();
            showNotification('Product added to cart!');
        }
    }
    
    function getProductById(id) {
        const products = {
            '5': { name: 'Silk Blouse', price: 79.00 },
            '6': { name: 'Cashmere Sweater', price: 159.00 },
            '7': { name: 'High-Waist Trousers', price: 119.00 },
            '8': { name: 'Skinny Jeans', price: 99.00 }
        };
        return products[id];
    }
    
    function proceedToCheckout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }
        
        // Store cart data for checkout page
        localStorage.setItem('checkoutCart', JSON.stringify(cart));
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
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
    
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }
    
    function showProductModal(productId) {
        const product = getProductById(productId);
        if (!product) return;
        
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-body">
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
                                        <button class="qty-btn decrease-modal-btn">-</button>
                                        <span id="modalQuantity">1</span>
                                        <button class="qty-btn increase-modal-btn">+</button>
                                    </div>
                                </div>
                            </div>
                            <button class="add-to-cart-btn" id="modalAddToCartBtn">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
        };
        
        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
        
        // Add event listeners for modal buttons
        const decreaseBtn = modal.querySelector('.decrease-modal-btn');
        const increaseBtn = modal.querySelector('.increase-modal-btn');
        const addToCartBtn = modal.querySelector('#modalAddToCartBtn');
        
        decreaseBtn.addEventListener('click', () => {
            const quantitySpan = document.getElementById('modalQuantity');
            let currentQuantity = parseInt(quantitySpan.textContent);
            currentQuantity = Math.max(1, currentQuantity - 1);
            quantitySpan.textContent = currentQuantity;
        });
        
        increaseBtn.addEventListener('click', () => {
            const quantitySpan = document.getElementById('modalQuantity');
            let currentQuantity = parseInt(quantitySpan.textContent);
            currentQuantity = currentQuantity + 1;
            quantitySpan.textContent = currentQuantity;
        });
        
        addToCartBtn.addEventListener('click', () => {
            const size = document.getElementById('modalSize').value;
            const quantity = parseInt(document.getElementById('modalQuantity').textContent);
            
            const product = getProductById(productId);
            if (product) {
                const existingItem = cart.find(item => item.id === productId && item.size === size);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        size: size,
                        quantity: quantity
                    });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                updateCartCount();
                showNotification('Product added to cart!');
                
                // Close modal
                document.body.removeChild(modal);
            }
        });
    }
});
