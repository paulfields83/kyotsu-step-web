# CURRENT POSITION

Updated: 2026-10-05  
Repository: `paulfields83/kyotsu-step-web`  
Working branch: `chore/juku-repository-os-v1`  
Review PR: **#3 — DRAFT / OPEN / MERGEABLE**

## Current Node

**R08 FINAL AUDIT — REVIEW / RATIFICATION WAIT**

Repository OS cleanup itself has reached a stable review point.

Completed:
- R05 documentation migration: PASS for audited legacy root/docs scope
- R06 governance validator: PASS-WITH-WARNINGS in GitHub Actions
- R07 narrow cleanup: PASS
- fresh-agent recovery: PASS
- Draft PR #3 created against `main`
- PR Repository Governance Check: SUCCESS
- existing PR checks: SUCCESS

Do **not** create another Repository OS PR for this workstream.

## Review State

PR #3:
- base: `main`
- head: `chore/juku-repository-os-v1`
- draft: true
- mergeable: true
- auto-merge: not requested

The branch remains intentionally unmerged until review/acceptance.

## Confirmed Facts

- old global-control docs are preserved under `history/`.
- current root README routes to governance/navigation/subjects/technical/quality.
- old root ZIP duplicates were provenance-classified, archived, then removed from root.
- Math Word source family remains under `backend/data/textbooks/math-1a/source/` with a manifest.
- Physics Chapter 1 figure lineage is recorded.
- governance CI passes in clean GitHub checkout.
- post-cleanup governance state has 0 structural errors.
- remaining warnings concern Physics Chapter 1 learner-facing architecture only.
- internal Physics 1A–1G IDs remain stable for URL/progress/tests/provenance.
- learner-facing Chapter 1 should show only:
  - 運動を表す
  - 速度の変化
  - 力と運動
- Math Practice canonical candidate requires cross-question dependencies; current runtime schema lacks them.
- `front-ui--test` remains protected; Practice frontend has not yet been ported.

## Current Rule

This cleanup branch is now **review-frozen** except for corrections requested by review/CI.

Do not add runtime feature work to PR #3.

Separate future workstreams:
- Physics Chapter 1 learner-facing 3-chunk UI
- Math Practice cross-question dependency schema
- Practice frontend selective salvage

## Do Not

- do not delete `front-ui--test`
- do not merge it wholesale
- do not rename Physics internal 1A–1G IDs merely for display cleanup
- do not restore old root/docs authority paths
- do not treat `完成版` / `v8` filenames as authority
- do not promote CANONICAL-CANDIDATE documents to CANONICAL without acceptance
- do not merge Draft PR #3 automatically

## Next Executable Work

Repository OS:
1. review PR #3.
2. if accepted, ratify/promote the appropriate candidate documents and merge through the normal review path.

After Repository OS review, create separate feature branches for:
1. Physics Chapter 1 three-chunk learner UI.
2. Math Practice cross-question dependency.
3. Practice frontend selective salvage.

Only after Practice salvage is complete may `front-ui--test` deletion be reconsidered.
