# Current Application Architecture

Status: CANONICAL  
Updated: 2026-10-05  
Evidence base: current `main` source code, package manifests, API server, deployment workflow

## 1. System shape

The current product is a split frontend/backend system.

```text
Browser
  │
  ├─ Vite/React SPA
  │    ├─ built-in Common-Test question catalog
  │    ├─ learning/simulation state
  │    ├─ local persisted progress
  │    └─ textbook API repository
  │
  └──── HTTP ────▶ Node API
                    ├─ textbook catalog/content
                    ├─ textbook answer checking
                    ├─ textbook assets/export
                    ├─ ordinary-practice catalog/questions
                    ├─ ordinary-practice answer checking
                    └─ health/contract reports
```

The old “pure static app with no backend” architecture is no longer current.

## 2. Frontend

Runtime:
- React 19
- React Router
- Zustand
- Zod
- KaTeX
- Vite

Current major route families:
- problem catalog
- guided learning
- textbook learning
- simulation
- analytics
- mistakes/history/ranking/profile
- admin/catalog preview

The current `main` does **not** yet expose the ordinary-practice frontend route that exists experimentally on `front-ui--test`.

## 3. State boundary

`src/stores/useAppStore.ts` persists browser-side user state using Zustand persistence.

Persisted categories currently include:
- guided-learning sessions/attempts
- simulation sessions/attempts
- textbook progress
- custom questions
- user settings

This is product/user-state persistence, not curriculum-source authority.

## 4. Content families

### A. Common-Test question catalog

The older learning/simulation question model remains in `src/domain/questionSchema.ts`.

It supports:
- stem/content blocks
- guided-learning blanks
- learning variants
- Common-Test presentation
- separated `finalBlankId`
- simulation items
- related questions
- stable IDs/revisions

This family currently serves Physics Common-Test guided practice/simulation and older question flows.

### B. Textbook learning

Schema:
- `src/domain/textbookSchema.ts`

Runtime source:
- static `unit.json`
- private `answers.json`
- textbook assets
- selected generated/legacy units

Backend loading:
- `backend/src/textbookData.ts`

Important current decision:
Word files under `backend/data/textbooks/math-1a/source/` are authoring sources only. Production does not parse DOCX at runtime.

### C. Ordinary Math Practice

Backend schema:
- `backend/src/practiceSchema.ts`

Source-bank schema:
- `backend/src/practiceSourceSchema.ts`

Runtime API and validation already exist on `main`, but frontend integration is not yet on `main`.

## 5. API boundary

The frontend textbook page accesses textbook content through a repository contract rather than reading backend files directly.

Current textbook endpoints include:
- `GET /api/textbooks`
- `GET /api/textbooks/:unitId`
- `GET /api/textbooks/:unitId/assets/:file`
- `POST /api/textbooks/:unitId/items/:itemId/answer`
- `GET /api/textbooks/export`

Current ordinary-practice endpoints include:
- `GET /api/practice/catalog`
- `GET /api/practice/questions`
- `GET /api/practice/questions/:questionId`
- `POST /api/practice/questions/:questionId/blanks/:blankId/answer`

`GET /health` also exposes content/contract diagnostics.

## 6. Answer-key boundary

Textbook public exports remove private answer/accepted-answer fields.

Practice public question payloads remove:
- correct option IDs
- wrong-reason details
- explanations that belong to answer evaluation

Answer checking remains backend-mediated for those API-backed content families.

This is a content-separation boundary, not a claim of cryptographic secrecy for repository contents.

## 7. Validation boundary

Frontend gates:
- TypeScript
- ESLint
- Vitest
- Vite build
- Playwright E2E
- math-figure verification/build scripts

Backend gates:
- TypeScript
- textbook validation/contract checks

Repository OS adds a separate governance validator:
- `tools/repo-governance-check.mjs`

These gates test different layers and must not substitute for one another.

## 8. Current architectural debt

1. Ordinary Practice backend exists, but frontend is not yet integrated on `main`.
2. New Math Practice canon requires cross-question dependency metadata, but current practice schema only models within-question step dependencies.
3. Technical docs still contain static-only assumptions from the old app phase.
4. Several content sources coexist: built-in TS data, generated units, static JSON units, Word authoring files, figure assets.
5. Runtime and authoring provenance are not yet uniformly manifested.

## 9. Architecture rule going forward

Do not let a page component become the source of truth for curriculum structure.

Preferred dependency direction:

```text
Mode Spec
   ↓
Schema / Content Contract
   ↓
Validated Data
   ↓
Repository/API layer
   ↓
Page/Renderer
```

UI experiments may change page/layout components, but must not silently redefine mode semantics or data contracts.
