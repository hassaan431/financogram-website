const fs = require('fs');
const execSync = require('child_process').execSync;

const htmlFiles = execSync('find . -name "*.html" -not -path "*/node_modules/*"').toString().trim().split('\n');

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<script src="js\/main.js"><\/script>/g, '<script type="module" src="js/main.js"></script>');
    content = content.replace(/<script src="\.\.\/js\/main.js"><\/script>/g, '<script type="module" src="../js/main.js"></script>');
    fs.writeFileSync(file, content);
});

let mainJs = fs.readFileSync('js/main.js', 'utf8');

const cubeImports = `import { rise, reveal } from "https://esm.sh/cube-motion";\n\n`;
const cubeAnimations = `
// Cube Motion Animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate hero text on load
    rise('h1, p', { targets: 'self', stagger: 40 });
    
    // Reveal cards and sections on scroll
    reveal('.card, .calc-inputs, .calc-results', { targets: 'self', stagger: 60 });
});
`;

if (!mainJs.includes('cube-motion')) {
    mainJs = cubeImports + mainJs + cubeAnimations;
    fs.writeFileSync('js/main.js', mainJs);
}

console.log('Updated HTML files and main.js to use cube-motion module.');
