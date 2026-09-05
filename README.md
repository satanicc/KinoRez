# KinoRez - Free Movie & TV Series Streaming Application

A modern, free streaming application for watching movies and TV series with support for multiple audio tracks (dubs and original), quality selection (480p to 4K), and full season/episode navigation for series.

## Features

✨ **Rich Content Library**
- Search for movies and TV series
- Browse popular content
- View detailed information

🎬 **Movie Features**
- Multiple dubbing options
- Quality selection: 480p, 720p, 1080p, 2K, 4K
- Smooth video playback

📺 **TV Series Features**
- Season selection
- Episode browsing
- Multiple audio tracks per episode
- Quality selection
- Episode information

🎨 **User Interface**
- Dark theme optimized for watching
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and animations
- Intuitive navigation

🔗 **API Integration**
- Powered by hdrezka API
- Real-time content updates
- Multiple translation sources

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP requests

## Installation

### Prerequisites
- Node.js 16+ and npm
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kinorez.git
   cd kinorez
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   cd client && npm install && cd ..
   ```

3. **Configure environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env if needed
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server at `http://localhost:5000`
   - Frontend at `http://localhost:3000`

### Building for Production

```bash
# Build both server and client
npm run build

# Start production server
npm start
```

## Project Structure

```
kinorez/
├── server/                 # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts       # Main server file
│   │   ├── services/      # Business logic
│   │   │   └── hdrezka.ts # hdrezka API integration
│   │   └── routes/        # API endpoints
│   │       ├── hdrezka.ts # Movie/series routes
│   │       └── search.ts  # Search routes
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── main.tsx       # Entry point
│   │   ├── App.tsx        # Main app component
│   │   ├── index.css      # Global styles
│   │   └── pages/         # Page components
│   │       ├── Search.tsx # Search page
│   │       ├── Details.tsx # Content details
│   │       └── Player.tsx # Video player
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── package.json           # Root package with scripts

```

## API Endpoints

### Search
- `GET /api/search?q=query` - Search movies and series

### Movie Details
- `GET /api/hdrezka/movie/:id` - Get movie/series details
- `GET /api/hdrezka/translations/:id` - Get available dubbing options
- `GET /api/hdrezka/seasons/:id/:translationId` - Get seasons and episodes
- `GET /api/hdrezka/stream/:id/:translationId/:season/:episode?quality=720` - Get video stream

## Usage

### Searching for Content
1. Open the application at `http://localhost:3000`
2. Enter a movie or series title in the search bar
3. Click "Найти" or press Enter
4. Browse the results

### Watching Movies
1. Click on a movie to view details
2. Select your preferred dubbing/audio track
3. Choose video quality (480p-4K)
4. Click "Смотреть" to start playing

### Watching TV Series
1. Click on a series to view details
2. Select your preferred dubbing
3. Choose a season from the dropdown
4. Select an episode from the episode grid
5. Choose video quality
6. Click "Смотреть" to start playing

## Keyboard Shortcuts

When watching a video:
- **Space** - Play/Pause
- **F** - Fullscreen
- **← →** - Rewind/Forward 5 seconds
- **↑ ↓** - Volume up/down
- **M** - Mute/Unmute

## Features Explained

### Quality Selection
Available quality options depend on the content:
- **480p** - Lowest quality, smallest file size
- **720p** - HD, good balance
- **1080p** - Full HD, recommended
- **2K** - Higher resolution (if available)
- **4K** - Ultra high definition (if available)

### Audio Tracks
Each content can have multiple audio tracks:
- **Original** - Original language
- **Russian Dub** - Professional dubbing
- **Other Languages** - Various other dubs

### Series Navigation
- **Seasons** - Select from all available seasons
- **Episodes** - Browse all episodes in a season with titles
- **Auto-select** - Season 1, Episode 1 selected by default

## Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process if needed
kill -9 <PID>
```

### Client won't start
```bash
# Clear cache and reinstall
rm -rf node_modules client/node_modules package-lock.json
npm install
cd client && npm install && cd ..
```

### Video won't play
1. Try a different quality option
2. Try a different audio track
3. Check your browser's video codec support
4. Ensure you have a stable internet connection

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

KinoRez is provided as-is for educational and entertainment purposes. Users are responsible for complying with local laws regarding streaming content. We do not host any content directly - we only integrate with publicly available APIs.

## Support

For issues and feature requests, please open an issue on GitHub.

---

**Made with ❤️ by the KinoRez team**
