# KinoRez Architecture

Technical architecture and system design documentation.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  App.tsx (Router)                                    │  │
│  │  ├─ Search.tsx (Search & Browse)                     │  │
│  │  ├─ Details.tsx (Content Details)                    │  │
│  │  └─ Player.tsx (Video Player)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│              ↓ HTTP/Axios ↓                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  index.ts (Server Setup & Middleware)                │  │
│  │  ├─ CORS Configuration                               │  │
│  │  ├─ JSON Parser                                      │  │
│  │  └─ Error Handlers                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│              ↓                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes Layer                                        │  │
│  │  ├─ /api/search                                      │  │
│  │  ├─ /api/hdrezka/movie/:id                           │  │
│  │  ├─ /api/hdrezka/translations/:id                    │  │
│  │  ├─ /api/hdrezka/seasons/:id/:translationId          │  │
│  │  └─ /api/hdrezka/stream/:id/:translationId/:s/:ep    │  │
│  └──────────────────────────────────────────────────────┘  │
│              ↓                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services Layer (Business Logic)                     │  │
│  │  └─ hdrezka.ts (API Integration)                     │  │
│  │     ├─ searchMovies()                                │  │
│  │     ├─ getMovieDetails()                             │  │
│  │     ├─ getTranslations()                             │  │
│  │     ├─ getSeasons()                                  │  │
│  │     └─ getStreamUrl()                                │  │
│  └──────────────────────────────────────────────────────┘  │
│              ↓ HTTP/Axios ↓                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    External APIs                            │
│  ├─ hdrezka.ag (Main Content Provider)                      │
│  └─ Various CDN Hosts (Video Streaming)                     │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
App (Root)
├── Header (Navigation)
├── Main Content Area
│   ├── Search (Page)
│   │   ├── SearchBar
│   │   └── MovieGrid
│   │       └── MovieCard
│   ├── Details (Page)
│   │   ├── PosterImage
│   │   ├── TitleInfo
│   │   ├── TranslationSelector
│   │   ├── SeasonSelector
│   │   ├── EpisodeSelector
│   │   ├── QualitySelector
│   │   └── PlayButton
│   └── Player (Page)
│       ├── VideoElement
│       ├── Controls
│       └── StreamInfo
└── Footer
```

### State Management

**App Component State:**
- `currentPage`: 'search' | 'details' | 'player'
- `selectedContent`: Content info
- `playerConfig`: Stream configuration

**Page Component State:**
- Search: query, results, loading
- Details: translations, seasons, episodes, selectedOptions
- Player: streamUrl, loading, error

### Data Flow

```
User Interaction
    ↓
Event Handler
    ↓
State Update
    ↓
API Request (via Axios)
    ↓
Backend Processing
    ↓
API Response
    ↓
State Update
    ↓
Component Re-render
    ↓
UI Update
```

## Backend Architecture

### Layered Structure

```
Presentation Layer (Routes)
        ↓
Business Logic Layer (Services)
        ↓
Data/External API Layer
```

### Request Flow

```
HTTP Request
    ↓
Express Route Handler
    ↓
Validate Input
    ↓
Call Service Method
    ↓
API Call (hdrezka)
    ↓
Parse Response
    ↓
Format Response
    ↓
Send JSON Response
    ↓
HTTP Response
```

## Technology Stack

### Frontend
- **Runtime**: Browser (ES2020+)
- **Framework**: React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Build Tool**: Vite 5
- **HTTP Client**: Axios

**Key Dependencies:**
- react: UI library
- react-dom: React rendering
- axios: HTTP requests
- tailwindcss: Utility-first CSS

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Language**: TypeScript 5
- **HTTP Client**: Axios

**Key Dependencies:**
- express: Web framework
- cors: CORS middleware
- axios: HTTP requests
- typescript: Type safety

## Database Design

Currently **No Database** - All data comes from hdrezka API.

### Future Database Schema

```sql
-- Users (if auth added)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP
);

-- Watch History
CREATE TABLE watch_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_id VARCHAR(255),
  season INT,
  episode INT,
  watched_at TIMESTAMP,
  duration INT
);

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_id VARCHAR(255),
  added_at TIMESTAMP
);

