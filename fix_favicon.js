const fs = require('fs');

const files = [
  './learn/buying-house.html',
  './learn/index.html',
  './learn/before-investing.html',
  './learn/retirement-planning.html',
  './calculators/education.html'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const faviconTag = '\n    <link rel="icon" type="image/png" href="../assets/logo-transparent.png">';
  content = content.replace(/<title>([^<]*)<\/title>/, '<title>$1</title>' + faviconTag);
  fs.writeFileSync(file, content);
});

console.log('Added favicon tags to all missing files.');
