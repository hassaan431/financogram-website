import os, glob, re

svg_btn = '''<li>
                    <a href="https://www.instagram.com/financo.gram/" target="_blank" aria-label="Instagram" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: white; text-decoration: none; transition: transform 0.2s;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                </li>'''

html_files = []
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

for file_path in html_files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # regex to find the Instagram li tag
    pattern = r'<li>\s*<a href="https://www.instagram.com/financo.gram/"[^>]*>.*?Instagram.*?</a>\s*</li>'
    new_content = re.sub(pattern, svg_btn, content, flags=re.DOTALL | re.IGNORECASE)
    
    with open(file_path, 'w') as f:
        f.write(new_content)

print("Updated Instagram buttons.")
