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

## F-009

Date: 2026-10-10
Type: CONFIRMED
Statement: Git history contains an earlier guided Practice vertical slice specifically covering Section 2 「集合の演算」 and Section 3 「集合の領域」.
Evidence:
- commit `65603cc442b2f7cc851138d91e3cc5e2c6b9554c` introduced the guided questions file.
- snapshot before deletion is readable at `96d18e01b52604da15c2fd7321f78685258e4a4b`.
Impact: a new correction proposal must not be designed from zero before evaluating this prior work.
Promote to Decision: NO
Promote to Lesson: YES

## F-010

Date: 2026-10-10
Type: CONFIRMED
Statement: Historical Section 2 question `math-i-set-practice-q01` already used a seven-step reasoning graph with explicit `dependsOn`, `basis`, `purpose`, `operation`, content, and blanks.
Evidence: recovered historical `questions.json`.
Impact: prior guidance design is materially richer than source-level one-line miniGuide and must be considered before redesign.
Promote to Decision: NO
Promote to Lesson: NO

## F-011

Date: 2026-10-10
Type: CONFIRMED
Statement: Historical Section 3 question `math-i-set-practice-q02` already represented the problem as four-region reconstruction: first derive the missing region, then rebuild A/B and downstream sets.
Evidence: recovered historical `questions.json`.
Impact: the earlier design already contains the central reasoning architecture for Section 3.
Promote to Decision: NO
Promote to Lesson: NO

## F-012

Date: 2026-10-10
Type: CONFIRMED
Statement: The historical Practice UI was subsequently refined to substitute solved earlier blanks into later prompts and to show explicit STEP operation headings.
Evidence: commits `aa5609...`, `8537c3...`, and `e9c52f...`.
Impact: recovered historical work is not data-only; relevant UI behavior also exists in branch history.
Promote to Decision: NO
Promote to Lesson: NO

## F-013

Date: 2026-10-10
Type: CONFIRMED
Statement: The old six-question guided file was removed when the full guided bank replaced the sample vertical slice.
Evidence: commit `63cb0027916bf71551b6158a4b9ac205f9462f76` removes `questions.json` with message `data(practice): replace six samples with full guided bank`; compressed bundle and loader commits precede it.
Impact: prior Section 2 / 3 work was not disproven; it was displaced by the full-bank migration and survives only in Git history.
Promote to Decision: NO
Promote to Lesson: YES

## F-014

Date: 2026-10-10
Type: OPEN-QUESTION
Statement: No separate canonical document explicitly labels the recovered q01/q02 state as “final approved Section 2 / 3 correction”.
Evidence: current main/history code search and branch scan found the implementation history but no such approval document.
Impact: treat it as strong historical design evidence, not automatic current authority, until the user decides how to reuse it.
Promote to Decision: NO
Promote to Lesson: NO

## F-009

Date: 2026-10-10
Type: CONFIRMED
Statement: Git history contains an earlier six-question guided Practice sample with dedicated Section 2/3 examples:
- `math-i-set-practice-q01` — 「集合の演算を順序よく整理する」
- `math-i-set-practice-q02` — 「領域の情報から集合を復元する」
Evidence: commit `65603cc442b2f7cc851138d91e3cc5e2c6b9554c` (“Add guided sets and logic practice data to backend”).
Impact: any new Title 2/3 correction proposal must first compare against this earlier completed guidance structure.
Promote to Decision: NO
Promote to Lesson: YES

## F-010

Date: 2026-10-10
Type: CONFIRMED
Statement: The earlier q01/q02 samples were removed when the repository replaced the representative six-question sample bank with the full guided bank.
Evidence: commit `63cb0027916bf71551b6158a4b9ac205f9462f76` (“data(practice): replace six samples with full guided bank”) deletes the old `questions.json`.
Impact: rich sample guidance could have been lost or diluted during full-bank migration.
Promote to Decision: NO
Promote to Lesson: YES

## F-011

Date: 2026-10-10
Type: CONFIRMED
Statement: The earlier q01/q02 samples were deliberate backend Practice design, not undocumented scratch content.
Evidence: commit `be1db94e4b33237ed0f17790b37ac584db85e64a` documents `solutionSteps` with `dependsOn / basis / purpose / operation` and sequential guided interaction as the Practice hierarchy.
Impact: the old Section 2/3 samples are valid design evidence, although their problem statements are reconstructed samples rather than the current exact 4STEP source questions.
Promote to Decision: NO
Promote to Lesson: YES

## F-012

Date: 2026-10-10
Type: CONFIRMED
Statement: The historical q01/q02 mother pattern is sufficient for the Q95/Q98 pilot without adding `feeds` or `releaseAfterCorrect`.
Evidence: Q95/Q98 pilot passes backend/frontend typechecks, unit tests, and build using existing `dependsOn / basis / purpose / operation / blankIds`.
Impact: no schema extension is justified at this stage.
Promote to Decision: NO
Promote to Lesson: YES

## F-013

Date: 2026-10-10
Type: CONFIRMED
Statement: The compressed full bank can be preserved while selectively correcting pilot questions using same-schema overrides.
Evidence: loader requires override targets to already exist; full published question count remains 36 under tests.
Impact: no bundle rollback or full-bank rewrite is necessary.
Promote to Decision: NO
Promote to Lesson: YES

## F-014

Date: 2026-10-10
Type: CONFIRMED
Statement: Current main lacked a backend-Practice learner page even though the Practice API already existed.
Evidence: pre-pilot main routed ordinary learning through the local question system; the protected `front-ui--test` contained the earlier backend Practice session reference implementation.
Impact: the pilot reimplements only the minimum Practice vertical slice on current main.
Promote to Decision: NO
Promote to Lesson: YES

