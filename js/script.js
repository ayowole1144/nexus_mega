// Function to update CSS variables dynamically (for LightGallery RGBA)
function updateCssRgbVariables() {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    const secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color').trim();

    // Convert hex to RGB and set CSS variables
    const hexToRgb = (hex) => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    };

    if (hexToRgb(primaryColor)) {
        root.style.setProperty('--primary-color-rgb', hexToRgb(primaryColor));
    }
    if (hexToRgb(secondaryColor)) {
        root.style.setProperty('--secondary-color-rgb', hexToRgb(secondaryColor));
    }
}


// ===== GLOBAL SELECTORS & HELPERS =====
const body = document.body;
const header = document.querySelector('header');
const mobileMenuButton = document.querySelector('.mobile-menu');
const mainNav = document.querySelector('nav ul'); // The desktop nav
const mobileNavOverlay = document.createElement('div'); // Create overlay
mobileNavOverlay.classList.add('mobile-nav-overlay');
body.appendChild(mobileNavOverlay);

const mobileNav = document.createElement('nav'); // Create mobile nav container
mobileNav.classList.add('mobile-nav');
mobileNav.innerHTML = `
    <i class="fas fa-times close-btn"></i>
    <ul>
        ${mainNav.innerHTML} </ul>
`;
body.appendChild(mobileNav);

