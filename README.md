# Tiny Wheel of Names

A browser-based random name picker built with Next.js. Spin a colorful wheel to randomly select a name from your list.

## Features

- **Charge-to-spin mechanic** — hold the spin button to build up power; release to launch the wheel
- **Winner display** — selected name shown with a confetti animation
- **Remove winner** — remove the selected name from the wheel for subsequent rounds
- **Shuffle** — randomize the order of names on the wheel
- **Reset** — restore the original list
- **Name management** — add/remove names via a sidebar
- **Persistence** — name list saved to `localStorage`
- **Dark / light / auto theme** — three-way toggle persisted across sessions

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router, standalone output)
- React 19, TypeScript 5
- Tailwind CSS v4
- Jest + Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |

## Docker

```bash
docker build -t wheel-of-names .
docker run -p 3000:3000 wheel-of-names
```

The image uses a multi-stage build and runs as a non-root user.

## Health Endpoints

| Endpoint | Description |
|---|---|
| `GET /health/liveness` | Returns `{ "status": "ok" }` |
| `GET /health/readiness` | Returns `{ "status": "ready" }` |
