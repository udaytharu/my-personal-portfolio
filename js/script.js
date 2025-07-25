// Typing animation configuration
const config = {
    phrases: ["Web Developer", "Frontend Developer", "Web Designer", "Graphic Designer", "Script Writer",],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseBeforeDeleting: 2000,
    pauseBeforeTypingNextPhrase: 500
};

class TypingAnimation {
    constructor(elementId, config) {
        this.element = document.getElementById(elementId);
        if (!this.element) throw new Error(`Element with ID ${elementId} not found`);
        this.phrases = config.phrases;
        this.currentPhraseIndex = 0;
        this.currentCharIndex = 0;
        this.config = config;
        this.isDeleting = false;
        this.lastPause = Date.now();
        this.isPaused = false;
    }

    update() {
        if (this.isPaused) return;

        const now = Date.now();
        if (this.isDeleting) {
            if (this.currentCharIndex > 0) {
                this.element.textContent = this.phrases[this.currentPhraseIndex].substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
            } else {
                this.isDeleting = false;
                this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            }
        } else {
            if (this.currentCharIndex < this.phrases[this.currentPhraseIndex].length) {
                this.element.textContent += this.phrases[this.currentPhraseIndex].charAt(this.currentCharIndex);
                this.currentCharIndex++;
            } else if (now - this.lastPause > this.config.pauseBeforeDeleting) {
                this.isDeleting = true;
                this.lastPause = now;
            }
        }
        this.animationFrame = requestAnimationFrame(() => this.update());
    }

    start() {
        this.isPaused = false;
        this.animationFrame = requestAnimationFrame(() => this.update());
    }

    stop() {
        this.isPaused = true;
        cancelAnimationFrame(this.animationFrame);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }
}

// Mobile menu hamburger button functionality
class MobileMenu {
    constructor() {
        this.menuButton = document.getElementById('menuButton');
        this.dropdownMenu = document.getElementById('dropdownMenu');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.menuButton.addEventListener('click', () => this.toggleMenu());
        document.addEventListener('keydown', (e) => this.handleEscape(e));
        document.addEventListener('click', (e) => this.handleClickOutside(e));
        
        // Add smooth scroll for mobile menu links
        this.dropdownMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    toggleMenu() {
        const isExpanded = this.menuButton.getAttribute('aria-expanded') === 'true';
        this.menuButton.setAttribute('aria-expanded', !isExpanded);
        this.dropdownMenu.classList.toggle('hidden');
        
        // Add animation classes
        if (!isExpanded) {
            this.dropdownMenu.classList.add('menu-open');
            setTimeout(() => this.dropdownMenu.classList.remove('menu-open'), 300);
        }
    }

    handleClickOutside(event) {
        if (!this.menuButton.contains(event.target) && !this.dropdownMenu.contains(event.target)) {
            this.closeMenu();
        }
    }

    handleEscape(event) {
        if (event.key === 'Escape' && this.menuButton.getAttribute('aria-expanded') === 'true') {
            this.closeMenu();
        }
    }

    closeMenu() {
        this.menuButton.setAttribute('aria-expanded', 'false');
        this.dropdownMenu.classList.add('menu-close');
        setTimeout(() => {
            this.dropdownMenu.classList.add('hidden');
            this.dropdownMenu.classList.remove('menu-close');
        }, 300);
    }
}

// CV download functionality
function downloadCV() {
    const cvUrl = 'docs/uday_cv.pdf'; // Replace with actual CV URL
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Uday_Tharu_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Confetti Effect
function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150, // Increased for more confetti
            spread: 80, // Slightly wider spread for a fuller effect
            origin: { y: 0.6 },
            colors: [
                '#ff0000', // Red
                '#00ff00', // Green
                '#0000ff', // Blue
                '#ff00ff', // Magenta
                '#00ffff', // Cyan
                '#ffff00', // Yellow
                '#ff8000', // Orange
                '#8000ff', // Purple
                '#ff0080', // Pink
                '#00ff80'  // Mint
            ]
        });
    }
}

// EmailJS integration for contact form with improved error handling
let isFormSubmitting = false;

