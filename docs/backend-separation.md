# Textbook frontend/backend separation

This branch moves the textbook runtime boundary from static browser data to an HTTP API.

## What changed

- React pages keep rendering, navigation, KaTeX, figures and interaction UI.
- `TextbookRepository` now fetches textbook units from `/api/textbooks`.
- Correct answers and accepted answers are stripped from the textbook payload returned to the browser.
- Answer checking happens through `POST /api/textbooks/:unitId/items/:itemId/answer`.
- On a wrong answer the API returns only the revealed correct answer needed by the current UX.
- Textbook progress is still stored locally in Zustand for this first migration step. Moving user progress to a database is a later step.

## Run locally

Terminal 1:

```powershell
cd backend
pnpm install
$env:FRONTEND_ORIGIN="http://127.0.0.1:5173"
pnpm dev
```

Terminal 2, from the repository root:

```powershell
$env:VITE_API_BASE_URL="http://127.0.0.1:8787"
pnpm dev
```

The API health endpoint is `GET http://127.0.0.1:8787/health`.

## API

- `GET /api/textbooks` — published textbook units without answer keys
- `GET /api/textbooks/:unitId` — one public textbook unit
- `POST /api/textbooks/:unitId/items/:itemId/answer` with `{ "value": "..." }` — server-side answer checking

## Images

The existing public textbook model already supports figure URLs. Relative URLs still resolve through the frontend assets directory. Absolute `https://...` URLs are also supported, so later textbook images can be stored in S3/R2/Supabase Storage without changing the renderer.

## Important migration note

The API currently uses the existing `src/data/textbookUnits.ts` file as a temporary seed source so this change can be reviewed without redesigning the content database at the same time. The frontend no longer imports that file at runtime. The next backend step is to replace this seed source with PostgreSQL/JSONB and object storage.

Because the current GitHub repository is public and historical commits already contain answer keys, moving files inside this same repository does not make the old answers secret. For production answer secrecy, the authoritative answer data must live in a private backend database/service, not in this public repository.

## Deployment

Do not merge/deploy this branch to GitHub Pages until a backend URL is deployed and `VITE_API_BASE_URL` is configured at frontend build time. GitHub Pages cannot run this API server.
