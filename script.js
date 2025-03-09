// Typing animation configuration
const config = {
    phrases: ["Web Developer", "Software Developer", "Web Designer", "Content Creator", "Script Writer"],
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
    event.preventDefault(); // Prevent default form submission
    if (isFormSubmitting) return; // Prevent multiple submissions

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
    }, (error) => {
        console.log('FAILED...', error);
        alert('Error sending message. Please try again later.');
    })
    .finally(() => {
        isFormSubmitting = false; // Reset flag after completion
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.contactFormInitialized) {
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactForm);
            window.contactFormInitialized = true; // Prevent re-initialization
        }

        try {
            const typingAnimation = new TypingAnimation('typing-text', config);
            typingAnimation.start();
        } catch (error) {
            console.error('Typing animation error:', error.message);
        }

        const mobileMenu = new MobileMenu();

        // Go to Top button functionality
        const goToTopButtons = document.querySelectorAll('.go-to-top');
        goToTopButtons.forEach(button => {
            button.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        // Show/hide button based on scroll position
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
    }
});