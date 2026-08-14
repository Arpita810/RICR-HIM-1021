# Quick Implementation Guide - Department Backgrounds

## 5-Minute Setup

### 1. Generate Images (Choose One)

**Option A: Automated (Recommended)**
```bash
pip install requests Pillow python-dotenv
export STABILITY_API_KEY=your_key
python scripts/generateBackgrounds.py
```

**Option B: Manual (Free)** 
- Go to stability.ai or openai.com
- Copy prompt from `docs/BACKGROUND_GENERATION.md`
- Generate image for each department
- Save to `public/backgrounds/{department}.jpg`

### 2. Directory Structure
```
public/
└── backgrounds/
    ├── roads_transport.jpg
    ├── electricity.jpg
    ├── water_supply.jpg
    ├── sanitation.jpg
    ├── drainage.jpg
    ├── public_property.jpg
    ├── streetlight.jpg
    └── illegal_dumping.jpg
```

### 3. Use in Your Component

```jsx
import DepartmentBackground from '@/components/DepartmentBackground';

export default function ComplaintForm() {
  const [dept, setDept] = useState('roads_transport');

  return (
    <DepartmentBackground department={dept} blur="md" darkening="40">
      <div className="flex items-center justify-center h-full">
        <form className="bg-white/95 p-8 rounded-2xl">
          <select value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="roads_transport">🚗 Roads & Transport</option>
            <option value="electricity">⚡ Electricity</option>
            <option value="water_supply">💧 Water Supply</option>
            <option value="sanitation">🗑️ Sanitation</option>
            <option value="drainage">🌊 Drainage</option>
            <option value="public_property">🏗️ Public Property</option>
            <option value="streetlight">💡 Streetlight</option>
            <option value="illegal_dumping">🚫 Illegal Dumping</option>
          </select>
          {/* Rest of form */}
        </form>
      </div>
    </DepartmentBackground>
  );
}
```

## Common Use Cases

### Complaint Filing Page
```jsx
// File complaint with dynamic background
<DepartmentBackground 
  department={selectedDept} 
  blur="md" 
  darkening="45"
  height="h-96"
>
  <ComplaintForm />
</DepartmentBackground>
```

### Dashboard Card
```jsx
// Show summary card with background
import { DepartmentBackgroundImage } from '@/components/DepartmentBackground';

<DepartmentBackgroundImage 
  department="roads_transport" 
  height="h-64"
  blur="sm"
  darkening="30"
/>
```

### Hero Section
```jsx
// Landing page with multiple backgrounds in carousel
{departments.map(dept => (
  <DepartmentBackground 
    key={dept}
    department={dept} 
    blur="lg"
    height="h-screen"
  >
    {/* Hero content */}
  </DepartmentBackground>
))}
```

### Statistics Section
```jsx
// Show stats with department context
<div className="grid md:grid-cols-2">
  {departments.map(dept => (
    <DepartmentBackgroundImage
      key={dept}
      department={dept}
      height="h-48"
    />
  ))}
</div>
```

## Component Props Reference

```jsx
<DepartmentBackground
  department="roads_transport"    // Required: department key
  blur="md"                        // Optional: none|sm|md|lg|xl
  darkening="40"                   // Optional: 0-100 (opacity %)
  height="h-96"                    // Optional: Tailwind height class
  overlay={true}                   // Optional: show dark overlay
  animated={true}                  // Optional: fade-in animation
>
  {/* Content here */}
</DepartmentBackground>
```

## Styling Tips

### For Text Overlay
```jsx
<div className="text-white drop-shadow-lg">
  <h1 className="text-4xl font-bold">Complaint Form</h1>
  <p className="text-lg">Help us improve your city</p>
</div>
```

### For Form Boxes
```jsx
<form className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
  {/* Form fields */}
</form>
```

### For Buttons
```jsx
<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl">
  Submit
</button>
```

## Responsive Adjustments

