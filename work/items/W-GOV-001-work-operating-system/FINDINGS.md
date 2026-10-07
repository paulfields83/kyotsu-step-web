# Findings — W-GOV-001

## F-001

Date: 2026-10-07
Type: ERROR-PROCESS
Statement: The previous `憲法から` definition allowed Strategy → Execution too directly and did not require an explicit check that the concrete proposal had already been approved.
Evidence: version 1.0.0 of `governance/COMMAND_WORDS.md`.
Impact: an agent could interpret “修正したい” or a concrete request as permission to execute an unreviewed correction design.
Corrective rule / next action: add a Work approval gate; unapproved work stops at proposal/user approval.
Promote to Decision: YES
Promote to Lesson: YES

## F-002

Date: 2026-10-07
Type: CONFIRMED
Statement: Approval should survive chat boundaries when the repository preserves the exact approved proposal and the current work remains inside that scope.
Evidence: user requirement that an already-approved correction plan should continue without asking again.
Impact: reduces repetitive confirmation while preserving control.
Corrective rule / next action: Proposal records must contain approval state/evidence.
Promote to Decision: YES
Promote to Lesson: YES

## F-003

Date: 2026-10-07
Type: CONFIRMED
Statement: Project-level Current Position/Progress/Decision/Lesson are insufficient for detailed task continuity without per-Work action and finding records.
Evidence: user requirement to preserve what was done, where it was done, detailed notes, wrong operations, and correct conclusions.
Impact: a per-Work record layer is required.
Corrective rule / next action: use five-file Work structure.
Promote to Decision: YES
Promote to Lesson: NO

## F-004

Date: 2026-10-07
Type: CONFIRMED
Statement: Errors and correct conclusions need distinct persistent classification; neither should live only in chat history.
Evidence: user explicitly requested both wrong and correct items to be stored and separated by type/location.
Impact: Findings taxonomy must include both CONFIRMED and typed ERROR records.
Corrective rule / next action: maintain Findings taxonomy and promote durable items selectively.
Promote to Decision: YES
Promote to Lesson: YES
