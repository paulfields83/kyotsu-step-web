# Repository Governance CI Evidence — 2026-10-05

Workflow: `Repository Governance Check`  
Run ID: `37221258052`  
Head: `997064376f2e7538dbe2a932fa7841ed9959b189`  
Conclusion: **SUCCESS**

## Executed

```bash
node tools/repo-governance-check.mjs
```

GitHub-hosted Ubuntu runner / Node 22 setup.

## Result

- errors: 0
- warnings: 4

Warnings:
1. root `figure.zip` duplicate still present
2. root `数学IA_教科書学習モード.zip` duplicate still present
3. Physics Chapter 1 three-chunk learner architecture not yet implemented in runtime tree
4. Physics learner lesson labels still expose internal 1A–1G codes

## Interpretation

The Repository OS structural contract is executable and passes in a clean GitHub checkout.

The remaining warnings are owned migration/product debt:
- warnings 1–2 are scheduled for R07 root cleanup
- warnings 3–4 are the Physics learner-facing architecture implementation gap

The validator correctly does **not** flag internal `1d-acceleration` paths themselves; stable internal IDs are allowed.
