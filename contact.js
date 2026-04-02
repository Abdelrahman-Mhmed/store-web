// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Sending message...', 'info');
        
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
            contactForm.reset();
        }, 2000);
    });

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.fa-chevron-down');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const faqAnswer = faqItem.querySelector('.faq-answer');
                const faqIcon = faqItem.querySelector('.fa-chevron-down');
                faqAnswer.style.maxHeight = '0px';
                faqIcon.style.transform = 'rotate(0deg)';
            });
            
            // Open clicked item if it wasn't open
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Enhanced notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Set notification styles based on type
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
            },
            info: {
                backgroundColor: '#fff',
                color: '#1976d2',
                borderLeft: '4px solid #1976d2'
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
        
        // Auto remove notification
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Add CSS for contact page
    const contactStyles = document.createElement('style');
    contactStyles.textContent = `
        .contact-hero {
            padding: 120px 0 80px;
            text-align: center;
            background-color: #f8f8f8;
        }
        
        .contact-hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }
        
        .contact-hero p {
            font-size: 1.2rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .contact-content {
            padding: 80px 0;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
        }
        
        .contact-form-section h2,
        .contact-info-section h2 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 30px;
            letter-spacing: 1px;
        }
        
        .contact-form {
            display: flex;
            flex-direction: column;
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
        .form-group select,
        .form-group textarea {
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            font-family: inherit;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #000;
        }
        
        .submit-btn {
            background-color: #000;
            color: #fff;
            border: none;
            padding: 15px 30px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-top: 10px;
        }
        
        .submit-btn:hover {
            background-color: #333;
        }
        
        .contact-info {
            margin-bottom: 40px;
        }
        
        .info-item {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-item i {
            font-size: 1.5rem;
            color: #000;
            margin-top: 5px;
        }
        
        .info-item h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .info-item p {
            color: #666;
            line-height: 1.6;
        }
        
        .social-connect h3 {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .social-connect p {
            color: #666;
            margin-bottom: 25px;
        }
        
        .social-links-large {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .social-link {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-decoration: none;
            color: #000;
            transition: all 0.3s ease;
        }
        
        .social-link:hover {
            border-color: #000;
            background-color: #f8f8f8;
        }
        
        .social-link i {
            font-size: 1.3rem;
        }
        
        .faq-section {
            padding: 80px 0;
            background-color: #f8f8f8;
        }
        
        .faq-section h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 50px;
            letter-spacing: 2px;
        }
        
        .faq-grid {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .faq-item {
            background-color: #fff;
            border: 1px solid #f0f0f0;
            margin-bottom: 20px;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .faq-question {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 25px 30px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .faq-question:hover {
            background-color: #f8f8f8;
        }
        
        .faq-question h3 {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
        }
        
        .faq-question i {
            transition: transform 0.3s ease;
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            padding: 0 30px;
        }
        
        .faq-answer p {
            color: #666;
            line-height: 1.6;
            margin: 0;
            padding-bottom: 25px;
        }
        
        .map-section {
            padding: 80px 0;
        }
        
        .map-section h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 600;
            margin-bottom: 50px;
            letter-spacing: 2px;
        }
        
        .map-container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .map-placeholder {
            height: 400px;
            background-color: #f8f8f8;
            border: 2px dashed #ddd;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #666;
        }
        
        .map-placeholder i {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .map-placeholder p {
            font-size: 1.1rem;
        }
        
        .notification-success {
            border-left: 4px solid #4CAF50;
        }
        
        .notification-error {
            border-left: 4px solid #d32f2f;
        }
        
        .notification-info {
            border-left: 4px solid #1976d2;
        }
        
        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
                gap: 50px;
            }
            
            .contact-hero h1 {
                font-size: 2rem;
            }
            
            .faq-section h2,
            .map-section h2 {
                font-size: 2rem;
            }
            
            .faq-question {
                padding: 20px;
            }
            
            .faq-answer {
                padding: 0 20px;
            }
        }
        
        @media (max-width: 480px) {
            .contact-hero {
                padding: 100px 0 60px;
            }
            
            .contact-content {
                padding: 60px 0;
            }
            
            .faq-section,
            .map-section {
                padding: 60px 0;
            }
        }
    `;
    document.head.appendChild(contactStyles);
});
