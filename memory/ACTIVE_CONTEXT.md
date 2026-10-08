# ACTIVE CONTEXT

Updated: 2026-10-08

## Current Focus

Repository OS v1 is **formally ratified and merged into `main`**.

The audited root/docs cleanup is complete. Runtime feature gaps are intentionally separated from this cleanup branch.

## Completed

- repository/branch inventory
- document authority classification
- Constitution / authority / change protocol
- Match Graph / Current Position
- four canonical mode specs
- Physics Chapter 1 learner-facing architecture spec
- all 32 `front-ui--test` final-tree differences dispositioned
- current technical architecture/content/schema/UI/deployment canon extracted from live code
- quality gates / known-problems registry
- history/archive structure
- legacy root/docs preservation
- ZIP and Word/figure provenance
- root README router rewrite
- structural governance validator
- GitHub Actions governance workflow
- fresh-agent recovery test
- narrow R07 cleanup of 29 duplicate legacy paths
- post-cleanup CI success

## Current CI State

GitHub Actions after cleanup:
- errors: 0
- warnings: 2

Remaining warnings:
1. Physics Chapter 1 three-chunk learner architecture not yet implemented in runtime.
2. Physics learner labels still expose internal 1A–1G codes.

## Active Decisions

- internal Physics 1A–1G identities stay stable.
- learner-facing Chapter 1 uses 3 major chunks.
- Math Practice requires cross-question dependency metadata.
- Practice frontend must be selectively salvaged from `front-ui--test`.
- main backend/deployment remains the technical base.
- Repository OS cleanup is reviewed separately from runtime feature work.
- ratification record: `audit/REPOSITORY_OS_RATIFICATION_2026-10-05.md`.

## Current Governance Extension

### W-GOV-001 — Work Operating System v1
Status: DONE / MERGED  
PR: #6  
Merge commit: `a3d003efe4c1a1788033a2a063163b0ef79b0235`  
Proposal: P-001 APPROVED

Adds:
- first-class Work IDs and status machine
- explicit proposal approval gate
- per-Work action/location log
- confirmed/error findings taxonomy
- verification records
- selective memory promotion
- revised downstream `憲法から` semantics after CMD-ROOT-001 live-repository verification

## Current Governance Extension

### W-GOV-002 — Instruction Matching + 修正 Command
Status: DONE / MERGED  
PR: #9  
Merge commit: `c58ead8ec1a90046f5818278675f04f6111db0ba`  
Proposal: P-001 APPROVED

Instruction Matching Rule and CMD-WORK-001 「修正」 are active. Resume the already-confirmed Mathematics learning-mode correction under CMD-WORK-001.

## Current Governance Extension

### W-GOV-003 — Proposal Review Loop
Status: DONE / MERGED  
PR: #12  
Merge commit: `bf7ff5e85de9da0b577a44b372882f5193430770`  
Proposal: P-001 APPROVED

REVIEW-FEEDBACK ≠ APPROVAL is active. Revised proposals must be shown and explicitly approved before implementation. Workflow simulation: 7/7 PASS. W-MATH-001 / PR #11 was correctly returned to REVISE-PROPOSAL.

## Open Workstreams

### W1 — Repository OS v1
COMPLETE — ratified, CI-passed, and merged through PR #3.

### W2 — Physics Chapter 1 learner UI
Implement 3 chunk cards, learner titles, bridge progression while preserving stable internal IDs.

### W3 — Math Practice dependency schema
Implement Q1→Q2 result dependencies and graph validation.

### W4 — Practice frontend salvage
Port/reimplement Practice frontend behavior onto current main technical contracts.

## Protected State

`front-ui--test` must remain until W4 is complete or its remaining behavior is explicitly rejected.
