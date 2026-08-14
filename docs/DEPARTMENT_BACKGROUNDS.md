# e-Samadhan AI Civic-Tech Background Images

## Overview

Professional, realistic civic-tech background images for the e-Samadhan AI Smart City Issue Reporting Platform. Each department (Roads, Electricity, Water, etc.) has a corresponding background image that visually contextualizes the complaint being filed.

**Key Characteristics:**
- ✅ Realistic Indian urban environments
- ✅ Department-specific civic issues
- ✅ Professional, trustworthy aesthetic
- ✅ Consistent visual style across all departments
- ✅ Optimized for form overlay text readability
- ✅ No text, logos, or watermarks
- ✅ Wide 16:9 aspect ratio (1920x1080)
- ✅ High-quality JPEG format (~300-500KB per image)

---

## Department Backgrounds

### 1. 🚗 Roads & Transport
**Filename:** `roads_transport.jpg`  
**Visual:** Indian city road with prominent pothole, exposed asphalt, municipal workers examining the damage with tools  
**Lighting:** Natural daylight  
**Mood:** Urgent but manageable  
**Use Case:** Pothole complaints, road damage, street repair issues

### 2. ⚡ Electricity
**Filename:** `electricity.jpg`  
**Visual:** Urban street at dusk, damaged/non-functional streetlight pole, lineman in safety gear working on electrical infrastructure  
**Lighting:** Blue-hour transition, warm tungsten + cool evening sky  
**Mood:** Professional technical environment  
**Use Case:** Streetlight outages, electrical infrastructure damage, power line issues

### 3. 💧 Water Supply
**Filename:** `water_supply.jpg`  
**Visual:** City street with visible water pipeline, active leakage pooling on street, water department workers repairing  
**Lighting:** Natural daylight  
**Mood:** Urgent but controlled response  
**Use Case:** Water leaks, pipeline damage, water supply issues

### 4. 🗑️ Sanitation
**Filename:** `sanitation.jpg`  
**Visual:** Urban street, overflowing municipal garbage bin, sanitation workers in uniforms managing waste collection  
**Lighting:** Natural daylight  
**Mood:** Active public health response  
**Use Case:** Garbage overflow, waste management, cleanliness complaints

### 5. 🌊 Drainage
**Filename:** `drainage.jpg`  
**Visual:** City street with waterlogging visible, damaged/clogged drainage, workers clearing blockage  
**Lighting:** Overcast daylight (post-rain atmosphere)  
**Mood:** Active remediation  
**Use Case:** Waterlogging, drainage blockages, flooding complaints

### 6. 🏗️ Public Property
**Filename:** `public_property.jpg`  
**Visual:** Urban street with damaged public infrastructure (broken bench, railing, bus stop shelter), workers assessing  
**Lighting:** Natural daylight  
**Mood:** Maintenance and care  
**Use Case:** Broken public facilities, infrastructure damage

### 7. 💡 Streetlight
**Filename:** `streetlight.jpg`  
**Visual:** Evening street, malfunctioning streetlight pole with visible damage/rust, maintenance worker performing repairs  
**Lighting:** Golden-hour to dusk transition  
**Mood:** Evening urban maintenance  
**Use Case:** Non-functional streetlights, lighting maintenance

### 8. 🚫 Illegal Dumping
**Filename:** `illegal_dumping.jpg`  
**Visual:** Urban roadside area, scattered refuse and illegal waste, enforcement/sanitation team addressing the issue  
**Lighting:** Natural daylight  
**Mood:** Environmental cleanup action  
**Use Case:** Illegal dumping, unauthorized waste disposal

---

## File Structure

```
public/
├── backgrounds/
│   ├── roads_transport.jpg          (1920x1080, ~350KB)
│   ├── electricity.jpg              (1920x1080, ~350KB)
│   ├── water_supply.jpg             (1920x1080, ~350KB)
│   ├── sanitation.jpg               (1920x1080, ~350KB)
│   ├── drainage.jpg                 (1920x1080, ~350KB)
│   ├── public_property.jpg          (1920x1080, ~350KB)
│   ├── streetlight.jpg              (1920x1080, ~350KB)
│   └── illegal_dumping.jpg          (1920x1080, ~350KB)
```

---

## React Component Usage

### Basic Background Display

