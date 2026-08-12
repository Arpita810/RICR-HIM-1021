import json
import os

def fix_file_simple(file_path):
    print(f"Fixing {file_path}")
    
    # Read the entire file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # The issue is: after "voiceComplaint": {...} there's }} instead of just }
    # And then "chatbot": {...} is outside
    
    # Find the position of "voiceComplaint"
    voice_start = content.find('"voiceComplaint": {')
    if voice_start == -1:
        print("Could not find voiceComplaint")
        return False
    
    # Find the closing brace for voiceComplaint
    brace_count = 0
    in_string = False
    escape = False
    voice_end = -1
    
    for i in range(voice_start, len(content)):
        char = content[i]
        
        if escape:
            escape = False
            continue
            
        if char == '\\':
            escape = True
            continue
            
        if char == '"' and not escape:
            in_string = not in_string
            continue
            
        if not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    voice_end = i
                    break
    
    if voice_end == -1:
        print("Could not find end of voiceComplaint")
        return False
    
    # Now check what comes after voice_end
    # It should be either , or } (if it's the last object)
    # But we know there's "chatbot" after
    
    # Look for "chatbot": { after voice_end
    chatbot_start = content.find('"chatbot": {', voice_end)
    if chatbot_start == -1:
        print("Could not find chatbot after voiceComplaint")
        return False
    
    # The text between voice_end and chatbot_start should be just whitespace and maybe },
    between = content[voice_end+1:chatbot_start].strip()
    print(f"Between voiceComplaint and chatbot: '{between}'")
    
    # If it's "}," that's wrong - should be just ","
    # If it's "}}," that's also wrong - should be just ","
    
    # Simple fix: replace any number of } followed by , with just ,
    import re
    fixed_content = re.sub(r'\s*}\s*,?\s*"chatbot": {', ', "chatbot": {', content[voice_end:])
    fixed_content = content[:voice_end] + fixed_content
    
    # Write the fixed content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    # Validate
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"✓ {file_path} fixed successfully")
        return True
    except json.JSONDecodeError as e:
        print(f"✗ {file_path} error: {e}")
        return False

# Fix files
en_file = r"src\i18n\locales\en\translation.json"
hi_file = r"src\i18n\locales\hi\translation.json"

print("Fixing English...")
fix_file_simple(en_file)
print("\nFixing Hindi...")
fix_file_simple(hi_file)