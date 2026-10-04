# Known Problems / Migration Debt

Updated: 2026-10-05

This list contains known repository/system inconsistencies that are deliberately not hidden by cleanup.

## KP-01 — Root/docs historical authority drift

Severity: P1 governance  
Status: CLOSED

Old root/docs files describe an earlier mostly-static application and may conflict with the current backend/content architecture.

Mitigation:
- old root/docs preserved under `history/`
- root README rewritten as current router
- current technical docs created

Resolution:
- legacy root/docs paths were migrated/removed after reference audit and preserved under `history/`

## KP-02 — Math Practice cross-question dependency missing in runtime schema

Severity: P1 pedagogy/data  
Status: OPEN

Canonical Math Practice requires explicit Q1→Q2 result dependencies. Current `backend/src/practiceSchema.ts` only supports within-question step dependencies.

Work item:
- `work/active/PRACTICE_CROSS_QUESTION_DEPENDENCY.md`

## KP-03 — Practice frontend stranded on divergent branch

Severity: P1 product integration  
Status: OPEN

Practice backend exists on main. Practice frontend behavior exists mainly on `front-ui--test`.

Decision:
- do not merge branch wholesale
- selectively port/reimplement frontend

Evidence:
- `audit/BRANCH_32_PATH_DISPOSITION.md`

## KP-04 — Physics Chapter 1 learner-facing architecture not yet on main

Severity: P1 content/navigation  
Status: OPEN

Latest Chapter 1 design uses 3 learner-facing chunks:
- 運動を表す — internal 1A/1B/1C
- 速度の変化 — internal 1D/1E/1F
- 力と運動 — internal 1G

Internal IDs/paths are intentionally stable and should remain for URL/progress/tests/provenance.

Current main still derives learner lesson labels from 1A–1G codes in `src/domain/textbookCatalog.ts`, and the expected dedicated Chapter 1 architecture file is not present.

Rule:
- preserve internal IDs
- remove internal-code exposure from major learner UI
- implement the three-chunk map and bridge flow
- do not rename data paths merely to simplify display titles

## KP-05 — Root ZIP duplicate migration

Severity: P2 provenance  
Status: CLOSED

Provenance is now classified and archive copies are staged under `archive/deliverables/`.

- `figure.zip`: uploaded source/delivery bundle. Its 17 extracted PNG blobs were promoted by Git rename into active physics/public asset paths.
- `数学IA_教科書学習モード.zip`: delivery/archive snapshot. The Word source corpus already exists under `backend/data/textbooks/math-1a/source/`.

The root copies were removed in R07 after archive preservation and CI validation.

Evidence:
- `archive/deliverables/README.md`
- `backend/data/textbooks/physics/FIGURE_PROVENANCE.md`
- `backend/data/textbooks/math-1a/source/SOURCE_MANIFEST.md`

## KP-06 — Word-source derivation metadata incomplete

Severity: P2 authoring  
Status: MITIGATED

A source manifest now establishes the Math IA Word family as authoring sources / historical production evidence, not runtime production inputs and not automatic canonical authority.

Remaining improvement:
- add per-file derived unit IDs
- supersedes/superseded-by
- QA state
- exact static-data derivation relation

## KP-07 — Backend deployment is not reproducible infrastructure-as-code

Severity: P2 operations  
Status: OPEN

Frontend GitHub Pages deploy is codified. Backend target is referenced by URL/environment examples, but no backend provisioning blueprint exists in repo.

## KP-08 — Repository governance validator protection level

Severity: P2 governance  
Status: MITIGATED

`tools/repo-governance-check.mjs` runs in GitHub Actions on push/PR and has passed. Requiring that check through branch protection/rulesets remains an optional administrative hardening step.

Remaining improvement:
- optionally require the governance workflow through branch protection/rulesets
- keep owned runtime-gap warnings visible until implementation closes them

## KP-09 — Mode-spec ratification

Severity: P1 governance  
Status: CLOSED

The four mode specs, Physics Chapter 1 architecture, technical canon, and quality gates were formally ratified on 2026-10-05.

Evidence:
- `audit/REPOSITORY_OS_RATIFICATION_2026-10-05.md`