function handleContactForm(event) {
    event.preventDefault();
    if (isFormSubmitting) return;

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const buttonText = submitBtn.querySelector('.button-text');
    const buttonSpinner = submitBtn.querySelector('.button-spinner');
    const formMessage = document.getElementById('form-message');
    const formData = new FormData(form);
    const userName = formData.get('user_name');
    const userEmail = formData.get('user_email');
    const message = formData.get('message');

    // Show loading state
    submitBtn.disabled = true;
    buttonText.classList.add('hidden');
    buttonSpinner.classList.remove('hidden');

    emailjs.send('service_rusvorz', form.getAttribute('data-email'), {
        from_name: userName,
        from_email: userEmail,
        message: message,
        to_name: 'Uday Tharu',
        to_email: 'udaytharu813@gmail.com'
    })
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        formMessage.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">✓</div>
                <div class="alert-text">
                    <h3>Message Sent Successfully! 🎉</h3>
                    <p>Thank you ${userName}, I'll get back to you soon!</p>
                </div>
            </div>
        `;
        formMessage.className = 'show success';
        form.reset();
        triggerConfetti(); // Add confetti effect

        // Hide success message after 5 seconds
        setTimeout(() => {
            formMessage.classList.remove('show', 'success');
            setTimeout(() => {
                formMessage.innerHTML = '';
            }, 300);
        }, 5000);
    })
    .catch((error) => {
        console.error('FAILED...', error);
        formMessage.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">✕</div>
                <div class="alert-text">
                    <h3>Message Failed to Send</h3>
                    <p>Please try again or contact me directly at udaytharu813@gmail.com</p>
                </div>
            </div>
        `;
        formMessage.className = 'show error';
    })
    .finally(() => {
        submitBtn.disabled = false;
        buttonText.classList.remove('hidden');
        buttonSpinner.classList.add('hidden');
    });
}

// Add real-time validation on input
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact-form');
    if (form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const errorSpan = document.getElementById(`${input.id}-error`);
                errorSpan.classList.add('hidden');

                if (input.id === 'email') {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value) && input.value !== '') {
                        errorSpan.textContent = 'Please enter a valid email';
                        errorSpan.classList.remove('hidden');
                    }
                } else if (!input.value.trim() && input.hasAttribute('required')) {
                    errorSpan.textContent = `${input.name.replace('user_', '').charAt(0).toUpperCase() + input.name.slice(6)} is required`;
                    errorSpan.classList.remove('hidden');
                }
            });
        });
    }
});

// Debounce function
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

// Particles animation
function createParticles(count) {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.getElementById('home').appendChild(particlesContainer);

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const x = Math.random() * 100;
        const delay = Math.random() * 15;
        particle.style.left = `${x}vw`;
        particle.style.animationDelay = `${delay}s`;
        particlesContainer.appendChild(particle);
    }
}

// Background shapes animation
function createBackgroundShapes(count) {
    const shapesContainer = document.querySelector('.background-shapes');
    const shapes = ['circle', 'triangle'];

    for (let i = 0; i < count; i++) {
        const shape = document.createElement('div');
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        shape.className = `shape ${shapeType}`;
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        shape.style.left = `${startX}vw`;
        shape.style.top = `${startY}vh`;
        
        const delay = Math.random() * 10;
        const duration = 15 + Math.random() * 10;
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationDuration = `${duration}s`;
        
        shapesContainer.appendChild(shape);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    if (!window.contactFormInitialized) {
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactForm);
            window.contactFormInitialized = true;
        }

        try {
            const typingAnimation = new TypingAnimation('typing-text', config);
            typingAnimation.start();
        } catch (error) {
            console.error('Typing animation error:', error.message);
        }

        const mobileMenu = new MobileMenu();

        const goToTopButton = document.querySelector('.go-to-top');
        const handleScroll = debounce(() => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 300) {
                goToTopButton.classList.add('show');
            } else {
                goToTopButton.classList.remove('show');
            }
        }, 100);
        window.addEventListener('scroll', handleScroll);

        // Smooth scroll to top function
        function scrollToTop() {
            const scrollDuration = 500; // Duration in milliseconds (lower = faster)
            const scrollStep = -window.scrollY / (scrollDuration / 15);
            
            function scroll() {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep);
                    requestAnimationFrame(scroll);
                }
            }
            
            requestAnimationFrame(scroll);
        }

        // Update the click event listener for the Go to Top button
        if (goToTopButton) {
            goToTopButton.addEventListener('click', () => {
                // Add launching class for animation
                goToTopButton.classList.add('launching');
                
                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Remove the launching class and reset button after animation
                setTimeout(() => {
                    goToTopButton.classList.remove('launching');
                }, 1000);
            });
        }

        createParticles(20);
        createBackgroundShapes(10);

        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.querySelector('.skill-spotlight')?.style.setProperty('--x', `${x}px`);
                card.querySelector('.skill-spotlight')?.style.setProperty('--y', `${y}px`);
            });
        });

        // Initialize scroll progress indicator
        initScrollProgress();

        // Initialize intersection observer for section animations
        initIntersectionObserver();

        // Initialize background shapes
        initBackgroundShapes();

        // Initialize form validation
        initFormValidation();

        // Initialize project cards
        initProjectCards();
    }
});

// Scroll Progress Indicator
function initScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });
}

