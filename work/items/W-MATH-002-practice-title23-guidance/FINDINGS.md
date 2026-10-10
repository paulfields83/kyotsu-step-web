# Findings — W-MATH-002

## F-001

Date: 2026-10-10
Type: ERROR-IMPLEMENTATION
Statement: The Practice frontend reference implementation does not display per-step `basis` or `purpose`, even though the backend payload includes them.
Evidence: `front-ui--test/src/pages/PracticeSessionPage.tsx` renders STEP number, `operation`, content, and blanks, but not `basis` / `purpose`.
Impact: the canonical 「考えること / 使うもの」 guide is effectively absent.
Corrective rule / next action: P-001 Phase C.
Promote to Decision: NO
Promote to Lesson: YES

## F-002

Date: 2026-10-10
Type: ERROR-SPEC
Statement: Current runtime Practice schema is below the canonical node contract because it lacks `feeds` and `releaseAfterCorrect`.
Evidence: comparison of `backend/src/practiceSchema.ts` with Mathematics Practice canonical SPEC section 4.
Impact: the runtime cannot fully preserve the intended reasoning/release graph.
Corrective rule / next action: P-001 Phase D.
Promote to Decision: NO
Promote to Lesson: YES

## F-003

Date: 2026-10-10
Type: ERROR-IMPLEMENTATION
Statement: The reference Practice UI unlocks by global blank order rather than by actual mathematical dependency.
Evidence: `PracticeSessionPage.tsx` computes `firstUnresolvedIndex` over a flattened blank list and hides later steps by index.
Impact: pedagogical display order substitutes for the mathematical graph, contrary to the canonical spec.
Corrective rule / next action: use graph/release metadata for progression.
Promote to Decision: NO
Promote to Lesson: YES

## F-004

Date: 2026-10-10
Type: CONFIRMED
Statement: Catalog Title 2 is 「集合の演算」 and Title 3 is 「集合の領域」.
Evidence: `backend/data/practice/math-1a/sets-and-logic/catalog.json` order 2 and 3.
Impact: W-MATH-002 scope is concretely identified.
Promote to Decision: NO
Promote to Lesson: NO

## F-005

Date: 2026-10-10
Type: CONFIRMED
Statement: Title 2 contains six source questions (95, 96, 97, 99, 100, 演習A-8) and Title 3 contains Q98.
Evidence: `source/set-operations.json` and `source/set-regions.json`.
Impact: all seven can be fully graph-audited before any broader rollout.
Promote to Decision: NO
Promote to Lesson: NO

## F-006

Date: 2026-10-10
Type: CONFIRMED
Statement: Title 2–3 requires multi-stage intermediate reasoning that is not captured by a one-line source miniGuide alone.
Evidence: source problems require normalization, nested set operations, complement scope, candidate rejection, and four-region reconstruction.
Impact: fix must begin from full solutions and node graphs, not prose padding.
Promote to Decision: YES
Promote to Lesson: YES

## F-007

Date: 2026-10-10
Type: CONFIRMED
Statement: `front-ui--test` Practice frontend is a salvage reference, not the technical base.
Evidence: branch salvage audit marks `PracticeSessionPage.tsx` as REIMPLEMENT and current main backend as authority.
Impact: do not repair the divergent branch in place or merge it wholesale.
Promote to Decision: NO
Promote to Lesson: YES

## F-008

Date: 2026-10-10
Type: CONFIRMED
Statement: Existing `work/active/PRACTICE_CROSS_QUESTION_DEPENDENCY.md` is relevant design evidence but is not an exact approved proposal for the current Title 2–3 guidance correction.
Evidence: it predates the current Work approval system and has no exact user approval record for this Work.
Impact: W-MATH-002 must stop at proposal approval.
Promote to Decision: NO
Promote to Lesson: NO
