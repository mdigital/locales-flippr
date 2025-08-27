# Penguin Flippr

A Tinder-style penguin rating app built for iPad kiosk displays. Users swipe through penguin images to like or dislike them, with their preferences tracked and displayed at the end.

## Features

- **Full-screen swiping interface** optimized for iPad
- **Touch gestures** with visual feedback (heart for likes, cross for dislikes)
- **Card stack visualization** with smooth animations
- **Local storage** to persist user ratings
- **Results screen** showing most popular penguins
- **Kiosk-friendly** with zoom disabled and touch optimizations
- **Night mode** with automatic black screen from 11pm to 10am

## Deployment

### Netlify Deployment

The app is automatically deployed to Netlify from the `main` branch:

**Live URL:** https://locales-flippr.netlify.app

#### Setup Instructions:

1. **Repository Connection**
   - Netlify is connected to this Git repository
   - Deploys automatically on pushes to the `main` branch

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment**
   - Node.js version: 18.x
   - Package manager: npm

#### Manual Deployment:

If you need to deploy manually:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy the dist/ folder to Netlify
# (Upload dist/ folder contents via Netlify dashboard or CLI)
```

## Kiosk Pro Configuration

The app is designed to run on iPads using **Kiosk Pro** app in full-screen kiosk mode.

### Settings.xml Configuration

Add these settings to your Kiosk Pro `settings.xml` file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings>
    <!-- Basic App Settings -->
    <kiosk_url>https://locales-flippr.netlify.app</kiosk_url>
    <home_button_enabled>false</home_button_enabled>
    <navigation_buttons_enabled>false</navigation_buttons_enabled>
    <toolbar_enabled>false</toolbar_enabled>
    
    <!-- Security & Access -->
    <admin_password>1234</admin_password>
    <exit_gesture_enabled>true</exit_gesture_enabled>
    <exit_gesture>two_finger_tap_top_corners</exit_gesture>
    
    <!-- Display Settings -->
    <orientation_lock>landscape</orientation_lock>
    <status_bar_hidden>true</status_bar_hidden>
    <fullscreen_enabled>true</fullscreen_enabled>
    
    <!-- Touch & Interaction -->
    <zoom_enabled>false</zoom_enabled>
    <scroll_bounce_enabled>false</scroll_bounce_enabled>
    <touch_delay>0</touch_delay>
    
    <!-- Network & Updates -->
    <auto_refresh_enabled>false</auto_refresh_enabled>
    <cache_enabled>true</cache_enabled>
    
    <!-- Kiosk Behavior -->
    <idle_timeout>0</idle_timeout>
    <sleep_prevention>true</sleep_prevention>
    <volume_button_disabled>true</volume_button_disabled>
    
    <!-- Night Mode Support -->
    <scheduled_restart_enabled>false</scheduled_restart_enabled>
    <javascript_enabled>true</javascript_enabled>
</settings>
```

### Exit Kiosk Mode

To exit kiosk mode and access iPad settings:

1. **Gesture:** Place two fingers simultaneously in the top corners of the screen
2. **PIN:** Enter `1234` when prompted
3. You'll then have access to the iPad home screen and settings

### Kiosk Pro App Settings

1. **Download Kiosk Pro** from the App Store
2. **Load the settings.xml** file or configure manually:
   - Set homepage to: `https://locales-flippr.netlify.app`
   - Enable admin password: `1234`
   - Set exit gesture to "Two finger tap in top corners"
   - Disable zoom, navigation, and toolbar
   - Lock to landscape orientation

## Night Mode

The app includes an automatic night mode feature for energy saving and screen protection:

### Automatic Activation:
- **Active Hours:** 11:00 PM to 10:00 AM (23:00 - 10:00)
- **Display:** Completely black screen during night hours
- **Touch Disabled:** All interactions are disabled during night mode
- **Automatic Check:** Time is checked every minute for seamless transitions

### Technical Implementation:
- Uses local device time (no network required)
- Covers the entire screen with `z-index: 9999`
- Prevents all touch interactions with `touch-action: none`
- Automatically returns to normal operation at 10:00 AM

### Kiosk Benefits:
- **Energy Saving:** Black screen reduces power consumption
- **Screen Protection:** Prevents burn-in during overnight hours
- **Professional Appearance:** Clean, intentional shutdown appearance
- **Automatic Operation:** No manual intervention required

### Testing Night Mode:
To test night mode during development, temporarily modify the time check in `App.jsx`:
```javascript
// For testing - replace the hour check:
const isNight = hour >= 23 || hour < 10  // Normal operation
// With:
const isNight = true  // Force night mode for testing
```

## Development

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd penguin-flippr

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Project Structure

```
penguin-flippr/
├── public/
│   ├── images/           # Penguin images (main.png, baz.png, etc.)
│   └── heart.svg         # Heart icon for likes
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Styles and animations
│   └── main.jsx         # React entry point
├── dist/                # Built files for deployment
└── README.md           # This file
```

### Building for Production

```bash
# Build optimized version
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` folder, optimized for file:// URLs and legacy browser support.

## Usage Instructions

### For End Users:

1. **Start Screen:** Swipe right to begin rating penguins
2. **Rating Penguins:**
   - Swipe **RIGHT** to like a penguin ❤️ (shows heart animation)
   - Swipe **LEFT** to dislike a penguin ✖️ (shows cross animation)
3. **Results:** After all penguins, see popularity rankings
4. **Restart:** Tap "Start over" to begin again

### Technical Notes:

- **Swipe Threshold:** 30% of screen width to trigger action
- **Data Storage:** Uses localStorage to persist ratings
- **Animations:** Heart/cross scale up to 5x size on commitment
- **Card Stack:** Shows 3 cards at once for preview effect
- **Touch Optimized:** Designed specifically for touch interaction
- **Night Mode:** Automatically activates from 11:00 PM to 10:00 AM (checks every minute)

## Troubleshooting

### Common Issues:

1. **Images not loading:** Ensure all PNG files are in `public/images/`
2. **Zoom not disabled:** Check viewport meta tag and touch-action CSS
3. **Exit gesture not working:** Verify Kiosk Pro settings and admin PIN
4. **Build fails:** Check Node.js version (requires 18.x or higher)

### Kiosk Pro Issues:

- If exit gesture stops working, force-quit and restart Kiosk Pro
- For persistent issues, delete and reinstall the app
- Ensure settings.xml is properly formatted and uploaded

## License

This project is configured for deployment and kiosk use. Contact the development team for licensing information.
