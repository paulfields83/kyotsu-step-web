# W-MATH-002 — Mathematics Practice Title 2–3 Guidance Correction

Status: REVISE-PROPOSAL
Updated: 2026-10-10

## Objective

Strengthen the guided reasoning flow in Mathematics Ordinary Practice for catalog Title 2 「集合の演算」 and Title 3 「集合の領域」 without turning Practice into Textbook Mode.

## Authority

- `subjects/mathematics/AGENTS.md`
- `subjects/mathematics/practice/SPEC.md`
- `governance/INSTRUCTION_DICTIONARY.md` / CMD-WORK-001 「修正」
- read-only comparison with `front-ui--test` Practice frontend salvage candidates

## Branch

`work/math-practice-title23-guidance`

## Scope

Assessment and proposal only until explicit user approval.

Proposed implementation scope:
- redesign thought-node graphs for the 7 Title 2–3 source questions
- make `basis` / `purpose` visible as actual guidance
- restore graph-aware step transitions instead of relying only on display order
- add the missing within-question guidance metadata required by the canonical spec
- add a short Title 2 → Title 3 transition bridge
- reimplement the necessary Practice frontend behavior on current `main`, not by wholesale merging `front-ui--test`
- targeted browser/mobile QA for Title 2–3

## Do Not Touch

- Mathematics Textbook / Learning Mode
- Physics modes
- original problem statements / mathematical conditions / answers
- all Titles 4+ before Title 2–3 review
- `front-ui--test` branch contents by wholesale merge
- unrelated product redesign files
- source archive provenance

## Approved Proposal

None.

## Current Step

P-001 was not approved. Historical Git recovery found an earlier Section 2 / Section 3 guided vertical slice and associated Practice UI refinements. No product implementation has started.

## Next Step

STOP and wait for user instruction. Do not draft P-002 or implement changes until the user directs how the recovered historical work should be used.

## Completion Condition

The Work becomes implementation-ready only after explicit approval of the exact proposal revision.
