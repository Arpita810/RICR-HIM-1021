import json
import os

def fix_file(file_path):
    print(f"Fixing {file_path}")
    
    # Read the entire file
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find where the error is
    # Look for the pattern: "voiceComplaint": {...} followed by issues
    in_voice_complaint = False
    voice_complaint_end = -1
    
    for i, line in enumerate(lines):
        if '"voiceComplaint": {' in line:
            in_voice_complaint = True
        elif in_voice_complaint and line.strip() == '}':
            voice_complaint_end = i
            in_voice_complaint = False
    
    print(f"Voice complaint ends at line {voice_complaint_end}")
    
    # Now check what comes after
    if voice_complaint_end > 0 and voice_complaint_end + 1 < len(lines):
        print(f"Line after voice complaint: {lines[voice_complaint_end + 1]}")
        print(f"Next line: {lines[voice_complaint_end + 2] if voice_complaint_end + 2 < len(lines) else 'EOF'}")
    
    # The issue is that after "voiceComplaint": {...} there should be either:
    # 1. A comma and another key-value pair
    # 2. Just a closing brace for the main object
    
    # Let's try to fix by ensuring proper structure
    fixed_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check for the problematic pattern
        if i > 0 and lines[i-1].strip() == '}' and line.strip() == '},' and i+1 < len(lines) and '"chatbot": {' in lines[i+1]:
            # This is the extra } and comma before chatbot
            # Remove the extra line
            print(f"Removing extra line at {i}: {line.strip()}")
            i += 1  # Skip this line
            continue
        elif line.strip() == '}' and i+1 < len(lines) and lines[i+1].strip() == '},' and i+2 < len(lines) and '"chatbot": {' in lines[i+2]:
            # This is } followed by }, before chatbot
            print(f"Found }} followed by }}, at line {i}")
            # Replace with just ,
            fixed_lines.append('  },\n')
            i += 2  # Skip both lines
            continue
        
        fixed_lines.append(line)
        i += 1
    
    # Write the fixed file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(fixed_lines)
    
    # Try to validate
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✓ {file_path} is valid JSON")
        return True
    except json.JSONDecodeError as e:
        print(f"✗ {file_path} error: {e}")
        # Try to find where the error is
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Try to parse character by character
            for pos in range(max(0, e.pos-50), min(len(content), e.pos+50)):
                print(content[pos], end='')
        print()
        return False

# Fix files
en_file = r"src\i18n\locales\en\translation.json"
hi_file = r"src\i18n\locales\hi\translation.json"

print("Fixing English file...")
fix_file(en_file)
print("\nFixing Hindi file...")
fix_file(hi_file)