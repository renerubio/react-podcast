# React Podcasts SPA (Next.js 16)

Single-page experience to browse and listen to music podcasts. Built with **Next.js 16** and **React 19**, using client navigation and Turbopack.

## Table of Contents

- [Goals](#goals)
- [Release Status](#release-status)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Architecture Decisions](#architecture-decisions)
- [Data & Caching](#data--caching)
- [Responsive & Accessibility](#responsive--accessibility)
- [Views](#views)
- [Development / Production](#development--production)
- [Quality](#quality)
- [Performance](#performance)
- [Git Workflow](#git-workflow)
- [Tags & Releases](#tags--releases)
- [Testing](#testing)
- [Windows & Line Endings](#windows--line-endings)
- [Roadmap & Milestones](#roadmap--milestones)
- [Naming Conventions](#naming-conventions)
- [Code Naming Conventions](#code-naming-conventions)

## Goals

- 3 views: **Home**, **Podcast Detail**, **Episode Detail**.
- **SPA behavior**: client-side transitions without full reloads.
- **Clean URLs**, no hash routing.
- **Loading indicator** top-right during navigation.
- **Public repo** with incremental commits and **tags** for milestones.

## Release Status

- Current target: `screen-global@final-v1.0`; Home, Podcast Detail, and Episode Detail are complete and stable.
- `next build` / `next start` pass locally; ESLint/TypeScript clean.
- README covers stack, layered architecture, cache decisions, and navigation approach (acceptance criteria 8).
- Responsive checks on mobile/desktop breakpoints; no external UI kits.
- Console kept free of errors/warnings during navigation.

## Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **UI**: React 19 (no component libraries; custom CSS)
- **Language**: TypeScript (strict)
- **State**: React Context API
- **Testing**: Vitest + Testing Library
- **Styling**: Custom CSS with color variables
- **Caching**: LocalStorage with TTL
- **Lint/Format**: ESLint 9 + Prettier
- **Git Hooks**: Husky for branch/commit validation

## Architecture

### Layers and structure

- Pages in `src/app`; reusable components in `src/components`.
- View logic and hooks in `src/hooks`.
- Data services in `src/services`.
- Utilities/normalization in `src/utils`; i18n config in `src/i18nConfig.ts` and translations in `src/locale`.
- Global contexts in `src/context`; styles in `src/styles`.

### Data flow

1. Pages render layout and trigger hooks (e.g., `usePodcastDetailPage`).
2. Hooks compose UI state, cache, and call services (`fetchTopPodcasts`, `fetchPodcastById`, `fetchParsedFeed`).
3. Services fetch (via proxy when needed) and hand results to normalizers (`parsePodcastDetail`, `parseEpisodesFromFeed`).
4. Components receive normalized data via props and stay presentational.

### Services and effects

- Services run controlled effects only: network `fetch` plus parsing (DOMParser in `fetchParsedFeed`).
- Remaining business logic is pure/testable; no unexpected side effects.

### Caching and TTL

- Client cache in LocalStorage with metadata `{ timestamp, ttl }` per key (`top-podcasts`, `podcast-${id}`).
- Immediate read for fast UX; silent revalidation when expired (TTL 24h).
- Decision: no Service Worker to keep invalidation simple and deterministic in CSR.

### Navigation and UX

- Client transitions with Next 16; clean routes, no hash.
- Loading indicator top-right via global context.
- Sidebar reused across detail and episode pages to keep access to the podcast.

### Styling and key decisions

- Custom CSS with variables; no UI libraries for full control.
- Key choices: LocalStorage + TTL instead of SW; DOMParser for XML feeds on client; Context API for feedback/loading.

## Architecture Decisions

- **Service purity**: Fetchers (`fetchPodcasts`, `fetchPodcastById`, `fetchParsedFeed`) keep side effects limited to network I/O plus parsing; proxy protected by allowlist + timeout (`/api/proxy`).
- **Caching strategy**: LocalStorage TTL (24h) for top list and per-podcast payloads; cache orchestration lives in services (`services/cache/topPodcasts.ts`, `services/cache/podcast.ts`) with shared TTL helpers.
- **Layer split**: Pages (routing/layout) -> view components (presentation) -> hooks (state, cache, effects) -> services (fetch/parse) -> utils (normalize/format). SRP enforced in UI blocks.
- **Error policy**: Network errors surface via feedback context and console; UI falls back to skeletons/last cached data when present.
- **Navigation UX**: Loading indicator driven by `LoadingContext`; feedback messages via `FeedbackContext`; sidebar reused between detail and episode.

## Data & Caching

- **Top 100** and **podcast detail/episodes** cached on client for 24h.
- If cache exists, show instantly; revalidate in background.
- Cache logic lives in hooks, separated from components.

## Responsive & Accessibility

- Layout verified on mobile and desktop; grids wrap without horizontal scroll and cards stack vertically on small screens.
- `next/image` used with descriptive alt text; table headers and `aria-label` attributes added for assistive tech.
- Inputs and links include labels/titles; focus states preserved by custom CSS.
- Styles modularized per view (header, podcasts grid, podcast detail) with shared CSS variables and explicit hover/focus states.

## Views

1. **Home (`/`)**
   - Top 100 list (image, title, author).
   - Instant text filter (title + author).
   - Navigates to podcast detail.
2. **Podcast Detail (`/podcast/{podcastId}`)**
   - **Sidebar**: image, title, author, description.
   - **Main**: total episodes and table (title, date, duration).
   - Episode click navigates to detail.
3. **Episode Detail (`/podcast/{podcastId}/episode/{episodeId}`)**
   - **Sidebar** reused (links back to podcast).
   - **Main**: title, rendered HTML description, native HTML5 audio.

## Development / Production

- **Development**: `next dev` for fast HMR, unminified.
- **Production**: `next build` + `next start` for optimized assets.
- Clean routes by default; no hash routing.

### Scripts in `package.json`

- `dev`: start dev server.
- `build`: production build.
- `start`: production server.
- `lint`: run ESLint.
- `test`: run tests (Vitest).

## Quality

- ESLint 9 + Prettier; keep console clean.
- SOLID and layered separation.
- TypeScript strict on models and services.
- No UI libraries; custom CSS and baseline responsive behavior.

## Performance

- Effects guarded by dependency arrays to avoid extra renders (e.g., filter memoization, podcast/episode fetching hooks).
- Memoization (`useMemo`/`useCallback`) applied to filters, episode lookup, and click handlers to prevent rerenders across large lists.
- Client cache (localStorage + TTL) and skeleton fallbacks reduce network hits and keep navigation snappy.
- Perf profiling (Chrome DevTools): Home LCP ~0.78s, CLS 0.0, INP 24ms (green); Podcast detail LCP ~0.78s, CLS 0.01, INP 32ms (green). With cache, timings improve further.
- Next steps: profile with React DevTools and capture findings to validate render timings under load.

## Git Workflow

- Husky enforces branch and commit naming.
- Branches: `<type>/<slug>` (e.g., `feat/filter`, `fix/build`).
- Conventional commits.
- Tags for milestones (Home, Filter, Detail, Episode, Final).

## Tags & Releases

- Pattern: `screen-[view]@m[n](-descriptor)` for milestones; `screen-global@final-vX.Y.Z` for stable releases.
- Planned tags: `screen-home@m1`, `screen-home@m2-filter`, `screen-podcast@m1`, `screen-episode@m1`, `screen-global@final-v1.0`.
- Release notes capture cache strategy, proxy allowlist/timeouts, and navigation UX decisions.

## Testing

- Plan: unit tests for hooks and small components.
- Render tests for the three views (loaders, lists, filter, navigation).
- Stack: **Vitest** + **@testing-library/react** + **jsdom**.

## Windows & Line Endings

- Align to CRLF line endings for Windows environments.
- Configure editor/formatter per `.prettierrc`.

## Roadmap & Milestones

- M1: Home + cache 24h + filter
- M2: Podcast detail (sidebar + list)
- M3: Episode detail (HTML + audio)
- M4: Navigation loading indicator
- M5: Polish, tests, README, tags

## Naming Conventions

| File/Element Type   | Naming Convention        | Example               |
| ------------------- | ------------------------ | --------------------- |
| React Components    | PascalCase               | `Podcast.tsx`         |
| Next.js Pages       | PascalCase               | `PodcastHomePage.tsx` |
| Contexts            | PascalCase               | `LoadingContext.tsx`  |
| Custom Hooks        | camelCase (prefix `use`) | `useLoadingState.tsx` |
| Utilities (helpers) | camelCase                | `utils.ts`            |
| CSS Files           | camelCase                | `globals.css`         |

## Code Naming Conventions

| Code Element  | Naming Convention                | Example                          |
| ------------- | -------------------------------- | -------------------------------- |
| Variables     | camelCase                        | `podcastList`, `isLoading`       |
| Functions     | camelCase                        | `fetchPodcasts`, `filterList`    |
| Custom Hooks  | camelCase (prefix `use`)         | `usePodcastCache`                |
| Types         | PascalCase                       | `Podcast`, `Episode`             |
| Interfaces    | PascalCase (prefix `I` optional) | `PodcastDetail`, `IEpisode`      |
| Enums         | PascalCase                       | `PodcastStatus`                  |
| Constants     | UPPER_SNAKE_CASE                 | `CACHE_TTL`, `API_URL`           |
| Props Objects | PascalCase (suffix `Props`)      | `PodcastProps`                   |
| CSS Classes   | kebab-case                       | `podcast-list`, `sidebar-header` |
| Test Files    | camelCase (suffix `.test.tsx`)   | `podcastDetail.test.tsx`         |

---

**Author:** Rene  
**License:** MIT
