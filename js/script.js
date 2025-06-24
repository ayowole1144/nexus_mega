// ===== MOBILE MENU TOGGLE =====
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('nav ul');
mobileMenu.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenu.querySelector('i').classList.toggle('fa-times');
});

// ===== HERO SLIDER =====
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelector('.slide-indicators');

function updateSlider() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    if (indicators) {
        const dots = indicators.querySelectorAll('span');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
}

function pauseSlider() {
    clearInterval(slideInterval);
}

function initSlider() {
    // Create indicators
    if (indicators) {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
                pauseSlider();
                startSlider();
            });
            indicators.appendChild(dot);
        });
    }
    
    // Set up controls
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        pauseSlider();
        startSlider();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        pauseSlider();
        startSlider();
    });
    
    // Initialize
    updateSlider();
    startSlider();
    
    // Pause on hover
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', pauseSlider);
        slider.addEventListener('mouseleave', startSlider);
    }
}

// ===== VIDEO LIGHTBOX =====
function initVideoLightbox() {
    const lightbox = document.getElementById('video-lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeBtn = document.querySelector('.close-btn');
    const videoItems = document.querySelectorAll('.video-item');

        videoItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const video = item.querySelector('video');
            if (video) {
                video.setAttribute('data-interacted', 'true');
                const videoSrc = video.querySelector('source').src;
                const videoType = video.querySelector('source').type;
                
                lightboxVideo.innerHTML = `
                    <source src="${videoSrc}" type="${videoType}">
                    Your browser doesn't support HTML5 video.
                `;
                lightbox.style.display = 'flex';
                lightboxVideo.load(); // Explicitly load without autoplay
                
                // Only play if user clicks play button
                lightboxVideo.controls = true;
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightboxVideo.pause();
            lightbox.style.display = 'none';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightboxVideo.pause();
                lightbox.style.display = 'none';
            }
        });
    }
}

// ===== AUTO PLAY/PAUSE ON SCROLL =====
function initScrollVideoPlayback() {
    const videos = document.querySelectorAll('.video-item video');
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            if (entry.isIntersecting) {
                // Only play if not already playing AND if user has interacted
                if (video.paused && video.dataset.interacted === 'true') {
                    video.play().catch(e => {
                        video.setAttribute('controls', 'true');
                    });
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, observerOptions);

    videos.forEach(video => {
        // Important settings
        video.removeAttribute('autoplay'); // Ensure no autoplay
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'metadata'); // Only load metadata initially
        video.setAttribute('data-interacted', 'false'); // Track interaction
        
        // Click to play with interaction tracking
        video.addEventListener('click', (e) => {
            e.stopPropagation();
            video.setAttribute('data-interacted', 'true');
            
            if (video.paused) {
                video.play()
                    .then(() => video.removeAttribute('controls'))
                    .catch(e => video.setAttribute('controls', 'true'));
            } else {
                video.pause();
            }
        });

        // Keyboard support
        video.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                video.setAttribute('data-interacted', 'true');
                video.paused ? video.play() : video.pause();
            }
        });

        observer.observe(video);
    });
}

// ===== MAINTENANCE GALLERY =====
function initGallery() {
    if (document.getElementById('maintenance-gallery')) {
        lightGallery(document.getElementById('maintenance-gallery'), {
            selector: 'a',
            download: false,
            videojs: true
        });
    }
}

// ===== QUOTE CALCULATOR =====
function initQuoteCalculator() {
    const calculateBtn = document.getElementById('calculate-quote');
    if (!calculateBtn) return;

    const rates = {
        truck: { base: 50000, small: 0.9, medium: 1, large: 1.2 },
        excavator: { base: 80000, small: 0.85, medium: 1, large: 1.15 }
    };

    calculateBtn.addEventListener('click', () => {
        const equipment = document.getElementById('equipment-type').value;
        const days = parseInt(document.getElementById('rental-days').value);
        const size = document.getElementById('project-size').value;
        
        let rate = rates[equipment].base;
        rate *= rates[equipment][size]; // Apply size multiplier
        
        const total = rate * days;
        
        document.getElementById('quote-result').innerHTML = `
            <strong>Estimated Cost:</strong> ₦${total.toLocaleString()}
            <small>(${days} days at ₦${rate.toLocaleString()}/day)</small>
        `;
    });
}

// ===== PROJECT FILTERS =====
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s+-]+$/;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        // Name validation
        const name = document.getElementById('name');
        if (name.value.trim().length < 2) {
            document.getElementById('name-error').textContent = 'Please enter a valid name';
            isValid = false;
        }
        
        // Email validation
        const email = document.getElementById('email');
        if (!emailRegex.test(email.value)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email';
            isValid = false;
        }
        
        // Phone validation (optional)
        const phone = document.getElementById('phone');
        if (phone.value && !phoneRegex.test(phone.value)) {
            document.getElementById('phone-error').textContent = 'Please enter a valid phone number';
            isValid = false;
        }
        
        // Message validation
        const message = document.getElementById('message');
        if (message.value.trim().length < 10) {
            document.getElementById('message-error').textContent = 'Please provide more details';
            isValid = false;
        }
        
        if (isValid) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.querySelector('.submit-text').style.display = 'none';
            submitBtn.querySelector('.loading-icon').style.display = 'inline-block';
            
            // Simulate form submission (replace with actual AJAX call)
            setTimeout(() => {
                document.getElementById('form-feedback').innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        Thank you! We'll contact you within 24 hours.
                    </div>
                `;
                form.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.querySelector('.submit-text').style.display = 'inline-block';
                submitBtn.querySelector('.loading-icon').style.display = 'none';
            }, 1500);
        }
    });
    
    // Real-time validation
    document.getElementById('email').addEventListener('input', (e) => {
        if (!emailRegex.test(e.target.value)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email';
        } else {
            document.getElementById('email-error').textContent = '';
        }
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initGallery();
    initQuoteCalculator();
    initProjectFilters();
    initFormValidation();
    initVideoLightbox();
    initScrollVideoPlayback();
});

// ===== LIGHTGALLERY PLUGIN LOADER =====
function loadLightGallery() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/lightgallery.min.js';
    script.onload = initGallery;
    document.body.appendChild(script);
    
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/css/lightgallery.min.css';
    document.head.appendChild(css);
}

// Load lightgallery only if needed
if (document.getElementById('maintenance-gallery')) {
    loadLightGallery();
}