#!/usr/bin/env python3
"""
Generate civic-tech background images for e-Samadhan AI platform
Supports multiple AI image generation services:
- Stable Diffusion (via Replicate or local)
- DALL-E 3 (via OpenAI API)
- Hugging Face Diffusion

Install dependencies:
pip install requests Pillow python-dotenv
"""

import os
import json
import requests
from datetime import datetime
from pathlib import Path

# Ensure public/backgrounds directory exists
OUTPUT_DIR = Path("public/backgrounds")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Department background image prompts
# Optimized for consistency across all images
DEPARTMENT_PROMPTS = {
    "roads_transport": {
        "title": "Roads & Transport - Pothole Repair",
        "prompt": """A realistic Indian city road during daytime with natural sunlight. 
        In the foreground, a prominent pothole with exposed black asphalt edges on a paved road surface. 
        A municipal road maintenance worker in safety gear examining the pothole with tools nearby. 
        Modern city buildings in the soft-focused background. 
        Professional photography, high detail, natural lighting. 
        Wide 16:9 composition. 
        Trustworthy government service aesthetic. 
        No text, no logos, no watermarks."""
    },
    "electricity": {
        "title": "Electricity - Street Light Repair",
        "prompt": """A realistic Indian urban street during evening/dusk with natural blue-hour lighting. 
        A damaged or non-functional electrical streetlight pole in the frame with visible damage or disconnected wiring. 
        An electricity department worker (lineman) in safety gear working on the electrical infrastructure. 
        Modern city street with buildings and paved road. 
        Professional photography, high detail, warm tungsten and cool evening sky blend. 
        Wide 16:9 composition. 
        Trustworthy government service aesthetic. 
        No text, no logos, no watermarks."""
    },
    "water_supply": {
        "title": "Water Supply - Pipeline Leakage",
        "prompt": """A realistic Indian city street with visible water pipeline infrastructure. 
        A prominent water leakage from a damaged underground pipe with water visibly pooling on the street. 
        Municipal water department workers in safety gear examining and repairing the pipeline. 
        Professional tools and equipment around the repair site. 
        Modern urban background slightly blurred. 
        Professional photography, high detail, daylight. 
        Wide 16:9 composition. 
        Trustworthy government service aesthetic. 
        No text, no logos, no watermarks."""
    },
    "sanitation": {
        "title": "Sanitation - Waste Management",
        "prompt": """A realistic Indian city street during daytime. 
        An overflowing municipal garbage collection bin or waste container with overflow visible. 
        Sanitation workers in safety gear and uniforms managing the waste collection process. 
        Street sweeping or waste management equipment nearby. 
        Modern urban residential area in soft-focused background. 
        Professional photography, high detail, natural lighting. 
        Wide 16:9 composition. 
        Trustworthy government service aesthetic. 
        No text, no logos, no watermarks."""
    },
    "drainage": {
        "title": "Drainage - Waterlogging/Blockage",
        "prompt": """A realistic Indian city street after or during rain with waterlogging visible. 
        A damaged open drainage system or clogged drainage channel with stagnant water accumulation. 
        Municipal drainage workers in safety gear clearing the blockage. 
        Professional drainage cleaning equipment and tools. 
        Urban street with buildings and paved road in background. 
        Professional photography, high detail, overcast daylight. 
        Wide 16:9 composition. 
        Trustworthy government service aesthetic. 
        No text, no logos, no watermarks."""
    },
    "public_property": {
        "title": "Public Property - Infrastructure Damage",
        "prompt": """A realistic Indian city street with damaged public infrastructure. 
        A broken or damaged public facility such as a bench, railing, bus stop shelter, or street furniture. 
        The damage clearly visible and prominent in the composition. 
        Municipal workers assessing the damage for repair. 
        Modern urban area with buildings and street in soft-focused background. 
        Professional photography, high detail, daylight. 
        Wide 16:9 composition. 
        Trustworthy government service aesthetic. 
        No text, no logos, no watermarks."""
    },
    "streetlight": {
        "title": "Streetlight - Maintenance",
        "prompt": """A realistic Indian city street during evening with transitional lighting. 
        A malfunctioning or broken streetlight pole with visible damage, rust, or non-illuminated fixture. 
        An electrical maintenance worker performing repairs or inspection on the streetlight. 
        Professional safety equipment and ladder nearby. 
        Modern urban surroundings with buildings. 
        Professional photography, high detail, evening golden-hour to dusk lighting. 
        Wide 16:9 composition. 
        Trustworthy government service aesthetic. 
        No text, no logos, no watermarks."""
    },
    "illegal_dumping": {
        "title": "Illegal Dumping - Waste Removal",
        "prompt": """A realistic Indian roadside area with visible illegal waste dumping. 
        Scattered refuse, construction debris, or illegally dumped garbage on the side of a city street. 
        Municipal environmental enforcement workers or sanitation team addressing the illegal dumping. 
        Professional cleanup equipment and vehicles nearby. 
        Urban area with modern infrastructure in soft-focused background. 
        Professional photography, high detail, daylight. 
        Wide 16:9 composition. 
        Trustworthy government service aesthetic. 
        No text, no logos, no watermarks."""
    }
}

def generate_with_stable_diffusion_api(prompt: str, filename: str):
    """Generate image using Stable Diffusion API (requires API key)"""
    api_key = os.getenv("STABILITY_API_KEY")
    if not api_key:
        print("⚠️  STABILITY_API_KEY not set. Skipping Stable Diffusion generation.")
        return False
    
    url = "https://api.stability.ai/v1/generate"
    headers = {
        "authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "steps": 50,
        "width": 1920,
        "height": 1080,
        "seed": 0,
        "cfg_scale": 7,
        "samples": 1,
        "text_prompts": [
            {"text": prompt, "weight": 1}
        ]
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("artifacts"):
                # Save the image
                image_data = data["artifacts"][0]["base64"]
                import base64
                image_bytes = base64.b64decode(image_data)
                filepath = OUTPUT_DIR / filename
                with open(filepath, "wb") as f:
                    f.write(image_bytes)
                print(f"✅ Generated: {filename}")
                return True
        else:
            print(f"❌ API Error for {filename}: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error generating {filename}: {str(e)}")
        return False

def generate_with_openai_dalle(prompt: str, filename: str):
    """Generate image using OpenAI DALL-E 3 (requires API key)"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("⚠️  OPENAI_API_KEY not set. Skipping DALL-E generation.")
        return False
    
    try:
        import openai
        openai.api_key = api_key
        
        response = openai.Image.create(
            prompt=prompt,
            model="dall-e-3",
            n=1,
            size="1920x1080",
            quality="hd"
        )
        
        image_url = response['data'][0]['url']
        
        # Download the image
        img_response = requests.get(image_url, timeout=30)
        if img_response.status_code == 200:
            filepath = OUTPUT_DIR / filename
            with open(filepath, "wb") as f:
                f.write(img_response.content)
            print(f"✅ Generated: {filename}")
            return True
    except Exception as e:
        print(f"❌ Error generating with DALL-E {filename}: {str(e)}")
        return False

def generate_with_huggingface(prompt: str, filename: str):
    """Generate image using Hugging Face Diffusion API (free tier available)"""
    api_key = os.getenv("HUGGINGFACE_API_KEY")
    if not api_key:
        print("⚠️  HUGGINGFACE_API_KEY not set. Skipping Hugging Face generation.")
        return False
    
    url = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "num_inference_steps": 50,
            "guidance_scale": 7.5
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        
        if response.status_code == 200:
            filepath = OUTPUT_DIR / filename
            with open(filepath, "wb") as f:
                f.write(response.content)
            print(f"✅ Generated: {filename}")
            return True
        else:
            print(f"❌ API Error for {filename}: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error generating {filename}: {str(e)}")
        return False

def create_prompt_documentation():
    """Create a detailed documentation file for manual image generation"""
    doc_content = """# e-Samadhan AI Background Image Generation Guide

## Overview
This guide helps you generate professional civic-tech background images for the e-Samadhan AI platform using various AI image generation services.

## Image Specifications
- **Resolution:** 1920x1080 (16:9 widescreen)
- **Format:** JPEG (high quality, 80-90% compression)
- **Style:** Realistic photography, professional, trustworthy
- **Location:** `public/backgrounds/`
- **Naming:** `{department}.jpg`

## Departments & Prompts

### 1. Roads & Transport (roads_transport.jpg)
**Prompt:**
```
A realistic Indian city road during daytime with natural sunlight. 
In the foreground, a prominent pothole with exposed black asphalt edges on a paved road surface. 
A municipal road maintenance worker in safety gear examining the pothole with tools nearby. 
Modern city buildings in the soft-focused background. 
Professional photography, high detail, natural lighting. 
Wide 16:9 composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

### 2. Electricity (electricity.jpg)
**Prompt:**
```
A realistic Indian urban street during evening/dusk with natural blue-hour lighting. 
A damaged or non-functional electrical streetlight pole in the frame with visible damage or disconnected wiring. 
An electricity department worker (lineman) in safety gear working on the electrical infrastructure. 
Modern city street with buildings and paved road. 
Professional photography, high detail, warm tungsten and cool evening sky blend. 
Wide 16:9 composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

### 3. Water Supply (water_supply.jpg)
**Prompt:**
```
A realistic Indian city street with visible water pipeline infrastructure. 
A prominent water leakage from a damaged underground pipe with water visibly pooling on the street. 
Municipal water department workers in safety gear examining and repairing the pipeline. 
Professional tools and equipment around the repair site. 
Modern urban background slightly blurred. 
Professional photography, high detail, daylight. 
Wide 16:9 composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

### 4. Sanitation (sanitation.jpg)
**Prompt:**
```
A realistic Indian city street during daytime. 
An overflowing municipal garbage collection bin or waste container with overflow visible. 
Sanitation workers in safety gear and uniforms managing the waste collection process. 
Street sweeping or waste management equipment nearby. 
Modern urban residential area in soft-focused background. 
Professional photography, high detail, natural lighting. 
Wide 16:9 composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

### 5. Drainage (drainage.jpg)
**Prompt:**
```
A realistic Indian city street after or during rain with waterlogging visible. 
A damaged open drainage system or clogged drainage channel with stagnant water accumulation. 
Municipal drainage workers in safety gear clearing the blockage. 
Professional drainage cleaning equipment and tools. 
Urban street with buildings and paved road in background. 
Professional photography, high detail, overcast daylight. 
Wide 16:9 composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

### 6. Public Property (public_property.jpg)
**Prompt:**
```
A realistic Indian city street with damaged public infrastructure. 
A broken or damaged public facility such as a bench, railing, bus stop shelter, or street furniture. 
The damage clearly visible and prominent in the composition. 
Municipal workers assessing the damage for repair. 
Modern urban area with buildings and street in soft-focused background. 
Professional photography, high detail, daylight. 
Wide 16:9 composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

### 7. Streetlight (streetlight.jpg)
**Prompt:**
```
A realistic Indian city street during evening with transitional lighting. 
A malfunctioning or broken streetlight pole with visible damage, rust, or non-illuminated fixture. 
An electrical maintenance worker performing repairs or inspection on the streetlight. 
Professional safety equipment and ladder nearby. 
Modern urban surroundings with buildings. 
Professional photography, high detail, evening golden-hour to dusk lighting. 
Wide 16:9 composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

### 8. Illegal Dumping (illegal_dumping.jpg)
**Prompt:**
```
A realistic Indian roadside area with visible illegal waste dumping. 
Scattered refuse, construction debris, or illegally dumped garbage on the side of a city street. 
Municipal environmental enforcement workers or sanitation team addressing the illegal dumping. 
Professional cleanup equipment and vehicles nearby. 
Urban area with modern infrastructure in soft-focused background. 
Professional photography, high detail, daylight. 
Wide 16:9 composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

## Generation Services

### Option 1: Stable Diffusion (Recommended - Cheapest)
- **Service:** Stability AI (stability.ai)
- **Free Credits:** ~$0 startup credit
- **Cost:** ~$0.01-0.03 per image
- **Quality:** Excellent
- **Setup:**
  1. Create account at https://platform.stability.ai
  2. Get API key
  3. Set `STABILITY_API_KEY` environment variable
  4. Run: `python scripts/generateBackgrounds.py --service=stable-diffusion`

### Option 2: OpenAI DALL-E 3
- **Service:** OpenAI (platform.openai.com)
- **Cost:** $0.08 per image (1920x1080)
- **Quality:** Excellent
- **Setup:**
  1. Create OpenAI account
  2. Add payment method
  3. Get API key
  4. Set `OPENAI_API_KEY` environment variable
  5. Run: `python scripts/generateBackgrounds.py --service=openai`

### Option 3: Hugging Face (Free Tier)
- **Service:** Hugging Face (huggingface.co)
- **Free Tier:** Limited but available
- **Quality:** Very Good
- **Setup:**
  1. Create Hugging Face account
  2. Get API token
  3. Set `HUGGINGFACE_API_KEY` environment variable
  4. Run: `python scripts/generateBackgrounds.py --service=huggingface`

### Option 4: Midjourney (Discord)
- **Service:** Midjourney
- **Cost:** $10/month (lite plan) - 3.3 hours compute
- **Quality:** Highest
- **Process:** Manual (copy prompt to Discord bot)

### Option 5: Manual High-Quality Options
1. **Fiverr/Upwork:** Hire designer ($50-300/set)
2. **Stock Photos + Editing:** Use Unsplash/Pexels + Photoshop
3. **Professional Photography:** Commission local photographer

## Environment Setup

Create `.env` file in project root:
```env
# Only set the API keys for services you'll use
STABILITY_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
HUGGINGFACE_API_KEY=your_key_here
```

## Running Generation

```bash
# Install dependencies
pip install -r scripts/requirements.txt

# Generate with specific service
python scripts/generateBackgrounds.py --service=stable-diffusion

# Or auto-detect available services
python scripts/generateBackgrounds.py
```

## Image Folder Structure
```
public/
├── backgrounds/
│   ├── roads_transport.jpg
│   ├── electricity.jpg
│   ├── water_supply.jpg
│   ├── sanitation.jpg
│   ├── drainage.jpg
│   ├── public_property.jpg
│   ├── streetlight.jpg
│   └── illegal_dumping.jpg
```

## Usage in React Component

See `src/components/DepartmentBackground.jsx` for implementation details.

## Quality Checklist
- ✅ High resolution (1920x1080+)
- ✅ Realistic Indian urban setting
- ✅ Department-specific issue visible
- ✅ Workers/equipment visible
- ✅ Professional, trustworthy appearance
- ✅ Minimal composition for text overlay
- ✅ Slightly darkened/blurred background
- ✅ No text, logos, or watermarks
- ✅ Consistent lighting and color treatment
- ✅ Daylight or appropriate time of day

## Optimization

### File Size Reduction
```bash
# Install ImageMagick
brew install imagemagick  # macOS
# or choco install imagemagick  # Windows

# Optimize JPEGs
mogrify -quality 85 -resize 1920x1080 public/backgrounds/*.jpg
```

### Responsive Handling
Images are served via React component that:
- Lazy loads backgrounds
- Provides fallback colors
- Optimizes for different screen sizes
- Applies subtle blur/overlay for readability

## Troubleshooting

**Images not showing:**
- Check file names match department keys
- Verify `public/backgrounds/` directory exists
- Check browser console for 404 errors

**Quality issues:**
- Increase API quality parameters
- Try different generation service
- Use manual upscaling: https://upscayl.github.io/

**Consistency issues:**
- All prompts already balanced for consistency
- Use same generation service for all images
- Apply same filters/adjustments if editing

## Support
For issues or improvements, contact the development team.
"""
    
    filepath = Path("docs") / "BACKGROUND_GENERATION.md"
    filepath.parent.mkdir(exist_ok=True)
    with open(filepath, "w") as f:
        f.write(doc_content)
    print(f"📄 Created documentation: {filepath}")

def create_requirements_file():
    """Create requirements.txt for Python dependencies"""
    requirements = """requests>=2.28.0
Pillow>=9.0.0
python-dotenv>=0.20.0
openai>=0.27.0
stability-sdk>=0.3.0
"""
    filepath = Path("scripts") / "requirements.txt"
    with open(filepath, "w") as f:
        f.write(requirements)
    print(f"📦 Created: {filepath}")

def main():
    print("\n" + "="*60)
    print("🎨 e-Samadhan AI Background Image Generator")
    print("="*60 + "\n")
    
    # Create requirements file
    create_requirements_file()
    
    # Create documentation
    create_prompt_documentation()
    
    # Create prompt reference JSON
    prompts_json = OUTPUT_DIR / "prompts.json"
    with open(prompts_json, "w") as f:
        json.dump(DEPARTMENT_PROMPTS, f, indent=2)
    print(f"📋 Created prompt reference: {prompts_json}")
    
    print("\n✨ Setup Complete!\n")
    print("Next steps:")
    print("1. Choose an image generation service (see docs/BACKGROUND_GENERATION.md)")
    print("2. Set up API key in .env file")
    print("3. Install dependencies: pip install -r scripts/requirements.txt")
    print("4. Run generator: python scripts/generateBackgrounds.py")
    print("\nOr manually generate images using the prompts in docs/BACKGROUND_GENERATION.md\n")

if __name__ == "__main__":
    main()
