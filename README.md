# 30 Days of Python

A focused, interactive 30-day Python learning experience with AI-assisted guidance.

## Snapshot
- Canonical URL: `https://python-30.nealfrazier.tech/`
- Author: `Neal Frazier`
- Stack: `React 19 + TypeScript + Vite 6 + Tailwind CSS 4`
- Deployment target: `Netlify`

## What This Site Delivers
- Daily Python progression with guided learning structure
- Interactive UI for practical, repeatable practice
- AI-assisted learning flows powered by Gemini-compatible API wiring

## Local Development
### Prerequisites
- Node.js 20+
- npm 10+

### Setup
```bash
npm install
cp .env.example .env.local
```

Add your key in `.env.local`:
```env
GEMINI_API_KEY="your_key_here"
```

### Run
```bash
npm run dev
```
App runs on `http://localhost:3000`.

## Build and Quality
```bash
npm run lint
npm run build
npm run preview
```

## Deploy (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback: `public/_redirects`

## SEO Baseline
- Canonical and social URLs point to: `https://python-30.nealfrazier.tech/`
- `robots.txt` references the same domain sitemap
- `sitemap.xml` contains the canonical root URL

## Project Layout
```text
src/
public/
index.html
vite.config.ts
```