```jsx
import DepartmentBackground from '@/components/DepartmentBackground';

export default function ComplaintForm() {
  const [department, setDepartment] = useState('roads_transport');

  return (
    <DepartmentBackground
      department={department}
      blur="md"
      darkening="40"
      height="h-96"
    >
      {/* Your form content goes here */}
      <div className="flex items-center justify-center h-full">
        <form>
          {/* Form fields */}
        </form>
      </div>
    </DepartmentBackground>
  );
}
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `department` | string | `'roads_transport'` | Department key (see above) |
| `blur` | string | `'md'` | Blur intensity: `none`, `sm`, `md`, `lg`, `xl` |
| `darkening` | string | `'40'` | Overlay opacity (0-100) |
| `height` | string | `'h-96'` | Tailwind height class |
| `overlay` | boolean | `true` | Show dark overlay for readability |
| `animated` | boolean | `true` | Fade-in animation |
| `children` | JSX | - | Content to overlay on background |

### Standalone Image Component

```jsx
import { DepartmentBackgroundImage } from '@/components/DepartmentBackground';

export default function DashboardCard() {
  return (
    <DepartmentBackgroundImage
      department="electricity"
      height="h-64"
      blur="sm"
      darkening="30"
    />
  );
}
```

### Dynamic Department Selection

```jsx
import DepartmentBackground from '@/components/DepartmentBackground';

export default function ComplaintForm() {
  const [selectedDept, setSelectedDept] = useState('roads_transport');

  const departments = [
    { value: 'roads_transport', label: '🚗 Roads & Transport' },
    { value: 'electricity', label: '⚡ Electricity' },
    { value: 'water_supply', label: '💧 Water Supply' },
    { value: 'sanitation', label: '🗑️ Sanitation' },
    { value: 'drainage', label: '🌊 Drainage' },
    { value: 'public_property', label: '🏗️ Public Property' },
    { value: 'streetlight', label: '💡 Streetlight' },
    { value: 'illegal_dumping', label: '🚫 Illegal Dumping' },
  ];

  return (
    <>
      <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
        {departments.map((dept) => (
          <option key={dept.value} value={dept.value}>
            {dept.label}
          </option>
        ))}
      </select>

      <DepartmentBackground department={selectedDept}>
        {/* Form content */}
      </DepartmentBackground>
    </>
  );
}
```

---

## Image Generation

### Automated Generation Script

1. **Install Python dependencies:**
   ```bash
   pip install -r scripts/requirements.txt
   ```

2. **Set up API credentials:**
   Create `.env` file with one of:
   ```env
   STABILITY_API_KEY=your_key          # Stable Diffusion
   OPENAI_API_KEY=your_key              # DALL-E 3
   HUGGINGFACE_API_KEY=your_key         # Hugging Face
   ```

3. **Run generator:**
   ```bash
   python scripts/generateBackgrounds.py
   ```

### Manual Generation Services

#### Option 1: Stable Diffusion (Recommended - Cheapest)
- **Cost:** ~$0.01-0.03 per image
- **Service:** https://stability.ai
- **Quality:** Excellent
- **Speed:** ~30-60 seconds per image

#### Option 2: DALL-E 3 (Best Quality)
- **Cost:** $0.08 per image
- **Service:** https://openai.com/dall-e-3
- **Quality:** Highest
- **Speed:** ~2-5 minutes per image

#### Option 3: Midjourney (Premium)
- **Cost:** $10/month (3.3 hours compute)
- **Service:** https://midjourney.com
- **Quality:** Exceptional
- **Speed:** ~1 minute per image

#### Option 4: Professional Photography
- **Cost:** $500-2000 for full set
- **Best:** Hire local photographer for authentic Indian cities
- **Quality:** Authentic, no AI artifacts
- **Speed:** 1-2 weeks

---

## Customization & Editing

### Adjust Blur Amount

```jsx
// Slight blur (readable text)
<DepartmentBackground blur="sm" />

// Medium blur (good balance)
<DepartmentBackground blur="md" />

// Heavy blur (minimal visual distraction)
<DepartmentBackground blur="lg" />
```

### Adjust Darkening/Overlay

```jsx
// Light overlay (30% darker)
<DepartmentBackground darkening="30" />

// Medium overlay (40% darker)
<DepartmentBackground darkening="40" />

// Dark overlay (50% darker)
<DepartmentBackground darkening="50" />
```

### Fallback Colors

If image fails to load, component displays gradient fallback:
- Roads: slate to slate
- Electricity: yellow to amber
- Water: cyan to blue
- Sanitation: emerald to green
- Drainage: slate to blue
- Public Property: purple to violet
- Streetlight: orange to yellow
- Illegal Dumping: red to orange

### Using in Different Contexts

**In complaint form:**
```jsx
<DepartmentBackground department={dept} blur="md" darkening="40">
  <ComplaintForm />
