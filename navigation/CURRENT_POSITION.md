# CURRENT POSITION

Updated: 2026-10-08  
Repository: `paulfields83/kyotsu-step-web`  
Authoritative branch: `main`  
Repository OS merge: **PR #3 — MERGED**

## Current Node

**Repository OS v1 + Work Operating System v1 — ACTIVE**

W-GOV-001 is complete and merged into `main` through PR #6. The root instruction dictionary is also active on `main` through PR #7.

Repository OS v1 was formally ratified on 2026-10-05 and merged into `main` through PR #3 using squash merge.

Repository-structure cleanup is closed. The project now moves to separate feature workstreams.

## Completed

- R00 inventory: PASS
- R01 authority map: PASS
- R02 Repository OS v1: RATIFIED / ACTIVE
- R03 four mode canons: CANONICAL
- R05 documentation migration: PASS
- R06 governance validator: PASS-WITH-OWNED-WARNINGS
- R07 narrow cleanup: PASS
- R08 Repository OS final audit: PASS
- fresh-agent recovery: PASS
- PR #3 normal PR checks: SUCCESS
- PR #3 Repository Governance Check: SUCCESS
- PR #3 merged to `main`

## Confirmed Facts

- old global-control docs are preserved under `history/`.
- current root README routes to governance/navigation/subjects/technical/quality.
- old root ZIP duplicates were provenance-classified, archived, then removed from root.
- Math Word source family remains under `backend/data/textbooks/math-1a/source/` with a manifest.
- Physics Chapter 1 figure lineage is recorded.
- internal Physics 1A–1G IDs remain stable for URL/progress/tests/provenance.
- learner-facing Physics Chapter 1 must show:
  - 運動を表す
  - 速度の変化
  - 力と運動
- Canonical Math Practice requires cross-question dependencies; current runtime schema still lacks them.
- `front-ui--test` remains protected; Practice frontend has not yet been selectively ported.

## Current Rule

Repository OS documents on `main` are now authoritative.

Future work must:
1. start from this file and `navigation/MASTER_MATCH_GRAPH.md`,
2. read the relevant subject/mode canon,
3. use a separate feature branch,
4. preserve history/provenance,
5. update Current Position / Progress when the workstream moves.

## Do Not

- do not rebuild or replace Repository OS v1 casually.
- do not restore old root/docs authority paths.
- do not delete `front-ui--test` before Practice salvage is complete.
- do not merge `front-ui--test` wholesale.
- do not rename Physics internal 1A–1G IDs merely for learner-facing display cleanup.
- do not treat `完成版` / `v8` filenames as authority.

## Completed Governance Work

- W-GOV-001 Work Operating System v1 — DONE
- proposal: `P-001` APPROVED
- PR #6 — MERGED
- merge commit: `a3d003efe4c1a1788033a2a063163b0ef79b0235`
- Repository Governance Check: SUCCESS
- normal PR checks: SUCCESS
- runtime impact: none
- CMD-ROOT-001 `憲法から` remains the highest-priority GitHub root command from PR #7

## Completed Governance Work

- W-GOV-002 Instruction Matching + 修正 Command — DONE
- proposal: `P-001` APPROVED
- PR #9 — MERGED
- merge commit: `c58ead8ec1a90046f5818278675f04f6111db0ba`
- Instruction Matching Rule: ACTIVE
- CMD-WORK-001 `修正`: ACTIVE
- follow-up: Mathematics learning-mode correction is already confirmed to map to CMD-WORK-001

## Completed Governance Work

- W-GOV-003 Proposal Review Loop — DONE
- proposal: `P-001` APPROVED
- PR #12 — MERGED
- merge commit: `bf7ff5e85de9da0b577a44b372882f5193430770`
- REVIEW-FEEDBACK ≠ APPROVAL — ACTIVE
- workflow simulation: 7/7 PASS
- W-MATH-001 / PR #11: REVISE-PROPOSAL / draft / unmerged

## Next Executable Work

Open separate feature branches for:

1. **Physics Chapter 1 learner UI**
   - implement the 3-chunk learner-facing structure
   - preserve stable internal 1A–1G identities

2. **Math Practice cross-question dependency**
   - implement Q1→Q2 reusable-result relationships
   - add dataset graph validation and UI gating

3. **Practice frontend selective salvage**
   - port/reimplement the useful `front-ui--test` Practice frontend on current main contracts
   - only after this is complete reconsider deleting `front-ui--test`
