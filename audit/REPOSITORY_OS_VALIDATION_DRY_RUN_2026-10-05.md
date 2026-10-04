# Repository OS Validation Dry Run — 2026-10-05

Branch: `chore/juku-repository-os-v1`  
Checked head: `b913a62c6b5add713e86e00feeadc82136450794`

## Result

**PASS-WITH-WARNINGS**

- files visible in branch tree: 783
- required Repository OS files missing: 0
- structural errors: 0

Validated:
- required governance/navigation/memory files exist
- all four mode specs exist
- each mode spec has valid candidate/canonical status
- each mode spec contains Purpose / Verification gate / Out of scope
- Master Match Graph contains R00 through R08
- Current Position contains Current Node / Current Rule / Next Executable Work
- Constitution contains Canonical Truth

## Warnings

1. root binary archive requires provenance classification:
   - `figure.zip`
2. root binary archive requires provenance classification:
   - `数学IA_教科書学習モード.zip`
3. retired/stale physics identifier candidate:
   - `backend/data/textbooks/physics/1d-acceleration/**`
   - 4 file paths currently detected

## Interpretation

The warnings are legacy/migration debt, not defects in the new Repository OS structure.

R07 destructive cleanup remains blocked until these warnings have explicit disposition and the high-value `front-ui--test` salvage is protected.

## Note

This was a remote structural dry run against the GitHub branch contents.  
The checked-in `tools/repo-governance-check.mjs` still needs execution in a full checkout/CI before it can be considered an enforced merge gate.
