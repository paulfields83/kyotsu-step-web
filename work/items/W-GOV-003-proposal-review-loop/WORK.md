# W-GOV-003 — Proposal Review Loop

Status: DONE
Updated: 2026-10-08

## Objective

Make proposal review behavior explicit: user correction/advice is review feedback, not approval. A revised proposal must be shown and explicitly approved before implementation.

## Authority

- `governance/INSTRUCTION_DICTIONARY.md`
- `governance/WORK_SYSTEM.md`
- user approval in the current conversation on 2026-10-08

## Branch

`docs/proposal-review-loop`

## Scope

- CMD-WORK-001 review/approval semantics
- Work OS proposal revision loop
- Change Protocol correction flow
- AGENTS approval rule
- Proposal template
- governance validator checks
- simulation after merge

## Do Not Touch

- Mathematics textbook implementation
- PR #11 content
- Constitution principles
- unrelated commands

## Approved Proposal

`P-001` — APPROVED by user on 2026-10-08.

## Current Step

Completed. Rule merged to main and 7/7 workflow simulations passed.

## Next Step

None for W-GOV-003. W-MATH-001 is now correctly waiting at REVISE-PROPOSAL.

## Completion Condition

- feedback is formally distinct from approval
- revised proposal must be re-presented
- implementation cannot start from review feedback
- simulation cases pass
