# Current Deployment Model

Status: CANONICAL  
Updated: 2026-10-05  
Evidence: current GitHub Pages workflow, environment examples, current frontend repository layer, current backend server

## 1. Frontend deployment

The frontend is built as a Vite SPA and deployed to GitHub Pages by:

- `.github/workflows/deploy-pages.yml`

Current workflow:
1. checkout
2. install pnpm 11.9.0
3. use Node 22
4. `pnpm install --frozen-lockfile`
5. `pnpm run typecheck`
6. `pnpm run build`
7. upload `dist/`
8. deploy to GitHub Pages

The build injects:

```text
VITE_API_BASE_URL=https://kyotsu-step-web.onrender.com
```

Therefore the frontend deployment is not a self-contained static application anymore: API-backed textbook/practice features depend on the backend service.

## 2. Backend runtime

Backend package:
- `backend/package.json`

Current commands:
- development: `pnpm dev`
- production start: validate textbooks, then launch server
- backend check: TypeScript + textbook checks

The backend listens on:
- `PORT`
- default local value 8787

Production hosting is expected to provide `PORT`.

## 3. CORS

Backend environment example declares:

```text
FRONTEND_ORIGIN=http://127.0.0.1:5173,http://localhost:5173,https://paulfields83.github.io
```

The API must allow the actual deployed frontend origin.

Do not use `*` as the long-term production configuration merely because it is convenient for debugging.

## 4. Local development

Frontend example:

```text
VITE_API_BASE_URL=http://127.0.0.1:8787
```

Backend example:

```text
PORT=8787
FRONTEND_ORIGIN=http://127.0.0.1:5173,http://localhost:5173,...
```

Run frontend and backend as separate processes.

## 5. What is automated vs not codified

Automated in repository:
- frontend GitHub Pages build/deploy

Not currently fully codified in repository:
- backend infrastructure provisioning/deployment manifest
- backend rollback procedure
- backend health monitoring
- environment-secret/config management beyond examples

The current workflow references an onrender.com API URL, but there is no Render blueprint/config file in the repository.

Therefore “backend is deployed to Render” should be treated as the current operational target inferred from deployment configuration, not as a fully reproducible infrastructure-as-code contract.

## 6. Release gate

Before a production release:

Frontend:
- typecheck
- lint
- unit tests
- build
- relevant E2E
- repository governance check

Backend:
- typecheck
- textbook/content contract validation
- Practice data validation through startup/import
- `/health` response
- endpoint smoke tests

Integration:
- frontend API base points to intended backend
- allowed origin contains intended frontend
- textbook list/load/answer flow
- textbook asset loading
- Practice API smoke test
- no answer-key leak in public payloads

## 7. Historical-doc conflict

Old `docs/DEPLOYMENT.md` states:
- pure static Vite SPA
- no server environment variables
- all data local

That description is now historical and must not be used as the deployment authority.

## 8. Follow-up technical debt

- add reproducible backend deployment configuration
- define backend production/preview environments
- define rollback/health procedure
- add integration smoke test against deployment contract
- decide whether Pages base-path behavior remains the long-term frontend hosting design