```jsx
// Mobile-friendly
<DepartmentBackground
  height="h-64"        // Smaller on mobile
  blur="lg"            // More blur for readability
  darkening="50"       // Darker overlay
>
  {/* Content */}
</DepartmentBackground>

// Desktop version
<DepartmentBackground
  height="h-96"        // Larger on desktop
  blur="md"
  darkening="40"
>
  {/* Content */}
</DepartmentBackground>
```

## Integration with Existing Pages

### Example 1: Update Complaint Form Page
```jsx
// Old code
export default function FileComplaint() {
  return (
    <div className="bg-gray-50">
      <ComplaintForm />
    </div>
  );
}

// New code with backgrounds
import DepartmentBackground from '@/components/DepartmentBackground';

export default function FileComplaint() {
  const [dept, setDept] = useState('roads_transport');

  return (
    <div className="bg-gray-50">
      <DepartmentBackground department={dept} blur="md" darkening="40">
        <ComplaintForm onDeptChange={setDept} />
      </DepartmentBackground>
    </div>
  );
}
```

### Example 2: Update Dashboard
```jsx
// Show different backgrounds for different complaint types
{complaints.map(complaint => (
  <DepartmentBackgroundImage
    key={complaint._id}
    department={complaint.category}
    height="h-40"
  />
))}
```

### Example 3: Update Landing Page
```jsx
// Hero section with background
<DepartmentBackground 
  department="roads_transport"
  blur="lg"
  height="h-screen"
>
  <LandingHero />
</DepartmentBackground>
```

## Troubleshooting

### Images not loading?
1. Check file names match exactly
2. Verify files in `public/backgrounds/`
3. Clear browser cache (Ctrl+Shift+Del)
4. Check console for 404 errors

### Text not readable?
1. Increase `darkening` prop (40→50)
2. Increase `blur` prop (md→lg)
3. Add `drop-shadow-lg` to text

### Performance issues?
1. Component lazy-loads images by default
2. Use `blur="lg"` to reduce visual detail
3. Reduce image size or compress JPEG

### Wrong department shown?
1. Verify department keys match:
   - roads_transport, electricity, water_supply, sanitation, drainage, public_property, streetlight, illegal_dumping
2. Check for typos in department prop
3. Verify import path is correct

## File Organization

```
src/
├── components/
│   ├── DepartmentBackground.jsx      ← Main component
│   ├── examples/
│   │   └── FileComplaintWithBackground.jsx  ← Example usage
│   └── (other components)
├── pages/
│   ├── complaints/
│   │   └── FileComplaint.jsx          ← Update this page
│   └── (other pages)
└── (rest of app)

public/
└── backgrounds/                       ← Images directory
    ├── roads_transport.jpg
    ├── electricity.jpg
    ├── (other images)
    └── illegal_dumping.jpg

docs/
├── DEPARTMENT_BACKGROUNDS.md          ← Main documentation
├── BACKGROUND_GENERATION.md           ← Generation guide
└── (other docs)

scripts/
└── generateBackgrounds.py             ← Generation script
```

## Next Steps

1. **Generate images:** See `docs/BACKGROUND_GENERATION.md`
2. **Place in `public/backgrounds/`**
3. **Import component:** `import DepartmentBackground from '@/components/DepartmentBackground'`
4. **Add to your pages:** Wrap content with `<DepartmentBackground>`
5. **Test and iterate:** Adjust blur/darkening as needed
6. **Deploy:** Backgrounds served automatically

## Support Files

- **Main Component:** `src/components/DepartmentBackground.jsx`
- **Example Usage:** `src/components/examples/FileComplaintWithBackground.jsx`
- **Generation Script:** `scripts/generateBackgrounds.py`
- **Full Documentation:** `docs/DEPARTMENT_BACKGROUNDS.md`
- **Generation Guide:** `docs/BACKGROUND_GENERATION.md`

---

**That's it!** Your complaint pages now have professional civic-tech backgrounds that adapt to the department. 🎨
