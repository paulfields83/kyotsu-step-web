# CURRENT POSITION

Updated: 2026-10-05  
Repository: `paulfields83/kyotsu-step-web`  
Working branch: `chore/juku-repository-os-v1`

## Current Node

Primary: **R06 VALIDATORS — CI verification in progress**  
Secondary: **R05 DOC MIGRATION — staged, old duplicate paths not yet removed**

R03 has four CANONICAL-CANDIDATE mode specs.  
R04 branch salvage is fully dispositioned but Practice frontend port is not yet applied.

## Confirmed Facts

- main head at audit start: `7ebbac15` (2026-10-02).
- old root/docs authority drift has been mitigated by new governance/technical/quality structure.
- 27 legacy root/docs/checkpoint files were preserved under `history/`.
- root README is now a short current router.
- two root ZIPs have provenance and archive copies under `archive/deliverables/`.
- Math Word source family has `SOURCE_MANIFEST.md`.
- Physics Chapter 1 figure lineage is recorded and promoted asset blobs are preserved.
- four mode specs exist:
  - Math Textbook
  - Math Ordinary Practice
  - Physics Textbook
  - Physics Common-Test Guided Practice
- Math Practice requires both within-question and cross-question dependencies; current runtime schema lacks the latter.
- `front-ui--test`: 10 unique + 22 modified final-tree paths are dispositioned.
- Practice frontend is the high-value salvage target.
- main backend wins over divergent branch backend; whole-branch merge is rejected.
- Chapter 1 physics title architecture is now correctly defined:
  - learner-facing: 運動を表す / 速度の変化 / 力と運動
  - internal 1A–1G IDs remain stable for URL/progress/tests/provenance
- current main still exposes 1A–1G learner lesson labels and has not implemented the latest three-chunk Chapter 1 architecture.
- repository governance workflow has been added and triggered on this branch.

## Current Rule

NO BROAD DESTRUCTIVE CLEANUP YET.

Allowed:
- CI/validator hardening
- reference audits
- fresh-agent recovery test
- archive/history staging
- Practice salvage planning
- precise R07 deletion list preparation

Not allowed yet:
- delete `front-ui--test`
- bulk rename physics internal IDs/data paths
- merge `front-ui--test` wholesale
- ratify candidate specs without acceptance
- delete old docs/root archives before CI + final reference audit

## Next Executable Work

1. confirm Repository Governance GitHub Action result.
2. run fresh-agent recovery audit from README/AGENTS/CURRENT_POSITION/Match Graph.
3. update migration/authority state from CI evidence.
4. prepare exact R07 removal manifest for old docs/root ZIP duplicates.
5. keep Practice frontend branch protected until selective salvage is applied.
6. only then apply narrow destructive cleanup.
