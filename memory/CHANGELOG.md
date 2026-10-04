# Repository OS Changelog

## 2026-10-05 — v1 draft review package

### Governance / navigation
- created isolated `chore/juku-repository-os-v1` branch
- inventoried main and all visible branches
- introduced Constitution, authority model, and change protocol
- introduced Master Match Graph and Current Position
- split project memory into brief / active / progress / lessons / decisions / changelog

### Educational canon
- created separate canonical-candidate specs for:
  - Mathematics Textbook
  - Mathematics Ordinary Practice
  - Physics Textbook
  - Physics Common-Test Guided Practice
- added Physics Chapter 1 learner-facing architecture
- clarified that internal Physics 1A–1G IDs remain stable while learner-facing titles use three chunks
- identified Math Practice cross-question dependency as a schema implementation gap

### Technical canon
- reconstructed current architecture from live code
- promoted current content/data policy, schema map, Common-Test contract, UI design system, deployment model, and quality gates
- recorded current backend/API and public/private answer boundary

### Branch salvage
- audited `front-ui--test`
- reduced final-tree difference to 10 unique + 22 modified paths
- dispositioned all 32 paths
- rejected wholesale merge
- protected Practice frontend for selective salvage

### History / provenance / cleanup
- preserved 27 legacy control/checkpoint documents under `history/`
- recorded Math Word source provenance
- recorded Physics Chapter 1 figure provenance
- moved delivery ZIPs under `archive/deliverables/`
- rewrote root README as a current router
- removed exactly 29 audited duplicate old paths in R07
- left runtime code/data and source Word files untouched

### Validation
- added `tools/repo-governance-check.mjs`
- added `.github/workflows/repository-governance.yml`
- fresh-agent recovery test: PASS
- GitHub Actions governance check: PASS
- post-cleanup result: errors 0, warnings 2
- remaining warnings are the Physics Chapter 1 learner-facing UI implementation gap

### Review state
- R05 documentation migration: PASS for audited legacy set
- R06 validators: PASS-WITH-WARNINGS
- R07 cleanup: PASS-NARROW
- R08 final audit: PASS-PARTIAL
- ready for Draft PR review; no automatic merge
