// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('nav ul');
mobileMenu.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelector('.slide-indicators');

// Initialize slider
function initSlider() {
    slides.forEach((slide, i) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => goToSlide(i));
        dots.appendChild(dot);
    });
    updateSlider();
    setInterval(nextSlide, 5000);
}

// Update slider state
function updateSlider() {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
    // Update dots
    document.querySelectorAll('.slide-indicators span').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Navigation functions
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}
function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}
function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    document.querySelector('.next-slide').addEventListener('click', nextSlide);
    document.querySelector('.prev-slide').addEventListener('click', prevSlide);
});