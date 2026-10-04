# MASTER MATCH GRAPH

Status: CANONICAL v1  
Updated: 2026-10-05

## Repository OS / Cleanup

```text
[R00 INVENTORY] ──▶ [R01 AUTHORITY MAP] ──▶ [R02 REPOSITORY OS v1]
      │                    │                       │
      │                    │                       ├──▶ [R03 MODE CANON] ── PASS-CANONICAL
      │                    │                       │       ├─ MATH-TEXT
      │                    │                       │       ├─ MATH-PRACTICE
      │                    │                       │       ├─ PHYS-TEXT
      │                    │                       │       └─ PHYS-PRACTICE
      │                    │                       │
      │                    │                       ├──▶ [R04 BRANCH SALVAGE] ── DISPOSITIONED
      │                    │                       │
      │                    │                       ├──▶ [R05 DOC MIGRATION] ── PASS
      │                    │                       │
      │                    │                       ├──▶ [R06 VALIDATORS] ── PASS-WARN
      │                    │                       │
      │                    │                       └──▶ [R07 CLEANUP APPLY] ── PASS-NARROW
      │                    │                               │
      └────────────────────┴───────────────────────────────┘
                                                              ▼
                                                        [R08 FINAL AUDIT]
                                                           PASS-PARTIAL
```

## Node Registry

### R00 — INVENTORY
Status: PASS  
Evidence: `audit/REPOSITORY_AUDIT_2026-10-05.md`

Repository/branch/control-document inventory completed for the cleanup scope.

### R01 — AUTHORITY MAP
Status: PASS  
Evidence: `audit/DOCUMENT_AUTHORITY_CLASSIFICATION.md`

Current/historical/archive layers are explicit and the v1 authority set has been ratified.

### R02 — REPOSITORY OS v1
Status: PASS / RATIFIED

Implemented:
- root Agent router
- Constitution / authority / change protocol
- navigation
- memory split
- subject/mode specs
- technical canon
- quality gates
- history/archive layers
- migration records

Fresh-agent recovery test: PASS.

### R03 — MODE CANON
Status: PASS-CANONICAL

Created:
- `subjects/mathematics/textbook/SPEC.md`
- `subjects/mathematics/practice/SPEC.md`
- `subjects/physics/textbook/SPEC.md`
- `subjects/physics/practice/SPEC.md`

Additional Physics Chapter 1 architecture:
- `subjects/physics/textbook/CHAPTER_01_ARCHITECTURE.md`

### R04 — BRANCH SALVAGE
Status: DISPOSITIONED-PENDING-PORT

Evidence:
- `audit/BRANCH_SALVAGE_FRONT_UI_TEST.md`
- `audit/BRANCH_32_PATH_DISPOSITION.md`

All final-tree differences of `front-ui--test` are classified.

Key rule:
- do not merge the branch wholesale
- keep main backend as technical base
- selectively port/reimplement Practice frontend
- quarantine redesign experiments

Branch deletion: BLOCKED until salvage/rejection is actually complete.

### R05 — DOC MIGRATION
Status: PASS — AUDITED LEGACY SET

Completed:
- current technical/quality canon extracted
- 27 legacy control/history files preserved under `history/`
- root README rewritten as current router
- source/archive provenance added
- old duplicate control paths removed only after preservation

Evidence:
- `migration/EXISTING_DOCS_PLAN.md`
- `audit/R07_CLEANUP_RESULT_2026-10-05.md`

### R06 — VALIDATORS
Status: PASS-WITH-WARNINGS

Implemented:
- `tools/repo-governance-check.mjs`
- `.github/workflows/repository-governance.yml`

GitHub Actions: PASS.

Current warnings: 2
1. Physics Chapter 1 three-chunk learner architecture not implemented in runtime tree.
2. Physics learner labels still expose internal 1A–1G codes.

These are one known runtime/UI migration family, not Repository OS structural failures.

### R07 — CLEANUP APPLY
Status: PASS-NARROW

Exactly 29 audited duplicate paths removed:
- old root WORKFLOW
- two root delivery ZIP duplicates
- migrated legacy docs
- migrated initial-app checkpoints

Runtime code/data, source Word files, Physics internal IDs, and `front-ui--test` were not deleted.

Evidence:
- `migration/R07_REMOVAL_MANIFEST.md`
- `audit/R07_CLEANUP_RESULT_2026-10-05.md`

### R08 — FINAL AUDIT
Status: PASS — REPOSITORY OS SCOPE

Passed:
- fresh-agent recovery
- repository governance CI
- post-cleanup governance CI
- migration preservation check for audited root/docs scope

Still open before project-wide closure:
- Physics Chapter 1 learner-facing 3-chunk implementation
- Math Practice cross-question dependency implementation
- Practice frontend selective salvage
- final decision on divergent branch after salvage

## Subject/Mode Map

```text
                     [COMMON EDUCATION PRINCIPLES]
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
             [MATH]                         [PHYSICS]
          ┌─────┴─────┐                  ┌─────┴─────┐
          ▼           ▼                  ▼           ▼
     [TEXTBOOK]   [PRACTICE]        [TEXTBOOK]   [PRACTICE]
          │           │                  │           │
       SPEC/QA      SPEC/QA            SPEC/QA      SPEC/QA
```

Cross-mode reuse requires explicit review; success in one mode is not automatic authority in another.
