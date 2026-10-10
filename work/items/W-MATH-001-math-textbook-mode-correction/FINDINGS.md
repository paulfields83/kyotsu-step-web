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
Type: ERROR-PROVENANCE
Statement: The first audit incorrectly inferred runtime figure absence from the raw static `unit.json` files.
Evidence: `backend/src/mathLearningFigures.ts` enriches Mathematics units at load time, and `src/domain/textbookBackendData.test.ts` verifies generated figure blocks/assets in loaded units.
Impact: the earlier claim “published runtime has no figures” was too broad.
Corrective rule / next action: distinguish raw source data from the final loaded textbook unit before making runtime claims. Preserve the existing runtime figure-enrichment pipeline and evaluate figure placement pedagogically during the pilot.
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

## F-006

Date: 2026-10-08
Type: CONFIRMED
Statement: In Mathematics Textbook / Learning Mode, the learner must not enter the next chapter until the current chapter is complete.
Evidence: explicit user correction requirement on 2026-10-08.
Impact: LearningSetup chapter selection needs progression gating.
Corrective rule / next action: implement sequential chapter locking inside Mathematics Textbook mode only.
Promote to Decision: YES
Promote to Lesson: YES

## F-007

Date: 2026-10-08
Type: ERROR-QA
Statement: In the supplied screenshot, the absolute-value delimiters around x+1 are too easy to miss.
Evidence: user-provided screenshot on 2026-10-08.
Impact: the mathematical expression can be misread as plain x+1.
Corrective rule / next action: trace the rendering path and use unambiguous math delimiters; verify desktop/mobile.
Promote to Decision: NO
Promote to Lesson: YES

## F-008

Date: 2026-10-08
Type: CONFIRMED
Statement: The exact source problem x>3 ⇒ |x+1|>2 is currently present under Mathematics Practice source data.
Evidence: `backend/data/practice/math-1a/sets-and-logic/source/propositions.json`.
Impact: this Work must not rewrite that Practice source merely because a screenshot was supplied during Textbook-mode correction.
Corrective rule / next action: fix shared rendering only if shared; otherwise open a separate Practice correction.
Promote to Decision: NO
Promote to Lesson: YES

## F-009

Date: 2026-10-08
Type: ERROR-PROCESS
Statement: P-002 was incorrectly marked APPROVED and implementation began from user review feedback rather than explicit approval of the revised proposal.
Evidence: live governance now defines REVIEW-FEEDBACK ≠ APPROVAL; the recorded evidence for P-002 was 「私のルールで守って結構！」 followed by two correction conditions.
Impact: W-MATH-001 must return to REVISE-PROPOSAL. Existing branch changes remain unmerged and frozen.
Corrective rule / next action: present full P-002, STOP, and wait for explicit approval before resuming or merging.
Promote to Decision: NO
Promote to Lesson: YES

