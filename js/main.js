// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    
    // Find the mobile menu button (hamburger) and the navigation links in the HTML
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    // When the user clicks the mobile menu button
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            
            // Toggle (add/remove) the 'active' class. 
            // In our CSS, the 'active' class makes the menu visible.
            navLinks.classList.toggle('active');
            
            // Change the icon from a hamburger (☰) to an X (✕) when opened
            if (navLinks.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '✕';
            } else {
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    }

});

// Unified Theme Enforcement (Strict Pakistan Green & Pure White)
try {
    localStorage.removeItem('theme');
    localStorage.setItem('theme', 'dark');
} catch (e) {}
document.documentElement.setAttribute('data-theme', 'dark');


// Initialize AOS (Animate On Scroll)
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({ once: true, offset: 50, duration: 600, easing: 'ease-out-cubic' });
});

// Initialize Swup for SPA page transitions
document.addEventListener("DOMContentLoaded", () => {
    if (typeof Swup !== 'undefined') {
        const swup = new Swup({
            plugins: [new SwupScriptsPlugin({ optin: true })]
        });
        
        swup.hooks.on('page:view', () => {
            AOS.refresh();
        });
    }
});
