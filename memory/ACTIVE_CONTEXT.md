# ACTIVE CONTEXT

Updated: 2026-10-05

## Current Focus

Repository OS v1 cleanup has moved from construction to **review/ratification**.

The audited root/docs cleanup is complete. Runtime feature gaps are intentionally separated from this cleanup branch.

## Completed

- repository/branch inventory
- document authority classification
- Constitution / authority / change protocol
- Match Graph / Current Position
- four mode canonical-candidate specs
- Physics Chapter 1 learner-facing architecture spec
- all 32 `front-ui--test` final-tree differences dispositioned
- current technical architecture/content/schema/UI/deployment canon extracted from live code
- quality gates / known-problems registry
- history/archive structure
- legacy root/docs preservation
- ZIP and Word/figure provenance
- root README router rewrite
- structural governance validator
- GitHub Actions governance workflow
- fresh-agent recovery test
- narrow R07 cleanup of 29 duplicate legacy paths
- post-cleanup CI success

## Current CI State

GitHub Actions after cleanup:
- errors: 0
- warnings: 2

Remaining warnings:
1. Physics Chapter 1 three-chunk learner architecture not yet implemented in runtime.
2. Physics learner labels still expose internal 1A–1G codes.

## Active Decisions

- internal Physics 1A–1G identities stay stable.
- learner-facing Chapter 1 uses 3 major chunks.
- Math Practice requires cross-question dependency metadata.
- Practice frontend must be selectively salvaged from `front-ui--test`.
- main backend/deployment remains the technical base.
- Repository OS cleanup is reviewed separately from runtime feature work.
- candidate specs are not ratified merely because they exist.

## Open Workstreams

### W1 — Repository OS review / ratification
Current branch → Draft PR → review → acceptance.

### W2 — Physics Chapter 1 learner UI
Implement 3 chunk cards, learner titles, bridge progression while preserving stable internal IDs.

### W3 — Math Practice dependency schema
Implement Q1→Q2 result dependencies and graph validation.

### W4 — Practice frontend salvage
Port/reimplement Practice frontend behavior onto current main technical contracts.

## Protected State

`front-ui--test` must remain until W4 is complete or its remaining behavior is explicitly rejected.
