# CURRENT POSITION

Updated: 2026-10-05  
Repository: `paulfields83/kyotsu-step-web`  
Working branch: `chore/juku-repository-os-v1`

## Current Node

R02 Repository OS v1 foundation complete enough to proceed.  
Next primary node: R03 MODE CANON.  
R04 branch salvage has completed initial structural audit but not feature disposition.

## Confirmed Facts

- main head: `7ebbac15` (2026-10-02).
- main contains 718 files / 195 directories.
- `backend/data/textbooks/` contains 545 files and about 32.9 MB.
- existing root README/WORKFLOW/docs primarily describe the earlier app phase and do not fully describe later textbook/practice production work.
- initial document authority classification is recorded in `audit/DOCUMENT_AUTHORITY_CLASSIFICATION.md`.
- `front-ui--test` is 127 commits ahead / 181 behind main, but final tree delta is manageable: 10 branch-only files + 22 modified paths.
- high-value branch-only area: backend-driven Practice frontend.
- main backend is newer than front-ui--test backend for Practice API; whole-branch merge is rejected.
- root contains binary archives including `figure.zip` and `数学IA_教科書学習モード.zip`.
- physics textbook paths still include `1d-acceleration`; stale-name candidate, not deletion target yet.

## Current Rule

NO DESTRUCTIVE CLEANUP YET.

Allowed:
- audit/classify
- build canonical mode specs
- port/salvage analysis
- write Repository OS docs on isolated branch
- design validators
- identify archive/quarantine destinations

Not allowed yet:
- delete branch
- delete/move unknown binary/source
- mass rewrite production data
- rename retired-looking sections without canonical mode map
- merge front-ui--test wholesale

## Next Executable Work

1. R03: build four canonical mode specs, starting with Math Textbook and Math Practice because their current artifacts are strongest.
2. Reconcile latest approved chat lessons with repository candidates.
3. Then define Physics Textbook/Practice specs and retired section mapping.
4. Convert R04's 32-path branch delta into KEEP-MAIN / PORT-FRONT / REIMPLEMENT / ARCHIVE decisions.
5. R06 validators.
6. R07 cleanup only after the above.
