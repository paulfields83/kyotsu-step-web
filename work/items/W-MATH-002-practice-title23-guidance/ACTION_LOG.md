# Action Log — W-MATH-002

## A-001

Date: 2026-10-10
Action: Recovered Mathematics Ordinary Practice canonical spec and mode boundary.
Target / location:
- `subjects/mathematics/AGENTS.md`
- `subjects/mathematics/MODE_MAP.md`
- `subjects/mathematics/practice/SPEC.md`
Result: SUCCESS

## A-002

Date: 2026-10-10
Action: Audited the current Practice backend schema, loader, public payload, and tests.
Target / location:
- `backend/src/practiceSchema.ts`
- `backend/src/practiceData.ts`
- `backend/src/publicPractice.ts`
- `src/domain/practiceBackendData.test.ts`
Result: SUCCESS

## A-003

Date: 2026-10-10
Action: Audited source problems for catalog Title 1, Title 2, and Title 3.
Target / location:
- `source/set-basics.json`
- `source/set-operations.json`
- `source/set-regions.json`
Result: SUCCESS

## A-004

Date: 2026-10-10
Action: Inspected the protected `front-ui--test` Practice Session implementation read-only.
Target / location:
- `src/pages/PracticeSessionPage.tsx`
- `src/domain/practice.ts`
- `src/repositories/practiceRepository.ts`
Result: SUCCESS
Note: no branch merge or modification performed.

## A-005

Date: 2026-10-10
Action: Checked prior branch-salvage decisions.
Target / location:
- `audit/BRANCH_SALVAGE_FRONT_UI_TEST.md`
- `audit/BRANCH_32_PATH_DISPOSITION.md`
Result: SUCCESS
Finding: PracticeSessionPage is explicitly REIMPLEMENT, not wholesale-port authority.

## A-006

Date: 2026-10-10
Action: Reviewed the legacy cross-question dependency design for adjacent schema context.
Target / location: `work/active/PRACTICE_CROSS_QUESTION_DEPENDENCY.md`
Result: SUCCESS
Finding: useful design evidence, but not an approval record for this Title 2–3 correction.

## A-007

Date: 2026-10-10
Action: Searched all live repository branches and historical commits for earlier Section 2 / Section 3 Practice work.
Target / location:
- branch inventory
- Git commit history
- deleted historical `backend/data/practice/math-1a/sets-and-logic/questions.json`
- `front-ui--test` Practice frontend history
Result: SUCCESS.

## A-008

Date: 2026-10-10
Action: Recovered the deleted six-question guided vertical slice from commit ancestry.
Target / location:
- introduction commit `65603cc442b2f7cc851138d91e3cc5e2c6b9554c`
- readable snapshot at parent-state commit `96d18e01b52604da15c2fd7321f78685258e4a4b`
Result: SUCCESS.
Recovered:
- `math-i-set-practice-q01` — Section 2 / set-operations
- `math-i-set-practice-q02` — Section 3 / set-regions

## A-009

Date: 2026-10-10
Action: Traced Practice frontend refinements associated with the guided flow.
Target / location:
- `c3bfaf6438b35e7d5dc64d08c9fe754fb7101868` — backend-driven PracticeSession
- `aa5609de6aff6b31b604dd0bbf41ddcd4c4b76bc` — substitute solved guidance blanks inline
- `8537c3dcbc4f5399ab69656dae6595908a3726b0` — show guided step operation headings
- `e9c52fa2097a7d8e19b11b906c5b7926c9eaea07` — style guided step headings
Result: SUCCESS.

## A-010

Date: 2026-10-10
Action: Verified why the historical Section 2 / 3 vertical slice disappeared from the active tree.
Target / location:
- compressed bundle commits
- `63cb0027916bf71551b6158a4b9ac205f9462f76`
Result: SUCCESS.
Finding: the old six-question `questions.json` was removed when the full guided bank became the active bundle. The old content remains recoverable in Git history.

## A-007

Date: 2026-10-10
Action: Stopped P-001 after user rejection and searched GitHub main, old branches, and commit history for prior Section 2/3 corrections.
Result: SUCCESS.

## A-008

Date: 2026-10-10
Action: Recovered the old representative guided Practice q01/q02 structures from commit history.
Evidence:
- `65603cc442b2f7cc851138d91e3cc5e2c6b9554c` — added six guided samples including set-operations and set-regions
- `63cb0027916bf71551b6158a4b9ac205f9462f76` — removed six samples during full-bank replacement
- `08ddb51de4386d041b95748637f669b98435bf75` — later repaired the first segment of the compressed guided bundle
Result: SUCCESS.

## A-009

Date: 2026-10-10
Action: Paused before drafting P-002, per user instruction.
Result: STOPPED-AS-REQUESTED.

## A-010

Date: 2026-10-10
Related proposal: P-002
Action: Created the seven-question historical-to-current mapping table before product edits.
Target / location: `work/items/W-MATH-002-practice-title23-guidance/HISTORICAL_CURRENT_MAPPING.md`
Result: SUCCESS.
Finding: Q95/Q98 can reproduce the old q01/q02 guidance quality with the existing Practice schema.

## A-011

Date: 2026-10-10
Related proposal: P-002
Action: Added same-schema Practice question overrides without replacing the compressed 36-question bundle.
Target / location:
- `backend/src/practiceData.ts`
- `backend/data/practice/math-1a/sets-and-logic/question-overrides/title-2-3-pilot.json`
Result: SUCCESS.
Safeguard: an override whose questionId does not already exist in the full bank throws at load time.

## A-012

Date: 2026-10-10
Related proposal: P-002
Action: Restored the old guided pattern on current exact Q95 and Q98.
Target / location: Q95 / Q98 pilot override data
Result: SUCCESS.
Details:
- Q95: 5 staged reasoning steps, 14 blanks
- Q98: 6 reasoning steps, 4 blanks
- current source problem statements/numbers/answers preserved
- no new Practice schema fields added

## A-013

Date: 2026-10-10
Related proposal: P-002
Action: Reimplemented the minimum backend-Practice frontend on current main.
Target / location:
- `src/domain/practice.ts`
- `src/domain/practiceFlow.ts`
- `src/repositories/practiceRepository.ts`
- `src/pages/PracticeSessionPage.tsx`
- `src/pages/LearningSetupPage.tsx`
- `src/app/App.tsx`
- Practice-only CSS
Result: SUCCESS.
Behavior:
- shows 何をする / なぜ / 使うもの
- shows resolved dependency results
- releases steps by `dependsOn`
- reveals only the next unresolved blank within a step

## A-014

Date: 2026-10-10
Related proposal: P-002
Action: Opened draft PR #14 and ran repository CI.
Target / location: PR #14
Result: SUCCESS.
Evidence:
- Repository Governance Check: SUCCESS
- backend typecheck: SUCCESS
- frontend typecheck: SUCCESS
- unit tests: SUCCESS
- production build: SUCCESS

## A-015

Date: 2026-10-10
Related proposal: P-002
Action: Stopped after Q95/Q98 pilot as required by the approved review gate.
Result: STOPPED-AS-PLANNED.

