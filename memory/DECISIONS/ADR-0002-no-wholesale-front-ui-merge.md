# ADR-0002 — Do not merge front-ui--test wholesale

Status: ACCEPTED-FOR-DRAFT  
Date: 2026-10-05

## Context

`front-ui--test` has unique Practice frontend and redesign work, but its final tree is heavily behind main and its backend server lacks main's newer Practice API.

## Decision

Use main as the technical base. Salvage by function:
- port/reimplement Practice frontend
- review textbook experiments semantically
- quarantine redesign
- keep main backend/deployment/tooling unless a specific missing behavior is proven

## Evidence

See:
- `audit/BRANCH_SALVAGE_FRONT_UI_TEST.md`
- `audit/BRANCH_32_PATH_DISPOSITION.md`

## Consequence

Branch deletion is blocked until all valuable behavior is ported or explicitly rejected.
