# KinoRez API Documentation

Complete API reference for KinoRez backend.

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Health Check
Check if the server is running.

**Request:**
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "environment": "development"
}
```

---

## Search Endpoints

### Search Movies/Series
Search for movies and TV series by title.

**Request:**
```
GET /search?q=<query>
```

**Parameters:**
- `q` (string, required): Search query (movie/series title)

**Example:**
```
GET /search?q=Matrix
```

**Response:**
```json
[
  {
    "id": "1234",
    "title": "The Matrix",
    "poster": "https://...",
    "year": "1999",
    "rating": "8.7",
    "type": "movie"
  },
  {
    "id": "5678",
    "title": "The Matrix Reloaded",
    "poster": "https://...",
    "year": "2003",
    "rating": "7.2",
    "type": "movie"
  }
]
```

**Response Fields:**
- `id`: Unique identifier
- `title`: Movie/series title
- `poster`: Poster image URL
- `year`: Release year
- `rating`: IMDb rating
- `type`: "movie" or "series"

---

## Content Details Endpoints

### Get Movie/Series Details
Get detailed information about a specific movie or series.

**Request:**
```
GET /hdrezka/movie/:id
```

**Parameters:**
- `id` (string, required): Content ID from search

**Example:**
```
GET /hdrezka/movie/1234
```

**Response:**
```json
{
  "id": "1234",
  "title": "The Matrix",
  "description": "A computer programmer discovers...",
  "genre": ["Action", "Sci-Fi"],
  "director": "The Wachowskis",
  "cast": ["Keanu Reeves", "Laurence Fishburne"],
  "duration": "136 min",
  "year": "1999"
}
```

### Get Available Translations/Dubs
Get all available dubbing options for content.

**Request:**
```
GET /hdrezka/translations/:id
```

**Parameters:**
- `id` (string, required): Content ID

**Example:**
```
GET /hdrezka/translations/1234
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Original"
  },
  {
    "id": "2",
    "name": "Russian Dub"
  },
  {
    "id": "3",
    "name": "Russian Voice-Over"
  }
]
```

**Response Fields:**
- `id`: Translation identifier
- `name`: Display name

---

## Series-Specific Endpoints

### Get Seasons and Episodes
Get all seasons and episodes for a series with a specific translation.

**Request:**
```
GET /hdrezka/seasons/:id/:translationId
```

**Parameters:**
- `id` (string, required): Series ID
- `translationId` (string, required): Translation ID from translations endpoint

**Example:**
```
GET /hdrezka/seasons/1234/2
```

**Response:**
```json
[
  {
    "number": 1,
    "episodes": [
      {
        "number": 1,
        "title": "Pilot"
      },
      {
        "number": 2,
        "title": "Second Episode"
      }
    ]
  },
  {
    "number": 2,
    "episodes": [
      {
        "number": 1,
        "title": "Season 2 Premiere"
      }
    ]
  }
]
```

**Response Fields:**
- `number`: Season/episode number
- `title`: Episode title (optional)

---

## Streaming Endpoints

### Get Stream URL
Get the streaming URL for a specific content with quality and translation.

**Request:**
```
GET /hdrezka/stream/:id/:translationId/:season/:episode?quality=<quality>
```

**Parameters:**
- `id` (string, required): Content ID
- `translationId` (string, required): Translation ID
- `season` (number, required): Season number (use 1 for movies)
- `episode` (number, required): Episode number (use 1 for movies)
- `quality` (string, optional): Video quality (default: 720)
  - Available: `480`, `720`, `1080`, `2k`, `4k`

**Example - Movie:**
```
GET /hdrezka/stream/1234/2/1/1?quality=1080
```

**Example - Series:**
```
GET /hdrezka/stream/5678/1/2/5?quality=720
```

**Response:**
```json
{
  "url": "https://stream.example.com/video.mp4",
  "quality": "1080"
}
```

**Response Fields:**
- `url`: Direct streaming URL
- `quality`: Confirmed quality

---

## Error Responses

All endpoints return appropriate HTTP status codes:

### 400 Bad Request
```json
{
  "error": "Query parameter required"
}
```

### 404 Not Found
```json
{
  "error": "Content not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch movie details"
}
```

---

## Rate Limiting

Currently no rate limiting implemented. Please be respectful:
- Don't make more than 10 requests per second
- Cache results on client side when possible
- Implement exponential backoff for retries

---

## CORS

Frontend requests are allowed from:
- `http://localhost:3000` (development)
- Configured via `CORS_ORIGIN` env variable

---

## Authentication

Currently no authentication required. Future versions may implement:
- User accounts
- Personalized recommendations
- Watch history tracking

---

## Testing Endpoints

### Using cURL

```bash
# Search
curl "http://localhost:5000/api/search?q=Matrix"

# Get translations
curl "http://localhost:5000/api/hdrezka/translations/1234"

# Get seasons
curl "http://localhost:5000/api/hdrezka/seasons/5678/1"

# Get stream
curl "http://localhost:5000/api/hdrezka/stream/1234/2/1/1?quality=720"
```

### Using JavaScript/Fetch

```javascript
// Search
const search = await fetch('/api/search?q=Matrix');
const results = await search.json();

// Get translations
const trans = await fetch('/api/hdrezka/translations/1234');
const translations = await trans.json();

// Get stream
const stream = await fetch('/api/hdrezka/stream/1234/2/1/1?quality=720');
const { url } = await stream.json();
```

### Using Axios

```javascript
import axios from 'axios';

// Search
const results = await axios.get('/api/search', {
  params: { q: 'Matrix' }
});

// Get translations
const translations = await axios.get('/api/hdrezka/translations/1234');

// Get stream
const { data } = await axios.get('/api/hdrezka/stream/1234/2/1/1', {
  params: { quality: '720' }
});
```

---

## Response Types

### Movie Object
```typescript
interface Movie {
  id: string;
  title: string;
  poster: string;
  year: string;
  rating: string;
  type: 'movie' | 'series';
}
```

### Translation Object
```typescript
interface Translation {
  id: string;
  name: string;
}
```

### Season Object
```typescript
interface Season {
  number: number;
  episodes: Episode[];
}

interface Episode {
  number: number;
  title: string;
}
```

### Stream Object
```typescript
interface StreamResponse {
  url: string;
  quality: string;
}
```

---

## Future Improvements

- [ ] Pagination for search results
- [ ] Filtering by genre, year, rating
- [ ] Sorting options
- [ ] Advanced search with regex
- [ ] Caching with Redis
- [ ] Database integration
- [ ] User authentication
- [ ] Watchlist API
- [ ] Review/rating API

---

## Support

For API issues:
1. Check if service is running: `GET /health`
2. Verify CORS settings
3. Check browser console for errors
4. Open an issue on GitHub

---

**Last Updated:** September 2024
