# 30-Days-Of-Python

A free interactive guide to mastering Python in 30 days with a personalized AI tutor.

## Overview
A free interactive guide to mastering Python in 30 days with a personalized AI tutor.

## Tech Stack
- React
- Vite
- Express

## Project Structure
```
30-Days-Of-Python/
  - public
  - src
  (24 files total)
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
git clone https://github.com/1nc0gn30/30-Days-Of-Python.git
cd 30-Days-Of-Python
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Available Scripts
  npm run dev - vite --port=3000 --host=0.0.0.0
  npm run build - vite build
  npm run preview - vite preview
  npm run clean - rm -rf dist
  npm run lint - tsc --noEmit

## Original README
<details>
<summary>Click to expand original README</summary>

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

</details>

## TODO / Roadmap
- [ ] Add unit tests
- [ ] Add LICENSE file
- [ ] Add Dockerfile for containerized deployment
- [ ] Add deployment configuration
- [ ] Consider adding Tailwind CSS
- [ ] Add CI/CD pipeline
- [ ] Add contribution guidelines (CONTRIBUTING.md)
- [ ] Improve error handling and edge cases
- [ ] Add environment variable documentation
- [ ] Update dependencies to latest versions
- [ ] Add code comments and inline documentation

## Deployment
This project can be deployed to Netlify, Vercel, or any static host.

## Author
**Neal Frazier** - [@AshAmplifies](https://github.com/1nc0gn30)

## Links
- GitHub: https://github.com/1nc0gn30/30-Days-Of-Python

---
*This README was enhanced as part of the neals-projects-2026 batch update.*
