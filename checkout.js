// Checkout page functionality
document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    let checkoutData = {};
    
    // Load cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
    
    // Initialize checkout
    initializeCheckout();
    
    // Same as shipping checkbox functionality
    const sameAsShippingCheckbox = document.getElementById('sameAsShipping');
    sameAsShippingCheckbox.addEventListener('change', function() {
        if (this.checked) {
            copyShippingToBilling();
        }
    });
    
    function initializeCheckout() {
        if (cart.length === 0) {
            // Redirect to cart if empty
            window.location.href = 'cart.html';
            return;
        }
        
        updateOrderSummary();
        updateOrderItems();
    }
    
    function updateOrderSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal >= 200 ? 0 : 15; // Free shipping over $200
        const tax = subtotal * 0.085; // 8.5% tax
        const total = subtotal + shipping + tax;
        
        document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
    }
    
    function updateOrderItems() {
        const orderItemsContainer = document.getElementById('checkoutOrderItems');
        let itemsHTML = '';
        
        cart.forEach(item => {
            itemsHTML += `
                <div class="checkout-order-item">
                    <div class="item-image">
                        <div class="product-placeholder"></div>
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Size: ${item.size || 'One Size'}</p>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                    <div class="item-price">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        orderItemsContainer.innerHTML = itemsHTML;
    }
    
    function copyShippingToBilling() {
        const shippingFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country'];
        const billingFields = ['billingFirstName', 'billingLastName', 'billingAddress', 'billingCity', 'billingState', 'billingZipCode'];
        
        shippingFields.forEach((field, index) => {
            const shippingValue = document.getElementById(field).value;
            if (index < billingFields.length) {
                document.getElementById(billingFields[index]).value = shippingValue;
            }
        });
    }
    
    // Step navigation functions
    window.nextStep = function() {
        if (validateCurrentStep()) {
            if (currentStep < 4) {
                currentStep++;
                updateStepDisplay();
                saveStepData();
            }
        }
    };
    
    window.prevStep = function() {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    };
    
    function updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.checkout-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        document.getElementById(`step${currentStep}`).classList.add('active');
        
        // Update progress indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update step content based on current step
        if (currentStep === 4) {
            populateOrderReview();
        }
    }
    
    function validateCurrentStep() {
        const currentStepElement = document.getElementById(`step${currentStep}`);
        const form = currentStepElement.querySelector('form');
        
        if (!form) return true;
        
        // Basic HTML5 validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        
        // Additional custom validation
        if (currentStep === 1) {
            return validateShippingForm();
        } else if (currentStep === 2) {
            return validateBillingForm();
        } else if (currentStep === 3) {
            return validatePaymentForm();
        }
        
        return true;
    }
    
    function validateShippingForm() {
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        // Email validation
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        // Phone validation
        if (!isValidPhone(phone)) {
            showNotification('Please enter a valid phone number', 'error');
            return false;
        }
        
        return true;
    }
    
    function validateBillingForm() {
        // Basic validation is handled by HTML5 required attributes
        return true;
    }
    
    function validatePaymentForm() {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        // Card number validation (basic)
        if (cardNumber.replace(/\s/g, '').length < 13) {
            showNotification('Please enter a valid card number', 'error');
            return false;
        }
        
        // Expiry date validation
        if (!isValidExpiryDate(expiryDate)) {
            showNotification('Please enter a valid expiry date (MM/YY)', 'error');
            return false;
        }
        
        // CVV validation
        if (cvv.length < 3 || cvv.length > 4) {
            showNotification('Please enter a valid CVV', 'error');
            return false;
        }
        
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    function isValidExpiryDate(expiryDate) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(expiryDate)) return false;
        
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(year) < currentYear) return false;
        if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
        
        return true;
    }
    
    function saveStepData() {
        if (currentStep === 1) {
            const formData = new FormData(document.getElementById('shippingForm'));
            checkoutData.shipping = Object.fromEntries(formData);
        } else if (currentStep === 2) {
            const formData = new FormData(document.getElementById('billingForm'));
            checkoutData.billing = Object.fromEntries(formData);
        } else if (currentStep === 3) {
            const formData = new FormData(document.getElementById('paymentForm'));
            checkoutData.payment = Object.fromEntries(formData);
        }
    }
    
    function populateOrderReview() {
        // Shipping review
        const shippingReview = document.getElementById('shippingReview');
        if (checkoutData.shipping) {
            shippingReview.innerHTML = `
                <p><strong>${checkoutData.shipping.firstName} ${checkoutData.shipping.lastName}</strong></p>
                <p>${checkoutData.shipping.address}</p>
                <p>${checkoutData.shipping.city}, ${checkoutData.shipping.state} ${checkoutData.shipping.zipCode}</p>
                <p>${checkoutData.shipping.country}</p>
                <p>${checkoutData.shipping.email}</p>
                <p>${checkoutData.shipping.phone}</p>
            `;
        }
        
        // Billing review
        const billingReview = document.getElementById('billingReview');
        if (checkoutData.billing) {
            billingReview.innerHTML = `
                <p><strong>${checkoutData.billing.billingFirstName} ${checkoutData.billing.billingLastName}</strong></p>
                <p>${checkoutData.billing.billingAddress}</p>
                <p>${checkoutData.billing.billingCity}, ${checkoutData.billing.billingState} ${checkoutData.billing.billingZipCode}</p>
            `;
        }
        
        // Payment review
        const paymentReview = document.getElementById('paymentReview');
        if (checkoutData.payment) {
            const cardNumber = checkoutData.payment.cardNumber;
            const maskedCard = '**** **** **** ' + cardNumber.slice(-4);
            paymentReview.innerHTML = `
                <p><strong>${checkoutData.payment.cardholderName}</strong></p>
                <p>${maskedCard}</p>
                <p>Expires: ${checkoutData.payment.expiryDate}</p>
            `;
        }
        
        // Order items review
        const orderItemsReview = document.getElementById('orderItemsReview');
        let itemsHTML = '';
        cart.forEach(item => {
            itemsHTML += `
                <div class="review-order-item">
                    <span>${item.name} (${item.size || 'One Size'}) x ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });
        orderItemsReview.innerHTML = itemsHTML;
    }
    
    // Place order functionality
    window.placeOrder = function() {
        if (currentStep !== 4) {
            showNotification('Please complete all steps before placing your order', 'error');
            return;
        }
        
        // Show processing state
        const placeOrderBtn = document.querySelector('.place-order-btn');
        placeOrderBtn.textContent = 'Processing...';
        placeOrderBtn.disabled = true;
        
        // Simulate order processing
        setTimeout(() => {
            // Clear cart
            localStorage.removeItem('cart');
            localStorage.removeItem('checkoutCart');
            
            // Show success message
            showNotification('Order placed successfully! You will receive a confirmation email shortly.', 'success');
            
            // Redirect to success page or home
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 3000);
    };
    
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
        }, 5000);
    }
    
    // Add CSS for checkout page
    const checkoutStyles = document.createElement('style');
    checkoutStyles.textContent = `
        .checkout-header {
            padding: 120px 0 80px;
            text-align: center;
            background-color: #f8f8f8;
        }
        
        .checkout-header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }
        
        .checkout-header p {
            font-size: 1.2rem;
            color: #666;
        }
        
        .checkout-progress {
            padding: 40px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .progress-steps {
            display: flex;
            justify-content: center;
            gap: 40px;
        }
        
        .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            color: #999;
            transition: color 0.3s ease;
        }
        
        .step.active {
            color: #000;
        }
        
        .step-number {
            width: 40px;
            height: 40px;
            border: 2px solid #ddd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .step.active .step-number {
            border-color: #000;
            background-color: #000;
            color: #fff;
        }
        
        .checkout-content {
            padding: 80px 0;
        }
        
        .checkout-layout {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 60px;
        }
        
        .checkout-step {
            display: none;
        }
        
        .checkout-step.active {
            display: block;
        }
        
        .checkout-step h2 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 30px;
            letter-spacing: 1px;
        }
        
        .checkout-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            font-weight: 600;
            margin-bottom: 8px;
            color: #000;
        }
        
        .form-group input,
        .form-group select {
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            font-family: inherit;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #000;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }
        
        .checkbox-label input[type="checkbox"] {
            display: none;
        }
        
        .checkmark {
            width: 20px;
            height: 20px;
            border: 2px solid #ddd;
            border-radius: 4px;
            position: relative;
            transition: border-color 0.3s ease;
        }
        
        .checkbox-label input[type="checkbox"]:checked + .checkmark {
            border-color: #000;
            background-color: #000;
        }
        
        .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }
        
        .step-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #f0f0f0;
        }
        
        .prev-step-btn,
        .next-step-btn,
        .place-order-btn {
            padding: 15px 30px;
            border: none;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 4px;
        }
        
        .prev-step-btn {
            background-color: #f0f0f0;
            color: #666;
        }
        
        .prev-step-btn:hover {
            background-color: #e0e0e0;
        }
        
        .next-step-btn,
        .place-order-btn {
            background-color: #000;
            color: #fff;
        }
        
        .next-step-btn:hover,
        .place-order-btn:hover {
            background-color: #333;
        }
        
        .payment-methods {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f8f8;
            border-radius: 4px;
        }
        
        .payment-methods h3 {
            margin-bottom: 15px;
            font-size: 1.1rem;
        }
        
        .payment-icons {
            display: flex;
            gap: 20px;
            font-size: 2rem;
            color: #666;
        }
        
        .order-review {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }
        
        .review-section h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .review-section p {
            margin-bottom: 8px;
            color: #666;
        }
        
        .review-order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .order-summary {
            background-color: #f8f8f8;
            padding: 40px;
            border-radius: 8px;
            position: sticky;
            top: 120px;
        }
        
        .order-summary h2 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 30px;
        }
        
        .summary-details {
            margin-bottom: 30px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 1.1rem;
        }
        
        .summary-row.total {
            font-size: 1.3rem;
            font-weight: 600;
            margin-top: 20px;
        }
        
        .summary-divider {
            height: 1px;
            background-color: #ddd;
            margin: 20px 0;
        }
        
        .order-items {
            margin-bottom: 30px;
        }
        
        .order-items h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        .checkout-order-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .checkout-order-item:last-child {
            border-bottom: none;
        }
        
        .item-image .product-placeholder {
            width: 60px;
            height: 60px;
            background-color: #e0e0e0;
        }
        
        .item-details h4 {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .item-details p {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 2px;
        }
        
        .item-price {
            font-weight: 600;
            margin-left: auto;
        }
        
        .security-info {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 20px;
            background-color: #fff;
            border-radius: 4px;
            text-align: center;
        }
        
        .security-info i {
            font-size: 1.5rem;
            color: #4CAF50;
        }
        
        .security-info p {
            color: #666;
            font-size: 0.9rem;
            margin: 0;
        }
        
        @media (max-width: 768px) {
            .checkout-layout {
                grid-template-columns: 1fr;
                gap: 40px;
            }
            
            .checkout-header h1 {
                font-size: 2rem;
            }
            
            .progress-steps {
                gap: 20px;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .step-actions {
                flex-direction: column;
                gap: 15px;
            }
            
            .order-summary {
                position: static;
            }
        }
        
        @media (max-width: 480px) {
            .checkout-header {
                padding: 100px 0 60px;
            }
            
            .checkout-content {
                padding: 60px 0;
            }
            
            .progress-steps {
                flex-direction: column;
                gap: 20px;
            }
        }
    `;
    document.head.appendChild(checkoutStyles);
});