// Function to smoothly scroll to a section
function scrollToSection(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
        // Close mobile menu if open
        if (body.classList.contains('mobile-menu-active')) {
            toggleMobileMenu(false);
        }
        const headerHeight = header.offsetHeight;
        const offsetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Attach scroll event listeners to all nav links
document.querySelectorAll('nav a').forEach(link => {
    if (link.hash) { // Only apply to internal links
        link.addEventListener('click', scrollToSection);
    }
});
// Attach scroll event listeners to mobile nav links
mobileNav.querySelectorAll('a').forEach(link => {
    if (link.hash) {
        link.addEventListener('click', scrollToSection);
    }
});


// ===== STICKY HEADER & DYNAMIC LOGO =====
const logoImgSrc = 'Nexus logo.jpeg'; // Assuming the logo is in the root
const initialLogoText = 'Nexus <span class="accent">Mega</span>';
const headerLogo = document.querySelector('.header-logo'); // New element for logo image
const logoText = document.querySelector('.logo h1'); // Original h1 for text

// Create and prepend the image element if it doesn't exist
if (!headerLogo) {
    const newLogoImg = document.createElement('img');
    newLogoImg.src = logoImgSrc;
    newLogoImg.alt = 'Nexus Mega Logo';
    newLogoImg.classList.add('header-logo');
    document.querySelector('.logo').prepend(newLogoImg);
}

function handleStickyHeader() {
    if (window.scrollY > 50) {
        header.classList.add('sticky');
        // Hide text, show image
        if (logoText) {
            logoText.style.display = 'none';
        }
        if (headerLogo) {
            headerLogo.style.display = 'block'; // Show the image
            headerLogo.style.height = '35px'; // Adjust size for sticky
        }
    } else {
        header.classList.remove('sticky');
        // Show text, hide image
        if (logoText) {
            logoText.style.display = 'block';
        }
        if (headerLogo) {
            headerLogo.style.display = 'none'; // Hide the image
            headerLogo.style.height = '40px'; // Reset size
        }
    }
}


// ===== MOBILE MENU TOGGLE (Overlay Based) =====
function toggleMobileMenu(show) {
    if (show === undefined) { // If no argument, toggle based on current state
        show = !body.classList.contains('mobile-menu-active');
    }

    if (show) {
        body.classList.add('mobile-menu-active');
        mobileNavOverlay.style.display = 'block';
        setTimeout(() => mobileNavOverlay.style.opacity = '1', 10);
        mobileNav.classList.add('active');
        mobileMenuButton.querySelector('i').classList.remove('fa-bars');
        mobileMenuButton.querySelector('i').classList.add('fa-times');
        body.style.overflowY = 'hidden'; // Prevent scrolling on body
    } else {
        body.classList.remove('mobile-menu-active');
        mobileNavOverlay.style.opacity = '0';
        setTimeout(() => mobileNavOverlay.style.display = 'none', 300);
        mobileNav.classList.remove('active');
        mobileMenuButton.querySelector('i').classList.remove('fa-times');
        mobileMenuButton.querySelector('i').classList.add('fa-bars');
        body.style.overflowY = 'auto'; // Re-enable scrolling
    }
}

mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
mobileNav.querySelector('.close-btn').addEventListener('click', () => toggleMobileMenu(false));
mobileNavOverlay.addEventListener('click', () => toggleMobileMenu(false)); // Close on overlay click


// ===== HERO SLIDER =====
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const indicatorsContainer = document.querySelector('.slide-indicators'); // Renamed for clarity

function updateSlider() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    if (indicatorsContainer) {
        const dots = indicatorsContainer.querySelectorAll('span');
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
    // Clear any existing interval before starting a new one
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function pauseSlider() {
    clearInterval(slideInterval);
}

function initSlider() {
    if (slides.length === 0) return;

    // Create indicators
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = ''; // Clear existing indicators
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.setAttribute('role', 'button');
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
                pauseSlider(); // Pause then restart on manual interaction
                startSlider();
            });
            indicatorsContainer.appendChild(dot);
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
    const closeBtn = lightbox ? lightbox.querySelector('.close-btn') : null; // Ensure closeBtn exists
    const videoItems = document.querySelectorAll('.video-item');

    videoItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior if video-item is an anchor
            const video = item.querySelector('video');
            if (video && lightbox && lightboxVideo) {
                const videoSrc = video.querySelector('source').src;
                const videoType = video.querySelector('source').type;

                lightboxVideo.innerHTML = `<source src="${videoSrc}" type="${videoType}">Your browser doesn't support HTML5 video.`;
                lightbox.style.display = 'flex';
                lightboxVideo.load();
                lightboxVideo.controls = true; // Show controls in lightbox
                lightboxVideo.play().catch(error => {
                    console.error("Autoplay prevented in lightbox:", error);
                    // Optionally show a play button if autoplay fails
                });
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (lightboxVideo) lightboxVideo.pause();
            if (lightbox) lightbox.style.display = 'none';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Only close if clicking the backdrop
                if (lightboxVideo) lightboxVideo.pause();
                lightbox.style.display = 'none';
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') {
            if (lightboxVideo) lightboxVideo.pause();
            lightbox.style.display = 'none';
        }
    });
}


// ===== AUTO PLAY/PAUSE ON SCROLL =====
function initScrollVideoPlayback() {
    const videos = document.querySelectorAll('.video-item video');
    const observerOptions = {
        threshold: 0.6, // Adjusted threshold to be more forgiving
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                // Check if video is not already playing and has sufficient percentage visible
                if (video.paused && video.readyState >= 2) { // ReadyState 2 means enough data for current frame
                    video.play().catch(e => {
                        // Autoplay prevented by browser, show controls
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
        // Essential for mobile autoplay considerations and preloading
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'metadata');
        video.muted = true; // Mute by default for autoplay compatibility
        video.loop = true; // Loop by default
        
        // Remove existing controls attribute if present, to manage dynamically
        video.removeAttribute('controls'); 

        // Add a play/pause overlay or icon if desired in CSS
        // For simplicity, we'll just handle clicks to toggle play/pause and controls
        video.addEventListener('click', () => {
            if (video.paused) {
                video.muted = false; // Unmute on first click
                video.play()
                    .then(() => {
                        video.removeAttribute('controls'); // Hide controls if playing
                    })
                    .catch(e => {
                        // Playback failed, likely due to browser policy or user preference
                        console.error("Playback prevented:", e);
                        video.setAttribute('controls', 'true'); // Show controls to allow manual play
                    });
            } else {
                video.pause();
                video.setAttribute('controls', 'true'); // Show controls when paused
            }
        });

        // Keyboard support for accessibility
        video.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (video.paused) {
                    video.muted = false;
                    video.play();
                } else {
                    video.pause();
                }
            }
        });

        observer.observe(video);
    });
}

