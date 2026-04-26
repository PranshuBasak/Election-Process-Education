import json
import os

files = [
    'package.json',
    'tsconfig.json',
    'components.json',
    'next.config.ts',
    'postcss.config.mjs',
    'eslint.config.mjs'
]

for f in files:
    if os.path.exists(f):
        print(f"Checking {f}...")
        try:
            with open(f, 'r') as file:
                content = file.read()
                if f.endswith('.json'):
                    json.loads(content)
                    print(f"  {f} is valid JSON.")
                else:
                    print(f"  {f} is not a JSON file, skipping JSON check.")
        except Exception as e:
            print(f"  Error in {f}: {e}")
