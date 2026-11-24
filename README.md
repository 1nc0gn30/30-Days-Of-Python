# 30 Days of Python

An open-access, interactive 30-day Python 3 learning app with an in-browser practice sandbox, 60 knowledge-check questions, `localStorage` progress tracking, and a zero-key local Python tutor.

- **Live URL:** [https://python-30.nealfrazier.tech/](https://python-30.nealfrazier.tech/)
- **Repository:** [https://github.com/1nc0gn30/30-Days-Of-Python](https://github.com/1nc0gn30/30-Days-Of-Python)
- **Author:** Neal Frazier Tech (`@1nc0gn30`) • [NullAI Platform](https://nullai.tech)
- **Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4

## What It Includes

- **30 Structured Lessons (4 Weekly Phases):** Foundations (Days 1–7), Data & Functions (Days 8–14), Modules & OOP (Days 15–21), and Modern Python & Capstone (Days 22–30).
- **In-Browser Python Practice Lab (`src/lib/pythonSandbox.ts`):** Client-side Python 3 subset evaluator supporting `print()`, variables, arithmetic, f-strings, conditionals, lists/dicts/tuples/sets, loops, `def` functions, list comprehensions, `try/except`, classes & inheritance, decorators, generators, lambdas, and `math`/`random`/`json`/`re`/`datetime` helpers—plus task checks and live variable inspection.
- **60 Knowledge-Check Questions (`src/data/exercises.ts`):** Two multiple-choice checks with explanations for every day, saved in `localStorage`.
- **Zero-Key Local Python Tutor (`src/lib/pythonTutor.ts`):** Answers syntax, error diagnostic (`IndentationError`, `SyntaxError`, `NameError`, `TypeError`, `KeyError`, `IndexError`, `ZeroDivisionError`), hint, and reference-solution questions locally with no API key required. Optional Gemini BYOK support is available in Settings with automatic fallback to the local tutor.
- **Search, Filter & Deep-Linking:** Filter the 30-day curriculum by keyword, concept, or completion status (`All` / `Todo` / `Done`), navigate with `Alt+Left` / `Alt+Right`, and deep-link to any day via `?day=N`.

## Local Development

```bash
npm install
npm run dev
```

App serves on `http://localhost:3000`.

## Verification & Build

```bash
npm run lint   # TypeScript type-check (tsc --noEmit)
npm test       # Automated curriculum, sandbox, tutor, and SEO/Netlify checks
npm run build  # Production Vite build into dist/
npm run preview
```

## Deployment (Netlify)

Configured via [`netlify.toml`](./netlify.toml):
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Security headers & SPA fallback:** `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `/* -> /index.html (200)`.

## Project Layout

```text
index.html                   # Metadata, OpenGraph/Twitter tags, JSON-LD graph
netlify.toml                 # Netlify build, headers, and SPA redirect rules
public/                      # robots.txt, sitemap.xml, ai.txt, manifest.json, icons, og-image.png
src/
  App.tsx                    # Responsive 3-tier workstation + URL/localStorage state
  components/
    Sidebar.tsx              # Progress tracker, search, phase grouping, status filter
    LessonView.tsx           # Lesson reader, copyable code blocks, pagination, footer
    PracticeLab.tsx          # In-browser Python editor, terminal output, task checker, quiz
    AITutor.tsx              # Local Python Tutor + optional Gemini BYOK panel
    Onboarding.tsx           # Optional OS-specific local Python 3 setup modal
  data/
    curriculum.ts            # 30-day lesson content
    exercises.ts             # Starter code, solutions, validators, 60 quiz questions
    wisdom.ts                # Zen of Python quotes
  lib/
    pythonSandbox.ts         # Deterministic in-browser Python subset interpreter
    pythonTutor.ts           # Offline lesson-grounded Python tutor engine
tests/
  app.test.ts                # Node test suite (npm test)
```
