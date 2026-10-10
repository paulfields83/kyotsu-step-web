# W-MATH-001 — Mathematics Textbook / Learning Mode Correction

Status: REVISE-PROPOSAL
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

None under the corrected proposal-review rule. `P-002` is awaiting explicit user approval.

## Current Step

Frozen at proposal review. Existing branch implementation is preserved as an unmerged prototype, but it was created before explicit approval of P-002 and must not be treated as authorized implementation.

## Next Step

Present the full revised P-002 to the user and STOP. Only after explicit approval of that exact proposal may implementation resume or PR #11 become merge-eligible.

## Completion Condition

This Work becomes implementation-ready only after a proposal is explicitly approved.
