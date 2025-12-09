# Image Assets

Place your custom images here:

- **image1.png** - Main background image (recommended: 1920x1080 or higher resolution)
- **logo1.png** - Left logo (recommended: 200x200 transparent PNG)
- **logo2.png** - Right logo (recommended: 200x200 transparent PNG)

The app will work with the default gradient background and placeholder logos if these files are not provided.

## How to Use Custom Images

1. Add your images to this `public/` folder
2. Update the image paths in the components:
   - Background: `src/App.tsx` (line ~15)
   - Logos: `src/components/Header.tsx` (lines ~10 and ~30)
