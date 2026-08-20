import os, re

key_takeaways_html = '''
            <div style="background: rgba(13, 148, 136, 0.05); border-left: 4px solid var(--primary-color); padding: 1.5rem; border-radius: 0 12px 12px 0; margin-bottom: 2rem;">
                <h3 style="margin-top: 0; color: var(--primary-color); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">Key Takeaways</h3>
                <ul style="margin: 0; padding-left: 1.2rem; color: var(--text-main);">
                    <li style="margin-bottom: 0.5rem;">Start as early as possible to leverage compound interest.</li>
                    <li style="margin-bottom: 0.5rem;">Automate your investments so you don't rely on willpower.</li>
                    <li>Ignore short-term market noise and focus on the long-term horizon.</li>
                </ul>
            </div>
'''

for file in os.listdir('learn'):
    if file.endswith('.html') and file != 'index.html':
        filepath = os.path.join('learn', file)
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Insert key takeaways right after the article image
        pattern = r'(<img src="\.\./assets/.*?\.jpg"[^>]*>)'
        if "Key Takeaways" not in content:
            content = re.sub(pattern, r'\1\n' + key_takeaways_html, content)
            
            with open(filepath, 'w') as f:
                f.write(content)

print("Updated articles with Key Takeaways.")
