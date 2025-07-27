// Typing Animation
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
        this.isPaused = false;
    }

    update() {
        if (this.isPaused) return;
        const now = Date.now();
        if (this.isDeleting) {
            if (this.currentCharIndex > 0) {
                this.element.textContent = this.phrases[this.currentPhraseIndex].substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
                setTimeout(() => this.update(), this.config.deletingSpeed);
            } else {
                this.isDeleting = false;
                this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
                setTimeout(() => this.update(), this.config.pauseBeforeTypingNextPhrase);
            }
        } else {
            if (this.currentCharIndex < this.phrases[this.currentPhraseIndex].length) {
                this.element.textContent += this.phrases[this.currentPhraseIndex].charAt(this.currentCharIndex);
                this.currentCharIndex++;
                setTimeout(() => this.update(), this.config.typingSpeed);
            } else if (now - this.lastPause > this.config.pauseBeforeDeleting) {
                this.isDeleting = true;
                this.lastPause = now;
                setTimeout(() => this.update(), this.config.deletingSpeed);
            } else {
                setTimeout(() => this.update(), 50);
            }
        }
    }

    start() {
        this.isPaused = false;
        this.update();
    }
}

// Mobile Menu
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
        this.dropdownMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                const targetId = link.getAttribute('href').substring(1);
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            });
        });
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

// CV Download
function downloadCV() {
    const cvUrl = 'docs/cv.pdf'; // Replace with actual CV URL
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
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff0000', '00cc00', '#0066ff', '#000000', '#ffffff', '#ffff1a', '#ff66cc', 'ff6600', '#00ffff', '#99ff66']
        });
    }
}

// Contact Form
function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const buttonText = submitBtn.querySelector('.button-text');
    const buttonSpinner = submitBtn.querySelector('.button-spinner');
    const formMessage = document.getElementById('form-message');
    const formData = new FormData(form);
    const userName = formData.get('user_name');
    const userEmail = formData.get('user_email');
    const message = formData.get('message');

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
        .then(() => {
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
            triggerConfetti();
            setTimeout(() => {
                formMessage.classList.remove('show', 'success');
                formMessage.innerHTML = '';
            }, 5000);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            formMessage.innerHTML = `
                <div class="alert-content">
                    <div class="alert-icon">✕</div>
                    <div class="alert-text">
                        <h3>Message Failed to Send</h3>
                        <p>Please try again or contact me at udaytharu813@gmail.com</p>
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

// Form Validation
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
        errorMessage = `${input.name.replace('user_', '').charAt(0).toUpperCase() + input.name.slice(6)} is required`;
    }

    errorSpan.textContent = isValid ? '' : errorMessage;
    errorSpan.classList.toggle('hidden', isValid);
    input.classList.toggle('error', !isValid);
    return isValid;
}

function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('focus', () => input.classList.add('focused'));
        input.addEventListener('blur', () => {
            input.classList.remove('focused');
            validateField(input);
        });
    });

    form.addEventListener('submit', handleContactForm);
}

// Scroll Progress
function initScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });
}

// Section Animations
function initIntersectionObserver() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
}

// Project Cards
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'a') return;
            card.classList.toggle('flipped');
        });
    });
}

// Go to Top
function initScrollToTop() {
    const goToTopButton = document.querySelector('.go-to-top');
    if (!goToTopButton) return;

    window.addEventListener('scroll', () => {
        goToTopButton.classList.toggle('show', window.scrollY > 300);
    });

    goToTopButton.addEventListener('click', () => {
        goToTopButton.classList.add('launching');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => goToTopButton.classList.remove('launching'), 1200);
    });
}

// Cosmic Particles
function createParticles(count) {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.getElementById('home')?.appendChild(particlesContainer);

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.8 + 0.2;
        particlesContainer.appendChild(particle);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        new TypingAnimation('typing-text', config).start();
    } catch (error) {
        console.error('Typing animation error:', error.message);
    }
    new MobileMenu();
    initFormValidation();
    initScrollProgress();
    initIntersectionObserver();
    initProjectCards();
    initScrollToTop();
    createParticles(30);
});