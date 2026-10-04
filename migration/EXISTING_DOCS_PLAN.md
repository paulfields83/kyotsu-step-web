# Existing Root / docs Migration Plan

Status: MIGRATION-STAGED — DESTRUCTIVE REMOVAL NOT YET APPLIED  
Updated: 2026-10-05

## Completed migration staging

- current technical canon extracted from live code
- current quality gates extracted
- old root/docs/checkpoints copied to `history/`
- root README rewritten as current human router
- root ZIPs copied to `archive/deliverables/`
- Math Word source manifest added
- Physics Chapter 1 figure provenance recorded
- old originals remain in place until R07

## Root

| Current | Target/action | Status |
|---|---|---|
| `README.md` | short current human router | DONE |
| historical README | `history/initial-app/README_2026-08.md` | PRESERVED |
| `WORKFLOW.md` | current global flow replaced by `governance/CHANGE_PROTOCOL.md`; old file copied to history | READY-FOR-R07-REMOVE-OLD-PATH |
| `figure.zip` | archived copy at `archive/deliverables/figure.zip`; root duplicate no longer authoritative | READY-FOR-R07-REMOVE-ROOT |
| `数学IA_教科書学習モード.zip` | archived copy under `archive/deliverables/`; root duplicate no longer authoritative | READY-FOR-R07-REMOVE-ROOT |

## docs/

| Current | Promoted current authority | Historical copy | Status |
|---|---|---|---|
| `docs/ARCHITECTURE.md` | `technical/architecture/APP_ARCHITECTURE.md` | `history/initial-app/ARCHITECTURE_2026-08.md` | READY-FOR-R07 |
| `docs/CONTENT_GUIDE.md` | `technical/content/CONTENT_DATA_POLICY.md` | `history/initial-app/CONTENT_GUIDE_2026-08.md` | READY-FOR-R07 |
| `docs/DEPLOYMENT.md` | `technical/deployment/DEPLOYMENT.md` | `history/initial-app/DEPLOYMENT_2026-08.md` | READY-FOR-R07 |
| `docs/DESIGN_SYSTEM.md` | `technical/ui/DESIGN_SYSTEM.md` | `history/initial-app/DESIGN_SYSTEM_2026-08.md` | READY-FOR-R07 |
| `docs/PRODUCT_REQUIREMENTS.md` | current project purpose in `memory/PROJECT_BRIEF.md` + mode specs | `history/initial-app/PRODUCT_REQUIREMENTS_2026-08.md` | READY-FOR-R07 |
| `docs/QUESTION_SCHEMA.md` | `technical/schemas/COMMON_TEST_QUESTION_SCHEMA.md` + executable schema | `history/initial-app/QUESTION_SCHEMA_2026-08.md` | READY-FOR-R07 |
| `docs/REQUIREMENTS_MATRIX.md` | current gates/specs | `history/initial-app/REQUIREMENTS_MATRIX_2026-08.md` | READY-FOR-R07 |
| `docs/TEST_PLAN.md` | `quality/QUALITY_GATES.md` | `history/initial-app/TEST_PLAN_2026-08.md` | READY-FOR-R07 |
| `docs/WORKLOG.md` | `memory/CHANGELOG.md` / progress / decisions | `history/initial-app/WORKLOG_2026-08.md` | READY-FOR-R07 |
| `docs/backend-separation.md` | current app architecture/deployment docs | `history/migrations/backend-separation.md` | READY-FOR-R07 |
| `docs/source-audit.md` | no current authority | `history/source-audits/LOGIKA_AUDIT.md` | READY-FOR-R07 |
| `docs/checkpoints/phase-00..13-review.md` | no current authority | `history/checkpoints/initial-app/` | READY-FOR-R07 |
| `docs/checkpoints/.gitkeep` | none | none needed | READY-FOR-R07 |

## Runtime/content directories

### `src/`, `backend/`, `public/`, `e2e/`

No bulk move in Repository OS v1.

Runtime path churn is not a cleanup goal.

### Math Word source family

Current:
- kept under `backend/data/textbooks/math-1a/source/`
- classified by `SOURCE_MANIFEST.md`
- authoring source / historical production evidence
- not production runtime input
- not automatic canonical authority

### Physics figure family

Current:
- promoted asset blobs live in active textbook/public paths
- provenance recorded in `backend/data/textbooks/physics/FIGURE_PROVENANCE.md`
- root ZIP is archive-only

## Remaining pre-R07 work

1. reference audit: find active links/imports that still point to old `docs/` paths
2. validator update after old-path removal
3. protect/plan Practice frontend salvage
4. record Chapter 1 learner-facing architecture gap
5. fresh-agent recovery test
6. execute full checkout/CI validation

## R07 deletion order

When R07 opens:

D1 verify history/archive copies exist  
→ D2 verify no active references to old paths  
→ D3 remove old root ZIP duplicates  
→ D4 remove old `docs/` historical originals / old WORKFLOW path  
→ D5 run governance validator  
→ D6 run build/tests/E2E where affected  
→ D7 compare final tree against migration manifest

## Hard rule

**Promote current knowledge first; preserve history second; delete duplicates last.**

This order has now been followed. The last destructive step remains intentionally blocked.
