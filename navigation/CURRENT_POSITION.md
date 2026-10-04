# CURRENT POSITION

Updated: 2026-10-05  
Repository: `paulfields83/kyotsu-step-web`  
Working branch: `chore/juku-repository-os-v1`  
Review PR: **#3 — OPEN / RATIFIED / MERGE AUTHORIZED**

## Current Node

**R08 FINAL AUDIT — RATIFIED / FINAL CI → MERGE**

Repository OS v1 has been formally ratified. Only final CI and merge remain for this workstream.

Completed:
- R05 documentation migration: PASS for audited legacy root/docs scope
- R06 governance validator: PASS-WITH-WARNINGS in GitHub Actions
- R07 narrow cleanup: PASS
- fresh-agent recovery: PASS
- PR #3 created against `main`
- Repository OS v1 formally ratified on 2026-10-05
- PR Repository Governance Check: SUCCESS
- existing PR checks: SUCCESS

Do **not** create another Repository OS PR for this workstream.

## Review State

PR #3:
- base: `main`
- head: `chore/juku-repository-os-v1`
- ratification: complete
- mergeable: true
- auto-merge: not requested

The branch is authorized to merge after the ratification commit set passes CI.

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
- Canonical Math Practice requires cross-question dependencies; current runtime schema lacks them.
- `front-ui--test` remains protected; Practice frontend has not yet been ported.

## Current Rule

This cleanup branch is **merge-frozen** except for final CI/merge corrections.

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
- do not add unrelated runtime features to PR #3 before merge

## Next Executable Work

Repository OS:
1. wait for final CI on the ratification commits.
2. mark PR #3 ready for review.
3. merge PR #3 into `main`.

After Repository OS review, create separate feature branches for:
1. Physics Chapter 1 three-chunk learner UI.
2. Math Practice cross-question dependency.
3. Practice frontend selective salvage.

Only after Practice salvage is complete may `front-ui--test` deletion be reconsidered.
