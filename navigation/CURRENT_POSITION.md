# CURRENT POSITION

Updated: 2026-10-05  
Repository: `paulfields83/kyotsu-step-web`  
Working branch: `chore/juku-repository-os-v1`

## Current Node

R00 INVENTORY + R01 AUTHORITY MAP + R02 REPOSITORY OS v1 foundation

## Confirmed Facts

- main head: `7ebbac15` (2026-10-02), merge message: "Merge backend app and textbook figures for deployment".
- main contains 718 files / 195 directories.
- `backend/data/textbooks/` alone contains 545 files and about 32.9 MB.
- existing root README/WORKFLOW/docs primarily describe the earlier app phase and do not fully describe later textbook/practice production work.
- branch `front-ui--test` diverged from main and has 127 commits ahead / 181 behind.
- `front-ui--test` contains work not present on main, including backend-driven practice UI, PracticeSessionPage, redesign pages, and math source Word files.
- old test branches are currently behind main and have no ahead commits in the branch comparison.
- root contains binary archives including `figure.zip` and `数学IA_教科書学習モード.zip`.
- physics textbook paths still include `1d-acceleration`; this is a stale-name candidate and must not be deleted/renamed until mode canon is resolved.

## Current Rule

NO DESTRUCTIVE CLEANUP YET.

Allowed:
- audit
- classify
- write Repository OS docs on the isolated branch
- identify conflicts
- propose migration

Not allowed yet:
- delete branch
- delete/move unknown binary/source
- rewrite current production data en masse
- declare main the sole canonical history without branch salvage

## Next Executable Work

1. Complete authority classification of existing control docs.
2. Audit unique `front-ui--test` work by functional area.
3. Build canonical specs for Math Textbook / Math Practice / Physics Textbook / Physics Practice from current artifacts + latest approved lessons.
4. Define archive/quarantine destinations.
5. Add repository consistency validators.
6. Only then run cleanup apply.
