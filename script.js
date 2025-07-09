// Balsim Website JavaScript
// Advanced functionality with modern ES6+ features

class BalsimWebsite {
    constructor() {
        this.init();
        this.bindEvents();
        this.initAnimations();
        this.initPortfolioFilter();
        this.initStatCounters();
        this.initContactForm();
        this.initScrollEffects();
    }

    init() {
        // Initialize core functionality
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.backToTopBtn = document.getElementById('backToTop');
        this.contactForm = document.getElementById('contactForm');
        
        // Set initial states
        this.isMenuOpen = false;
        this.scrollPosition = 0;
        this.isScrolling = false;
        
        console.log('Balsim Website initialized successfully!');
    }

    bindEvents() {
        // Navigation Events
        this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());

        // Back to top button
        this.backToTopBtn?.addEventListener('click', () => this.scrollToTop());

        // Portfolio filter events
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterPortfolio(e));
        });

        // Removed custom JS handler for contact form to allow Formspree to work

        // Add loading completion event
        window.addEventListener('load', () => this.onPageLoad());

        // Footer legal links
        document.querySelectorAll('.footer-section ul li a').forEach(link => {
            if (link.textContent.includes('Privacy Policy') || link.textContent.includes('Terms of Service')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('This page is coming soon!');
                });
            }
        });
        // Blog card click (optional)
        document.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.blog-title')?.textContent || 'Blog';
                alert('Read more: ' + title);
            });
        });
    }

    // Mobile Menu Toggle
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navMenu?.classList.toggle('active');
        this.navToggle?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    // Smooth Scrolling
    handleSmoothScroll(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        
        if (target.startsWith('#')) {
            const element = document.querySelector(target);
            if (element) {
                const offsetTop = element.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.toggleMobileMenu();
                }
            }
        }
    }

    // Scroll Event Handler
    handleScroll() {
        if (!this.isScrolling) {
            window.requestAnimationFrame(() => {
                this.updateNavbar();
                this.updateBackToTopButton();
                this.updateScrollAnimations();
                this.isScrolling = false;
            });
        }
        this.isScrolling = true;
    }

    // Update Navbar on Scroll
    updateNavbar() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }

        // Update active navigation link
        this.updateActiveNavLink();
    }

    // Update Active Navigation Link
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Back to Top Button
    updateBackToTopButton() {
        if (window.pageYOffset > 300) {
            this.backToTopBtn?.classList.add('show');
        } else {
            this.backToTopBtn?.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Portfolio Filter
    filterPortfolio(e) {
        const filterValue = e.target.getAttribute('data-filter');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Update active filter button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Filter portfolio items with animation
        portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (filterValue === 'all' || itemCategory === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Animated Counters
    initStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.7,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Contact Form Handler
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="loading"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showNotification('Message sent successfully!', 'success');
            this.contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add styles for notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : '#6366f1',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-out'
        });

        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Scroll Animations
    initScrollAnimations() {
        const animateElements = document.querySelectorAll('.fade-in, .testimonial');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        animateElements.forEach(el => observer.observe(el));
        
        // Make service cards always visible
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.classList.add('animate');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        // Handle portfolio items separately since they should be visible by default
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const portfolioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        portfolioItems.forEach(el => portfolioObserver.observe(el));
    }

    updateScrollAnimations() {
        // Additional scroll-based animations can be added here
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero background shapes
        const shapes = document.querySelectorAll('.bg-shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    }

    // Initialize Animations
    initAnimations() {
        // Add CSS classes for animations
        const style = document.createElement('style');
        style.textContent = `
            .navbar.scrolled {
                background: rgba(255, 255, 255, 0.98);
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }
            
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .service-card, .testimonial {
                opacity: 1;
                transform: translateY(0);
                transition: all 0.6s ease-out;
            }
            
            .service-card.animate, .testimonial.animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            .portfolio-item {
                transition: all 0.6s ease-out;
            }
            
            .portfolio-item.animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            .nav-link.active {
                color: var(--primary-color);
            }
            
            .nav-link.active::after {
                width: 100%;
            }
        `;
        document.head.appendChild(style);
    }

    // Portfolio Filter Initialization
    initPortfolioFilter() {
        // Set initial state
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.style.transition = 'all 0.3s ease-out';
            // Show all items by default
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
        
        // Set the 'all' filter button as active by default
        const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allFilterBtn) {
            allFilterBtn.classList.add('active');
        }
    }

    // Scroll Effects
    initScrollEffects() {
        // Initialize intersection observer for scroll effects
        this.initScrollAnimations();
        
        // Add smooth reveal animations
        const revealElements = document.querySelectorAll('.section-header, .about-text, .contact-info');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease-out';
            revealObserver.observe(el);
        });
    }

    // Handle Window Resize
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    // Page Load Handler
    onPageLoad() {
        // Add loaded class to body for any load-specific animations
        document.body.classList.add('loaded');
        
        // Initialize any load-dependent features
        this.initParallaxEffects();
        
        console.log('Page fully loaded - all features active!');
    }

    // Parallax Effects
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-visual, .floating-cards');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.3;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Utility Methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BalsimWebsite();
});

// Additional utility functions
const utils = {
    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Format phone number
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    },

    // Generate unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Smooth animation helper
    animate: (element, keyframes, options = {}) => {
        return element.animate(keyframes, {
            duration: 300,
            easing: 'ease-out',
            fill: 'forwards',
            ...options
        });
    }
};

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BalsimWebsite, utils };
}
