# Proposals — W-GOV-003

## P-001 — Proposal Review Loop

Status: APPROVED
Created: 2026-10-08

### Problem / Need

The current Work OS says that material changes return to REVISE-PROPOSAL, but it does not explicitly prevent an agent from treating user review comments such as 「いいけど、1. ... 2. ...」 as approval of a newly inferred revision.

This caused W-MATH-001 to move from user feedback directly into an agent-created P-002 and implementation without first presenting P-002 for approval.

### Proposed Solution

1. Define **REVIEW-FEEDBACK ≠ APPROVAL**.
2. If feedback adds, removes, modifies, rejects, or conditions any part of a proposal:
   - do not implement;
   - move to `REVISE-PROPOSAL`;
   - create a new proposal revision/ID;
   - preserve the old proposal history;
   - present the full revised proposal;
   - STOP.
3. Only explicit approval of the revised proposal may move to APPROVED.
4. A short affirmative such as 「そう」「OK」 counts only when it directly answers a specific approval question about the exact proposal and contains no scope/design changes.
5. If approval intent is ambiguous, ask rather than infer.
6. Add validator markers and a simulation suite.

### Approval

Status: APPROVED
Approved by user: YES
Approval date: 2026-10-08
Approval evidence: user agreed that the correct flow is review feedback → revised proposal → explicit approval, then instructed 「だからルールとしてこれを修正すべき。終わった後で作業のシミュレーションを行う。」
