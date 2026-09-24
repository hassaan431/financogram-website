const fs = require('fs');
const execSync = require('child_process').execSync;

const htmlFiles = execSync('find . -name "*.html" -not -path "*/node_modules/*"').toString().trim().split('\n');

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Remove old active styles
    content = content.replace(/ style="color: var\(--primary-color\); font-weight: 700;"/g, '');

    // Add CDN links
    if (!content.includes('unpkg.com/aos')) {
        const headLinks = `
    <!-- AOS -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>`;
        content = content.replace(/<\/head>/, headLinks);
    }
    if (!content.includes('unpkg.com/swup')) {
        const bodyScripts = `
    <!-- Swup & AOS -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="https://unpkg.com/swup@4"></script>
    <script src="https://unpkg.com/@swup/scripts-plugin@3"></script>
</body>`;
        content = content.replace(/<\/body>/, bodyScripts);
    }

    // Fix cash-vs-installments wrap
    content = content.replace(/<div class="wrap">/, '<main class="wrap">');
    content = content.replace(/<\/div>\s*<footer/, '</main>\n\n<footer');

    // Add swup main tags
    content = content.replace(/<main>/, '<main id="swup" class="transition-fade">');
    content = content.replace(/<main class="([^"]+)">/, '<main id="swup" class="$1 transition-fade">');

    // Add scroll animations
    content = content.replace(/class="card"/g, 'class="card" data-aos="fade-up" data-aos-duration="600"');
    content = content.replace(/class="calc-inputs"/g, 'class="calc-inputs" data-aos="fade-up" data-aos-duration="600"');

    // Add data-swup-reload-script
    content = content.replace(/<script>\s*(?!\s*<\/script>)/g, '<script data-swup-reload-script>\n');

    fs.writeFileSync(file, content);
});

// Update js/main.js
let mainJs = fs.readFileSync('js/main.js', 'utf8');
if (!mainJs.includes('AOS.init')) {
    const swupLogic = `
// Initialize AOS
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({ once: true, offset: 50, duration: 600, easing: 'ease-out-cubic' });
    updateActiveNav();
});

// Initialize Swup
document.addEventListener("DOMContentLoaded", () => {
    if (typeof Swup !== 'undefined') {
        const swup = new Swup({
            plugins: [new SwupScriptsPlugin({ optin: true })]
        });
        
        swup.hooks.on('page:view', () => {
            AOS.refresh();
            updateActiveNav();
            
            // Close mobile menu if open
            const navLinks = document.getElementById('nav-links');
            const mobileMenuBtn = document.getElementById('mobile-menu');
            if(navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    }
});

function updateActiveNav() {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => link.classList.remove('nav-active'));
    
    const currentPath = window.location.pathname;
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        // Simple matching logic
        if (href && !href.startsWith('http')) {
            if (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('nav-active');
            } else if (currentPath.includes('/calculators/') && href.includes('calculators/index.html')) {
                link.classList.add('nav-active');
            } else if (currentPath.includes('/learn/') && href.includes('learn/index.html')) {
                link.classList.add('nav-active');
            }
        }
    });
}
`;
    fs.writeFileSync('js/main.js', mainJs + '\n' + swupLogic);
}

// Update css/style.css
let styleCss = fs.readFileSync('css/style.css', 'utf8');
if (!styleCss.includes('transition-fade')) {
    const swupCss = `
/* Swup Page Transitions */
html.is-animating .transition-fade {
    opacity: 0;
    transform: translateY(15px);
}
.transition-fade {
    transition: opacity 300ms ease-out, transform 300ms ease-out;
    opacity: 1;
    transform: translateY(0);
}

/* Active Nav Links */
.nav-links a.nav-active {
    color: var(--primary-color) !important;
    font-weight: 700;
}
`;
    fs.writeFileSync('css/style.css', styleCss + '\n' + swupCss);
}

console.log('Setup finished.');
