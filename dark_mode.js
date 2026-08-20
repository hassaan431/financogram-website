
// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check local storage for saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeIcon.textContent = '☀️';
        }
    } else {
        // Check system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
        }
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let targetTheme = 'light';
            
            if (currentTheme === 'light' || !currentTheme) {
                targetTheme = 'dark';
                themeIcon.textContent = '☀️';
            } else {
                targetTheme = 'light';
                themeIcon.textContent = '🌙';
            }
            
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
        });
    }
});