// Intersection Observer for section animations
function initIntersectionObserver() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add a subtle parallax effect
                entry.target.style.transform = `translateY(${entry.intersectionRatio * 20}px)`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    sections.forEach(section => observer.observe(section));
}

// Enhanced Background Shapes
function initBackgroundShapes() {
    const container = document.querySelector('.background-shapes');
    const shapes = ['circle', 'triangle'];
    const numShapes = 5;

    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.className = `shape ${shapes[Math.floor(Math.random() * shapes.length)]}`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(shape);
    }
}

// Enhanced Form Validation and Submission
function initFormValidation() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonSpinner = submitButton.querySelector('.button-spinner');

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateField(input);
        });

        input.addEventListener('focus', () => {
            input.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.classList.remove('focused');
            validateField(input);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading state
        submitButton.disabled = true;
        buttonText.classList.add('hidden');
        buttonSpinner.classList.remove('hidden');

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Send email using EmailJS
            await emailjs.send(
                'service_rusvorz',
                'template_90obdbh',
                {
                    from_name: data.user_name,
                    from_email: data.user_email,
                    message: data.message
                }
            );

            // Show success message with name
            formMessage.innerHTML = `
                <div class="alert-content">
                    <div class="alert-icon">✓</div>
                    <div class="alert-text">
                        <h3>Message Sent Successfully! 🎉</h3>
                        <p>Thank you ${data.user_name}, I'll get back to you soon!</p>
                    </div>
                </div>
            `;
            formMessage.className = 'show success';
            form.reset();
            triggerConfetti(); // Add confetti effect
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('show');
                setTimeout(() => {
                    formMessage.innerHTML = '';
                }, 300);
            }, 5000);

        } catch (error) {
            console.error('Error sending email:', error);
            formMessage.innerHTML = `
                <div class="alert-content">
                    <div class="alert-icon">✕</div>
                    <div class="alert-text">
                        <h3>Message Failed to Send</h3>
                        <p>Please try again or contact me directly at udaytharu813@gmail.com</p>
                    </div>
                </div>
            `;
            formMessage.className = 'show error';
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonSpinner.classList.add('hidden');
        }
    });
}

function validateField(input) {
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (!errorSpan) return true;

    let isValid = true;
    let errorMessage = '';

    if (input.type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailPattern.test(input.value);
        errorMessage = 'Please enter a valid email address';
    } else if (input.hasAttribute('required')) {
        isValid = input.value.trim().length > 0;
        if (input.name === 'message') {
            errorMessage = 'Message is required';
        } else {
            // For other fields (name, email)
            const fieldName = input.name.replace('user_', '');
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
    }

    if (!isValid) {
        errorSpan.textContent = errorMessage;
        errorSpan.classList.remove('hidden');
        input.classList.add('error');
    } else {
        errorSpan.classList.add('hidden');
        input.classList.remove('error');
    }

    return isValid;
}

// Initialize project cards
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    
    projectCards.forEach(card => {
        // Remove any existing flipped class
        card.classList.remove('flipped');
        
        card.addEventListener('click', (e) => {
            // Prevent flip if clicking on links
            if (e.target.tagName.toLowerCase() === 'a') return;
            
            // Toggle flip class
            card.classList.toggle('flipped');
        });
    });

    // Update cards on resize
    window.addEventListener('resize', debounce(() => {
        const isMobileNow = window.matchMedia('(max-width: 767px)').matches;
        if (isMobile !== isMobileNow) {
            projectCards.forEach(card => card.classList.remove('flipped'));
        }
    }, 250));
}

// Update the scroll-to-top functionality
function initScrollToTop() {
    const goToTopButton = document.querySelector('.go-to-top');
    let isAnimating = false;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            goToTopButton.classList.add('show');
        } else {
            goToTopButton.classList.remove('show');
        }
    });

    // Create smoke effect
    function createSmoke(x, y) {
        const smoke = document.createElement('div');
        smoke.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(smoke);

        // Animate and remove smoke
        smoke.animate([
            { transform: 'translateY(0) scale(1)', opacity: 0.4 },
            { transform: 'translateY(-20px) scale(2)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => smoke.remove();
    }

    // Handle click event
    goToTopButton.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        // Add launching class for animation
        goToTopButton.classList.add('launching');

        // Create smoke effect
        const rect = goToTopButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const bottomY = rect.bottom;

        // Create multiple smoke particles
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createSmoke(
                    centerX - 10 + Math.random() * 20,
                    bottomY + Math.random() * 10
                );
            }, i * 100);
        }

        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Reset button after animation
        setTimeout(() => {
            goToTopButton.classList.remove('launching');
            isAnimating = false;
        }, 1200); // Match animation duration
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollToTop);