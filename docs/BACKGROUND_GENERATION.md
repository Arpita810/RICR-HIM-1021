# Background Image Generation Guide for e-Samadhan AI

## Quick Start

### Step 1: Choose Your Generation Service

| Service | Cost | Quality | Speed | Ease |
|---------|------|---------|-------|------|
| **Stable Diffusion** | $0.01-0.03/img | ⭐⭐⭐⭐ | ~60s | ⭐⭐⭐ |
| **DALL-E 3** | $0.08/img | ⭐⭐⭐⭐⭐ | ~3min | ⭐⭐⭐⭐ |
| **Midjourney** | $10/mo | ⭐⭐⭐⭐⭐ | ~60s | ⭐⭐ |
| **Professional Photo** | $500-2000 | ⭐⭐⭐⭐⭐ | 1-2wks | ⭐ |

### Step 2: Get API Keys

**Stable Diffusion (Recommended):**
1. Visit https://stability.ai
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Copy key to `.env`: `STABILITY_API_KEY=sk-...`

**DALL-E 3:**
1. Visit https://platform.openai.com
2. Create account + add payment method
3. Go to API keys
4. Copy key to `.env`: `OPENAI_API_KEY=sk-...`

**Midjourney:**
1. Join Discord: https://discord.gg/midjourney
2. Subscribe via `/subscribe`
3. Use `/imagine` command with prompts

### Step 3: Run Generation

**Automated (Python):**
```bash
pip install -r scripts/requirements.txt
python scripts/generateBackgrounds.py --service=stable-diffusion
```

**Manual (Web UI):**
- Copy prompt below into web UI
- Generate image
- Save to `public/backgrounds/{department}.jpg`

---

## Image Generation Prompts

### All departments optimized for consistency

**Consistency guidelines applied to all:**
- ✅ Similar camera angle (medium distance, slight elevated)
- ✅ Similar time of day (natural daylight or appropriate)
- ✅ Similar lighting quality (clear, professional)
- ✅ Similar subject placement (left/center composition)
- ✅ Similar urban context (modern Indian city)
- ✅ Similar worker presence (safety gear visible)
- ✅ Similar color tone (natural, warm-neutral)
- ✅ Similar blur depth (medium)
- ✅ Similar image quality (high detail, professional)

---

## 1. Roads & Transport - Pothole Repair

**Service:** Stable Diffusion, DALL-E 3, or Midjourney

**Primary Prompt:**
```
A realistic Indian city road during daytime with natural sunlight. 
In the foreground, a prominent pothole with exposed black asphalt edges on a paved road surface, showing visible crumbling and damage. 
A municipal road maintenance worker in orange safety vest and hardhat examining the pothole with measuring tools and marking tape nearby. 
Modern apartment buildings and city traffic lights visible in the soft-focused background. 
Professional photography style, shot from 3 meters distance at slight angle. 
High detail, sharp focus on pothole and worker. 
Natural daylight, warm color temperature. 
16:9 widescreen composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

**Shorter Version (if long prompts fail):**
```
Indian city street with large pothole, road worker in safety gear examining it, 
apartment buildings background, professional photography, daylight, 16:9, no text.
```

**Image Specs:**
- Size: 1920x1080
- Quality: 85%
- Filename: `roads_transport.jpg`

---

## 2. Electricity - Street Light Repair

**Service:** Stable Diffusion, DALL-E 3, or Midjourney

**Primary Prompt:**
```
A realistic Indian urban street during evening transition with blue-hour lighting. 
A damaged electrical streetlight pole in the frame with visible rust, broken fixture, and exposed wiring. 
An electricity department lineman in orange safety gear, hardhat, and harness working on the electrical infrastructure with tools. 
Professional electrical repair equipment and ladder positioned nearby. 
Modern shop fronts and city buildings in the soft-focused background. 
Professional photography style, shot from 4 meters distance. 
High detail, warm tungsten bulbs and cool evening sky color blend. 
Dusk lighting, natural color. 
16:9 widescreen composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

**Shorter Version:**
```
Indian city street at dusk with broken streetlight, electrical worker in safety gear repairing it, 
buildings background, professional photography, evening lighting, 16:9, no text.
```

**Image Specs:**
- Size: 1920x1080
- Quality: 85%
- Filename: `electricity.jpg`

---

## 3. Water Supply - Pipeline Leakage

**Service:** Stable Diffusion, DALL-E 3, or Midjourney

