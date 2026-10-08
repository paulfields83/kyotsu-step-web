# Repository OS Changelog

## 2026-10-05 — Repository OS v1.0.0 ratified

### Governance / navigation
- created isolated `chore/juku-repository-os-v1` branch
- inventoried main and all visible branches
- introduced Constitution, authority model, and change protocol
- introduced Master Match Graph and Current Position
- split project memory into brief / active / progress / lessons / decisions / changelog

### Educational canon
- ratified separate canonical specs for:
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
- project owner approved ratification and merge sequence
- Constitution ratified as v1.0.0
- educational, technical, and quality canon promoted from candidate to canonical
- PR #3 authorized for merge after final CI
- PR #3 final Governance and normal PR checks passed
- PR #3 merged to `main` using squash merge
- merge commit: `caf6983a6ef4bc52634bc244b2f6ce61fbd9d8fe`


## 2026-10-07 — Work Operating System v1 design

- user approved the integrated Work/approval/recording design
- created W-GOV-001 as the first formal Work
- added canonical Work state machine and approval gate
- added WORK / PROPOSAL / ACTION_LOG / FINDINGS / VERIFICATION records
- added CONFIRMED and typed ERROR findings
- added Work-to-Decision/Lesson/current-state promotion rules
- revised `憲法から` so unapproved proposals stop at the approval gate
- extended repository governance validation for Work records

## 2026-10-08 — Work Operating System v1 merged

- reconciled PR #6 with PR #7 root instruction dictionary
- preserved `CMD-ROOT-001 — 憲法から` as the highest-priority GitHub command
- integrated Work identification / approval gate / action logs / findings / verification below Root Command recovery
- final Repository Governance Check: SUCCESS
- final normal PR checks: SUCCESS
- PR #6 squash merged to `main`
- merge commit: `a3d003efe4c1a1788033a2a063163b0ef79b0235`
- W-GOV-001 closed as DONE

## 2026-10-08 — Proposal review loop correction

- user clarified that proposal feedback must not be treated as approval
- opened W-GOV-003
- added REVIEW-FEEDBACK ≠ APPROVAL invariant
- required REVISE-PROPOSAL → revised proposal presentation → explicit approval before implementation
- recorded the W-MATH-001 premature-approval incident as ERROR-PROCESS

### Proposal review loop verification

- PR #12 merged to `main`
- merge commit: `bf7ff5e85de9da0b577a44b372882f5193430770`
- ran 7 proposal review/approval simulations against live main
- all 7 PASS
- real W-MATH-001 / PR #11 regression detected prior invalid approval evidence
- W-MATH-001 returned to REVISE-PROPOSAL; P-002 is awaiting explicit approval
- PR #11 remains draft/unmerged

