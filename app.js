// Aviral Dimri's Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initTypewriter();
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initSkillsAnimation();
    initProjectFiltering();
    initContactForm();
    initIntersectionObserver();
});

// Theme toggle functionality - FIXED
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (!themeToggle || !themeIcon) return;
    
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || 'dark';
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        console.log('Theme switched to:', newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
}

// Typewriter effect for hero section
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;
    
    const phrases = [
        'Machine Learning Engineer & Computer Science Student',
        'Deep Learning Specialist & AI Researcher',
        'System Programming & Compiler Design Expert',
        'Neural Network Architecture Designer',
        'Full Stack Developer & Tech Innovator'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing next phrase
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start the typewriter effect
    setTimeout(type, 1000);
}

// Navigation functionality - FIXED
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Update active navigation link
        updateActiveNavLink();
    });
    
    // Smooth scrolling for navigation links - FIXED
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            console.log('Navigation clicked:', targetId);
            
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navbarHeight = 70;
                    const targetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    // Smooth scroll
                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });
                    
                    console.log('Scrolling to section:', targetId);
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('nav-menu');
                    const hamburger = document.getElementById('hamburger');
                    navMenu?.classList.remove('active');
                    hamburger?.classList.remove('active');
                } else {
                    console.error('Target section not found:', targetId);
                }
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100; // Offset for navbar
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // If we're at the top of the page, highlight home
    if (window.scrollY < 100) {
        currentSection = 'home';
    }
    
    // Update active class on navigation links
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            console.log('Mobile menu toggled');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = navMenu.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Project filtering functionality
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            console.log('Filter clicked:', filter);
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter project cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('filtered-out');
                    card.style.display = 'block';
                } else {
                    card.classList.add('filtered-out');
                    setTimeout(() => {
                        if (card.classList.contains('filtered-out')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
            
            // Show all cards first, then apply filter
            setTimeout(() => {
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => card.classList.remove('filtered-out'), 50);
                    }
                });
            }, 50);
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.skill-category, .project-card, .about-highlights, .contact-content, .highlight-item'
    );
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });
}

// Skills progress bar animation
function initSkillsAnimation() {
    const progressBars = document.querySelectorAll('.progress-fill');
    let skillsAnimated = false;
    
    const skillsSection = document.getElementById('skills');
    
    const animateSkills = () => {
        if (!skillsAnimated) {
            progressBars.forEach((bar, index) => {
                const progress = bar.getAttribute('data-progress');
                
                // Add loading animation first
                bar.classList.add('loading');
                
                setTimeout(() => {
                    bar.classList.remove('loading');
                    bar.style.width = progress + '%';
                }, 500 + (index * 100)); // Stagger the animations
            });
            skillsAnimated = true;
        }
    };
    
    // Check if skills section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, {
        threshold: 0.3
    });
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Contact form handling - FIXED
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            console.log('Form data:', formObject);
            
            // Validate form
            if (validateForm(formObject)) {
                console.log('Form is valid');
                // Simulate form submission
                handleFormSubmission(formObject);
            } else {
                console.log('Form validation failed');
            }
        });
    } else {
        console.error('Contact form not found');
    }
}

// Form validation - FIXED
function validateForm(data) {
    const { name, email, subject, message } = data;
    
    // Clear previous error messages
    clearErrorMessages();
    
    let isValid = true;
    
    // Validate name
    if (!name || !name.trim()) {
        showError('name', 'Name is required');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }
    
    // Validate subject
    if (!subject || !subject.trim()) {
        showError('subject', 'Subject is required');
        isValid = false;
    }
    
    // Validate message
    if (!message || !message.trim()) {
        showError('message', 'Message is required');
        isValid = false;
    } else if (message.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    console.log('Validation result:', isValid);
    return isValid;
}

// Show error message - FIXED
function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) {
        console.error('Field not found:', fieldName);
        return;
    }
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) {
        console.error('Form group not found for field:', fieldName);
        return;
    }
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.cssText = `
        color: #ff5459;
        font-size: var(--font-size-sm);
        margin-top: var(--space-4);
        font-weight: var(--font-weight-medium);
    `;
    errorElement.textContent = message;
    
    formGroup.appendChild(errorElement);
    
    // Add error styling to field
    field.style.borderColor = '#ff5459';
    field.style.boxShadow = '0 0 0 3px rgba(255, 84, 89, 0.2)';
    
    console.log('Error shown for field:', fieldName, message);
}

// Clear error messages - FIXED
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    const formControls = document.querySelectorAll('.form-control');
    
    errorMessages.forEach(error => error.remove());
    formControls.forEach(control => {
        control.style.borderColor = '';
        control.style.boxShadow = '';
    });
    
    console.log('Error messages cleared');
}

// Handle form submission
function handleFormSubmission(data) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    if (!submitButton) return;
    
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        
        // Log form data (in real app, this would be sent to server)
        console.log('Form submitted successfully:', data);
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    // Remove any existing success messages
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    const bgColor = currentTheme === 'dark' ? '#32c5d2' : '#319795';
    const textColor = currentTheme === 'dark' ? '#1a365d' : '#ffffff';
    
    successMessage.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: var(--space-16) var(--space-24);
        border-radius: var(--radius-base);
        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 300px;
        font-weight: var(--font-weight-medium);
    `;
    successMessage.textContent = 'Message sent successfully! Thank you for reaching out.';
    
    document.body.appendChild(successMessage);
    
    // Trigger slide-in animation
    setTimeout(() => {
        successMessage.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 300);
    }, 5000);
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
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

// Add scroll event listener with debouncing for performance
const debouncedScroll = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu && window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}, 250));

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Theme toggle with 'T' key
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }
    }
});

// Smooth scroll polyfill for better browser support
function smoothScrollTo(target, duration = 800) {
    const startPosition = window.pageYOffset;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 70;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Performance optimization: Lazy load project images if needed
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Add loading state management
window.addEventListener('load', function() {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Trigger any post-load animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 200);
        });
    }, 300);
});

// Console message for recruiters/developers
console.log(`
🚀 Welcome to Aviral Dimri's Portfolio!
=======================================

Interested in the code? Check out the GitHub repository!
Built with modern web technologies and best practices.

📧 Contact: aviral09dimri2004@gmail.com
💻 GitHub: https://github.com/Anig164
🔗 LinkedIn: https://linkedin.com/in/aviral-dimri

Available for Machine Learning, Deep Learning, and Software Development opportunities!
`);