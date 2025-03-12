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
    }

    type() {
        if (this.currentCharIndex < this.phrases[this.currentPhraseIndex].length) {
            this.element.textContent += this.phrases[this.currentPhraseIndex].charAt(this.currentCharIndex);
            this.currentCharIndex++;
            this.timeout = setTimeout(() => this.type(), this.config.typingSpeed);
        } else {
            this.timeout = setTimeout(() => this.deleteText(), this.config.pauseBeforeDeleting);
        }
    }

    deleteText() {
        if (this.currentCharIndex > 0) {
            this.element.textContent = this.phrases[this.currentPhraseIndex].substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            this.timeout = setTimeout(() => this.deleteText(), this.config.deletingSpeed);
        } else {
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            this.timeout = setTimeout(() => this.type(), this.config.pauseBeforeTypingNextPhrase);
        }
    }

    start() {
        this.type();
    }

    stop() {
        clearTimeout(this.timeout);
    }
}

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

        // Trigger reflow to ensure animation restarts
        this.dropdownMenu.style.animation = 'none';
        this.dropdownMenu.offsetHeight; // Trigger reflow
        this.dropdownMenu.style.animation = isExpanded ? 'none' : 'slideDown 0.3s ease forwards';
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
        this.dropdownMenu.style.animation = 'none'; // Reset animation
    }
}

function downloadCV() {
    const cvUrl = 'path/to/your/cv.pdf'; // Replace with actual CV URL
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Uday_Tharu_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

let isFormSubmitting = false;

function handleContactForm(event) {
    event.preventDefault();
    if (isFormSubmitting) return;

    isFormSubmitting = true;
    console.log('Form submitted');

    const form = event.target;
    const formData = new FormData(form);
    const userName = formData.get('user_name');
    const userEmail = formData.get('user_email');
    const message = formData.get('message');

    emailjs.send('service_rusvorz', form.getAttribute('data-email'), {
        from_name: userName,
        from_email: userEmail,
        message: message,
        to_name: 'Uday Tharu',
        to_email: 'udaytharu813@gmail.com'
    })
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('We will reply soon!');
        form.reset();

        // Add confetti animation
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
        console.log('FAILED...', error);
        alert('Error sending message. Please try again later.');
    })
    .finally(() => {
        isFormSubmitting = false;
    });
}

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

        const goToTopButtons = document.querySelectorAll('.go-to-top');
        goToTopButtons.forEach(button => {
            button.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            goToTopButtons.forEach(button => {
                if (scrollPosition > 300) {
                    button.style.display = 'block';
                } else {
                    button.style.display = 'none';
                }
            });
        });

        createParticles(50);

        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.querySelector('.skill-spotlight')?.style.setProperty('--x', `${x}px`);
                card.querySelector('.skill-spotlight')?.style.setProperty('--y', `${y}px`);
            });
        });

        createBackgroundShapes(20); // Create 20 floating shapes
    }
});
