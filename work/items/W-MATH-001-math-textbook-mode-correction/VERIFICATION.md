# Verification — W-MATH-001

Status: IN-PROGRESS

## V-001 — Schema compatibility

Date: 2026-10-08
Target: textbook schema
Check: optional semantic roles do not invalidate existing untagged textbook data.
Expected: PASS
Result: PASS
Evidence: unit tests and backend/frontend typechecks SUCCESS.

## V-002 — Chapter order

Date: 2026-10-08
Target: Mathematics Textbook chapter catalog
Check: Mathematics I・A follows the approved canonical sequence.
Expected: 数と式 → 2次関数 → 集合と命題 → 図形と計量 → データの分析 → 場合の数と確率 → 図形の性質 → 数学と人間の活動
Result: PASS
Evidence: dedicated catalog unit test SUCCESS.

## V-003 — Chapter gate

Date: 2026-10-08
Target: Mathematics Textbook progression
Check: Chapter 2 is locked while Chapter 1 is incomplete and unlocks after Chapter 1 completion.
Expected: PASS
Result: PASS
Evidence: dedicated unlock-helper unit test SUCCESS; setup selection and direct URL use the same helper.

## V-004 — Absolute-value implementation

Date: 2026-10-08
Target: Mathematics Textbook reading prose
Check: plain `|...|` expressions are rendered using explicit KaTeX absolute-value delimiters.
Expected: PASS
Result: PASS-CODE
Evidence: frontend typecheck/build SUCCESS.
Remaining: visual desktop/mobile confirmation by user.

## V-005 — Exact supplied screenshot provenance

Date: 2026-10-08
Target: user-supplied `x>3 ⇒ |x+1|>2` example
Check: determine whether the exact source belongs to Mathematics Textbook or Practice.
Expected: no cross-mode edit
Result: PASS
Evidence: exact source problem is under `backend/data/practice/math-1a/sets-and-logic/source/propositions.json`; Practice source was not modified in W-MATH-001.

## V-006 — Semantic pilot

Date: 2026-10-08
Target: Mathematics A 「図形の性質」
Check: Definition / Property / Proof / Example roles exist and the example hierarchy no longer uses double worksheet headings.
Expected: PASS
Result: PASS
Evidence: dedicated loaded-unit tests SUCCESS.

## V-007 — Repository CI

Date: 2026-10-08
Target: draft PR #11 latest head
Check: governance + application CI.
Expected: PASS
Result: PASS
Evidence:
- Repository Governance Check: SUCCESS
- backend typecheck: SUCCESS
- frontend typecheck: SUCCESS
- unit tests: SUCCESS
- production build: SUCCESS

## V-008 — Visual / mobile pilot QA

Date: 2026-10-08
Target: chapter lock UI, absolute-value visibility, Proof / Example distinction, mobile flow
Expected: user-visible correctness
Result: PENDING
Reason: requires actual rendered-screen review.

## V-009 — User pilot review

Date: 2026-10-08
Target: Mathematics A 「図形の性質」 pilot
Expected: user approval before expanding to remaining Mathematics chapters
Result: PENDING

## V-010 — Proposal approval governance regression

Date: 2026-10-08
Target: W-MATH-001 approval state
Check: determine whether P-002 had explicit approval under the corrected live governance.
Expected: review feedback must not count as approval.
Result: FAIL-PREVIOUS-STATE / PASS-CORRECTION
Evidence: prior approval evidence contained material correction comments. Work was returned to REVISE-PROPOSAL and PR #11 remains draft/unmerged.
Follow-up: present full P-002 to user and wait for explicit approval.

