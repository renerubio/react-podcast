# React Podcasts SPA (Next.js 16)

A single-page application for browsing and listening to music podcasts. Built with **Next.js 16** and **React 19**, operating with SPA-style client navigation while leveraging Next's modern build pipeline (Turbopack).

## Table of Contents

- [Goals](#goals)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Data & Caching](#data--caching)
- [Views](#views)
- [Development / Production](#development--production)
- [Quality](#quality)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Windows & Line Endings](#windows--line-endings)
- [Roadmap & Milestones](#roadmap--milestones)

## Goals

- 3 views: **Home**, **Podcast Detail**, **Episode Detail**.
- **SPA behavior**: client-side transitions without full document reloads.
- **Clean URLs**, no hash-based routing.
- **Public repository** with progressive commits and **tags** for milestones.
- **Indicator** in the top-right corner while a client navigation is in progress.

## Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **UI**: React 19 (no component libraries; custom CSS)
- **Language**: TypeScript (strict)
- **Formatting/Linting**: Prettier + ESLint 9
- **State**: React Context API (as required)
- **Testing**: Vitest + Testing Library (see below)
- **Data Sources**:
  - Top 100: `https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json`
  - Podcast detail/episodes: `https://itunes.apple.com/lookup?id=<ID>&media=podcast&entity=podcastEpisode&limit=20`
  - CORS helper if needed: `https://allorigins.win` (or a Next API proxy route)

## Architecture

**Layered approach** for clarity and maintainability:

```
UI (Components & Pages)
│
├─ State (React Context)
│
├─ Hooks (custom hooks for data fetching, cache, filters)
│
├─ Services (API clients: iTunes RSS / lookup, proxy)
│
└─ Cache (client storage with TTL + background revalidation)
```

- **UI**: three pages (Home, Podcast Detail, Episode Detail) + small reusable components (sidebar, list/table, audio player, top-right loading indicator).
- **State**: Context API for cross-cutting concerns (e.g., navigation/loading indicator, search filter state).
- **Hooks**: data hooks encapsulate fetch logic, caching, and stale-while-revalidate behavior.
- **Services**: isolated functions to fetch/transform data (RSS/JSON parsing, mapping to typed models).
- **Cache**: client-side storage (e.g., `localStorage`) with **24h TTL**, plus background revalidation to keep data fresh without blocking UI.

**Mermaid diagram (high-level):**

```mermaid
flowchart TD
    A[User] -->|Clicks/Routes| B[UI Pages & Components]
    B --> C[Context (Loading/Filter)]
    B --> D[Custom Hooks]
    D --> E[Services (Fetch + Transform)]
    E --> F[Cache (localStorage, TTL 24h)]
    E --> G[External APIs (Apple RSS/Lookup, AllOrigins/Next API)]
    F --> D
    C --> B
```

## Data & Caching

- **Top 100 podcasts** and **Podcast detail/episodes** are cached **on the client** for **24 hours**.
- When cached data exists, we show it immediately and **revalidate in the background**.
- If CORS blocks RSS or episode HTML, we rely on **AllOrigins** or a **Next API route proxy**.

## Views

1. **Home (`/`)**
   - Displays Top 100 podcasts (image, title, author).
   - **Instant filter** by text (title+author).
   - Navigates to podcast detail on click.
2. **Podcast Detail (`/podcast/{podcastId}`)**
   - **Sidebar**: image, title, author, description.
   - **Main**: episode count + list (title, date, duration).
   - Clicking an episode title routes to its detail view.
3. **Episode Detail (`/podcast/{podcastId}/episode/{episodeId}`)**
   - **Same sidebar** as podcast detail (image, title, author) — all link back to the podcast.
   - **Main**: title, **HTML description rendered**, **native HTML5 audio player**.

## Development / Production

- **Development**: `next dev` — unminified, fast HMR.
- **Production**: `next build` + `next start` — optimized/minified output (Turbopack).
- No hash-based routing; clean URLs by default in Next.

## Quality

- **ESLint 9 + Prettier** configured; warnings treated seriously (console kept clean).
- **SOLID** and separation of concerns via layers.
- **TypeScript strict**: complete typing for data models and services.
- **No UI libraries**: components built from scratch, responsive with custom CSS.

## Git Workflow

- Branch naming enforced via hook: `<type>/<slug>` (e.g., `feat/filter`, `fix/build`).
- **Conventional commits**.
- **Tags**: used to mark milestones (e.g., MVP Home list, Filter added, Detail page, Episode page, Final polishing). Tags allow reviewers to step through the project evolution in GitHub’s Releases and compare changes between milestones.

## Testing

- If tests are requested, we use **Vitest** with **@testing-library/react** and **jsdom**:
  - Unit tests for hooks and small components.
  - Rendering tests for the three pages (loader states, list rendering, filtering, episode navigation).
  - Keep tests fast and focused; no E2E required for this scope.

## Windows & Line Endings

- Reviewers may use Windows. The project can align to **CRLF** line endings to match their environment.
- Ensure editor settings and formatter are consistent (see `.prettierrc` and editor configuration).

## Roadmap & Milestones

- M1: Home list + client cache (24h) + filter
- M2: Podcast detail (sidebar + episodes list)
- M3: Episode detail (HTML description + audio)
- M4: Top-right route loading indicator
- M5: Polish, tests, README, tags

---

**Author:** René  
**License:** MIT
