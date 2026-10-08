# W-MATH-001 — Mathematics Textbook / Learning Mode Correction

Status: IMPLEMENTING
Updated: 2026-10-08

## Objective

Bring the current Mathematics Textbook / Learning Mode implementation into alignment with the canonical mathematics textbook spec without changing mathematical content unnecessarily.

## Authority

- `subjects/mathematics/AGENTS.md`
- `subjects/mathematics/MODE_MAP.md`
- `subjects/mathematics/textbook/SPEC.md`
- `governance/INSTRUCTION_DICTIONARY.md` / CMD-WORK-001 「修正」

## Branch

`work/math-textbook-mode-correction`

## Scope

Assessment and proposal only until user approval.

Potential implementation scope after approval:
- semantic representation of motivation / concept / property / proof / example
- renderer/UI distinction for proof/example/definition
- black concept/definition prose with functional color only
- pilot migration of Mathematics A 「図形の性質」
- figure placement/integration for the pilot where justified
- regression and mobile QA

## Do Not Touch

- Mathematics Practice mode
- Physics modes
- source DOCX files
- answer keys / stable item IDs unless separately justified
- all remaining published Mathematics units before pilot review
- draft/non-public legacy units

## Approved Proposal

`P-002` — APPROVED by user on 2026-10-08.

## Current Step

Implement P-002, starting with chapter gating and absolute-value readability trace before the semantic pilot.

## Next Step

Implement and verify the approved correction in staged order; stop after the pilot for user review.

## Completion Condition

This Work becomes implementation-ready only after a proposal is explicitly approved.
