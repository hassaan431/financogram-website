const fs = require('fs');
let content = fs.readFileSync('calculators/education.html', 'utf8');

// 1. Fix CSS
content = content.replace('.card-form { margin-bottom: 24px; background: var(--bg-main); border-radius: 14px; }', '.card-form { margin-bottom: 24px; }');

// 2. Fix HTML structure
// I will replace the entire .card-form block with stacked fields.

const newCardForm = `<div class="card-form">
          <div class="field">
            <label for="fee">Semester fee today</label>
            <div class="input-row">
              <span class="prefix">Rs</span>
              <input type="number" id="fee" class="has-prefix" value="150000" min="0" step="1000">
            </div>
          </div>

          <div class="field">
            <label for="semesters">Number of semesters</label>
            <div class="input-row">
              <input type="number" id="semesters" value="8" min="1" step="1">
            </div>
          </div>

          <div class="field">
            <label for="years">Years until university</label>
            <div class="input-row">
              <input type="number" id="years" value="10" min="1" step="1">
            </div>
          </div>

          <div class="field">
            <label for="inflation">Expected fee inflation</label>
            <div class="input-row">
              <input type="number" id="inflation" class="has-suffix" value="7" min="0" step="0.5">
              <span class="suffix">%</span>
            </div>
            <p class="hint">Default: general inflation minus 3%</p>
          </div>

          <div class="field">
            <label>Where you'll invest (Presets)</label>
            <div class="toggle-group" id="invest-toggle">
              <div class="toggle-btn active" data-return="9">Money Market (9%)</div>
              <div class="toggle-btn" data-return="15">Stock Market (15%)</div>
              <div class="toggle-btn" data-return="16">Gold (16%)</div>
            </div>
          </div>

          <div class="field">
            <label for="return">Expected annual return</label>
            <div class="input-row">
              <input type="number" id="return" class="has-suffix" value="9" min="0" step="0.5">
              <span class="suffix">%</span>
            </div>
          </div>

          <div class="field">
            <label for="onetime">One-time expenses (laptop, books, etc.)</label>
            <div class="input-row">
              <span class="prefix">Rs</span>
              <input type="number" id="onetime" class="has-prefix" value="75000" min="0" step="1000">
            </div>
          </div>

          <div class="field">
            <label for="initial">Already saved (optional)</label>
            <div class="input-row">
              <span class="prefix">Rs</span>
              <input type="number" id="initial" class="has-prefix" value="0" min="0" step="1000">
            </div>
          </div>
      </div>`;

content = content.replace(/<div class="card-form">[\s\S]*?<\/div>\s*<div id="warn"/, newCardForm + '\n\n      <div id="warn"');

fs.writeFileSync('calculators/education.html', content);
console.log('Fixed layout structure.');
