# KinoRez Mobile - Complete Setup Guide

Full step-by-step guide to run KinoRez on your Android phone.

## Prerequisites

### What You Need
- Android phone (Android 6.0+)
- Computer (Windows, Mac, or Linux)
- WiFi connection (for both devices)
- Node.js installed on computer
- Expo Go app on phone

### Install Expo Go (Phone)
1. Open Google Play Store on your Android phone
2. Search for "Expo Go"
3. Install the official Expo app (by Expo)

## Step-by-Step Setup

### Step 1: Start Backend Server (Computer)

Open terminal/cmd and navigate to project:
```bash
cd KinoRez
npm run server
```

Wait for message: "Server running on port 5000"

### Step 2: Get Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (example: 192.168.1.100)

**Mac:**
```bash
ifconfig
```
Look for "inet" under en0 or en1

**Linux:**
```bash
hostname -I
```

### Step 3: Navigate to Mobile Folder

```bash
cd KinoRez/mobile
```

### Step 4: Install Mobile Dependencies

```bash
npm install
```

Wait for installation to complete (~2-3 minutes)

### Step 5: Update API URLs

The app needs to know your computer's IP address.

Open these files and replace `192.168.1.100` with your IP:

**File 1: SearchScreen.tsx**
```bash
nano screens/SearchScreen.tsx
# or use your editor
```

Find this line:
```typescript
const API_URL = 'http://192.168.1.100:5000/api';
```

Replace `192.168.1.100` with your IP, save and close.

**File 2: DetailsScreen.tsx**
```bash
nano screens/DetailsScreen.tsx
```

Find and replace:
```typescript
const API_URL = 'http://192.168.1.100:5000/api';
```

**File 3: PlayerScreen.tsx**
```bash
nano screens/PlayerScreen.tsx
```

Find and replace:
```typescript
const API_URL = 'http://192.168.1.100:5000/api';
```

### Step 6: Verify Connection

Before starting Expo, test if your phone can reach the backend:

**Option A: From your phone browser**
1. Open Chrome on your Android phone
2. Go to: `http://YOUR_IP:5000/api/health`
3. Should show: `{"status":"ok"}`

**Option B: From your computer**
```bash
curl http://localhost:5000/api/health
```

Should show: `{"status":"ok"}`

### Step 7: Start Expo

In the mobile directory, run:
```bash
npm start
```

You'll see output like:
```
Starting Expo Publishing Platform
Opening exp://192.168.1.100:19000 on the host computer

  ▄▀▄▀▄▀
  ▄▀▄▀▄▀  Metro waiting on port 19001
  ▄▀▄▀▄▀

To open the app:
  - Android: scan the QR code above with Expo Go (Android 6+)
  - Press 'a' to open Android emulator
```

A QR code will appear in the terminal.

### Step 8: Connect Phone to Expo

**Make sure both devices are on same WiFi!**

On your Android phone:
1. Open Expo Go app
2. Tap "Scan QR Code" button
3. Point camera at the QR code in your terminal
4. App will load (30-60 seconds, be patient!)

If QR code doesn't work:
1. In Expo terminal, press 'a' to open Android emulator (if available)
2. Or scan the QR code shown in terminal

## First Time Using

The app should now be running on your phone!

### Search for Content
1. Tap the search tab (magnifying glass)
2. Type a movie or series name
3. Tap the search button
4. Results will appear

### Watch Something
1. Tap on any result
2. Select audio track (if available)
3. For series: select season and episode
4. Select quality (720p recommended for mobile)
5. Tap "Смотреть" (Watch)
6. Video should start playing!

## Troubleshooting

### "Connection Refused" Error

**Problem:** App can't connect to backend

**Solution 1: Check IP Address**
- Make sure you used correct IP (not localhost)
- IP should be 192.168.x.x format

**Solution 2: Check Backend**
- Verify backend is running: `npm run server`
- Check it shows "Server running on port 5000"

**Solution 3: Check Network**
- Phone and computer on same WiFi? YES
- WiFi network has internet? YES
- Firewall blocking port 5000? Check settings

**Solution 4: Update Code Again**
```bash
# Make sure all 3 files have correct IP
grep "192.168.1.100" screens/*.tsx

# Update if needed
nano screens/SearchScreen.tsx
nano screens/DetailsScreen.tsx
nano screens/PlayerScreen.tsx
```

### "Blank Screen" or "App Won't Load"

**Solution 1: Restart Expo**
- Close terminal (Ctrl+C)
- Run `npm start` again
- Re-scan QR code

**Solution 2: Clear Cache**
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

**Solution 3: Restart Phone**
- Restart your Android phone
- Re-open Expo Go
- Scan QR code again

### "Video Won't Play"

**Try:**
1. Select different quality (lower quality first)
2. Select different audio track
3. Check internet connection
4. Restart app (close and reopen in Expo Go)

### "Module Not Found"

```bash
# Clear and reinstall
rm -rf node_modules
npm install
npm start
```

### "Can't Find My IP Address"

Use 192.168.1.1 and check:
- Router admin panel (often shows all devices)
- Use simple approach: look at router label
- Ask your network admin

### "Port 5000 Already in Use"

```bash
# Change in server/.env
PORT=5001

# Then update code:
# Change all instances of 5000 to 5001 in mobile code
```

## Network Diagram

```
┌──────────────────────────┐
│  Your Android Phone      │
│  Running Expo Go         │
│  App (Port 19000)        │
└──────────────┬───────────┘
               │
               │ WiFi Network
               │
        WiFi Router
               │
               │
┌──────────────┴───────────┐
│  Your Computer           │
│  Backend Server (5000)   │
│  Expo Dev Server (19001) │
└──────────────────────────┘
```

## Advanced: Using Android Emulator

If you have Android Studio installed:

**Start emulator:**
```bash
# Open Android Studio, then start emulator
# Or use command line if you know your emulator name
```

**In Expo terminal:**
```bash
npm start
# Press 'a' to open in Android emulator
```

No IP configuration needed for emulator!

## Performance

### For Better Experience
- Use WiFi 5GHz if available
- Connect close to WiFi router
- Close other apps
- Start with 720p quality
- Use wired connection for computer if possible

### Mobile Data Issues
- Using mobile data? Works but uses more data
- 1 hour HD video ≈ 1-2 GB
- Recommended: WiFi connection

## Keyboard Shortcuts (Expo)

In terminal while Expo is running:
- `r` - Reload app
- `i` - Open iOS simulator
- `a` - Open Android emulator
- `w` - Open web browser
- `c` - Clear cache
- `q` - Quit

On phone:
- Shake device - Open Expo menu
- Use volume buttons for shortcuts

## Need More Help?

1. Check mobile/README.md
2. Check main README.md
3. Check SETUP.md
4. Restart everything fresh
5. Open GitHub issue with details

## Success Checklist

- ✓ Backend running on port 5000
- ✓ Phone and computer on same WiFi
- ✓ Correct IP address in code
- ✓ Expo Go installed on phone
- ✓ Dependencies installed
- ✓ QR code scanned
- ✓ App loaded on phone
- ✓ Can search for movies
- ✓ Can select and watch videos

## Next Steps

After setup works:
1. Explore the app
2. Try searching for different movies
3. Test different qualities
4. Add to favorites
5. Try different audio tracks

---

**Enjoy KinoRez on your Android! 🎬📱**

Need help? Check the README.md or open an issue!
