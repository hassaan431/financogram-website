import os, re

theme_btn = '''<li>
                    <button id="theme-toggle" aria-label="Toggle Dark Mode" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; height: 36px; width: 36px;">
                        <span id="theme-icon">🌙</span>
                    </button>
                </li>
                <li>'''

html_files = []
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

for file_path in html_files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove footer
    content = re.sub(r'<p style="margin-top: 1rem;">&copy; 2024 Financo\. All rights reserved\.</p>', '', content)
    
    # Add theme toggle button before Instagram (look for the <a href="...instagram...</a>)
    content = re.sub(r'<li>(\s*<a href="https://www.instagram.com/financo.gram/)', theme_btn + r'\1', content)
    
    with open(file_path, 'w') as f:
        f.write(content)

print("Updated HTML files.")
