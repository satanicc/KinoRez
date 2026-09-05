# KinoRez Setup Guide

Complete guide to setting up and running KinoRez locally.

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- Git

### 2. Clone and Install
```bash
git clone https://github.com/satanicc/KinoRez.git
cd KinoRez

# Install all dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 3. Run Development
```bash
# From the root directory
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Detailed Setup

### Step 1: Environment Setup

1. **Install Node.js**
   ```bash
   # macOS (using Homebrew)
   brew install node

   # Ubuntu/Debian
   sudo apt-get install nodejs npm

   # Or download from https://nodejs.org/
   ```

2. **Verify Installation**
   ```bash
   node --version  # v16 or higher
   npm --version   # 7 or higher
   ```

### Step 2: Clone Repository

```bash
git clone https://github.com/satanicc/KinoRez.git
cd KinoRez
```

### Step 3: Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### Step 4: Configure Environment

```bash
# Copy environment template
cp server/.env.example server/.env

# Edit if needed (defaults work for local development)
# nano server/.env
```

### Step 5: Start Development Servers

**Option A: Use npm (Recommended)**
```bash
npm run dev
```

**Option B: Start servers separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### Step 6: Access Application

- Frontend: http://localhost:3000
- API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Using Docker

### Prerequisites
- Docker
- Docker Compose

### Run with Docker

```bash
# Build and run
docker-compose up

# In background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access at http://localhost:3000

## Development

### Project Structure
```
KinoRez/
├── server/           # Node.js backend
│   └── src/
│       ├── config.ts
│       ├── index.ts
│       ├── routes/
│       └── services/
└── client/           # React frontend
    └── src/
        ├── App.tsx
        ├── pages/
        └── components/
```

### Available Scripts

**Root Level:**
```bash
npm run dev         # Start both servers
npm run build       # Build for production
npm start           # Start production server
npm run server      # Start backend only
npm run client      # Start frontend only
```

**Server:**
```bash
cd server
npm run dev         # Start with watch mode
npm run build       # Build TypeScript
npm start           # Run compiled code
```

**Client:**
```bash
cd client
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Configuration

### Backend (.env)
```bash
PORT=5000                              # Server port
NODE_ENV=development                   # Environment
HDREZKA_API_URL=https://rezka.ag      # API endpoint
```

### Frontend (vite.config.ts)
- Proxy: `/api` → `http://localhost:5000`
- Port: 3000

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000    # Frontend
lsof -i :5000    # Backend

# Kill process
kill -9 <PID>

# Or use different ports
# Backend: change PORT in server/.env
# Frontend: change port in client/vite.config.ts
```

### Dependencies Issues
```bash
# Clear all node_modules
rm -rf node_modules server/node_modules client/node_modules

# Clear cache
npm cache clean --force

# Reinstall
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### CORS Issues
Ensure `CORS_ORIGIN` in server/.env matches frontend URL:
```bash
CORS_ORIGIN=http://localhost:3000
```

### Video Won't Play
1. Check browser console for errors
2. Verify API is running: http://localhost:5000/api/health
3. Try different video quality
4. Try different audio track

## Building for Production

### Build
```bash
npm run build
```

### Test Production Build
```bash
npm start
```

Server runs at http://localhost:5000

### Docker Build
```bash
docker-compose -f docker-compose.yml build
docker-compose up
```

## Development Tips

### API Debugging
- Check backend logs: `console.log()` in server code
- Test endpoints: Use Postman or curl
```bash
curl http://localhost:5000/api/health
curl "http://localhost:5000/api/search?q=movie"
```

### Frontend Debugging
- Use React DevTools browser extension
- Check console for errors (F12)
- Vite HMR (Hot Module Replacement) enabled by default

### Database/Caching
Currently no database - data comes from hdrezka API in real-time.

To add caching:
1. Install Redis or another cache store
2. Implement caching layer in services
3. Add TTL for cached responses

## Performance Optimization

### Current Status
- ✅ Frontend: Optimized with Vite
- ✅ API responses: Real-time from hdrezka
- ⚠️ Caching: Not implemented yet

### To Improve
1. Add API response caching
2. Implement database for popular searches
3. Add CDN for images
4. Optimize video streaming

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Can't connect to API | Check backend is running, verify CORS settings |
| Video won't load | Try different quality, check network connection |
| Search returns nothing | Verify API is accessible, try different query |
| Styling looks broken | Clear browser cache, restart dev server |
| TypeScript errors | Run `npm install`, check Node.js version |

## Getting Help

1. Check the README.md for general info
2. Check logs: `docker-compose logs`
3. Open an issue on GitHub
4. Ask in discussions

## Next Steps

After setup:
1. Search for a movie or series
2. Select content and choose quality/language
3. For series, select season and episode
4. Click play and enjoy!

---

**Happy Streaming! 🎬**
