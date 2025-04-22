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
        this.phrases = config.phrases;
        this.typingSpeed = config.typingSpeed;
        this.deletingSpeed = config.deletingSpeed;
        this.pauseBeforeDeleting = config.pauseBeforeDeleting;
        this.pauseBeforeTypingNextPhrase = config.pauseBeforeTypingNextPhrase;
        this.currentPhraseIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
    }

    async type() {
        const currentPhrase = this.phrases[this.currentPhraseIndex];

        if (this.isDeleting) {
            this.element.textContent = currentPhrase.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentPhrase.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        if (!this.isDeleting && this.currentCharIndex === currentPhrase.length) {
            this.isDeleting = true;
            await this.sleep(this.pauseBeforeDeleting);
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            await this.sleep(this.pauseBeforeTypingNextPhrase);
        }

        const speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        setTimeout(() => this.type(), speed);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    start() {
        this.type();
    }
}

function initTypingAnimation() {
    const typing = new TypingAnimation('typing-text', config);
    typing.start();
}

function initMobileMenu() {
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');

    menuButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
        menuButton.classList.toggle('active');
    });

    document.querySelectorAll('#dropdownMenu a').forEach(link => {
        link.addEventListener('click', () => {
            dropdownMenu.classList.add('hidden');
            menuButton.classList.remove('active');
        });
    });
}

function initProjectCards() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('clicked');
        });
    });
}

function initIntersectionObserver() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = `translateY(${entry.intersectionRatio * 20}px)`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    sections.forEach(section => observer.observe(section));
}

function initGoToTopButton() {
    const goToTopButton = document.querySelector('.go-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            goToTopButton.classList.add('visible');
        } else {
            goToTopButton.classList.remove('visible');
        }
    });

    goToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

function downloadCV() {
    const link = document.createElement('a');
    link.href = 'path/to/your/cv.pdf';
    link.download = 'Uday_Tharu_CV.pdf';
    link.click();
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonSpinner = submitButton.querySelector('.button-spinner');

    const validators = {
        name: value => value.trim().length >= 2 ? '' : 'Name must be at least 2 characters.',
        email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.',
        message: value => value.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'
    };

    function showError(inputId, message) {
        const errorElement = document.getElementById(`${inputId}-error`);
        errorElement.textContent = message;
        errorElement.classList.toggle('hidden', !message);
        document.getElementById(inputId).classList.toggle('border-red-500', !!message);
    }

    function validateForm() {
        let isValid = true;
        ['name', 'email', 'message'].forEach(field => {
            const value = form[field].value;
            const error = validators[field](value);
            showError(field, error);
            if (error) isValid = false;
        });
        return isValid;
    }

    form.addEventListener('input', (e) => {
        const field = e.target.name;
        if (validators[field]) {
            showError(field, validators[field](e.target.value));
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        submitButton.disabled = true;
        buttonText.classList.add('hidden');
        buttonSpinner.classList.remove('hidden');

        try {
            await emailjs.sendForm('service_6g8j4fe', form.dataset.email, form);
            form.reset();
            ['name', 'email', 'message'].forEach(field => showError(field, ''));
            formMessage.classList.remove('hidden', 'text-red-500');
            formMessage.classList.add('text-green-500');
            formMessage.textContent = 'Message sent successfully!';
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (error) {
            console.error('EmailJS error:', error);
            formMessage.classList.remove('hidden', 'text-green-500');
            formMessage.classList.add('text-red-500');
            formMessage.textContent = 'Failed to send message. Please try again later.';
        } finally {
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonSpinner.classList.add('hidden');
            setTimeout(() => {
                formMessage.classList.add('hidden');
                formMessage.textContent = '';
            }, 5000);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initMobileMenu();
    initProjectCards();
    initIntersectionObserver();
    initGoToTopButton();
    initScrollProgress();
    initContactForm();
});