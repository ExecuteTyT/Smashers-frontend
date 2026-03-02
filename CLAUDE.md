# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smashers Badminton Club — a Russian-language marketing & booking website for a badminton club. React 19 SPA with SSG (Static Site Generation) for SEO, deployed on Vercel.

## Commands

- **Dev server**: `npm run dev` (port 3000, proxies `/api` to backend)
- **Production build**: `npm run build` (Vite client build → SSR build → SSG static HTML for all routes)
- **Preview**: `npm run preview`
- No linter or test runner is configured.

## Environment Variables

Defined in `.env` (see `.env.example`):
- `VITE_API_URL` — Backend API base (default: `https://apismash.braidx.tech/api`)
- `VITE_SITE_URL` — Canonical site URL for OG tags (default: `https://smashersbc.ru`)
- `GEMINI_API_KEY` — Google Gemini API key

## Architecture

### Source layout (flat, no `src/` directory)

All source code lives in the repo root:
- `App.tsx` — Router definition with all routes
- `index.tsx` — Client entry (hydrates SSG HTML or creates fresh root)
- `entry-server.tsx` — SSR entry used by SSG build scripts
- `constants.ts` / `types.ts` — Shared constants and TypeScript interfaces
- `index.css` — Tailwind directives + custom CSS

Key directories:
- `pages/` — Route-level page components (Home, Training, Schedule, Contacts, FAQ, PrivacyPolicy, NotFound)
- `components/` — Shared components (Layout, BookingModal, MagneticButton, MembershipCalculator, ScrollToTop)
- `context/` — React Context providers (BookingContext, MembershipContext)
- `config/api.ts` — ApiClient class, API types, and exported singleton `apiClient`
- `hooks/` — Custom hooks (useSeo)
- `scripts/` — Node build scripts for SSR/SSG (build-ssr.mjs, ssg.mjs)

### SSR / SSG pipeline

The build runs in three stages:
1. `vite build` — standard client bundle to `dist/`
2. `node scripts/build-ssr.mjs` — compiles `entry-server.tsx` into a Node-compatible SSR bundle
3. `node scripts/ssg.mjs` — imports the SSR bundle, calls `render(url)` for each route, writes static `index.html` files into `dist/`

Client entry (`index.tsx`) detects pre-rendered content and uses `hydrateRoot` instead of `createRoot`.

When adding a new route: add it to both `App.tsx` (Routes) and `entry-server.tsx` (ROUTE_PAGES map), otherwise SSG won't generate its static HTML.

### API layer

`config/api.ts` exports an `apiClient` singleton (class `ApiClient`) with `get<T>()` and `post<T>()` methods. All responses follow `{ success: true, data: T }` shape. Key endpoints:
- `GET /memberships`, `GET /memberships/:id`, `GET /categories`, `GET /sessions`, `GET /locations`
- `POST /booking`

Pages fall back to mock data when the API is unavailable.

### State management

React Context only — no Redux/Zustand:
- **BookingContext** — controls the global BookingModal (open/close, booking type, target info)
- **MembershipContext** — fetches and caches membership data (list, base price, loading/error state)

### Styling

- **Tailwind CSS 3** with custom theme in `tailwind.config.js`
- Brand colors: `brand-ghost`, `brand-carbon`, `brand-blue`, `brand-action-start/end`, `brand-lime`
- Fonts: `font-display` (Unbounded), `font-body` (Manrope), `font-marker` (Permanent Marker)
- Custom animations: `shine`, `pulse-glow`, `button-shimmer`, `pulse-button`
- Additional CSS in `index.css` (noise background, gradient buttons, scroll hiding)
- Icons via Font Awesome 6 CDN

### Routing

React Router DOM v7 with `BrowserRouter` (client) / `StaticRouter` (SSG):
- `/` → Home
- `/training` → Training
- `/schedule` → Schedule
- `/contacts` → Contacts
- `/faq` → FAQ
- `/privacy-policy` → PrivacyPolicy
- `*` → NotFound

### Path alias

`@` is aliased to the project root in `vite.config.ts`. Imports use relative paths throughout.

## Conventions

- All UI text is hardcoded in Russian — no i18n library
- Telegram integration: `createTgLink()` in `constants.ts` builds `t.me` deep links
- Vite `define` exposes `GEMINI_API_KEY` as `process.env.GEMINI_API_KEY`
- Vercel deployment config in `vercel.json`; analytics via Yandex.Metrika in `index.html`
- SEO: `useSeo` hook sets document title, meta description, and OG tags dynamically
