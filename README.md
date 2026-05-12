# PulsePlan Fitness Planner

PulsePlan is an installable progressive web app that creates beginner and advanced exercise plans from a short onboarding flow.

## Features

- Gender, experience, height, weight, diet, units, and plan-length selections
- Tailored weekly workout schedule
- Exercise examples for the selected level
- Diet-aware recipe suggestions
- PWA manifest, service worker, offline cache, install prompt, and local profile persistence

## Run Locally

Use Node.js to serve the static app:

```bash
node server.mjs
```

Then open:

```text
http://localhost:4173
```

## Deploy

This is a static app, so it can be hosted on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static web server. For iPhone PWA install and offline behavior, host it over HTTPS.

## Wellness Note

PulsePlan is for general wellness planning only. It is not medical advice. People with health conditions, injuries, pregnancy, medication concerns, or unusual symptoms should speak with a qualified professional before changing activity or diet.
