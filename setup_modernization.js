const fs = require('fs');
const execSync = require('child_process').execSync;

const htmlFiles = execSync('find . -name "*.html" -not -path "*/node_modules/*"').toString().trim().split('\n');

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add CDN links to <head> if not present
    if (!content.includes('unpkg.com/aos')) {
        const headLinks = `
    <!-- AOS & Alpine.js -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>`;
        content = content.replace(/<\/head>/, headLinks);
    }

    // 2. Add CDN scripts to end of <body> if not present
    if (!content.includes('unpkg.com/swup')) {
        const bodyScripts = `
    <!-- Swup & AOS Scripts -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="https://unpkg.com/swup@4"></script>
    <script src="https://unpkg.com/@swup/scripts-plugin@3"></script>
</body>`;
        content = content.replace(/<\/body>/, bodyScripts);
    }

    // 3. Fix cash-vs-installments wrap to main
    content = content.replace(/<div class="wrap">/, '<main class="wrap">');
    content = content.replace(/<\/div>\s*<footer/, '</main>\n\n<footer');

    // 4. Transform <main> to <main id="swup" class="transition-fade">
    // Case A: <main>
    content = content.replace(/<main>/, '<main id="swup" class="transition-fade">');
    // Case B: <main class="...">
    content = content.replace(/<main class="([^"]+)">/, '<main id="swup" class="$1 transition-fade">');
    
    // 5. Add data-aos="fade-up" to .card and .calc-inputs
    content = content.replace(/class="card"/g, 'class="card" data-aos="fade-up" data-aos-duration="600"');
    content = content.replace(/class="calc-inputs"/g, 'class="calc-inputs" data-aos="fade-up" data-aos-duration="600"');

    // 6. Add data-swup-reload-script to inline scripts (excluding AOS/Swup/Alpine/main.js)
    // We target <script> that is NOT followed by src=
    content = content.replace(/<script>\s*(\/\/ We use an IIFE|const|function|let)/g, '<script data-swup-reload-script>\n        $1');
    content = content.replace(/<script>\s*(?:\/\/ Calculator Logic|const)/gi, '<script data-swup-reload-script>\n        // Calculator Logic');
    
    fs.writeFileSync(file, content);
});

// Update main.js
let mainJs = fs.readFileSync('js/main.js', 'utf8');
if (!mainJs.includes('AOS.init')) {
    const swupLogic = `
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
`;
    fs.writeFileSync('js/main.js', mainJs + '\n' + swupLogic);
}

// Update style.css
let styleCss = fs.readFileSync('css/style.css', 'utf8');
if (!styleCss.includes('transition-fade')) {
    const swupCss = `
/* Swup Page Transition Styles */
html.is-animating .transition-fade {
    opacity: 0;
    transform: translateY(10px);
}
.transition-fade {
    transition: opacity 300ms ease-out, transform 300ms ease-out;
    opacity: 1;
    transform: translateY(0);
}
`;
    fs.writeFileSync('css/style.css', styleCss + '\n' + swupCss);
}

console.log('Setup complete.');