-- Cache (Search Results)
CREATE TABLE cache (
  id UUID PRIMARY KEY,
  key VARCHAR(500) UNIQUE,
  value TEXT,
  expires_at TIMESTAMP
);
```

## API Integration

### hdrezka.ag Integration

**Method**: HTTP Requests with Axios

**Endpoints Used:**
1. **Search**: `/engine/ajax/search.php`
2. **Content**: `/series/{id}.html`
3. **Episodes**: `/ajax/get_cdn_series/`
4. **Stream**: CDN URLs from API responses

**Headers:**
```javascript
{
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'X-Requested-With': 'XMLHttpRequest'
}
```

**Response Parsing**: DOM parsing for HTML responses, JSON for API responses

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (Port 3000)
├── Backend (Port 5000)
└── Browser (Client)
```

### Production (Docker)
```
Docker Container
├── Node.js Runtime
├── Backend Server (Port 5000)
├── Frontend Server (Port 3000)
└── Environment Variables
```

### Scalability Considerations

**Current Limitations:**
- Single backend instance
- No load balancing
- No caching layer
- No database optimization

**For Scale:**
1. Add load balancer (Nginx)
2. Implement Redis caching
3. Use database for favorites/history
4. CDN for frontend assets
5. Horizontal scaling with containers

## Security Considerations

### Current Implementation
- CORS configured
- No auth required (public API)
- Environment variables for config

### Future Enhancements
- [ ] Input validation
- [ ] Rate limiting
- [ ] User authentication
- [ ] API key system
- [ ] HTTPS enforcement
- [ ] XSS protection
- [ ] SQL injection prevention (when using DB)
- [ ] CSRF tokens

## Error Handling

### Frontend
```
User Action
    ↓
Try-Catch Block
    ↓
Error Object
    ↓
User-Friendly Message
    ↓
Fallback UI
```

### Backend
```
Route Handler
    ↓
Try-Catch Block
    ↓
Error Object
    ↓
Log Error
    ↓
HTTP Status Code + Message
```

## Performance Optimization

### Current Status
- **Frontend**: Optimized with Vite
- **Backend**: Lightweight Express server
- **Network**: Real-time API calls

### Optimization Opportunities
1. **Caching**
   - Implement Redis for API responses
   - Browser caching headers
   - Service Worker for offline support

2. **Database**
   - Index frequently searched content
   - Materialize popular searches
   - Optimize queries

3. **Frontend**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Minification

4. **Backend**
   - Connection pooling
   - Response compression
   - Request batching

## Testing Strategy

### Current Status: No Tests

### Recommended Test Coverage

**Unit Tests:**
- Service methods
- Route handlers
- Utility functions

**Integration Tests:**
- API endpoints
- Database queries
- External API calls

**E2E Tests:**
- User workflows
- Search → Details → Play
- Error scenarios

### Test Framework
```typescript
// Using Jest
import { describe, it, expect } from '@jest/globals';

describe('Search API', () => {
  it('should return movie results', async () => {
    const response = await searchMovies('Matrix');
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
  });
});
```

## Monitoring & Logging

### Current Implementation
- Console logs only

### Recommended Setup
- Structured logging (Winston/Pino)
- Error tracking (Sentry)
- Performance monitoring (Datadog)
- Uptime monitoring

## Documentation

- `README.md`: Project overview
- `SETUP.md`: Installation guide
- `API.md`: API reference
- `CONTRIBUTING.md`: Contribution guide
- `ARCHITECTURE.md`: This file

## Future Roadmap

### Phase 1: Foundation ✅
- Basic streaming functionality
- Search and browsing
- Quality/dub selection

### Phase 2: User Features
- [ ] User accounts
- [ ] Watch history
- [ ] Favorites/bookmarks
- [ ] Recommendations

### Phase 3: Advanced Features
- [ ] Subtitles
- [ ] Offline watching
- [ ] Social features
- [ ] Analytics

### Phase 4: Scale
- [ ] Database optimization
- [ ] Caching layer
- [ ] Multi-region deployment
- [ ] Advanced monitoring

---

**Last Updated:** September 2024
