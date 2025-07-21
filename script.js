// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeSearch();
    initializeFilters();
    initializeContactForm();
    initializeScrollEffects();
    initializeProductCards();
    initializeCart();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        // Add debounce to search for better performance
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts();
            }, 300);
        });
    }
}

// Enhanced search function
function searchProducts() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const description = card.querySelector('.product-description').innerText.toLowerCase();
        const category = card.getAttribute('data-category').toLowerCase();
        
        const isVisible = title.includes(input) || 
                         description.includes(input) || 
                         category.includes(input);
        
        if (isVisible) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show no results message
    showNoResultsMessage(visibleCount === 0 && input !== '');
}

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            filterProducts(filter);
        });
    });
}

// Enhanced filter function
function filterProducts(category) {
    const cards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let visibleCount = 0;

    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
    });

    // Filter products
    cards.forEach(card => {
        const productCategory = card.getAttribute('data-category');
        const isVisible = category === 'all' || productCategory === category;
        
        if (isVisible) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Clear search input when filtering
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    // Show no results message
    showNoResultsMessage(visibleCount === 0);
}

// Show/hide no results message
function showNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (show) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
            document.getElementById('productContainer').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else {
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const phone = contactForm.querySelector('input[type="tel"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            // Validate form
            if (!name || !email || !phone || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Create WhatsApp message
            const whatsappMessage = `Hello MA STEEL!
            
New Contact Form Submission:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}

Please get back to me soon!`;
            
            const whatsappUrl = `https://wa.me/918087126177?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            showNotification('Message sent! We will contact you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Scroll effects
function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(46, 58, 89, 0.98)';
        } else {
            navbar.style.background = 'rgba(46, 58, 89, 0.95)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe product cards and sections
    document.querySelectorAll('.product-card, .feature, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Product card interactions
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add click tracking
        const whatsappBtn = card.querySelector('.whatsapp-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', function() {
                const productName = card.querySelector('h3').innerText;
                
                // Track click (you can integrate with analytics here)
                console.log(`Product clicked: ${productName}`);
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        }
        
        // Add hover effects for better UX
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animation for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.8;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization: Preload critical images
function preloadCriticalImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=600&fit=crop'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    preloadCriticalImages();
    initializeLazyLoading();
});

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for global access
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;

// Shopping Cart functionality
let cart = [];

function initializeCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('masteelCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartCount();
    }
}

function addToCart(name, price, unit) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            unit: unit,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartCount();
    saveCart();
    showNotification(`${name} added to cart!`, 'success');
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
    updateCartCount();
    saveCart();
    showNotification('Item removed from cart', 'info');
}

function updateQuantity(name, quantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = Math.max(1, quantity);
        updateCartDisplay();
        updateCartCount();
        saveCart();
    }
}

function updateQuantityFromInput(name, quantity) {
    const parsedQuantity = parseInt(quantity);
    if (parsedQuantity && parsedQuantity > 0 && parsedQuantity <= 9999) {
        updateQuantity(name, parsedQuantity);
        showNotification(`Quantity updated to ${parsedQuantity}`, 'success');
    } else {
        showNotification('Please enter a valid quantity (1-9999)', 'error');
        // Reset to current quantity
        updateCartDisplay();
    }
}

function handleQuantityKeyPress(event, name, quantity) {
    if (event.key === 'Enter') {
        event.preventDefault();
        updateQuantityFromInput(name, quantity);
        event.target.blur(); // Remove focus from input
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }
    
    let subtotal = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toFixed(2)} per ${item.unit}</p>
                </div>
                <div class="item-controls">
                    <button onclick="updateQuantity('${item.name}', ${item.quantity - 1})" class="quantity-btn">-</button>
                    <input type="number"
                           value="${item.quantity}"
                           min="1"
                           max="9999"
                           class="quantity-input"
                           onchange="updateQuantityFromInput('${item.name}', this.value)"
                           onkeypress="handleQuantityKeyPress(event, '${item.name}', this.value)">
                    <button onclick="updateQuantity('${item.name}', ${item.quantity + 1})" class="quantity-btn">+</button>
                </div>
                <div class="item-total">
                    <span>₹${itemTotal.toFixed(2)}</span>
                    <button onclick="removeFromCart('${item.name}')" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    
    cartSummary.style.display = 'block';
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function clearCart() {
    cart = [];
    updateCartDisplay();
    updateCartCount();
    saveCart();
    showNotification('Cart cleared', 'info');
}

function saveCart() {
    localStorage.setItem('masteelCart', JSON.stringify(cart));
}

function generateWhatsAppOrder() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    let message = 'Hello MA STEEL!\n\nI would like to place an order:\n\n';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `• ${item.name} - ${item.quantity} ${item.unit}(s) @ ₹${item.price.toFixed(2)} = ₹${itemTotal.toFixed(2)}\n`;
    });
    
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    
    message += `\nSubtotal: ₹${subtotal.toFixed(2)}`;
    message += `\nTax (18%): ₹${tax.toFixed(2)}`;
    message += `\nTotal: ₹${total.toFixed(2)}`;
    message += `\n\nPlease confirm availability and delivery details.`;
    
    const whatsappUrl = `https://wa.me/918087126177?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function printBill() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    generateBill();
    document.getElementById('printModal').style.display = 'block';
}

function generateBill() {
    const billContent = document.getElementById('billContent');
    let subtotal = 0;
    const currentDate = new Date();
    const billNumber = `MS-${Date.now().toString().slice(-6)}`;
    
    const billHTML = `
        <div class="gst-invoice-header">
            <div class="invoice-title-section">
                <div class="invoice-type">TAX INVOICE</div>
                <div class="company-name">M.A. STEEL</div>
                <div class="company-tagline">STOCKISTS FOR:</div>
                <div class="company-products">G.I., M.S. Corrugated Sheets, Cement Sheets, M.S. Pipe etc.</div>
                <div class="company-address">
                    Plot No.32, Gat No.150/A, Satpur Ambad Link Road, Near Ind. Weigh Bridge, Nashik-422010<br>
                    Mob: 9422748363 / 8605567620 / 9970117512 / 9823739159
                </div>
            </div>
            <div class="gst-details">
                <div class="gst-info">
                    <div>GST No: 27ARBPK6403F1ZG</div>
                    <div>State: Maharashtra</div>
                    <div>State Code: 27</div>
                    <div>PAN: ARBPK6403F</div>
                </div>
            </div>
        </div>
        
        <div class="invoice-details-section">
            <div class="invoice-left-details">
                <table class="details-table">
                    <tr>
                        <td class="label">Reverse Charge Basis</td>
                        <td class="value"></td>
                        <td class="label">Transportation Mode</td>
                        <td class="value"></td>
                    </tr>
                    <tr>
                        <td class="label">Invoice No.</td>
                        <td class="value">${billNumber}</td>
                        <td class="label">Vehicle No.</td>
                        <td class="value"></td>
                    </tr>
                    <tr>
                        <td class="label">Invoice Date</td>
                        <td class="value">${currentDate.toLocaleDateString('en-IN')}</td>
                        <td class="label">Place of Supply</td>
                        <td class="value">Maharashtra</td>
                    </tr>
                    <tr>
                        <td class="label">Date of Receipt (Billed To)</td>
                        <td class="value">${currentDate.toLocaleDateString('en-IN')}</td>
                        <td class="label"></td>
                        <td class="value"></td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div class="customer-details">
            <div class="customer-section">
                <div class="section-title">Name of Recipient:</div>
                <div class="customer-info">
                    <div class="customer-name">Cash Customer</div>
                    <div class="customer-address">Address: Nashik, Maharashtra</div>
                    <div class="customer-gst">GST No.: </div>
                    <div class="customer-state">State: Maharashtra &nbsp;&nbsp;&nbsp;&nbsp; State Code: 27</div>
                </div>
            </div>
        </div>
        
        <div class="items-table-section">
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Name of Products / Services</th>
                        <th>HSN Code</th>
                        <th>Rate of Tax</th>
                        <th>Qty</th>
                        <th>Unit of Measure</th>
                        <th>Rate Per Qty/UOM</th>
                        <th>Taxable Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map((item, index) => {
                        const itemTotal = item.price * item.quantity;
                        subtotal += itemTotal;
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.name}</td>
                                <td>7326</td>
                                <td>18%</td>
                                <td>${item.quantity}</td>
                                <td>${item.unit}</td>
                                <td>₹${item.price.toFixed(2)}</td>
                                <td>₹${itemTotal.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                    <tr class="total-row">
                        <td colspan="7" class="total-label">Total Rs.</td>
                        <td class="total-value">₹${subtotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="tax-calculation-section">
            <table class="tax-table">
                <thead>
                    <tr>
                        <th rowspan="2">5%</th>
                        <th rowspan="2">12%</th>
                        <th rowspan="2">18%</th>
                        <th rowspan="2">28%</th>
                        <th rowspan="2">Add: CGST</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="tax-label">Tax Value</td>
                        <td class="tax-label">Tax</td>
                        <td class="tax-label">Tax Value</td>
                        <td class="tax-label">Tax</td>
                        <td class="tax-label">Tax Value</td>
                        <td class="tax-label">Tax</td>
                        <td class="tax-label">Tax Value</td>
                        <td class="tax-label">Tax</td>
                        <td class="tax-label">Add: SGST</td>
                    </tr>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>₹${subtotal.toFixed(2)}</td>
                        <td>₹${(subtotal * 0.09).toFixed(2)}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>₹${(subtotal * 0.09).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4">CGST</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td class="tax-label">Add: IGST</td>
                    </tr>
                    <tr>
                        <td colspan="4">SGST</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td class="tax-label">Add: Reverse Charge</td>
                    </tr>
                    <tr>
                        <td colspan="4">IGST</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td class="tax-label">Add: Cess</td>
                    </tr>
                    <tr class="total-final-row">
                        <td colspan="4">TOTAL</td>
                        <td colspan="4"></td>
                        <td class="final-total">Total Rs. ₹${(subtotal * 1.18).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="amount-words">
            <strong>Total Invoice Value in Words Rs.</strong> ${numberToWords(subtotal * 1.18)} Only
        </div>
        
        <div class="footer-section">
            <div class="bank-details">
                <div class="bank-title">Bank Details:</div>
                <div>Bank Name: Central Bank of India</div>
                <div>Current A/c: 3096055117</div>
                <div>IFSC Code: CBIN0283765</div>
            </div>
            <div class="signature-section">
                <div class="company-signature">
                    <div class="signature-title">For M.A. STEEL</div>
                    <div class="signature-space"></div>
                    <div class="signature-label">Receiver's Signature &nbsp;&nbsp;&nbsp;&nbsp; Authorised Signatory</div>
                </div>
            </div>
        </div>
        
        <div class="print-actions">
            <button onclick="printBillContent()" class="print-bill-btn">
                <i class="fas fa-print"></i> Print Bill
            </button>
            <button onclick="closePrintModal()" class="close-bill-btn">Close</button>
        </div>
    `;
    
    billContent.innerHTML = billHTML;
}

function printBillContent() {
    const billContent = document.getElementById('billContent').cloneNode(true);
    
    // Remove print actions from the cloned content
    const printActions = billContent.querySelector('.print-actions');
    if (printActions) {
        printActions.remove();
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>MA STEEL - GST Invoice</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 10px; font-size: 12px; }
                    
                    .gst-invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border: 2px solid #000; padding: 10px; margin-bottom: 0; }
                    .invoice-title-section { flex: 1; text-align: center; }
                    .invoice-type { font-weight: bold; font-size: 14px; margin-bottom: 5px; border: 1px solid #000; padding: 2px 5px; display: inline-block; }
                    .company-name { font-size: 24px; font-weight: bold; margin: 5px 0; letter-spacing: 2px; }
                    .company-tagline { font-weight: bold; margin: 5px 0; }
                    .company-products { font-size: 12px; margin: 5px 0; }
                    .company-address { font-size: 11px; margin: 10px 0; line-height: 1.4; }
                    .gst-details { border-left: 1px solid #000; padding-left: 10px; min-width: 200px; }
                    .gst-info div { font-size: 11px; margin: 2px 0; padding: 1px 0; }
                    
                    .invoice-details-section { border: 1px solid #000; border-top: none; margin-bottom: 0; }
                    .details-table { width: 100%; border-collapse: collapse; font-size: 11px; }
                    .details-table td { border: 1px solid #000; padding: 4px 6px; height: 25px; }
                    .details-table .label { background: #f5f5f5; font-weight: bold; width: 20%; }
                    .details-table .value { width: 20%; }
                    
                    .customer-details { border: 1px solid #000; border-top: none; padding: 8px; margin-bottom: 0; }
                    .section-title { font-weight: bold; font-size: 12px; margin-bottom: 5px; }
                    .customer-info { font-size: 11px; line-height: 1.6; }
                    .customer-name { font-weight: bold; margin: 3px 0; }
                    
                    .items-table-section { border: 1px solid #000; border-top: none; margin-bottom: 0; }
                    .items-table { width: 100%; border-collapse: collapse; font-size: 11px; }
                    .items-table th, .items-table td { border: 1px solid #000; padding: 4px 6px; text-align: center; }
                    .items-table th { background: #f5f5f5; font-weight: bold; height: 30px; }
                    .items-table td:nth-child(2) { text-align: left; max-width: 200px; }
                    .total-row { font-weight: bold; }
                    .total-label { text-align: right !important; background: #f5f5f5; }
                    .total-value { background: #f5f5f5; }
                    
                    .tax-calculation-section { border: 1px solid #000; border-top: none; margin-bottom: 0; }
                    .tax-table { width: 100%; border-collapse: collapse; font-size: 10px; }
                    .tax-table th, .tax-table td { border: 1px solid #000; padding: 3px 4px; text-align: center; height: 20px; }
                    .tax-table th { background: #f5f5f5; font-weight: bold; }
                    .tax-label { font-size: 9px; background: #f8f8f8; }
                    .total-final-row { font-weight: bold; background: #f5f5f5; }
                    .final-total { font-weight: bold; font-size: 11px; }
                    
                    .amount-words { border: 1px solid #000; border-top: none; padding: 8px; font-size: 11px; margin-bottom: 0; }
                    
                    .footer-section { display: flex; justify-content: space-between; border: 1px solid #000; border-top: none; padding: 10px; font-size: 11px; }
                    .bank-details { flex: 1; }
                    .bank-title { font-weight: bold; margin-bottom: 5px; }
                    .signature-section { flex: 1; text-align: right; }
                    .signature-title { font-weight: bold; margin-bottom: 20px; }
                    .signature-space { height: 40px; margin: 10px 0; }
                    .signature-label { font-size: 10px; border-top: 1px solid #000; padding-top: 5px; margin-top: 10px; }
                    
                    @media print {
                        body { margin: 0; font-size: 11px; }
                        .gst-invoice-header, .invoice-details-section, .customer-details, .items-table-section, .tax-calculation-section, .amount-words, .footer-section { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                ${billContent.innerHTML}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

function closePrintModal() {
    document.getElementById('printModal').style.display = 'none';
}

// Export new functions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.updateQuantityFromInput = updateQuantityFromInput;
window.handleQuantityKeyPress = handleQuantityKeyPress;
window.clearCart = clearCart;
window.generateWhatsAppOrder = generateWhatsAppOrder;
window.printBill = printBill;
window.closePrintModal = closePrintModal;
window.printBillContent = printBillContent;

// Bill History functionality
let billHistory = [];

function initializeBillHistory() {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('masteelBillHistory');
    if (savedHistory) {
        billHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

function saveBillToHistory(cartData, total) {
    const bill = {
        id: 'MS-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN'),
        items: [...cartData],
        total: total,
        timestamp: Date.now()
    };
    
    billHistory.unshift(bill); // Add to beginning of array
    
    // Keep only last 50 bills
    if (billHistory.length > 50) {
        billHistory = billHistory.slice(0, 50);
    }
    
    localStorage.setItem('masteelBillHistory', JSON.stringify(billHistory));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (billHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-receipt"></i>
                <p>No bill history found</p>
                <p class="hint">Bills will appear here after checkout</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = billHistory.map(bill => `
        <div class="history-item">
            <div class="history-info">
                <h4>Bill #${bill.id}</h4>
                <p><i class="fas fa-calendar"></i> ${bill.date} at ${bill.time}</p>
                <p><i class="fas fa-shopping-cart"></i> ${bill.items.length} items</p>
            </div>
            <div class="history-total">₹${bill.total.toFixed(2)}</div>
            <div class="history-actions">
                <button onclick="viewBillDetails('${bill.id}')" class="view-bill-btn">
                    <i class="fas fa-eye"></i> View
                </button>
                <button onclick="reorderFromHistory('${bill.id}')" class="reorder-btn">
                    <i class="fas fa-redo"></i> Reorder
                </button>
            </div>
        </div>
    `).join('');
}

function viewBillDetails(billId) {
    const bill = billHistory.find(b => b.id === billId);
    if (!bill) return;
    
    // Create a temporary cart with bill data for display
    const tempCart = bill.items;
    generateBillFromData(bill);
    document.getElementById('printModal').style.display = 'block';
}

function generateBillFromData(bill) {
    const billContent = document.getElementById('billContent');
    let subtotal = bill.total / 1.18; // Remove tax to get subtotal
    
    const billHTML = `
        <div class="bill-header">
            <h2><i class="fas fa-industry"></i> MA STEEL</h2>
            <p>Premium Steel & Plastic Products</p>
            <p>Satpur Ambad Link Road, Near Datt Mandir, Nashik – 422010</p>
            <p>Phone: +91 80871 26177 | Email: info@masteel.com</p>
            <hr>
        </div>
        
        <div class="bill-info">
            <div class="bill-date">
                <strong>Date:</strong> ${bill.date}
            </div>
            <div class="bill-time">
                <strong>Time:</strong> ${bill.time}
            </div>
            <div class="bill-number">
                <strong>Bill No:</strong> ${bill.id}
            </div>
        </div>
        
        <div class="bill-items">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Rate</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${bill.items.map(item => {
                        const itemTotal = item.price * item.quantity;
                        return `
                            <tr>
                                <td>${item.name}</td>
                                <td>₹${item.price.toFixed(2)}</td>
                                <td>${item.quantity}</td>
                                <td>${item.unit}</td>
                                <td>₹${itemTotal.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="bill-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>GST (18%):</span>
                <span>₹${(bill.total - subtotal).toFixed(2)}</span>
            </div>
            <div class="summary-row total-row">
                <span><strong>Total Amount:</strong></span>
                <span><strong>₹${bill.total.toFixed(2)}</strong></span>
            </div>
        </div>
        
        <div class="bill-footer">
            <p>Thank you for your business!</p>
            <p>For any queries, please contact us at +91 80871 26177</p>
        </div>
        
        <div class="print-actions">
            <button onclick="printBillContent()" class="print-bill-btn">
                <i class="fas fa-print"></i> Print Bill
            </button>
            <button onclick="closePrintModal()" class="close-bill-btn">Close</button>
        </div>
    `;
    
    billContent.innerHTML = billHTML;
}

function reorderFromHistory(billId) {
    const bill = billHistory.find(b => b.id === billId);
    if (!bill) return;
    
    // Clear current cart and add items from history
    cart = [...bill.items];
    updateCartDisplay();
    updateCartCount();
    saveCart();
    
    showNotification('Items added to cart from bill history!', 'success');
    
    // Navigate to cart section
    const cartSection = document.getElementById('cart');
    cartSection.scrollIntoView({ behavior: 'smooth' });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all bill history? This action cannot be undone.')) {
        billHistory = [];
        localStorage.removeItem('masteelBillHistory');
        updateHistoryDisplay();
        showNotification('Bill history cleared', 'info');
    }
}

function exportHistory() {
    if (billHistory.length === 0) {
        showNotification('No history to export', 'error');
        return;
    }
    
    const csvContent = generateHistoryCSV();
    downloadCSV(csvContent, 'ma-steel-bill-history.csv');
    showNotification('History exported successfully!', 'success');
}

function generateHistoryCSV() {
    let csv = 'Bill ID,Date,Time,Items,Total\n';
    
    billHistory.forEach(bill => {
        const itemsText = bill.items.map(item => `${item.name} (${item.quantity}x${item.price})`).join('; ');
        csv += `${bill.id},"${bill.date}","${bill.time}","${itemsText}",${bill.total}\n`;
    });
    
    return csv;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Add Product functionality
function initializeAddProduct() {
    const addProductForm = document.getElementById('addProductForm');
    
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProduct();
        });
    }
    
    // Initialize image upload functionality
    initializeImageUpload();
}

function initializeImageUpload() {
    const imageFileInput = document.getElementById('productImageFile');
    const imageUrlInput = document.getElementById('productImage');
    
    if (imageFileInput) {
        imageFileInput.addEventListener('change', handleImageFileSelect);
    }
    
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', handleImageUrlChange);
    }
}

function handleImageFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            showImagePreview(e.target.result);
            // Clear URL input when file is selected
            document.getElementById('productImage').value = '';
        };
        reader.readAsDataURL(file);
    }
}

function handleImageUrlChange(event) {
    const url = event.target.value.trim();
    if (url) {
        // Clear file input when URL is entered
        document.getElementById('productImageFile').value = '';
        showImagePreview(url);
    } else {
        hideImagePreview();
    }
}

function showImagePreview(src) {
    const previewContainer = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    previewImg.src = src;
    previewContainer.style.display = 'block';
    
    // Test if image loads successfully
    previewImg.onload = function() {
        previewContainer.style.display = 'block';
    };
    
    previewImg.onerror = function() {
        hideImagePreview();
        showNotification('Invalid image URL or file', 'error');
    };
}

function hideImagePreview() {
    const previewContainer = document.getElementById('imagePreview');
    previewContainer.style.display = 'none';
}

function removeImagePreview() {
    document.getElementById('productImageFile').value = '';
    document.getElementById('productImage').value = '';
    hideImagePreview();
}

function getSelectedImageSrc() {
    const fileInput = document.getElementById('productImageFile');
    const urlInput = document.getElementById('productImage');
    const previewImg = document.getElementById('previewImg');
    
    // Priority: file input, then URL input, then default
    if (fileInput.files.length > 0) {
        return previewImg.src; // This will be the data URL from file reader
    } else if (urlInput.value.trim()) {
        return urlInput.value.trim();
    } else {
        return 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop';
    }
}

function addNewProduct() {
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const unit = document.getElementById('productUnit').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const imageUrl = getSelectedImageSrc();
    
    if (!name || !price || !category || !unit || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Create new product card
    const productCard = createProductCard(name, price, category, unit, description, imageUrl);
    
    // Add to products grid
    const productContainer = document.getElementById('productContainer');
    productContainer.appendChild(productCard);
    
    // Save to localStorage
    saveNewProduct({ name, price, category, unit, description, imageUrl });
    
    // Clear form and reset image preview
    document.getElementById('addProductForm').reset();
    removeImagePreview();
    
    showNotification('Product added successfully!', 'success');
    
    // Navigate to products section
    const productsSection = document.getElementById('products');
    productsSection.scrollIntoView({ behavior: 'smooth' });
}

function createProductCard(name, price, category, unit, description, imageUrl) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', category);
    
    const categoryDisplayName = getCategoryDisplayName(category);
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${name}" onerror="this.src='https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop'">
            <div class="product-badge">${categoryDisplayName}</div>
        </div>
        <div class="product-content">
            <h3>${name}</h3>
            <p class="product-description">${description}</p>
            <div class="price-section">
                <span class="price">₹${price.toFixed(2)}</span>
                <span class="price-unit">per ${unit}</span>
            </div>
            <div class="product-actions">
                <button onclick="addToCart('${name}', ${price}, '${unit}')" class="add-to-cart-btn">
                    <i class="fas fa-plus"></i> Add to Cart
                </button>
                <a href="https://wa.me/918087126177?text=I want to buy ${encodeURIComponent(name)} - ₹${price.toFixed(2)} per ${unit}" class="whatsapp-btn">
                    <i class="fab fa-whatsapp"></i> Order Now
                </a>
            </div>
        </div>
    `;
    
    return productCard;
}

function getCategoryDisplayName(category) {
    const categoryMap = {
        'steel': 'Steel',
        'plastic': 'Plastic',
        'chairs': 'Chairs',
        'storage': 'Storage',
        'sheets': 'Sheets'
    };
    return categoryMap[category] || 'Product';
}

function saveNewProduct(product) {
    // Add new product and save all products
    saveAllProductsToStorage();
}

// This function is no longer needed as we use loadAllProducts instead
function loadCustomProducts() {
    // Function kept for compatibility but functionality moved to loadAllProducts
}

// Update the checkout function to save bills to history
function generateWhatsAppOrderWithHistory() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    let message = 'Hello MA STEEL!\\n\\nI would like to place an order:\\n\\n';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `• ${item.name} - ${item.quantity} ${item.unit}(s) @ ₹${item.price.toFixed(2)} = ₹${itemTotal.toFixed(2)}\\n`;
    });
    
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    
    message += `\\nSubtotal: ₹${subtotal.toFixed(2)}`;
    message += `\\nTax (18%): ₹${tax.toFixed(2)}`;
    message += `\\nTotal: ₹${total.toFixed(2)}`;
    message += `\\n\\nPlease confirm availability and delivery details.`;
    
    // Save to history before opening WhatsApp
    saveBillToHistory(cart, total);
    
    const whatsappUrl = `https://wa.me/918087126177?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    showNotification('Order sent and saved to history!', 'success');
}

// Initialize new functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBillHistory();
    initializeAddProduct();
    initializeProducts(); // Load products from localStorage
    initializeBulkEdit();
});

// Bulk Edit functionality
let bulkEditData = [];

function initializeBulkEdit() {
    // The button click is handled by onclick attribute in HTML
    // This function ensures the bulk edit functionality is ready
    console.log('Bulk edit functionality initialized');
}

function openBulkEditModal() {
    // Collect all current products
    const productCards = document.querySelectorAll('.product-card');
    bulkEditData = [];
    
    productCards.forEach((card, index) => {
        const img = card.querySelector('.product-image img');
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('.product-description').textContent;
        const price = parseFloat(card.querySelector('.price').textContent.replace('₹', '').replace(',', ''));
        const unit = card.querySelector('.price-unit').textContent.replace('per ', '');
        const category = card.getAttribute('data-category');
        
        bulkEditData.push({
            id: index,
            name: title,
            price: price,
            category: category,
            unit: unit,
            description: description,
            imageUrl: img.src,
            originalCard: card
        });
    });
    
    renderBulkEditInterface();
    document.getElementById('bulkEditModal').style.display = 'block';
}

function renderBulkEditInterface() {
    const container = document.getElementById('bulkEditProductsList');
    
    container.innerHTML = bulkEditData.map((product, index) => `
        <div class="bulk-edit-item" data-index="${index}">
            <div class="bulk-edit-item-header">
                <div class="bulk-edit-item-title">${product.name}</div>
                <div class="bulk-edit-item-actions">
                    <button onclick="deleteProductFromBulk(${index})" class="delete-item-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <form class="bulk-edit-form">
                <div class="form-group">
                    <label>Product Name</label>
                    <input type="text" value="${product.name}" onchange="updateBulkEditData(${index}, 'name', this.value)">
                </div>
                <div class="form-group">
                    <label>Price (₹)</label>
                    <input type="number" value="${product.price}" step="0.01" onchange="updateBulkEditData(${index}, 'price', parseFloat(this.value))">
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select onchange="updateBulkEditData(${index}, 'category', this.value)">
                        <option value="steel" ${product.category === 'steel' ? 'selected' : ''}>Steel Products</option>
                        <option value="plastic" ${product.category === 'plastic' ? 'selected' : ''}>Plastic Products</option>
                        <option value="chairs" ${product.category === 'chairs' ? 'selected' : ''}>Chairs</option>
                        <option value="storage" ${product.category === 'storage' ? 'selected' : ''}>Storage</option>
                        <option value="sheets" ${product.category === 'sheets' ? 'selected' : ''}>Sheets</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Unit</label>
                    <input type="text" value="${product.unit}" onchange="updateBulkEditData(${index}, 'unit', this.value)">
                </div>
                <div class="form-group full-width">
                    <label>Description</label>
                    <textarea rows="2" onchange="updateBulkEditData(${index}, 'description', this.value)">${product.description}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Image URL</label>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <input type="url" value="${product.imageUrl}" onchange="updateBulkEditData(${index}, 'imageUrl', this.value)" style="flex: 1;">
                        <img src="${product.imageUrl}" alt="Preview" class="bulk-edit-image-preview" onerror="this.src='https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop'">
                    </div>
                </div>
            </form>
        </div>
    `).join('');
}

function updateBulkEditData(index, field, value) {
    if (bulkEditData[index]) {
        bulkEditData[index][field] = value;
        
        // Update image preview if it's an image URL change
        if (field === 'imageUrl') {
            const preview = document.querySelector(`[data-index="${index}"] .bulk-edit-image-preview`);
            if (preview) {
                preview.src = value;
            }
        }
    }
}

function deleteProductFromBulk(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        // Remove from bulk edit data
        const deletedProduct = bulkEditData.splice(index, 1)[0];
        
        // Remove the original card from DOM
        if (deletedProduct.originalCard) {
            deletedProduct.originalCard.remove();
        }
        
        // Re-render the bulk edit interface
        renderBulkEditInterface();
        
        showNotification('Product deleted successfully!', 'success');
    }
}

function saveAllProducts() {
    // Update all product cards with the new data
    bulkEditData.forEach((product, index) => {
        if (product.originalCard) {
            updateProductCardFromBulkData(product.originalCard, product);
        }
    });
    
    // Save to localStorage
    saveAllProductsToStorage();
    
    showNotification('All products updated successfully!', 'success');
    closeBulkEditModal();
}

function updateProductCardFromBulkData(card, productData) {
    // Update image
    const img = card.querySelector('.product-image img');
    img.src = productData.imageUrl;
    img.alt = productData.name;
    
    // Update badge
    const badge = card.querySelector('.product-badge');
    badge.textContent = getCategoryDisplayName(productData.category);
    
    // Update content
    const title = card.querySelector('h3');
    title.textContent = productData.name;
    
    const desc = card.querySelector('.product-description');
    desc.textContent = productData.description;
    
    const priceElement = card.querySelector('.price');
    priceElement.textContent = `₹${productData.price.toFixed(2)}`;
    
    const unitElement = card.querySelector('.price-unit');
    unitElement.textContent = `per ${productData.unit}`;
    
    // Update cart button
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.setAttribute('onclick', `addToCart('${productData.name}', ${productData.price}, '${productData.unit}')`);
    
    // Update WhatsApp button
    const whatsappBtn = card.querySelector('.whatsapp-btn');
    whatsappBtn.href = `https://wa.me/918087126177?text=I want to buy ${encodeURIComponent(productData.name)} - ₹${productData.price.toFixed(2)} per ${productData.unit}`;
    
    // Update product data category attribute
    card.setAttribute('data-category', productData.category);
}

function resetAllProducts() {
    if (confirm('Are you sure you want to reset all changes? This will reload the original product data.')) {
        // Close modal and reopen to reload original data
        closeBulkEditModal();
        setTimeout(() => {
            openBulkEditModal();
        }, 100);
        
        showNotification('All changes have been reset', 'info');
    }
}

function closeBulkEditModal() {
    document.getElementById('bulkEditModal').style.display = 'none';
    bulkEditData = [];
}

function initializeEditImageUpload() {
    const imageFileInput = document.getElementById('editProductImageFile');
    const imageUrlInput = document.getElementById('editProductImage');
    
    if (imageFileInput) {
        imageFileInput.addEventListener('change', handleEditImageFileSelect);
    }
    
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', handleEditImageUrlChange);
    }
}

function handleEditImageFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            showEditImagePreview(e.target.result);
            // Clear URL input when file is selected
            document.getElementById('editProductImage').value = '';
        };
        reader.readAsDataURL(file);
    }
}

function handleEditImageUrlChange(event) {
    const url = event.target.value.trim();
    if (url) {
        // Clear file input when URL is entered
        document.getElementById('editProductImageFile').value = '';
        showEditImagePreview(url);
    } else {
        hideEditImagePreview();
    }
}

function showEditImagePreview(src) {
    const previewContainer = document.getElementById('editImagePreview');
    const previewImg = document.getElementById('editPreviewImg');
    
    previewImg.src = src;
    previewContainer.style.display = 'block';
    
    // Test if image loads successfully
    previewImg.onload = function() {
        previewContainer.style.display = 'block';
    };
    
    previewImg.onerror = function() {
        hideEditImagePreview();
        showNotification('Invalid image URL or file', 'error');
    };
}

function hideEditImagePreview() {
    const previewContainer = document.getElementById('editImagePreview');
    previewContainer.style.display = 'none';
}

function removeEditImagePreview() {
    document.getElementById('editProductImageFile').value = '';
    document.getElementById('editProductImage').value = '';
    hideEditImagePreview();
}

function getEditSelectedImageSrc() {
    const fileInput = document.getElementById('editProductImageFile');
    const urlInput = document.getElementById('editProductImage');
    const previewImg = document.getElementById('editPreviewImg');
    
    // Priority: file input, then URL input, then current image
    if (fileInput.files.length > 0) {
        return previewImg.src; // This will be the data URL from file reader
    } else if (urlInput.value.trim()) {
        return urlInput.value.trim();
    } else if (currentEditingProduct) {
        return currentEditingProduct.dataset.image;
    } else {
        return 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop';
    }
}

function editProduct(button) {
    currentEditingProduct = button;
    
    // Get product data from button attributes
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const category = button.dataset.category;
    const unit = button.dataset.unit;
    const description = button.dataset.description;
    const image = button.dataset.image;
    
    // Fill the edit form with current product data
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductPrice').value = price;
    document.getElementById('editProductCategory').value = category;
    document.getElementById('editProductUnit').value = unit;
    document.getElementById('editProductDescription').value = description;
    document.getElementById('editProductImage').value = image;
    
    // Show current image
    if (image) {
        showEditImagePreview(image);
    } else {
        hideEditImagePreview();
    }
    
    // Show the edit modal
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingProduct = null;
    
    // Clear form
    document.getElementById('editProductForm').reset();
    removeEditImagePreview();
}

function saveProductChanges() {
    if (!currentEditingProduct) return;
    
    const originalName = currentEditingProduct.dataset.name;
    const name = document.getElementById('editProductName').value.trim();
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const category = document.getElementById('editProductCategory').value;
    const unit = document.getElementById('editProductUnit').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();
    const imageUrl = getEditSelectedImageSrc();
    
    if (!name || !price || !category || !unit || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Update the product card
    const productCard = currentEditingProduct.closest('.product-card');
    updateProductCard(productCard, name, price, category, unit, description, imageUrl);
    
    // Update button data attributes
    currentEditingProduct.dataset.name = name;
    currentEditingProduct.dataset.price = price;
    currentEditingProduct.dataset.category = category;
    currentEditingProduct.dataset.unit = unit;
    currentEditingProduct.dataset.description = description;
    currentEditingProduct.dataset.image = imageUrl;
    
    // Update cart button
    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
    addToCartBtn.setAttribute('onclick', `addToCart('${name}', ${price}, '${unit}')`);
    
    // Update WhatsApp button
    const whatsappBtn = productCard.querySelector('.whatsapp-btn');
    whatsappBtn.href = `https://wa.me/918087126177?text=I want to buy ${encodeURIComponent(name)} - ₹${price.toFixed(2)} per ${unit}`;
    
    // Update product data category attribute
    productCard.setAttribute('data-category', category);
    
    // Save all products to localStorage (including edited default products)
    saveAllProductsToStorage();
    
    showNotification('Product updated successfully!', 'success');
    closeEditModal();
}

function updateProductCard(productCard, name, price, category, unit, description, imageUrl) {
    // Update image
    const img = productCard.querySelector('.product-image img');
    img.src = imageUrl;
    img.alt = name;
    
    // Update badge
    const badge = productCard.querySelector('.product-badge');
    badge.textContent = getCategoryDisplayName(category);
    
    // Update content
    const title = productCard.querySelector('h3');
    title.textContent = name;
    
    const desc = productCard.querySelector('.product-description');
    desc.textContent = description;
    
    const priceElement = productCard.querySelector('.price');
    priceElement.textContent = `₹${price.toFixed(2)}`;
    
    const unitElement = productCard.querySelector('.price-unit');
    unitElement.textContent = `per ${unit}`;
}

function deleteProduct() {
    if (!currentEditingProduct) return;
    
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        const productCard = currentEditingProduct.closest('.product-card');
        const productName = currentEditingProduct.dataset.name;
        
        // Remove from DOM
        productCard.remove();
        
        // Update localStorage
        removeCustomProduct(productName);
        
        showNotification('Product deleted successfully!', 'success');
        closeEditModal();
    }
}

function updateCustomProduct(name, price, category, unit, description, imageUrl) {
    let savedProducts = localStorage.getItem('masteelCustomProducts');
    if (savedProducts) {
        let products = JSON.parse(savedProducts);
        const productIndex = products.findIndex(p => p.name === name);
        
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                name, price, category, unit, description, imageUrl
            };
            localStorage.setItem('masteelCustomProducts', JSON.stringify(products));
        }
    }
}

function removeCustomProduct(productName) {
    let savedProducts = localStorage.getItem('masteelAllProducts');
    if (savedProducts) {
        let products = JSON.parse(savedProducts);
        products = products.filter(p => p.name !== productName);
        localStorage.setItem('masteelAllProducts', JSON.stringify(products));
    }
}

// Save all products (including default ones) to localStorage
function saveAllProductsToStorage() {
    const allProductCards = document.querySelectorAll('.product-card');
    const allProducts = [];
    
    allProductCards.forEach(card => {
        const editBtn = card.querySelector('.edit-product-btn');
        if (editBtn) {
            allProducts.push({
                name: editBtn.dataset.name,
                price: parseFloat(editBtn.dataset.price),
                category: editBtn.dataset.category,
                unit: editBtn.dataset.unit,
                description: editBtn.dataset.description,
                imageUrl: editBtn.dataset.image,
                id: Date.now() + Math.random(),
                dateAdded: new Date().toISOString()
            });
        }
    });
    
    localStorage.setItem('masteelAllProducts', JSON.stringify(allProducts));
}

// Load all products from localStorage and replace HTML products
function loadAllProducts() {
    const savedProducts = localStorage.getItem('masteelAllProducts');
    if (savedProducts) {
        const products = JSON.parse(savedProducts);
        const productContainer = document.getElementById('productContainer');
        
        // Clear existing products
        productContainer.innerHTML = '';
        
        // Add all saved products
        products.forEach(product => {
            const productCard = createProductCard(
                product.name,
                product.price,
                product.category,
                product.unit,
                product.description,
                product.imageUrl
            );
            productContainer.appendChild(productCard);
        });
    } else {
        // First time loading - save current HTML products to localStorage
        saveAllProductsToStorage();
    }
}

// Initialize products with localStorage data
function initializeProducts() {
    loadAllProducts();
}

// Export new functions
window.clearHistory = clearHistory;
window.exportHistory = exportHistory;
window.viewBillDetails = viewBillDetails;
window.reorderFromHistory = reorderFromHistory;
window.addNewProduct = addNewProduct;
window.removeImagePreview = removeImagePreview;
window.openBulkEditModal = openBulkEditModal;
window.closeBulkEditModal = closeBulkEditModal;
window.saveAllProducts = saveAllProducts;
window.resetAllProducts = resetAllProducts;
window.deleteProductFromBulk = deleteProductFromBulk;
window.updateBulkEditData = updateBulkEditData;

// Update the existing generateWhatsAppOrder function
window.generateWhatsAppOrder = generateWhatsAppOrderWithHistory;

// Image Lightbox functionality
function initializeImageLightbox() {
    // Add click event listeners to all product images
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(imageContainer => {
        imageContainer.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const img = this.querySelector('img');
            const productCard = this.closest('.product-card');
            
            if (img && productCard) {
                openLightbox(img, productCard);
            }
        });
        
        // Add visual feedback on hover
        imageContainer.style.cursor = 'pointer';
    });
    
    // Close lightbox when clicking outside the image
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

function openLightbox(img, productCard) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxPrice = document.getElementById('lightboxPrice');
    
    // Get product information
    const title = productCard.querySelector('h3').textContent;
    const description = productCard.querySelector('.product-description').textContent;
    const price = productCard.querySelector('.price').textContent;
    const unit = productCard.querySelector('.price-unit').textContent;
    
    // Set lightbox content
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightboxPrice.textContent = `${price} ${unit}`;
    
    // Show lightbox
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Add loading state
    lightboxImage.style.opacity = '0';
    lightboxImage.onload = function() {
        this.style.opacity = '1';
    };
    
    // Track lightbox usage (for analytics)
    console.log(`Lightbox opened for product: ${title}`);
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear image source to prevent memory issues
        setTimeout(() => {
            lightboxImage.src = '';
        }, 300);
    }
}

// Update the createProductCard function to include lightbox functionality
function createProductCardWithLightbox(name, price, category, unit, description, imageUrl) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', category);
    
    const categoryDisplayName = getCategoryDisplayName(category);
    
    productCard.innerHTML = `
        <div class="product-image" onclick="openProductLightbox(this)">
            <img src="${imageUrl}" alt="${name}" onerror="this.src='https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop'">
            <div class="product-badge">${categoryDisplayName}</div>
        </div>
        <div class="product-content">
            <h3>${name}</h3>
            <p class="product-description">${description}</p>
            <div class="price-section">
                <span class="price">₹${price.toFixed(2)}</span>
                <span class="price-unit">per ${unit}</span>
            </div>
            <div class="product-actions">
                <button onclick="addToCart('${name}', ${price}, '${unit}')" class="add-to-cart-btn">
                    <i class="fas fa-plus"></i> Add to Cart
                </button>
                <a href="https://wa.me/918087126177?text=I want to buy ${encodeURIComponent(name)} - ₹${price.toFixed(2)} per ${unit}" class="whatsapp-btn">
                    <i class="fab fa-whatsapp"></i> Order Now
                </a>
            </div>
        </div>
    `;
    
    return productCard;
}

function openProductLightbox(imageContainer) {
    const img = imageContainer.querySelector('img');
    const productCard = imageContainer.closest('.product-card');
    
    if (img && productCard) {
        openLightbox(img, productCard);
    }
}

// Update the original createProductCard function to use the new one
function createProductCard(name, price, category, unit, description, imageUrl) {
    return createProductCardWithLightbox(name, price, category, unit, description, imageUrl);
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all product cards are loaded
    setTimeout(() => {
        initializeImageLightbox();
    }, 100);
});

// Re-initialize lightbox when new products are added
function reinitializeLightbox() {
    initializeImageLightbox();
}

// Number to words conversion function
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    function convertHundreds(n) {
        let result = '';
        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        if (n >= 20) {
            result += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        } else if (n >= 10) {
            result += teens[n - 10] + ' ';
            return result;
        }
        if (n > 0) {
            result += ones[n] + ' ';
        }
        return result;
    }
    
    if (num === 0) return 'Zero';
    
    let result = '';
    const crores = Math.floor(num / 10000000);
    if (crores > 0) {
        result += convertHundreds(crores) + 'Crore ';
        num %= 10000000;
    }
    
    const lakhs = Math.floor(num / 100000);
    if (lakhs > 0) {
        result += convertHundreds(lakhs) + 'Lakh ';
        num %= 100000;
    }
    
    const thousands = Math.floor(num / 1000);
    if (thousands > 0) {
        result += convertHundreds(thousands) + 'Thousand ';
        num %= 1000;
    }
    
    if (num > 0) {
        result += convertHundreds(num);
    }
    
    return result.trim();
}

// Export lightbox functions
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.openProductLightbox = openProductLightbox;
window.reinitializeLightbox = reinitializeLightbox;