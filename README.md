# Service Pattern Finder

Unofficial research tool for exploring whether similar public sector service patterns already exist in UK government code repositories.

## Purpose

Helps product managers, service designers, architects, and delivery leads discover existing implementations before building new services. Uses semantic search against an index of publicly available government code.

## Local setup

```bash
npm install
npm run dev
```

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for the govreposcrape API | `https://govreposcrape-api-1060386346356.us-central1.run.app` |

## Deploy

Built with Vite. Deploy the `dist/` output to any static host (Vercel, Netlify, GitHub Pages).

```bash
npm run build
```

## Accessibility

Built with semantic HTML, keyboard navigation, visible focus styles, ARIA labels, and a contrast-aware colour palette. Targets WCAG 2.1 AA.

## Disclaimer

This is an unofficial research and discovery tool. It is not affiliated with, endorsed by, or operated by any government department or agency.
