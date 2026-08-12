import json
import os

def fix_translation_file(file_path):
    """Fix JSON syntax error in translation files"""
    print(f"Fixing {file_path}")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the problematic pattern: "voiceComplaint": {...}}\n},\n"chatbot": {
    # The issue is there are extra closing braces
    
    # Simple fix: remove the extra } and , before chatbot
    if '}"\n},\n"chatbot": {' in content:
        print("Found pattern 1")
        content = content.replace('}"\n},\n"chatbot": {', '}",\n  "chatbot": {')
    elif '}\n}\n},\n"chatbot": {' in content:
        print("Found pattern 2")
        content = content.replace('}\n}\n},\n"chatbot": {', '},\n  "chatbot": {')
    elif '  }\n}\n},\n"chatbot": {' in content:
        print("Found pattern 3")
        content = content.replace('  }\n}\n},\n"chatbot": {', '  },\n  "chatbot": {')
    
    # Write the fixed content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Try to parse to verify it's valid JSON
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"✓ {file_path} is now valid JSON")
        return True
    except json.JSONDecodeError as e:
        print(f"✗ {file_path} still has JSON error: {e}")
        return False

# Fix both files
en_file = r"src\i18n\locales\en\translation.json"
hi_file = r"src\i18n\locales\hi\translation.json"

success_en = fix_translation_file(en_file)
success_hi = fix_translation_file(hi_file)

if success_en and success_hi:
    print("\nBoth files fixed successfully!")
else:
    print("\nSome files still have issues.")