// ===== MAINTENANCE GALLERY =====
function initGallery() {
    const galleryElement = document.getElementById('maintenance-gallery');
    if (galleryElement) {
        // Ensure LightGallery is loaded before initializing
        if (typeof lightGallery === 'function') {
            lightGallery(galleryElement, {
                selector: '.gallery-item', // Use a specific class for gallery items
                download: false,
                speed: 500,
                // Add plugins if needed (e.g., thumbnails, zoom, video)
                plugins: [lgThumbnail, lgZoom, lgVideo], // Make sure these are loaded via CDN
                videojs: true, // If you have video.js integrated for videos
                animateThumb: true,
                zoomFromOrigin: true,
                allowMediaOverlap: true,
                toggleThumb: false
            });
        } else {
            console.error("LightGallery is not loaded. Ensure its script is included before initGallery.");
        }
    }
}

// ===== QUOTE CALCULATOR =====
function initQuoteCalculator() {
    const calculateBtn = document.getElementById('calculate-quote');
    if (!calculateBtn) return;

    const equipmentType = document.getElementById('equipment-type');
    const rentalDays = document.getElementById('rental-days');
    const projectSize = document.getElementById('project-size');
    const quoteResult = document.getElementById('quote-result');

    const rates = {
        truck: { base: 50000, small: 0.9, medium: 1, large: 1.2 },
        excavator: { base: 80000, small: 0.85, medium: 1, large: 1.15 }
    };

    const updateQuote = () => {
        const equipment = equipmentType.value;
        const days = parseInt(rentalDays.value);
        const size = projectSize.value;

        if (isNaN(days) || days <= 0) {
            quoteResult.innerHTML = '<strong style="color: var(--error-color);">Please enter valid rental days.</strong>';
            return;
        }
        if (!rates[equipment]) {
            quoteResult.innerHTML = '<strong style="color: var(--error-color);">Invalid equipment selected.</strong>';
            return;
        }

        let rate = rates[equipment].base;
        rate *= rates[equipment][size];

        const total = rate * days;

        quoteResult.innerHTML = `
            <strong>Estimated Cost:</strong> ₦${total.toLocaleString()}
            <small>(${days} days at ₦${rate.toLocaleString()}/day)</small>
        `;
    };

    // Add event listeners for instant updates
    equipmentType.addEventListener('change', updateQuote);
    rentalDays.addEventListener('input', updateQuote); // Use 'input' for range/number
    projectSize.addEventListener('change', updateQuote);

    // Initial calculation on load
    updateQuote();
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

            // Filter projects with animation
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const isMatch = (filter === 'all' || card.dataset.category === filter);
                
                // Use a small timeout to allow CSS transition to apply
                if (isMatch) {
                    card.style.display = 'block'; // Make it visible
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10); // Small delay to trigger transition
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)'; // Shrink slightly
                    setTimeout(() => {
                        card.style.display = 'none'; // Hide after animation
                    }, 300); // Match CSS transition duration
                }
            });
        });
    });

    // Trigger initial filter to show all projects if 'all' button exists
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) {
        allBtn.click();
    }
}


// ===== TOTAL TRIPS COUNTER ANIMATION =====
function animateCounter(element, start, end, duration) {
    let startTime = null;
    const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString(); // Format with commas
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = end.toLocaleString(); // Ensure final value is exact
        }
    };
    requestAnimationFrame(step);
}

