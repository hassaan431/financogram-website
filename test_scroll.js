const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Serve the folder locally
  const server = spawn('python3', ['-m', 'http.server', '8080']);
  
  // Wait for server to start
  await new Promise(r => setTimeout(r, 2000));
  
  await page.goto('http://localhost:8080');
  
  // Take screenshots at various scroll depths
  for (let i = 0; i <= 10; i++) {
    const scrollY = i * 400; // scroll by 400px increments
    await page.evaluate(`window.scrollTo(0, ${scrollY})`);
    await new Promise(r => setTimeout(r, 500)); // wait for animations
    await page.screenshot({ path: `scratch/shot_${i}.png` });
    console.log(`Took screenshot at ${scrollY}px`);
  }
  
  await browser.close();
  server.kill();
})();
