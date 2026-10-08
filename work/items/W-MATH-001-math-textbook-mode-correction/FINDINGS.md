# Findings — W-MATH-001

## F-001

Date: 2026-10-08
Type: ERROR-IMPLEMENTATION
Statement: The current textbook schema cannot encode the canonical semantic distinction among concept, definition, property, proof, and example.
Evidence: `src/domain/textbookSchema.ts` reading block union contains only topic / heading / paragraph / formula / figure / note.
Impact: renderer and validators cannot enforce the Mathematics Textbook canonical structure.
Corrective rule / next action: P-001 proposes backward-compatible semantic role metadata.
Promote to Decision: NO
Promote to Lesson: NO

## F-002

Date: 2026-10-08
Type: ERROR-IMPLEMENTATION
Statement: The renderer treats proof/example/definition content generically because it only sees structural block types.
Evidence: `src/pages/TextbookUnitPage.tsx` maps topic/heading/note/paragraph/formula/figure to generic visual components.
Impact: canonical Proof / Example visual separation cannot be guaranteed.
Corrective rule / next action: add role-aware rendering after proposal approval.
Promote to Decision: NO
Promote to Lesson: NO

## F-003

Date: 2026-10-08
Type: CONFIRMED
Statement: Across the seven currently published Mathematics textbook units, 407 of 427 heading blocks are worksheet-style textbook-question/problem headings.
Evidence: repository-wide scan of published Math `unit.json` readingFlow data.
Impact: the current flow is strongly prompt/worksheet-shaped relative to the canonical prose-backbone architecture.
Corrective rule / next action: pilot should reduce mechanical headings and restore continuous textbook prose where appropriate.
Promote to Decision: NO
Promote to Lesson: NO

## F-004

Date: 2026-10-08
Type: CONFIRMED
Statement: All seven currently published Mathematics units have zero declared figures and zero figure blocks in their learning flow, while curated Math figure assets and QA sources exist in the repository.
Evidence: repository-wide published-unit scan plus `backend/data/textbooks/math-1a/figure-sources/` and unit asset directories.
Impact: figure integration is absent from current published learning-flow data.
Corrective rule / next action: integrate figures only after deciding their pedagogical role and placement.
Promote to Decision: NO
Promote to Lesson: YES

## F-005

Date: 2026-10-08
Type: CONFIRMED
Statement: No existing approved Work/Decision/Lesson specifically authorizes a Mathematics learning-mode correction implementation.
Evidence: main-branch search of `work/items`, `work/active`, `memory/DECISIONS`, and `memory/LESSONS`.
Impact: CMD-WORK-001 requires a new proposal and stop before implementation.
Corrective rule / next action: await user approval of P-001.
Promote to Decision: NO
Promote to Lesson: NO
