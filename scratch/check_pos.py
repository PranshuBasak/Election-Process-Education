with open('package.json', 'r') as f:
    content = f.read()
    print(f"Char at 793: '{content[793]}'")
    print(f"Context: '{content[780:810]}'")
