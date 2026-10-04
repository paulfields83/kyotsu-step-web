# CURRENT POSITION

Updated: 2026-10-05  
Repository: `paulfields83/kyotsu-step-web`  
Working branch: `chore/juku-repository-os-v1`

## Current Node

R06 VALIDATORS is the next active construction node.  
R03 has four CANONICAL-CANDIDATE mode specs.  
R04 has all 32 final-tree differences dispositioned, but salvage has not yet been applied.

## Confirmed Facts

- main head at audit start: `7ebbac15` (2026-10-02).
- main inventory: 718 files / 195 directories.
- old root README/WORKFLOW/docs do not fully represent the later textbook/practice project.
- four mode specs now exist:
  - Math Textbook
  - Math Practice
  - Physics Textbook
  - Physics Common-Test Guided Practice
- Math Practice spec explicitly requires both within-question and cross-question dependencies.
- Physics Textbook spec rejects old `1A〜1G/1D` identifiers as chapter authority.
- `front-ui--test`: 10 unique + 22 modified final-tree paths.
- salvage target: Practice frontend vertical slice.
- main backend wins over branch backend; whole-branch merge rejected.
- redesign files are quarantine/product-review candidates.
- root binary archives remain protected until provenance/reproducibility audit.

## Current Rule

NO DESTRUCTIVE CLEANUP YET.

Allowed:
- validators
- documentation migration design
- non-destructive provenance classification
- Practice salvage implementation on an isolated feature branch after contract tests
- archive/quarantine design

Not allowed:
- delete `front-ui--test`
- delete/move unknown binary/source
- mass rename physics sections
- merge branch wholesale
- mark Constitution or mode candidates canonical without acceptance/audit

## Next Executable Work

1. R06: add structural repository validator and validation policy.
2. R05: design new target tree and migration table for existing root/docs/assets.
3. audit binary/source provenance.
4. prepare Practice frontend salvage plan/branch.
5. run fresh-agent recovery test.
6. only then open R07 destructive cleanup.
