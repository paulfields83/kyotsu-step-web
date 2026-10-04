# Repository Audit — 2026-10-05

Repository: `paulfields83/kyotsu-step-web`

## 1. Scale

main recursive inventory:
- files: 718
- directories: 195
- docs: 26 files
- src: 64 files
- e2e: 12 files
- backend/data/textbooks: 545 files, ~32.9 MB
- backend/data/practice: 16 files, ~82.9 KB
- public: 9 files, ~2.62 MB

This is no longer a small app repository. It contains application code, content source, generated assets, project history, binary handoffs, and deployment material.

## 2. Control-Document Drift

Current root documents such as README.md, WORKFLOW.md, docs/PRODUCT_REQUIREMENTS.md, docs/WORKLOG.md primarily describe the original app lifecycle and early sample-question architecture.

Later repository content includes:
- full math textbook-learning datasets
- many physics textbook units
- math practice backend data
- figure source trees and QA outputs
- Word source documents and archive bundles

Therefore, root control documents cannot currently be assumed to represent the whole project state.

## 3. Branch Risk

Branches:
- main
- backend
- front-ui--test
- test/all-math-guidance-merged-v1
- test/all-math-textbook-guidance-v1
- test/geometry-guidance-v1

Comparison to main:
- backend: 0 ahead, 3 behind
- three test/* branches: 0 ahead, behind main
- front-ui--test: 127 ahead, 181 behind

Unique work observed in front-ui--test includes:
- backend-driven practice repository
- PracticeSessionPage
- practice taxonomy/session flow changes
- redesign layout/pages
- Word source corpus
- textbook guided-example UI experiments

Conclusion: front-ui--test MUST NOT be deleted before a functional salvage audit.

## 4. Root Artifact Risk

Observed root binary archives:
- `figure.zip`
- `数学IA_教科書学習モード.zip`

Binary archives are poor canonical working sources because contents and provenance are not visible in normal code review. They should eventually be classified as source backup, deliverable, generated bundle, or archive.

## 5. Naming / Stale-Spec Risk

Physics textbook data currently includes `backend/data/textbooks/physics/1d-acceleration`.  
Recent project decisions indicate historical section identifiers may have been retired/reorganized. This path is therefore a stale-spec candidate, not an automatic deletion target.

## 6. Repository Boundary Problem

The same repository currently mixes:
- runtime code
- backend code
- canonical/near-canonical curriculum data
- source Word files
- figure source and generated figures
- QA results
- old project planning/checkpoints
- zip deliverables/backups

The cleanup should introduce explicit boundaries between:
1. product runtime
2. curriculum source
3. generated artifacts
4. governance
5. active work
6. memory/history
7. archive

## 7. Immediate Recommendations

P0:
- protect unique branch work from deletion
- establish authority model
- establish current-position/navigation files
- freeze destructive cleanup

P1:
- classify current docs
- create four mode canonical specs
- identify generated vs source assets
- create archive/quarantine policy

P2:
- add CI validators for governance links/status/retired references
- simplify old checkpoint/history layout after preservation
