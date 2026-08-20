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

// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Default to dark theme if no saved preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        if (themeIcon) themeIcon.textContent = '🌙';
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            let targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
            
            if (targetTheme === 'dark') {
                themeIcon.textContent = '☀️';
            } else {
                themeIcon.textContent = '🌙';
            }
            
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
        });
    }
});
