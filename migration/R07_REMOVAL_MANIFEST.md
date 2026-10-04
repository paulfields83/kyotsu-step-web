# R07 Narrow Removal Manifest

Status: READY  
Updated: 2026-10-05

Scope: remove **duplicate historical/root delivery paths only**.  
Out of scope: runtime code/data, Physics internal IDs, `front-ui--test`.

## Preconditions — PASS

- historical docs copied to `history/`
- current technical/quality replacements created
- root README rewritten
- ZIP archive copies created
- provenance recorded
- code-search reference audit completed
- governance CI success
- fresh-agent recovery test pass
- divergent branch remains protected

## Exact removal list

### Root duplicates

- `WORKFLOW.md`
- `figure.zip`
- `数学IA_教科書学習モード.zip`

### Legacy docs replaced by current canon/history

- `docs/ARCHITECTURE.md`
- `docs/CONTENT_GUIDE.md`
- `docs/DEPLOYMENT.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/QUESTION_SCHEMA.md`
- `docs/REQUIREMENTS_MATRIX.md`
- `docs/TEST_PLAN.md`
- `docs/WORKLOG.md`
- `docs/backend-separation.md`
- `docs/source-audit.md`

### Historical checkpoints already preserved

- `docs/checkpoints/.gitkeep`
- `docs/checkpoints/phase-00-review.md`
- `docs/checkpoints/phase-01-review.md`
- `docs/checkpoints/phase-02-review.md`
- `docs/checkpoints/phase-03-review.md`
- `docs/checkpoints/phase-04-review.md`
- `docs/checkpoints/phase-05-review.md`
- `docs/checkpoints/phase-06-review.md`
- `docs/checkpoints/phase-07-review.md`
- `docs/checkpoints/phase-08-review.md`
- `docs/checkpoints/phase-09-review.md`
- `docs/checkpoints/phase-10-review.md`
- `docs/checkpoints/phase-11-review.md`
- `docs/checkpoints/phase-12-review.md`
- `docs/checkpoints/phase-13-review.md`

Total removal paths: 29.

## Replacement map

- global workflow → `governance/CHANGE_PROTOCOL.md`
- architecture → `technical/architecture/APP_ARCHITECTURE.md`
- content policy → `technical/content/CONTENT_DATA_POLICY.md`
- deployment → `technical/deployment/DEPLOYMENT.md`
- design → `technical/ui/DESIGN_SYSTEM.md`
- common-test schema → `technical/schemas/COMMON_TEST_QUESTION_SCHEMA.md`
- schema overview → `technical/schemas/CURRENT_SCHEMA_MAP.md`
- test plan → `quality/QUALITY_GATES.md`
- old requirements/worklog/checkpoints → `history/`
- delivery ZIPs → `archive/deliverables/`

## Reference audit

Default-branch code search found active old-path references primarily in the old root README.  
That README has already been rewritten on the cleanup branch.

Other references found in old phase checkpoints are historical statements and their checkpoint copies are preserved under `history/`.

No runtime import depends on these Markdown/ZIP root paths.

## Post-removal gate

After deletion:
1. governance CI must pass
2. root ZIP warnings must disappear
3. Physics architecture warnings may remain until the UI migration
4. final tree must contain history/archive replacement paths
5. `front-ui--test` must remain untouched
