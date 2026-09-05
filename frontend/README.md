# NSE Financial Literacy Quiz — Frontend

Mobile-first React (Vite) app for a live NSE quiz event.

## Flow

1. **Landing** — display name (+ optional phone)
2. **Scratch card** — canvas scratch reveal for LOW / MEDIUM / HIGH
3. **Quiz** — 20 questions, one at a time, per-question timer
4. **Result** — score, live rank, top-5 leaderboard (polls every ~3.5s)

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL and use Chrome DevTools device mode (~390px) to preview.

## API stubs

All network calls live in `src/api/stubs.js` with `TODO` comments for FastAPI wiring:

- `POST /participants`
- `POST /participants/{id}/tier`
- `GET /participants/{id}/quiz`
- `POST /participants/{id}/answers`
- `POST /participants/{id}/finish`
- `GET /session/{id}/leaderboard`

## Stack

- React + Vite
- React Router
- Framer Motion (question transitions)
- canvas-confetti (reveal / high-score celebration)
- Plain CSS design tokens in `src/index.css`
