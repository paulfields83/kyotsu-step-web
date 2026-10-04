# R07 Narrow Cleanup Result — 2026-10-05

Status: **PASS**

Branch: `chore/juku-repository-os-v1`

## Applied scope

Only the 29 paths listed in `migration/R07_REMOVAL_MANIFEST.md` were removed.

Removed:
- obsolete root `WORKFLOW.md`
- root delivery/archive duplicates:
  - `figure.zip`
  - `数学IA_教科書学習モード.zip`
- 11 migrated legacy `docs/` control documents
- 14 initial-app checkpoint reviews + old `.gitkeep`

Not touched:
- runtime code
- curriculum JSON
- Math Word source files
- Physics internal 1A–1G IDs/data paths
- `front-ui--test`

## Preservation

Before removal:
- historical control docs/checkpoints were copied under `history/`
- delivery ZIPs were copied under `archive/deliverables/`
- current architecture/content/deployment/UI/schema/quality docs were promoted
- provenance manifests were added

## Validation

GitHub Actions after removal:

```text
Juku repository governance check
errors: 0
warnings: 2
```

Remaining warnings:
1. Physics Chapter 1 three-chunk learner architecture is not yet implemented in runtime tree.
2. Physics learner lesson labels still expose internal 1A–1G codes.

These warnings are one known application/UI migration issue and are unrelated to the deleted historical/root duplicate files.

Latest cleanup workflow run:
- run `37221442627`
- conclusion: SUCCESS

## Conclusion

The narrow repository cleanup succeeded without removing runtime assets or unique branch work.

R05 documentation migration is complete for the audited legacy root/docs set.  
R07 cleanup is PASS for that scoped set.

Repository-wide final closure still depends on:
- Physics Chapter 1 learner-title migration
- Practice frontend salvage / preservation decision
- Math Practice cross-question dependency implementation
- final ratification/merge of Repository OS candidate specs
