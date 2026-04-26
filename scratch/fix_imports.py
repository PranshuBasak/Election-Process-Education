import os

root_dir = r'c:\Others\proj\ElectionEducationBot\backend'

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.py'):
            filepath = os.path.join(subdir, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                try:
                    with open(filepath, 'r', encoding='latin-1') as f:
                        content = f.read()
                except Exception as e:
                    print(f"Could not read {filepath}: {e}")
                    continue
            
            new_content = content.replace('from app', 'from backend')
            new_content = new_content.replace('import app', 'import backend')
            
            if content != new_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
