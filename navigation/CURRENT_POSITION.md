# CURRENT POSITION

Updated: 2026-10-05  
Repository: `paulfields83/kyotsu-step-web`  
Working branch: `chore/juku-repository-os-v1`

## Current Node

**R08 FINAL AUDIT / REVIEW PACKAGE**

Repository OS cleanup itself has reached a reviewable state:

- R05 documentation migration: PASS for audited legacy root/docs scope
- R06 governance validator: PASS-WITH-WARNINGS in GitHub Actions
- R07 narrow cleanup: PASS
- fresh-agent recovery: PASS

The next repository-level action is to package this branch as a **Draft PR to main**. Runtime feature migrations remain separate workstreams.

## Confirmed Facts

- old global-control docs are preserved under `history/`, not lost.
- current root README is a router into governance/navigation/subjects/technical/quality.
- old root ZIP duplicates were provenance-classified, archived, then removed from root.
- Math Word source family remains under `backend/data/textbooks/math-1a/source/` with a manifest.
- Physics Chapter 1 figure lineage is recorded.
- Repository Governance GitHub Action passes after cleanup.
- post-cleanup governance result: errors 0, warnings 2.
- both remaining warnings concern the same Physics Chapter 1 learner-facing architecture gap.
- internal Physics 1A–1G IDs remain valid/stable for URL, progress, tests and provenance.
- learner-facing Chapter 1 should show only:
  - 運動を表す
  - 速度の変化
  - 力と運動
- Math Practice canonical candidate requires cross-question dependencies; current schema still lacks them.
- `front-ui--test` remains protected; its Practice frontend has not yet been ported.

## Current Rule

Repository OS cleanup and runtime feature implementation are now separated.

Allowed on this cleanup branch:
- status/audit documentation
- governance validator fixes
- Draft PR/review preparation
- corrections required by PR/CI review

Do not use this branch for:
- Physics Chapter 1 UI implementation
- Practice frontend port
- Practice schema feature implementation
- broad curriculum rewrites

These should use separate feature branches after the Repository OS review point is established.

## Do Not

- do not delete `front-ui--test`
- do not merge it wholesale
- do not rename Physics internal 1A–1G IDs merely for display cleanup
- do not restore old root/docs authority paths
- do not treat `完成版` / `v8` filenames as authority
- do not promote CANONICAL-CANDIDATE documents to CANONICAL without acceptance
- do not merge the Repository OS Draft PR automatically

## Next Executable Work

1. create Draft PR: `chore/juku-repository-os-v1` → `main`.
2. verify PR CI and review diff scope.
3. after review/acceptance, ratify/promote the Repository OS candidate documents as appropriate.
4. create separate feature work for:
   - Physics Chapter 1 three-chunk learner UI
   - Math Practice cross-question dependency
   - Practice frontend selective salvage
5. only after Practice salvage is complete may `front-ui--test` deletion be reconsidered.
