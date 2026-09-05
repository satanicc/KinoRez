# Quick Start Guide - KinoRez

Get KinoRez running in 5 minutes!

## For Windows Users

### Step 1: Install Node.js
Download and install Node.js 16+ from https://nodejs.org/

### Step 2: Clone Repository
```bash
git clone https://github.com/satanicc/KinoRez.git
cd KinoRez
```

### Step 3: Run Installation
```bash
# From project root
scripts\install.bat
```

### Step 4: Start Development
```bash
scripts\dev.bat
```

Open http://localhost:3000 in your browser!

---

## For macOS/Linux Users

### Step 1: Install Node.js
```bash
# macOS (using Homebrew)
brew install node

# Or download from https://nodejs.org/
```

### Step 2: Clone Repository
```bash
git clone https://github.com/satanicc/KinoRez.git
cd KinoRez
```

### Step 3: Run Installation
```bash
bash scripts/install.sh
```

### Step 4: Start Development
```bash
bash scripts/dev.sh
```

Open http://localhost:3000 in your browser!

---

## Manual Setup (All Platforms)

If scripts don't work:

```bash
# Install dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Setup environment
cp server/.env.example server/.env

# Start development
npm run dev
```

---

## First Time Using

1. **Open the app** → http://localhost:3000

2. **Search for content**
   - Type movie/series name
   - Click "Найти" button
   - Browse results

3. **Select and watch**
   - Click on any title
   - Choose audio track (dub/original)
   - Select quality (720p recommended)
   - For series: choose season and episode
   - Click "Смотреть" to play

4. **Enjoy!**
   - Use video player controls
   - Space to play/pause
   - F for fullscreen

---

## What's Running

```
Backend API:  http://localhost:5000
Frontend:     http://localhost:3000
Health Check: http://localhost:5000/api/health
```

---

## Troubleshooting

### "Port already in use"
```bash
# Change in server/.env
PORT=5001  # or any free port

# Or change frontend port in client/vite.config.ts
port: 3001
```

### "Node command not found"
Make sure Node.js is installed:
```bash
node --version
npm --version
```

### "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### "Video won't play"
1. Try different audio track
2. Try different quality
3. Check browser console (F12)

---

## What You Get

✅ Search movies and series
✅ Multiple audio tracks
✅ Quality selection (480p-4K)
✅ Season/episode selection
✅ Full-featured video player
✅ Responsive design
✅ Dark theme

---

## Next Steps

1. Explore the app
2. Read [README.md](README.md) for full documentation
3. Check [SETUP.md](SETUP.md) for advanced configuration
4. See [API.md](API.md) for API reference

---

## Need Help?

- Check [SETUP.md](SETUP.md) for detailed guide
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Open issue on GitHub
- Check browser console for errors (F12)

---

**Happy streaming! 🎬**
