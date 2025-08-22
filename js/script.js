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

    // Ensure exhaust element exists
    let exhaust = goToTopButton.querySelector('.exhaust');
    if (!exhaust) {
        exhaust = document.createElement('div');
        exhaust.className = 'exhaust';
        goToTopButton.appendChild(exhaust);
    }

    // Spawn a smoke puff with varied size, drift and duration
    const spawnSmoke = () => {
        const puff = document.createElement('div');
        puff.className = 'smoke';
        const offset = (Math.random() - 0.5) * 24; // -12px to 12px
        const size = 6 + Math.random() * 12; // 6px to 18px
        const dur = 900 + Math.random() * 800; // 0.9s to 1.7s
        puff.style.left = '50%';
        puff.style.marginLeft = `${offset}px`;
        puff.style.width = `${size}px`;
        puff.style.height = `${size}px`;
        puff.style.setProperty('--dur', `${dur}ms`);
        puff.style.pointerEvents = 'none';
        puff.addEventListener('animationend', () => puff.remove());
        goToTopButton.appendChild(puff);
    };

    let isLaunching = false;
    let smokeIntervalId = null;

    window.addEventListener('scroll', () => {
        goToTopButton.classList.toggle('show', window.scrollY > 300);
    });

    goToTopButton.addEventListener('click', () => {
        if (isLaunching) return; // throttle repeated clicks
        isLaunching = true;
        goToTopButton.classList.add('launching');

        // Spawn smoke while launching
        smokeIntervalId = setInterval(spawnSmoke, 60);

        // Begin scroll
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Stop smoke and reset state after flight duration
        setTimeout(() => {
            // ensure disabled
            if (smokeIntervalId) { clearInterval(smokeIntervalId); smokeIntervalId = null; }
            goToTopButton.classList.remove('launching');
            isLaunching = false;
        }, 1250);
    });
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
    // Disable old floating particles
    // createParticles(30);

    // Initialize twinkling_stars background only on desktop for better mobile performance
    if (window.innerWidth > 768) {
        inittwinkling_stars({ count: 400 });
    }

    // Initialize shooting stars only on desktop for better mobile performance
    if (window.innerWidth > 768) {
        initShootingStars({ frequencyMs: 2500 });
    }

    // Handle window resize for responsive animations
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        const twinklingContainer = document.querySelector('.twinkling_stars');
        const shootingContainer = document.querySelector('.shooting-stars');
        
        if (isMobile) {
            // Remove animations on mobile
            if (twinklingContainer) twinklingContainer.remove();
            if (shootingContainer) shootingContainer.remove();
        } else {
            // Add animations on desktop if they don't exist
            if (!twinklingContainer) {
                inittwinkling_stars({ count: 400 });
            }
            if (!shootingContainer) {
                initShootingStars({ frequencyMs: 2500 });
            }
        }
    });
});

// twinkling_stars
function inittwinkling_stars({ count = 30 } = {}) {
    const container = document.createElement('div');
    container.className = 'twinkling_stars';
    document.body.insertBefore(container, document.body.firstChild);

    const twinkling_stars = [];
    const viewport = () => ({ w: window.innerWidth, h: window.innerHeight });
    const movementScale = 0.3; // Lower = slower movement

    for (let i = 0; i < count; i++) {
        const node = document.createElement('div');
        node.className = 'firefly';
        node.style.setProperty('--blink-duration', `${(Math.random() * 2 + 2).toFixed(2)}s`);
        container.appendChild(node);

        const sizePx = 1.5 + Math.random() * 2.5; // 1.5px to 4px
        node.style.width = `${sizePx}px`;
        node.style.height = `${sizePx}px`;

        const f = {
            el: node,
            x: Math.random() * viewport().w,
            y: Math.random() * viewport().h,
			vx: (Math.random() - 0.5) * 0.2,
			vy: (Math.random() - 0.5) * 0.2,
			speed: Math.random() * 0.15 + 0.1,
            driftChangeMs: 0,
        };
        twinkling_stars.push(f);
    }

    function step(ts) {
        const { w, h } = viewport();
        twinkling_stars.forEach(f => {
            if (!f.last) f.last = ts;
            const dt = Math.min(33, ts - f.last);
            f.last = ts;

            // Occasionally change direction slightly
            f.driftChangeMs += dt;
			if (f.driftChangeMs > 800 + Math.random() * 1200) {
				f.vx += (Math.random() - 0.5) * 0.08;
				f.vy += (Math.random() - 0.5) * 0.08;
				const max = 0.25;
                f.vx = Math.max(-max, Math.min(max, f.vx));
                f.vy = Math.max(-max, Math.min(max, f.vy));
                f.driftChangeMs = 0;
            }

			f.x += f.vx * f.speed * dt * movementScale;
			f.y += f.vy * f.speed * dt * movementScale;

            // Wrap around edges
            if (f.x < -10) f.x = w + 10;
            if (f.x > w + 10) f.x = -10;
            if (f.y < -10) f.y = h + 10;
            if (f.y > h + 10) f.y = -10;

            f.el.style.transform = `translate(${f.x}px, ${f.y}px)`;
        });

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    window.addEventListener('resize', () => {
        // No-op: positions wrap relative to viewport in animation loop
    });
}

// Shooting Stars
function initShootingStars({ frequencyMs = 3000 } = {}) {
    const layer = document.createElement('div');
    layer.className = 'shooting-stars';
    document.body.insertBefore(layer, document.body.firstChild);
    let activeStars = 0;

    function spawn() {
        if (activeStars >= 4) return;
        const star = document.createElement('div');
        star.className = 'shooting-star';
        layer.appendChild(star);
        activeStars++;

        // Diagonal, constant-velocity motion (down-right)
        const w = window.innerWidth;
        const h = window.innerHeight;
        const startX = -80 + Math.random() * (w * 0.15); // from just off left to ~15% width
        const startY = -100 + Math.random() * (h * 0.25); // from just above to ~25% height
        const speed = 900 + Math.random() * 400; // px/s
        const angle = (25 + (Math.random() * 12 - 6)) * (Math.PI / 180); // ~19° to 31°
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        let x = startX;
        let y = startY;
        let last = undefined;
        let life = 0;
        const maxLife = 1800 + Math.random() * 800; // ms
        let removed = false;

        // Precompute constant visuals
        const rotDegConst = Math.atan2(vy, vx) * 180 / Math.PI;
        const vmagConst = Math.hypot(vx, vy);
        const tailConst = Math.min(220, 40 + vmagConst * 0.12);
        star.style.setProperty('--tail', `${tailConst}px`);

        function frame(ts) {
            if (!last) last = ts;
            const dtMs = Math.min(33, ts - last);
            last = ts;
            life += dtMs;

            const dt = dtMs / 1000;

            // Integrate position (constant velocity)
            x += vx * dt;
            y += vy * dt;

            star.style.transform = `translate(${x}px, ${y}px) rotate(${rotDegConst}deg)`;

            // Fade in/out naturally
            const t = life / maxLife;
            const opacity = t < 0.15 ? t / 0.15 : (t > 0.85 ? (1 - t) / 0.15 : 1);
            star.style.opacity = String(Math.max(0, Math.min(1, opacity)));

            // Remove if off-screen or life exceeded
            if (life > maxLife || x > w + 150 || y > h + 150) {
                if (!removed) {
                    removed = true;
                    activeStars--;
                    star.remove();
                }
                return;
            }

            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    // Initial few
    for (let i = 0; i < 2; i++) {
        setTimeout(spawn, i * 700);
    }

    // Loop
    setInterval(spawn, frequencyMs);
}