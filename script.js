// Typing animation configuration
const config = {
    phrases: ["Web Developer", "Frontend Developer", "Web Designer", "Graphic Designer", "Script Writer"],
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
    }

    update() {
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
        this.animationFrame = requestAnimationFrame(() => this.update());
    }

    stop() {
        cancelAnimationFrame(this.animationFrame);
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
    }

    toggleMenu() {
        const isExpanded = this.menuButton.getAttribute('aria-expanded') === 'true';
        this.menuButton.setAttribute('aria-expanded', !isExpanded);
        this.dropdownMenu.classList.toggle('hidden');
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
        this.dropdownMenu.classList.add('hidden');
    }
}

// CV download functionality
function downloadCV() {
    const cvUrl = 'path/to/your/cv.pdf'; // Replace with actual CV URL
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Uday_Tharu_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    // Real-time validation
    let isValid = true;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Reset error messages
    nameError.classList.add('hidden');
    emailError.classList.add('hidden');
    messageError.classList.add('hidden');
    formMessage.classList.remove('show', 'success', 'error');

    if (!userName.trim()) {
        nameError.textContent = 'Name is required';
        nameError.classList.remove('hidden');
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
        emailError.textContent = 'Please enter a valid email';
        emailError.classList.remove('hidden');
        isValid = false;
    }

    if (!message.trim()) {
        messageError.textContent = 'Message is required';
        messageError.classList.remove('hidden');
        isValid = false;
    }

    if (!isValid) return;

    isFormSubmitting = true;

    // Disable the button and show loading state
    submitBtn.disabled = true;
    buttonText.textContent = 'Sending...';
    buttonSpinner.classList.remove('hidden');

    // Check if emailjs is available
    if (typeof emailjs === 'undefined' || typeof emailjs.send !== 'function') {
        console.error('EmailJS is not properly initialized. Please check your User ID and library loading.');
        formMessage.textContent = 'Error: Email service is unavailable. Please try again later or contact me directly at udaytharu813@gmail.com.';
        formMessage.classList.add('show', 'error');
        isFormSubmitting = false;
        submitBtn.disabled = false;
        buttonText.textContent = 'Submit';
        buttonSpinner.classList.add('hidden');
        return;
    }

    emailjs.send('service_rusvorz', form.getAttribute('data-email'), {
        from_name: userName,
        from_email: userEmail,
        message: message,
        to_name: 'Uday Tharu',
        to_email: 'udaytharu813@gmail.com'
    })
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        formMessage.textContent = `We will reply soon, ${userName}! Thank you for reaching out.`;
        formMessage.classList.add('show', 'success');
        form.reset();

        // Confetti animation (preserved)
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }, (error) => {
        console.error('FAILED...', error);
        formMessage.textContent = 'Error sending message. Please try again later or contact me directly at udaytharu813@gmail.com.';
        formMessage.classList.add('show', 'error');
    })
    .finally(() => {
        // Re-enable the button and reset text
        isFormSubmitting = false;
        submitBtn.disabled = false;
        buttonText.textContent = 'Submit';
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
            goToTopButton.style.display = scrollPosition > 300 ? 'block' : 'none';
        }, 100);
        window.addEventListener('scroll', handleScroll);

        goToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

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
    }
});