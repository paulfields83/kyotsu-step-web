# Known Problems / Migration Debt

Updated: 2026-10-05

This list contains known repository/system inconsistencies that are deliberately not hidden by cleanup.

## KP-01 — Root/docs historical authority drift

Severity: P1 governance  
Status: MITIGATED, NOT CLOSED

Old root/docs files describe an earlier mostly-static application and may conflict with the current backend/content architecture.

Mitigation:
- old root/docs preserved under `history/`
- root README rewritten as current router
- current technical docs created

Close when:
- legacy root/docs paths are migrated/removed after reference audit

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

## KP-04 — Physics retired/stale section identifiers

Severity: P1 content/navigation  
Status: OPEN

Paths/content still contain identifiers such as `1d-acceleration` while newer project structure retired/reorganized some visible IDs.

Rule:
- do not bulk rename until canonical chapter map/migration mapping is explicit
- new active specs must not treat old IDs as authority

## KP-05 — Root ZIP provenance unknown

Severity: P2 provenance  
Status: OPEN

Examples:
- `figure.zip`
- `数学IA_教科書学習モード.zip`

Need to classify:
- unique source?
- generated deliverable?
- backup?
- reproducible?
- superseded?

No deletion before classification.

## KP-06 — Word-source authority inconsistent

Severity: P1 authoring  
Status: OPEN

Many Word files contain names such as 完成版/v8, but no uniform manifest states whether each is:
- canonical authoring source
- evidence
- backup
- superseded artifact

Current runtime explicitly treats Math Word files as authoring sources, not production runtime inputs.

## KP-07 — Backend deployment is not reproducible infrastructure-as-code

Severity: P2 operations  
Status: OPEN

Frontend GitHub Pages deploy is codified. Backend target is referenced by URL/environment examples, but no backend provisioning blueprint exists in repo.

## KP-08 — Repository governance validator not yet CI-enforced

Severity: P2 governance  
Status: OPEN

`tools/repo-governance-check.mjs` exists, but is not yet a protected merge gate.

Close when:
- CI workflow runs it
- baseline warnings are owned
- post-cleanup debt rules are escalated to errors

## KP-09 — Mode specs are candidate, not ratified

Severity: P1 governance  
Status: OPEN

Four mode specs exist as `CANONICAL-CANDIDATE`.

Close only after:
- migration conflict audit
- user acceptance/ratification
- status update
- dependent docs synchronized
