import json
import os

def validate_json_file(file_path):
    print(f"Validating {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✓ {file_path} is valid JSON")
        return True
    except json.JSONDecodeError as e:
        print(f"✗ {file_path} has JSON error: {e}")
        print(f"  Error at line {e.lineno}, column {e.colno}")
        
        # Show context around the error
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        start_line = max(0, e.lineno - 3)
        end_line = min(len(lines), e.lineno + 2)
        
        print(f"  Context around line {e.lineno}:")
        for i in range(start_line, end_line):
            print(f"  {i+1}: {lines[i].rstrip()}")
        
        return False

# Validate both files
en_file = r"src\i18n\locales\en\translation.json"
hi_file = r"src\i18n\locales\hi\translation.json"

print("Validating English file...")
en_valid = validate_json_file(en_file)
print("\nValidating Hindi file...")
hi_valid = validate_json_file(hi_file)

if en_valid and hi_valid:
    print("\n✅ Both files are valid JSON!")
else:
    print("\n❌ Some files have JSON errors.")