function initTotalTripsCounter() {
    const counterElement = document.getElementById('total-trips-count');
    if (!counterElement) return;

    const targetCount = 2000; // Your desired total trips count
    let animated = false; // Flag to prevent re-animation on scroll

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounter(counterElement, 0, targetCount, 2500); // From 0 to 2000 in 2.5 seconds
                animated = true;
                observer.unobserve(counterElement); // Stop observing once animated
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    observer.observe(counterElement);
}


// ===== FORM VALIDATION & AJAX SUBMISSION SIMULATION =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\(\)-]{7,20}$/; // More flexible phone regex

    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = submitBtn.querySelector('.submit-text');
    const loadingIcon = submitBtn.querySelector('.loading-icon');
    const formFeedback = document.getElementById('form-feedback');

    // Function to show feedback messages
    function showFeedback(message, type = 'success') {
        formFeedback.innerHTML = `
            <div class="${type}-message">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                ${message}
            </div>
        `;
        formFeedback.style.display = 'block';
        // Hide after 5 seconds
        setTimeout(() => {
            formFeedback.style.display = 'none';
            formFeedback.innerHTML = '';
        }, 5000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        formFeedback.innerHTML = ''; // Clear previous feedback

        // Validate Name
        const nameInput = document.getElementById('name');
        if (nameInput.value.trim().length < 2) {
            document.getElementById('name-error').textContent = 'Name must be at least 2 characters.';
            isValid = false;
        }

        // Validate Email
        const emailInput = document.getElementById('email');
        if (!emailRegex.test(emailInput.value.trim())) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        // Validate Phone (optional, but if entered, validate format)
        const phoneInput = document.getElementById('phone');
        if (phoneInput.value.trim() && !phoneRegex.test(phoneInput.value.trim())) {
            document.getElementById('phone-error').textContent = 'Please enter a valid phone number.';
            isValid = false;
        }

        // Validate Service (if applicable)
        const serviceSelect = document.getElementById('service');
        if (serviceSelect && serviceSelect.value === '') {
            document.getElementById('service-error').textContent = 'Please select a service.';
            isValid = false;
        }

        // Validate Message
        const messageTextarea = document.getElementById('message');
        if (messageTextarea.value.trim().length < 10) {
            document.getElementById('message-error').textContent = 'Message must be at least 10 characters.';
            isValid = false;
        }

        if (isValid) {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitText.style.display = 'none';
            loadingIcon.style.display = 'block';

            try {
                // Simulate network request
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay

                // Simulate successful submission
                showFeedback('Thank you for your message! We will get back to you soon.', 'success');
                form.reset(); // Clear form fields
                
                // Example of sending data to a server (replace with your actual backend endpoint)
                /*
                const formData = new FormData(form);
                const response = await fetch('/api/contact', { // Replace with your actual endpoint
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showFeedback('Thank you for your message! We will get back to you soon.', 'success');
                    form.reset();
                } else {
                    const errorData = await response.json();
                    showFeedback(`Submission failed: ${errorData.message || 'Server error.'}`, 'error-message-feedback');
                }
                */

            } catch (error) {
                console.error('Form submission error:', error);
                showFeedback('There was an issue sending your message. Please try again later.', 'error-message-feedback');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitText.style.display = 'inline-block';
                loadingIcon.style.display = 'none';
            }
        } else {
            showFeedback('Please correct the errors in the form.', 'error-message-feedback');
        }
    });

    // Real-time validation on input blur
    const inputsToValidate = ['name', 'email', 'phone', 'message'];
    inputsToValidate.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('blur', () => {
                // Trigger specific validation check on blur
                if (id === 'name' && input.value.trim().length < 2) {
                    document.getElementById('name-error').textContent = 'Name must be at least 2 characters.';
                } else if (id === 'email' && !emailRegex.test(input.value.trim())) {
                    document.getElementById('email-error').textContent = 'Please enter a valid email address.';
                } else if (id === 'phone' && input.value.trim() && !phoneRegex.test(input.value.trim())) {
                    document.getElementById('phone-error').textContent = 'Please enter a valid phone number.';
                } else if (id === 'message' && input.value.trim().length < 10) {
                    document.getElementById('message-error').textContent = 'Message must be at least 10 characters.';
                } else {
                    document.getElementById(`${id}-error`).textContent = ''; // Clear error if valid
                }
            });
        }
    });

    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', () => {
            if (serviceSelect.value === '') {
                document.getElementById('service-error').textContent = 'Please select a service.';
            } else {
                document.getElementById('service-error').textContent = '';
            }
        });
    }
}


