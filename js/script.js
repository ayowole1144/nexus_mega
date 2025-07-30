// Function to update CSS variables dynamically (for LightGallery RGBA)
function updateCssRgbVariables() {
    const root = document.documentElement;
    const primaryColorHex = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    const secondaryColorHex = getComputedStyle(root).getPropertyValue('--secondary-color').trim();

    // Convert hex to RGB and set CSS variables
    const hexToRgb = (hex) => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    };

    if (hexToRgb(primaryColorHex)) {
        root.style.setProperty('--primary-color-rgb', hexToRgb(primaryColorHex));
    }
    if (hexToRgb(secondaryColorHex)) {
        root.style.setProperty('--secondary-color-rgb', hexToRgb(secondaryColorHex));
    }
}


// ===== GLOBAL SELECTORS & HELPERS =====
const body = document.body;
const header = document.querySelector('header');
const mobileMenuButton = document.querySelector('.mobile-menu');
const mainNav = document.querySelector('nav ul'); // The desktop nav

// Create mobile menu elements if they don't exist
const mobileNavOverlay = document.createElement('div');
mobileNavOverlay.classList.add('mobile-nav-overlay');
body.appendChild(mobileNavOverlay);

const mobileNav = document.createElement('nav');
mobileNav.classList.add('mobile-nav');
mobileNav.innerHTML = `
    <i class="fas fa-times close-btn"></i>
    <ul>
        ${mainNav ? mainNav.innerHTML : ''} 
    </ul>
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
const headerLogo = document.querySelector('.header-logo'); // Element for logo image (the img tag)
const logoText = document.querySelector('.logo h1'); // Original h1 for text (the 'Nexus Mega' text)

// Set initial display state on load: text visible, image hidden
if (logoText) {
    logoText.style.display = 'block';
}
if (headerLogo) {
    headerLogo.style.display = 'none'; // Ensure image is hidden initially
}

function handleStickyHeader() {
    // You can adjust this value (50) based on how far you want to scroll before the header changes
    const scrollThreshold = 50; 

    if (window.scrollY > scrollThreshold) {
        header.classList.add('sticky');
        // Hide text, show image
        if (logoText) {
            logoText.style.display = 'none';
        }
        if (headerLogo) {
            headerLogo.style.display = 'block'; 
            // REMOVED: headerLogo.style.height = '35px'; // Let CSS control the height now
        }
    } else {
        header.classList.remove('sticky');
        // Show text, hide image
        if (logoText) {
            logoText.style.display = 'block';
        }
        if (headerLogo) {
            headerLogo.style.display = 'none';
            // REMOVED: headerLogo.style.height = '40px'; // Let CSS control the height now
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
        // Ensure mobile menu button icon changes if it's there
        const menuIcon = mobileMenuButton ? mobileMenuButton.querySelector('i') : null;
        if (menuIcon) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        }
        body.style.overflowY = 'hidden'; // Prevent scrolling on body
    } else {
        body.classList.remove('mobile-menu-active');
        mobileNavOverlay.style.opacity = '0';
        setTimeout(() => mobileNavOverlay.style.display = 'none', 300);
        mobileNav.classList.remove('active');
        // Ensure mobile menu button icon changes back
        const menuIcon = mobileMenuButton ? mobileMenuButton.querySelector('i') : null;
        if (menuIcon) {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
        body.style.overflowY = 'auto'; // Re-enable scrolling
    }
}

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
}
if (mobileNav.querySelector('.close-btn')) {
    mobileNav.querySelector('.close-btn').addEventListener('click', () => toggleMobileMenu(false));
}
if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', () => toggleMobileMenu(false)); // Close on overlay click
}


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

// ===== PROJECT CARD CAROUSEL (New Functionality) =====
function initProjectCardCarousel(projectCardElement) {
    const slidesContainer = projectCardElement.querySelector('.project-carousel-slides');
    const slides = slidesContainer ? slidesContainer.querySelectorAll('img') : [];
    const prevBtn = projectCardElement.querySelector('.project-carousel-prev');
    const nextBtn = projectCardElement.querySelector('.project-carousel-next');
    const indicatorsContainer = projectCardElement.querySelector('.project-carousel-indicators');

    if (slides.length <= 1) { // No carousel needed if 0 or 1 slide
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (indicatorsContainer) indicatorsContainer.style.display = 'none';
        return;
    }

    let currentSlideIndex = 0;
    let autoSlideInterval;

    function updateProjectCarousel() {
        // Reset all slides and then activate the current one
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            // For a "slide" effect, we'd use transform: translateX.
            // For a "fade" effect, we use opacity and position: absolute.
            // Let's stick to opacity/absolute for simplicity and better control over stacking.
            if (index === currentSlideIndex) {
                slide.classList.add('active');
            }
        });

        // Update indicators
        if (indicatorsContainer) {
            const dots = indicatorsContainer.querySelectorAll('span');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlideIndex);
            });
        }
    }

    function showNextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        updateProjectCarousel();
    }

    function showPrevSlide() {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        updateProjectCarousel();
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval); // Clear any existing interval
        autoSlideInterval = setInterval(showNextSlide, 4000); // Auto-advance every 4 seconds
    }

    function pauseAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Create indicators dynamically
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = ''; // Clear existing
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.setAttribute('aria-label', `Go to image ${index + 1}`);
            dot.setAttribute('role', 'button');
            dot.addEventListener('click', () => {
                currentSlideIndex = index;
                updateProjectCarousel();
                pauseAutoSlide();
                startAutoSlide(); // Restart timer on manual interaction
            });
            indicatorsContainer.appendChild(dot);
        });
    }

    // Attach event listeners to buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showPrevSlide();
            pauseAutoSlide();
            startAutoSlide();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showNextSlide();
            pauseAutoSlide();
            startAutoSlide();
        });
    }

    // Pause/Resume on hover
    if (slidesContainer) {
        slidesContainer.addEventListener('mouseenter', pauseAutoSlide);
        slidesContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Initial update and start auto-slide
    updateProjectCarousel();
    startAutoSlide();
}

// Initialize all project carousels when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // ... (your existing DOMContentLoaded code) ...

    // NEW: Initialize project carousels
    document.querySelectorAll('.project-card').forEach(card => {
        initProjectCardCarousel(card);
    });
});

// ===== MAINTENANCE GALLERY =====
function initGallery() {
    const galleryElement = document.getElementById('maintenance-gallery');
    if (galleryElement) {
        // Ensure LightGallery is loaded before initializing
        if (typeof lightGallery === 'function') {
            lightGallery(galleryElement, {
                selector: 'a', // Select all anchor tags within the galleryElement
                download: false,
                speed: 500,
                plugins: [lgThumbnail, lgZoom], // Make sure these are loaded via CDN
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
    const counterElement = document.getElementById('trip-count'); // Corrected ID based on your HTML
    if (!counterElement) return;

    const targetCount = 364; // Set to the default value in your HTML
    let animated = false; // Flag to prevent re-animation on scroll

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounter(counterElement, 0, targetCount, 2500); // From 0 to 364 in 2.5 seconds
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
            if (submitText) submitText.style.display = 'none';
            if (loadingIcon) loadingIcon.style.display = 'block';

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
                if (submitText) submitText.style.display = 'inline-block';
                if (loadingIcon) loadingIcon.style.display = 'none';
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
}


// ===== INITIALIZE ALL FUNCTIONS ON DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
    updateCssRgbVariables(); // Set RGB variables on load

    initSlider();
    initProjectFilters();
    initTotalTripsCounter();
    initContactForm();
    
    // Initial check for sticky header and logo display
    handleStickyHeader(); 

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
            // Check if all *remaining* plugins are also loaded before calling initGallery
            const checkPluginsLoaded = setInterval(() => {
                if (typeof lgThumbnail === 'function' && typeof lgZoom === 'function') {
                    clearInterval(checkPluginsLoaded);
                    initGallery();
                }
            }, 100);
        };
    } else {
        initGallery(); // LightGallery is already loaded, just initialize
    }
}