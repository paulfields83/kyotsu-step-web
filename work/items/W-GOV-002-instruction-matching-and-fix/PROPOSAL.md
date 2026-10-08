# Proposals — W-GOV-002

## P-001 — Instruction Matching Rule + CMD-WORK-001

Status: APPROVED
Created: 2026-10-08

### Problem / Need

Natural-language GitHub instructions can be similar to a registered command without being exactly the same. Automatically treating similar wording as the same command can expand authority incorrectly.

The project also needs a canonical correction macro for existing artifacts.

### Proposed Solution

1. Add EXACT / SIMILAR / UNKNOWN instruction matching.
2. For SIMILAR, show the candidate command and its meaning, then ask the user whether to treat the instruction as that command.
3. For UNKNOWN important GitHub instructions, stop normal work and prioritize instruction-dictionary correction.
4. Register CMD-WORK-001 「修正」:
   - assess what needs correction first;
   - if no approved correction proposal exists, propose and stop;
   - if already approved, execute only that scope;
   - record action/findings/verification/memory close.

### Out of Scope

No other command words or aliases.

### Approval

Status: APPROVED
Approved by user: YES
Approval date: 2026-10-08
Approval evidence: user explicitly answered 「そう」 after the proposed SIMILAR handling and CMD-WORK-001 mapping were presented.
