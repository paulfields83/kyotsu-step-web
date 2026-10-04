# Textbook frontend/backend separation

This branch moves the textbook runtime boundary from static browser data to an HTTP API.

## What changed

- React pages keep rendering, navigation, KaTeX, figures and interaction UI.
- `TextbookRepository` now fetches textbook units from `/api/textbooks`.
- Correct answers and accepted answers are stripped from the textbook payload returned to the browser.
- Answer checking happens through `POST /api/textbooks/:unitId/items/:itemId/answer`.
- On a wrong answer the API returns only the revealed correct answer needed by the current UX.
- Physics keeps using the existing legacy textbook seed during the migration.
- Math A is stored as backend-owned `unit.json`, private `answers.json`, and extracted image assets.
- Textbook progress is still stored locally in Zustand for this first migration step. Moving user progress to a database is a later step.

## Run locally

Install workspace dependencies once from the repository root:

```powershell
corepack enable
corepack prepare pnpm@11.9.0 --activate
pnpm install --frozen-lockfile
```

Terminal 1, from the repository root:

```powershell
$env:FRONTEND_ORIGIN="http://127.0.0.1:5173,http://localhost:5173"
pnpm --dir backend dev
```

Terminal 2, from the repository root:

```powershell
$env:VITE_API_BASE_URL="http://127.0.0.1:8787"
pnpm dev --host 127.0.0.1
```

The API health endpoint is `GET http://127.0.0.1:8787/health`.

## API

- `GET /health` — health check and published textbook count
- `GET /api/textbooks` — published textbook units without answer keys
- `GET /api/textbooks/:unitId` — one public textbook unit
- `GET /api/textbooks/:unitId/assets/:fileName` — backend-owned textbook image
- `POST /api/textbooks/:unitId/items/:itemId/answer` with `{ "value": "..." }` — server-side answer checking

## Images

Backend-owned assets such as the Math A figures are returned as absolute API URLs based on the current backend request origin. This keeps images working when the frontend is hosted on GitHub Pages and the API is hosted on Render.

Legacy frontend assets beginning with `/assets/...` continue to resolve through the Vite/GitHub Pages base path, so the existing physics textbook remains compatible during the migration.

The asset endpoint supports PNG, JPEG, WebP, and SVG content types. New JSON textbook units can use an `assets/filename.ext` figure source without adding unit-specific server code.

## CORS

`FRONTEND_ORIGIN` accepts one origin, multiple comma-separated origins, or `*`.

Example for development plus the current GitHub Pages host:

```text
FRONTEND_ORIGIN=http://127.0.0.1:5173,http://localhost:5173,https://paulfields83.github.io
```

For the first Render smoke test, `*` is acceptable. Before adding authenticated/private user APIs, restrict it to the actual frontend origins.

## Render deployment

Create a Render **Web Service** from `paulfields83/kyotsu-step-web` with these settings:

- Branch: `refactor/textbook-backend-split`
- Runtime: Node
- Node version: 22 (`.node-version` is included in this branch)
- Root Directory: leave blank
- Build Command:

```bash
corepack enable && corepack prepare pnpm@11.9.0 --activate && pnpm install --frozen-lockfile && pnpm --dir backend typecheck
```

- Start Command:

```bash
pnpm --dir backend start
```

- Health Check Path:

```text
/health
```

Environment variables for the first test:

```text
FRONTEND_ORIGIN=*
```

Do **not** manually set `PORT` on Render. Render injects it automatically and the server listens on `0.0.0.0:$PORT`.

After Render gives you a URL such as `https://kyotsu-step-api.onrender.com`, verify in this order:

1. `https://YOUR-RENDER-URL/health`
2. `https://YOUR-RENDER-URL/api/textbooks`
3. `https://YOUR-RENDER-URL/api/textbooks/math-1a-counting-permutation`
4. `https://YOUR-RENDER-URL/api/textbooks/math-1a-counting-permutation/assets/venn-diagram.png`

The public textbook JSON must not contain `answer` or `acceptedAnswers` fields.

To test answer checking from PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://YOUR-RENDER-URL/api/textbooks/math-1a-counting-permutation/items/math-a-s1-sets-001/answer" `
  -ContentType "application/json" `
  -Body '{"value":"5"}'
```

For a wrong answer, use `6`; the response should have `correct: false` and reveal `correctAnswer: "5"` only after submission.

## Connect a local frontend to Render

Keep `main` untouched while reviewing this branch. On your machine, check out `refactor/textbook-backend-split` and run:

```powershell
$env:VITE_API_BASE_URL="https://YOUR-RENDER-URL"
pnpm dev --host 127.0.0.1
```

Then test both the existing physics textbook and the Math A textbook in the browser.

## Important migration note

The API still uses the existing `src/data/textbookUnits.ts` file as a temporary seed source for the current physics unit so the existing physics experience is preserved. The Math A unit already uses the new backend data layout under `backend/data/textbooks/`.

The next migration step is to convert the remaining legacy physics data to the same backend data format and later replace JSON answer storage with PostgreSQL/private storage.

Because the current GitHub repository is public and historical commits already contain answer keys, keeping `answers.json` in this public branch does **not** provide real answer secrecy. For production answer secrecy, authoritative answer data must ultimately live in a private backend database/service or private content store.

## Merge rule

Do not merge this branch into `main` until:

1. the Render backend is deployed and healthy;
2. the frontend is configured with `VITE_API_BASE_URL`;
3. physics and Math A both pass browser testing;
4. public textbook API payloads have been checked for answer leakage.
