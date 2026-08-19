# Financo Developer Notes & Guidelines

This file serves as the memory and rulebook for the AI developer working on the Financo website.

## Brand Colors
The official Financo brand palette:
- **Dark / Text Main:** `#264653`
- **Primary (Buttons, Links, Accents):** `#2A9D8F` (Teal)
- **Secondary Accent 1:** `#E9C46A` (Yellow)
- **Secondary Accent 2:** `#F4A261` (Light Orange)
- **Highlight / Action:** `#E76F51` (Burnt Orange)

## Standard Operating Procedure: Adding New Calculators
Because the user is a beginner, the AI developer must handle all integration seamlessly.

**When the user provides a new calculator (HTML/JS):**
1. **Create the file:** Create `calculators/<calculator-name>.html`.
2. **Apply Layout:** Wrap the raw code inside the standard Financo template (Global Navbar at the top, Global Footer at the bottom).
3. **Brand Alignment:** Modify the calculator's internal CSS and JS to use the official brand colors (e.g., `#2A9D8F` instead of default blues or greens).
4. **Mobile Optimization (MANDATORY):** Automatically write and inject mobile-specific CSS (`@media (max-width: 600px)`) to ensure all inputs, grids, and metrics stack vertically and do not overflow on mobile screens. Do not ask the user to do this; do it proactively.
5. **Update Routing:** Go to `index.html` and `calculators/index.html` and update the respective placeholder buttons to link to the newly created calculator page.