**Primary Prompt:**
```
A realistic Indian city street with visible water pipeline infrastructure damage. 
A prominent water leakage from a burst underground pipe with water visibly spurting and pooling on the street surface. 
Two municipal water department workers in yellow safety vests and helmets examining the leak with pressure gauges and repair equipment. 
Professional tools, stop valve, and metal grating visible around the active repair site. 
Modern urban buildings and paved street in the soft-focused background. 
Professional photography style, shot from 2.5 meters distance. 
High detail, water spray clearly visible catching sunlight. 
Bright daylight, natural color temperature. 
16:9 widescreen composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

**Shorter Version:**
```
Indian city street with water pipeline leak, water workers in safety gear repairing, 
tools and equipment visible, urban background, professional photography, daylight, 16:9, no text.
```

**Image Specs:**
- Size: 1920x1080
- Quality: 85%
- Filename: `water_supply.jpg`

---

## 4. Sanitation - Waste Management

**Service:** Stable Diffusion, DALL-E 3, or Midjourney

**Primary Prompt:**
```
A realistic Indian city street during daytime with natural sunlight. 
An overflowing municipal garbage collection bin with trash and waste visible on top and around it. 
Municipal sanitation workers in green uniforms and yellow safety gear managing the waste collection. 
Mechanical waste collection truck or street sweeping equipment parked nearby. 
Residential buildings and modern urban street in the soft-focused background. 
Professional photography style, shot from 3 meters distance. 
High detail, clear detail of waste and workers. 
Bright daylight, slightly warm color tone. 
16:9 widescreen composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

**Shorter Version:**
```
Indian city street with overflowing garbage bin, sanitation workers in uniforms collecting waste, 
urban background, professional photography, daylight, 16:9, no text.
```

**Image Specs:**
- Size: 1920x1080
- Quality: 85%
- Filename: `sanitation.jpg`

---

## 5. Drainage - Waterlogging & Blockage

**Service:** Stable Diffusion, DALL-E 3, or Midjourney

**Primary Prompt:**
```
A realistic Indian city street after rain with visible waterlogging and stagnant water accumulation. 
A damaged open drainage system or clogged drainage channel clearly visible with water pooling. 
Municipal drainage workers in blue safety vests and helmets clearing the blockage with suction equipment and tools. 
Professional drainage cleaning vehicle and equipment positioned at the site. 
Urban street with buildings and wet pavement in the soft-focused background. 
Professional photography style, shot from 3 meters distance. 
High detail, water reflection and drainage work clearly visible. 
Overcast daylight (post-rain atmosphere), cool color tone. 
16:9 widescreen composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

**Shorter Version:**
```
Indian city street with waterlogging and drainage blockage, workers clearing it, 
drainage equipment visible, post-rain urban scene, professional photography, 16:9, no text.
```

**Image Specs:**
- Size: 1920x1080
- Quality: 85%
- Filename: `drainage.jpg`

---

## 6. Public Property - Infrastructure Damage

**Service:** Stable Diffusion, DALL-E 3, or Midjourney

**Primary Prompt:**
```
A realistic Indian city street with damaged public infrastructure. 
A broken or damaged public facility such as a corroded metal bench, broken railing, or damaged bus stop shelter frame. 
The damage prominently visible with rust, cracks, or structural deformation. 
Municipal workers in safety gear assessing the damage and preparing repair plans. 
Modern urban surroundings with paved street and buildings in the soft-focused background. 
Professional photography style, shot from 2.5 meters distance. 
High detail, damage clearly visible and documented. 
Natural daylight, warm color tone. 
16:9 widescreen composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

**Shorter Version:**
```
Indian city street with broken public bench/railing, workers assessing damage, 
urban background, professional photography, daylight, 16:9, no text.
```

**Image Specs:**
- Size: 1920x1080
- Quality: 85%
- Filename: `public_property.jpg`

---

## 7. Streetlight - Evening Maintenance

**Service:** Stable Diffusion, DALL-E 3, or Midjourney

**Primary Prompt:**
```
A realistic Indian city street during evening with transitional golden-hour to dusk lighting. 
A malfunctioning streetlight pole in the frame with visible damage, rust, non-illuminated fixture, or broken bulb. 
An electrical maintenance worker in orange safety gear, hardhat, and harness performing repairs or inspection on the streetlight. 
Professional repair tools, ladder, and equipment positioned nearby. 
Modern urban surroundings with buildings and city street. 
Professional photography style, shot from 4 meters distance. 
High detail, warm evening light on worker and pole. 
Golden-hour to dusk lighting, natural warm color blend. 
16:9 widescreen composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

**Shorter Version:**
```
Indian city street at evening with broken streetlight, worker in safety gear repairing, 
ladder and tools visible, urban background, professional photography, golden hour, 16:9, no text.
```

**Image Specs:**
- Size: 1920x1080
- Quality: 85%
- Filename: `streetlight.jpg`

---

## 8. Illegal Dumping - Waste Removal

**Service:** Stable Diffusion, DALL-E 3, or Midjourney

**Primary Prompt:**
```
A realistic Indian roadside area with visible illegal waste dumping and environmental contamination. 
Scattered refuse, construction debris, plastic waste, and illegally dumped garbage accumulated on the side of a city street. 
Municipal environmental enforcement workers or sanitation team in safety gear actively addressing the illegal dumping. 
Professional cleanup equipment, waste collection containers, and vehicles positioned at the site. 
Urban residential area with modern infrastructure in the soft-focused background. 
Professional photography style, shot from 3 meters distance. 
High detail, waste accumulation and cleanup work clearly visible. 
Natural daylight, neutral to slightly warm color tone. 
16:9 widescreen composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

