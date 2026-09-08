# Financogram Calculator Standards (CRITICAL)

**AI AGENT INSTRUCTIONS:** If the user asks you to create or modify a calculator for Financogram, you MUST read this file and use `calculators/TEMPLATE.html` as the absolute baseline structure. Do NOT invent new classes or rely on external frameworks like Tailwind.

## Golden Rules for New Calculators:
1. **Wrapping:** All calculators MUST be wrapped inside `<main class="container">` and `<div class="card calc-container">`. This is the ONLY way to ensure the calculator gets the global box outline, padding, and shadow. Do NOT just use an unstyled wrapper.
2. **Back Button:** ALWAYS include `<a href="index.html">&larr; Back to all calculators</a>` directly above the `.card` container.
3. **Inputs:** Use standard HTML inputs. Use `class="has-prefix"` alongside a `<span class="prefix">Rs</span>` for currency, or `class="has-suffix"` for percentages. Do not use custom styled range sliders unless explicitly ordered.
4. **Colors (CRITICAL):** Use the global variables from `style.css`:
   - `var(--primary-color)` (Teal)
   - `var(--bg-main)` (Background color for the page body and stat cards)
   - `var(--bg-card)` (Background color for the main outlined cards)
   - `var(--border-color)`
   - `var(--text-main)`
   - `var(--text-muted)`
   **DO NOT** invent missing variables like `--card-surface`, `--bg-color`, or `--cream`.
5. **Navbar/Footer:** Copy the exact navbar and footer from `TEMPLATE.html`. Do not miss the Instagram logo or dark mode toggle logic.
6. **Results:** Display results using the hidden `#results` div containing a `.headline` banner and `.stat` cards arranged in a `.grid`.

Whenever you add a new calculator, you simply copy `calculators/TEMPLATE.html`, rename it, add it to `calculators/index.html`, and inject the specific math logic. This ensures 100% design consistency across the site.