// ===== INITIALIZE ALL FUNCTIONS ON DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
    updateCssRgbVariables(); // Set RGB variables on load

    initSlider();
    initQuoteCalculator();
    initProjectFilters();
    initTotalTripsCounter(); // Initialize new counter
    initContactForm(); // Use the new form init function
    initVideoLightbox();
    initScrollVideoPlayback();
    handleStickyHeader(); // Initial check for sticky header

    // Event listener for sticky header on scroll
    window.addEventListener('scroll', handleStickyHeader);

    // Load lightgallery assets dynamically if the element exists
    if (document.getElementById('maintenance-gallery')) {
        loadLightGalleryAssets();
    }
});


// ===== LIGHTGALLERY PLUGIN LOADER =====
// This function ensures LightGallery and its required plugins are loaded
function loadLightGalleryAssets() {
    // Only load if LightGallery is not already globally available
    if (typeof lightGallery === 'undefined') {
        // LightGallery Core CSS
        const cssCore = document.createElement('link');
        cssCore.rel = 'stylesheet';
        cssCore.href = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/css/lightgallery.min.css';
        document.head.appendChild(cssCore);

        // LightGallery Video Plugin CSS (if you use videos in LightGallery)
        const cssVideo = document.createElement('link');
        cssVideo.rel = 'stylesheet';
        cssVideo.href = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/css/lg-video.min.css';
        document.head.appendChild(cssVideo);

        // LightGallery Thumbnail Plugin CSS
        const cssThumb = document.createElement('link');
        cssThumb.rel = 'stylesheet';
        cssThumb.href = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/css/lg-thumbnail.min.css';
        document.head.appendChild(cssThumb);
        
        // LightGallery Zoom Plugin CSS
        const cssZoom = document.createElement('link');
        cssZoom.rel = 'stylesheet';
        cssZoom.href = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/css/lg-zoom.min.css';
        document.head.appendChild(cssZoom);


        // LightGallery Core JS
        const scriptCore = document.createElement('script');
        scriptCore.src = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/lightgallery.min.js';
        scriptCore.defer = true;
        document.body.appendChild(scriptCore);

        // LightGallery Video Plugin JS
        const scriptVideo = document.createElement('script');
        scriptVideo.src = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/plugins/video/lg-video.min.js';
        scriptVideo.defer = true;
        document.body.appendChild(scriptVideo);

        // LightGallery Thumbnail Plugin JS
        const scriptThumb = document.createElement('script');
        scriptThumb.src = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/plugins/thumbnail/lg-thumbnail.min.js';
        scriptThumb.defer = true;
        document.body.appendChild(scriptThumb);

        // LightGallery Zoom Plugin JS
        const scriptZoom = document.createElement('script');
        scriptZoom.src = 'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.1/plugins/zoom/lg-zoom.min.js';
        scriptZoom.defer = true;
        document.body.appendChild(scriptZoom);

        // Ensure initGallery is called after all scripts are loaded
        scriptCore.onload = () => {
            // Check if all plugins are also loaded before calling initGallery
            const checkPluginsLoaded = setInterval(() => {
                if (typeof lgVideo === 'function' && typeof lgThumbnail === 'function' && typeof lgZoom === 'function') {
                    clearInterval(checkPluginsLoaded);
                    initGallery();
                }
            }, 100);
        };
    } else {
        initGallery(); // LightGallery is already loaded, just initialize
    }
}