</DepartmentBackground>
```

**In dashboard card:**
```jsx
<DepartmentBackgroundImage department={dept} height="h-48" blur="sm" />
```

**In landing page hero:**
```jsx
<DepartmentBackground department="roads_transport" height="h-screen" blur="lg" />
```

---

## Performance Optimization

### Image Lazy Loading
Images are lazy-loaded by default to improve page performance:
```jsx
<img loading="lazy" src={imageUrl} />
```

### Responsive Images
Component automatically scales to container:
```jsx
className="w-full h-full object-cover"
```

### Caching Strategy
Browser caches background images automatically. Set appropriate cache headers in production:
```
Cache-Control: public, max-age=31536000, immutable
```

### File Size Optimization

**Current optimizations:**
- ✅ JPEG format (80-85% quality)
- ✅ 1920x1080 resolution
- ✅ ~300-500KB per image (~2.4MB total)
- ✅ CDN delivery ready

**Further optimization:**
```bash
# Install ImageMagick
brew install imagemagick

# Batch optimize
mogrify -quality 80 -resize 1920x1080 public/backgrounds/*.jpg
```

---

## Best Practices

### ✅ Do's

1. **Use consistent blur/darkening:**
   - Blur: `md` or `lg`
   - Darkening: `40-50`

2. **Optimize for mobile:**
   ```jsx
   <DepartmentBackground 
     height="h-64" // Smaller on mobile
     blur="lg"      // More blur for mobile readability
   />
   ```

3. **Lazy load images:**
   - Component handles this automatically
   - Images load on viewport entry

4. **Provide fallback colors:**
   - Component has built-in fallbacks
   - Displays immediately while image loads

5. **Test with actual forms:**
   - Ensure text is readable
   - Adjust darkening if needed

### ❌ Don'ts

1. **Don't add text to images:**
   - All text should be in overlay
   - Keeps images timeless

2. **Don't use bright, busy backgrounds:**
   - Keep compositions minimal
   - Form content is priority

3. **Don't ignore accessibility:**
   - Ensure sufficient contrast
   - WCAG AA standard minimum

4. **Don't skip image optimization:**
   - Keep file sizes reasonable
   - Compress properly

5. **Don't hardcode department names:**
   - Use translation keys
   - Support multi-language

---

## Troubleshooting

### Images Not Loading

**Problem:** 404 errors in console
```
GET /backgrounds/roads_transport.jpg 404
```

**Solution:**
1. Check file names are lowercase
2. Verify `public/backgrounds/` directory exists
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Rebuild: `npm run build`

### Text Not Readable

**Problem:** Form text blends with background

**Solution:**
```jsx
// Increase darkening
<DepartmentBackground darkening="50" blur="md" />

// Or increase blur
<DepartmentBackground blur="lg" darkening="40" />

// Or use white text with shadow
<div className="text-white drop-shadow-lg">
  {content}
</div>
```

### Images Look Pixelated

**Problem:** Low-quality JPEG compression

**Solution:**
1. Regenerate with higher quality (85-90%)
2. Check file size is 300-500KB
3. Verify resolution is 1920x1080

### Performance Issues

**Problem:** Slow page load with backgrounds

**Solution:**
1. Enable lazy loading (automatic)
2. Serve from CDN
3. Use WebP format for modern browsers
4. Reduce blur/animation on mobile

---

## Production Deployment

### Image Serving

**Option 1: Static Assets (Vite Default)**
```
Files served from: public/backgrounds/
URL pattern: /backgrounds/{department}.jpg
```

**Option 2: CDN (Recommended for scale)**
```
Upload to: Cloudinary, AWS S3, or similar
Update URLs in component:
const IMAGE_BASE = 'https://cdn.example.com/backgrounds/'
```

**Option 3: Image Optimization Service**
```
Use Next.js Image or Vite plugin
Automatic format conversion, resizing, caching
```

### Environment Variables

```env
# Production
VITE_BACKGROUNDS_URL=https://cdn.esamadhan.gov.in/backgrounds/

# Or keep default (Vite serves from public/)
# VITE_BACKGROUNDS_URL=/backgrounds/
```

### Monitoring

Track image load performance:
```javascript
const imageLoadTime = performance.measure('imageLoad');
console.log(`Image loaded in ${imageLoadTime.duration}ms`);
```

---

## Future Enhancements

1. **WebP Format:** Reduce file size by 30-40%
2. **Responsive Images:** Different resolutions for mobile/desktop
3. **Dark Mode Variants:** Alternative backgrounds for dark theme
4. **Video Backgrounds:** Subtle animated backgrounds
5. **Seasonal Variants:** Weather-appropriate backgrounds
6. **AI Generation API:** Real-time background generation per complaint
7. **User-Uploaded Backgrounds:** Community-submitted civic issue photos

---

## Support & Feedback

- **Issues:** Report in project GitHub issues
- **Suggestions:** Use feature request template
- **Questions:** Check this documentation first

For image regeneration or quality improvements, see `docs/BACKGROUND_GENERATION.md`.

---

**Last Updated:** January 2024  
**Status:** Production Ready  
**Version:** 1.0
