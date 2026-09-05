# KinoRez Mobile App - Expo

Free movie and TV series streaming app for Android and iOS using Expo.

## Features

✨ **All Features**
- Search movies and TV series
- Multiple audio tracks (dubs)
- Quality selection (480p-4K)
- Season/episode selection for series
- Full-featured video player
- Favorites/bookmarks (local storage)
- Dark theme optimized for viewing

## Requirements

### For Android
- Android phone or tablet (Android 6+)
- Expo Go app installed
- Same WiFi network as backend server

### For Simulator
- Android Studio with emulator
- Or iOS simulator (Mac only)

## Quick Start - Android Phone

### Step 1: Install Expo Go
Download "Expo Go" from Google Play Store on your Android device.

### Step 2: Get Backend Running
Make sure the backend server is running:
```bash
npm run server
```

Backend must be on same network, accessible at:
```
http://192.168.1.100:5000
```

### Step 3: Configure API URL
Edit `mobile/screens/SearchScreen.tsx` and update:
```typescript
const API_URL = 'http://YOUR_COMPUTER_IP:5000/api';
```

**Find your IP:**
- **Windows:** Open cmd, type `ipconfig`, find IPv4 Address
- **Mac/Linux:** Open terminal, type `ifconfig`, find inet address

### Step 4: Install Dependencies
```bash
cd mobile
npm install
```

### Step 5: Start Expo
```bash
npm start
```

You'll see a QR code. Open Expo Go on your phone and scan it!

## Step-by-Step Setup

### On Your Computer

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/

2. **Start Backend Server**
   ```bash
   cd KinoRez
   npm run server
   # Runs on http://localhost:5000
   ```

3. **Navigate to Mobile Folder**
   ```bash
   cd mobile
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Find Your Computer's IP Address**
   
   **Windows:**
   - Open Command Prompt
   - Type: `ipconfig`
   - Find "IPv4 Address" (usually 192.168.x.x)
   
   **Mac:**
   - Open Terminal
   - Type: `ifconfig`
   - Find "inet" under en0 or en1
   
   **Linux:**
   - Open Terminal
   - Type: `hostname -I`

6. **Update API URLs in Code**
   
   Open these files and replace `192.168.1.100` with your actual IP:
   - `mobile/screens/SearchScreen.tsx`
   - `mobile/screens/DetailsScreen.tsx`
   - `mobile/screens/PlayerScreen.tsx`
   
   ```typescript
   const API_URL = 'http://YOUR_IP:5000/api';
   ```

7. **Start Expo Development**
   ```bash
   npm start
   ```

### On Your Android Phone

1. **Install Expo Go**
   - Open Google Play Store
   - Search "Expo Go"
   - Install official Expo app

2. **Connect to Same WiFi**
   - Connect phone to same WiFi as computer

3. **Scan QR Code**
   - Open Expo Go app
   - Tap "Scan QR Code"
   - Scan code from terminal
   - Wait for app to load (30-60 seconds)

4. **Done!**
   - App should load on your phone
   - Start searching for movies!

## Network Setup

```
Your Computer (Backend)
    ↓ 192.168.1.100:5000
WiFi Router
    ↓
Your Android Phone (Frontend)
```

**Make sure:**
- Computer and phone on same WiFi
- Firewall not blocking port 5000
- Backend server running

### Testing Connection

**From your computer:**
```bash
curl http://localhost:5000/api/health
```

**From your phone browser:**
```
http://192.168.1.100:5000/api/health
```

Both should show: `{"status":"ok","environment":"development"}`

## Using the App

### Search
1. Tap search tab
2. Enter movie/series name
3. Tap search button
4. Tap result to view details

### Watch Movie
1. Click on movie
2. Select audio track
3. Select quality
4. Tap "Смотреть" (Watch)
5. Enjoy!

### Watch Series
1. Click on series
2. Select audio track
3. Select season
4. Select episode
5. Select quality
6. Tap "Смотреть" (Watch)

### Save Favorites
Click heart icon on favorites tab to save content.

## Troubleshooting

### "Can't connect to server"
1. Check backend is running
2. Verify IP address in code
3. Check firewall settings
4. Restart expo with `npm start`

### "Blank white screen"
1. Check console errors (press 'i' for iOS or 'a' for Android)
2. Check network connection
3. Reload with 'r' key

### "Video won't play"
1. Try different quality option
2. Try different audio track
3. Check internet connection
4. Restart app

### "Can't find module"
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

### Network Issues

If having connection issues:

1. **Check IP format**
   - Should be `192.168.x.x` (not `localhost`)
   - Not `127.0.0.1`

2. **Check port**
   - Backend should be on port 5000
   - Phone can access it

3. **Test with curl**
   ```bash
   curl -v http://192.168.1.100:5000/api/health
   ```

4. **Check firewall**
   - Windows: Allow Node.js through firewall
   - Mac: System Preferences → Security & Privacy
   - Linux: `ufw allow 5000`

## Project Structure

```
mobile/
├── App.tsx              # Main app navigation
├── screens/
│   ├── SearchScreen.tsx     # Search page
│   ├── DetailsScreen.tsx    # Details & options
│   ├── PlayerScreen.tsx     # Video player
│   └── FavoritesScreen.tsx  # Favorites
├── app.json            # Expo config
├── package.json        # Dependencies
├── babel.config.js     # Babel config
├── tsconfig.json       # TypeScript config
└── README.md           # This file
```

## API Integration

Uses same backend API as web version:

```typescript
// Search
GET /api/search?q=query

// Get translations
GET /api/hdrezka/translations/:id

// Get seasons
GET /api/hdrezka/seasons/:id/:translationId

// Get stream
GET /api/hdrezka/stream/:id/:translationId/:season/:episode?quality=720
```

## Performance Tips

- Start with 720p quality to reduce data usage
- Use mobile-optimized video settings
- Close other apps to free memory
- Connect to WiFi for best experience

## Development

### Edit Code
- Make changes to files
- Expo will hot reload
- Or press 'r' to reload manually

### Debug
- Press 'j' to open debugger
- Use `console.log()` for debugging
- Check terminal for errors

### Add Features
1. Edit relevant screen component
2. Test changes
3. Make sure app still works

## Limitations

- Requires backend server running
- Must be on same network
- Video player features depend on device capabilities
- Some formats may not work on all Android versions

## Future Improvements

- [ ] Built-in backend (no server needed)
- [ ] Offline video caching
- [ ] Subtitles support
- [ ] Picture-in-picture mode
- [ ] Screen rotation
- [ ] Dark/light theme toggle
- [ ] Push notifications
- [ ] Android TV support

## Support

For issues:
1. Check troubleshooting section
2. Check terminal for error messages
3. Try restarting Expo
4. Check GitHub issues
5. Open new issue on GitHub

## License

Same as main KinoRez project - MIT

---

**Happy streaming on mobile! 🎬📱**
