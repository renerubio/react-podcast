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
- **State Management**: React Context API
- **Testing**: Vitest + Testing Library
- **Styling**: Custom CSS with color variables for uniformity
- **Caching**: LocalStorage with TTL (Time-to-Live)
- **Linting/Formatting**: ESLint 9 + Prettier
- **Git Hooks**: Husky for enforcing branch naming and commit conventions

## Architecture

The application follows a layered architecture for clarity and maintainability:

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

### Key Decisions

Initially, the project used a Service Worker for caching. However, due to the complexity of managing cache invalidation and ensuring consistent behavior across all views, we transitioned to using **LocalStorage**. This approach allows us to:

- Control the timing of fetch requests and cache updates.
- Access LocalStorage directly within the client-side rendering (CSR) lifecycle.
- Implement a TTL system to manage data expiration.

### TTL System

The TTL system adds metadata to cached items in LocalStorage, including:

- `timestamp`: The time the data was cached.
- `ttl`: The time-to-live duration (e.g., 24 hours).

When accessing cached data, the application checks these properties to determine if the data is still valid or needs to be re-fetched.

### Styling

For uniformity, the application uses CSS variables for colors. This ensures consistency across components and simplifies theming.

### Responsiveness

The application includes minimal responsive design to ensure usability on different screen sizes. Further improvements are planned in future iterations.

## Data & Caching

- **Top 100 podcasts** and **Podcast detail/episodes** are cached **on the client** for **24 hours**.
- When cached data exists, it is displayed immediately, and a background revalidation fetches fresh data.
- The caching logic is implemented in custom hooks, ensuring separation of concerns.

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

### Scripts in `package.json`

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for code quality issues.
- `test`: Runs unit tests using Vitest.

## Quality

- **ESLint 9 + Prettier** configured; warnings treated seriously (console kept clean).
- **SOLID** principles and separation of concerns via layers.
- **TypeScript strict**: complete typing for data models and services.
- **No UI libraries**: components built from scratch, responsive with custom CSS.

## Git Workflow

- **Husky** is used to enforce branch naming conventions and commit message standards.
- Branch naming: `<type>/<slug>` (e.g., `feat/filter`, `fix/build`).
- **Conventional commits**: Ensures clear and structured commit messages.
- **Tags**: Used to mark milestones (e.g., MVP Home list, Filter added, Detail page, Episode page, Final polishing). Tags allow reviewers to step through the project evolution in GitHub’s Releases and compare changes between milestones.

## Testing

Testing will be implemented in future iterations. The plan includes:

- Unit tests for hooks and small components.
- Rendering tests for the three pages (loader states, list rendering, filtering, episode navigation).
- Using **Vitest** with **@testing-library/react** and **jsdom**.

## Windows & Line Endings

- The project aligns to **CRLF** line endings to match Windows environments.
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
