# 🎧 Podcasts App — React Technical Test

A client-side rendered single-page application (SPA) built with **Next.js 16 (React 19 + TypeScript)** for streaming and managing musical podcasts.  
The project follows the official technical test requirements: modular architecture, pure CSS, Context API for state management, no external UI libraries, and full client navigation without page reloads.

---

## 🧱 Stack and Tools

- **Next.js 16** (App Router, React 19, CSR-only)
- **TypeScript**
- **CSS Modules + CSS Variables**
- **ESLint Flat Config** (Next core web vitals + Prettier)
- **Prettier** (consistent code formatting)
- **Husky + lint-staged** (Git hooks for pre-commit and pre-push)
- **Vitest + Testing Library** (unit testing)
- **GitHub Actions** (continuous integration: lint + test + build)
- **Local + browser cache system (TTL 24h)** for podcast data

---

## ⚙️ Available Scripts

```bash
npm run dev         # Development mode (non-minified)
npm run build       # Production build (minified and optimized)
npm start           # Run production server
npm run lint        # Run ESLint analysis
npm run lint:fix    # Fix lint issues automatically
npm run format      # Check Prettier formatting
npm run format:fix  # Apply Prettier formatting
npm run test        # Run unit tests
npm run test:watch  # Run tests in watch mode
```

---

## 🧩 Project Architecture

```
/app
  /layout.tsx                     # Client layout + Context Providers + Nav indicator
  /page.tsx                       # Main view (Top 100 podcasts)
  /podcast/[id]/page.tsx          # Podcast details (episodes list)
  /podcast/[id]/episode/[eid]/page.tsx  # Episode details (audio player)
/components                       # UI components built from scratch (Card, Loader, Player)
/context
  CacheContext.tsx                # In-memory + localStorage cache (TTL 24h)
  PlayerContext.tsx               # Global audio player state (play, pause, queue)
/hooks
  usePodcasts.ts                  # Fetch + cache Top 100 podcasts
  usePodcast.ts                   # Fetch + cache podcast detail and episodes
  useEpisode.ts                   # Retrieve specific episode info
  useNavProgress.ts               # Handle navigation progress indicator
/lib
  fetchers.ts                     # API calls to Apple RSS/Lookup + proxy support
  cache.ts                        # Helpers for TTL validation
  format.ts                       # Utilities for formatting (dates, durations)
/styles
  globals.css                     # Reset + CSS variables (colors, spacing, typography)
/tests
  ...                             # Vitest + Testing Library unit tests
```

---

## 🔁 Data Flow & Caching Strategy

- All data requests are made **client-side** via `fetch` (no SSR or Server Components).
- Results are cached in:
  - **In-memory context** (fastest access)
  - **localStorage** (persisted for next sessions)
- **TTL = 24 hours**: data expires and re-fetches after a full day.
- Fetch sequence:
  1. Check in-memory cache
  2. If missing or expired → check `localStorage`
  3. If still missing → fetch from Apple API → normalize → save in cache

---

## 🧠 Global State (Context API)

- `CacheContext`: manages the cached podcast data and TTL logic.
- `PlayerContext`: manages the audio player (current episode, playback state, duration).
- `NavProgressContext`: provides a global progress indicator during client navigation.

---

## 🌍 API Sources

- **Top 100 Podcasts:**  
  `https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json`
- **Podcast details (episodes):**  
  `https://itunes.apple.com/lookup?id={id}&media=podcast&entity=podcastEpisode&limit=20`
- If needed, a proxy service can be used to avoid CORS restrictions:  
  `https://api.allorigins.win/get?url={encodedURL}`

---

## 🧪 Development Iterations

| Version | Milestone             | Description                                               |
| ------- | --------------------- | --------------------------------------------------------- |
| v0.1    | Base setup            | Next.js CSR project, ESLint, Prettier, Husky, GitHub repo |
| v0.2    | Architecture + Styles | Folder structure, global layout, CSS variables            |
| v0.3    | Global State          | Context API (player + cache), TTL system                  |
| v0.4    | Functional Views      | Main page, podcast detail, episode detail                 |
| v0.5    | Tests + CI            | Vitest setup, GitHub Actions, README & documentation      |

---

## 📦 Installation

```bash
git clone https://github.com/renerubio/podcasts.git
cd podcasts
npm install
npm run dev
```

---

## 🧰 Development Mode vs Production

- **Development:**
  - Non-minified bundles
  - Full source maps for debugging
  - Hot reload enabled
- **Production:**
  - Minified and concatenated assets
  - Automatic tree-shaking and optimization by Next.js

---

## 📄 License

MIT © [renerubio](https://github.com/renerubio)
