# Existing Root / docs Migration Plan

Status: **PASS — AUDITED LEGACY SET MIGRATED AND CLEANED**  
Updated: 2026-10-05

## Result

The audited legacy root/docs control layer has been migrated successfully.

Sequence actually followed:

```text
extract current knowledge
→ preserve historical originals
→ record source/archive provenance
→ rewrite current router
→ reference audit
→ governance CI
→ exact removal manifest
→ narrow deletion
→ post-cleanup CI
```

No runtime code/data was bulk-moved.

## Completed preservation

Historical copies exist under:
- `history/initial-app/`
- `history/checkpoints/initial-app/`
- `history/migrations/`
- `history/source-audits/`

Delivery archives exist under:
- `archive/deliverables/`

Current promoted authorities include:
- `technical/architecture/APP_ARCHITECTURE.md`
- `technical/content/CONTENT_DATA_POLICY.md`
- `technical/deployment/DEPLOYMENT.md`
- `technical/ui/DESIGN_SYSTEM.md`
- `technical/schemas/CURRENT_SCHEMA_MAP.md`
- `technical/schemas/COMMON_TEST_QUESTION_SCHEMA.md`
- `quality/QUALITY_GATES.md`

## Removed duplicate old paths

Root:
- `WORKFLOW.md`
- `figure.zip`
- `数学IA_教科書学習モード.zip`

Legacy `docs/` controls:
- architecture
- content guide
- deployment
- design system
- product requirements
- question schema
- requirements matrix
- test plan
- worklog
- backend separation note
- source audit

Legacy checkpoint directory:
- phase-00 through phase-13 reviews
- old .gitkeep

Exact list:
- `migration/R07_REMOVAL_MANIFEST.md`

## Runtime/content paths intentionally retained

- `src/`
- `backend/`
- `public/`
- `e2e/`
- Math Word authoring sources
- active Physics assets
- stable Physics internal IDs

## Provenance

Math Word sources:
- `backend/data/textbooks/math-1a/source/SOURCE_MANIFEST.md`

Physics Chapter 1 figures:
- `backend/data/textbooks/physics/FIGURE_PROVENANCE.md`

Archived delivery bundles:
- `archive/deliverables/README.md`

## Validation

Post-cleanup GitHub Actions:
- errors: 0
- warnings: 2

The two warnings concern an application/UI feature gap:
Physics Chapter 1 learner-facing three-chunk architecture.

They are not failures of the document migration.

## Migration conclusion

R05 is closed for the audited legacy root/docs set.

Future migration work should be opened as a new scoped node rather than silently extending this completed cleanup.
