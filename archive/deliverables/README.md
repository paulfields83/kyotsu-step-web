# Archived Deliverables

Status: ARCHIVE-STAGING  
Updated: 2026-10-05

Files here are preserved for provenance/recovery. They have **no current specification authority**.

## figure.zip

- size at main audit: 12,078,342 bytes
- blob SHA: `b2cb3ca846380078d6c3f4772a90e02dff39a6a5`
- introduced: commit `df34fe68`
- commit message: `Add uploaded physics figures and lockfile`
- role: uploaded delivery archive / source bundle
- current runtime authority: NO

Strong provenance evidence:
- the same introduction commit also added 17 extracted PNG files under `tmp_figures/`
- commit `79be5372` renamed those PNG blobs into actual textbook/public asset paths without changing their blob SHA
- `tmp_figures/` no longer exists on current main
- current physics/public asset files therefore preserve the extracted images independently of the ZIP

Disposition:
- preserve under archive for recovery/history
- root duplicate is a deletion candidate in R07 after final validation

## 数学IA_教科書学習モード.zip

- size at main audit: 2,231,021 bytes
- blob SHA: `782a41b27291486ea33a152aba3608e022acafc4`
- introduced: commit `25a112aa`
- commit message: `Add Math IA textbook archive`
- role: delivery/archive snapshot
- current runtime authority: NO

Strong provenance evidence:
- commit `e063e82e` immediately before it added the Math IA Word source documents under `backend/data/textbooks/math-1a/source/`
- current main explicitly treats Math Word files as authoring sources and production textbook units as static validated data
- the ZIP is therefore not the only surviving copy of the authoring corpus

Disposition:
- preserve under archive for recovery/history
- root duplicate is a deletion candidate in R07 after final validation

## Archive rule

Archive presence does not mean “read this first”.

New work must use:
- governance for authority
- subject mode specs for pedagogy
- technical contracts for runtime
- source manifests for authoring provenance