**Shorter Version:**
```
Indian roadside with illegal waste dumping, sanitation workers cleaning it up, 
equipment and containers visible, urban background, professional photography, daylight, 16:9, no text.
```

**Image Specs:**
- Size: 1920x1080
- Quality: 85%
- Filename: `illegal_dumping.jpg`

---

## Using Different Services

### Stable Diffusion API

```python
# Using stability.ai API
import requests
import base64

url = "https://api.stability.ai/v1/generate"
headers = {
    "authorization": f"Bearer {STABILITY_API_KEY}",
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
        {"text": PROMPT_TEXT, "weight": 1}
    ]
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

# Save image
image_data = data["artifacts"][0]["base64"]
image_bytes = base64.b64decode(image_data)
with open(f"public/backgrounds/{department}.jpg", "wb") as f:
    f.write(image_bytes)
```

### DALL-E 3 API

```python
import openai

openai.api_key = OPENAI_API_KEY

response = openai.Image.create(
    prompt=PROMPT_TEXT,
    model="dall-e-3",
    n=1,
    size="1920x1080",
    quality="hd"
)

image_url = response['data'][0]['url']

# Download and save
img_response = requests.get(image_url)
with open(f"public/backgrounds/{department}.jpg", "wb") as f:
    f.write(img_response.content)
```

### Midjourney Discord Bot

```
/imagine a realistic Indian city road during daytime with natural sunlight. 
In the foreground, a prominent pothole with exposed black asphalt edges on a paved road surface, showing visible crumbling and damage. 
A municipal road maintenance worker in orange safety vest and hardhat examining the pothole with measuring tools and marking tape nearby. 
Modern apartment buildings and city traffic lights visible in the soft-focused background. 
Professional photography style, shot from 3 meters distance at slight angle. 
High detail, sharp focus on pothole and worker. 
Natural daylight, warm color temperature. 
16:9 widescreen composition. 
Trustworthy government service aesthetic. 
No text, no logos, no watermarks.
```

---

## Quality Checklist

After generating, verify each image:

- ✅ **Resolution:** 1920x1080 (16:9 aspect ratio)
- ✅ **Format:** JPEG, 80-90% quality
- ✅ **File Size:** 300-500KB per image
- ✅ **Focus:** Sharp detail on main issue and worker
- ✅ **Background:** Slightly blurred urban context
- ✅ **Lighting:** Natural, professional, appropriate for time of day
- ✅ **Color:** Consistent tone across all departments
- ✅ **Style:** Realistic photography, not overly artistic
- ✅ **Content:** Issue clearly visible, worker present, no text
- ✅ **Mood:** Trustworthy, professional, action-oriented
- ✅ **Composition:** 16:9 wide format, suitable for form overlay

---

## Common Issues & Solutions

### Issue: Generated image is too bright/dark
**Solution:**
- Add to prompt: "properly exposed photograph" or "professional lighting"
- Regenerate with different service
- Edit manually: Curves adjustment in Photoshop

### Issue: Image doesn't look Indian
**Solution:**
- Add to prompt: "Indian urban environment" or "New Delhi/Mumbai style street"
- Show example images to AI service
- Use professional photographer

### Issue: Image quality is low/pixelated
**Solution:**
- Increase quality setting (85-90%)
- Check resolution is 1920x1080
- Try different generation service (DALL-E 3 typically best quality)

### Issue: Text appears in image
**Solution:**
- Add to prompt: "absolutely no text, no labels, no signs with text"
- Regenerate
- If necessary, remove with Inpaint feature

### Issue: Worker/equipment not visible
**Solution:**
- Add to prompt: "worker clearly visible in frame" or "equipment prominently featured"
- Adjust crop/composition
- Try again with different seed/parameters

---

## Optimization Tips

1. **Start with lower quality:** Generate at 85% quality first, upgrade if needed
2. **Use consistent seeds:** If satisfied with one style, keep seed for similar ones
3. **Batch similar prompts:** Do all "worker in safety gear" images in one batch
4. **Review first:** Always review before saving to final location
5. **Keep originals:** Save high-res versions, compress for web separately

---

## Cost Estimation

**Total cost for 8 images:**

| Service | Per Image | Total |
|---------|-----------|-------|
| Stable Diffusion | $0.02 | $0.16 |
| DALL-E 3 | $0.08 | $0.64 |
| Midjourney | $3/hr equiv | $8-10 |
| Professional | $60-250 | $480-2000 |

**Recommendation:** Use Stable Diffusion for cost-effectiveness, DALL-E 3 for best quality.

---

## Next Steps

1. Choose service and set up API
2. Run `python scripts/generateBackgrounds.py` or generate manually
3. Save images to `public/backgrounds/`
4. Test in React component
5. Fine-tune blur/darkening if needed
6. Deploy to production

---

For support or image regeneration, refer to main documentation.
