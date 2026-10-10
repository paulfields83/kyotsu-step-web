# Action Log — W-MATH-001

## A-001

Date: 2026-10-08
Action: Recovered Mathematics Textbook canonical rules and mode boundary.
Target / location:
- `subjects/mathematics/AGENTS.md`
- `subjects/mathematics/MODE_MAP.md`
- `subjects/mathematics/textbook/SPEC.md`
Result: SUCCESS

## A-002

Date: 2026-10-08
Action: Audited the ten Mathematics textbook unit files and separated published vs draft/legacy units.
Target / location: `backend/data/textbooks/math-1a/*/unit.json`
Result: SUCCESS

## A-003

Date: 2026-10-08
Action: Audited published-unit reading-flow structure, heading patterns, semantic role support, and figure integration.
Target / location: seven published Mathematics unit JSON files
Result: SUCCESS

## A-004

Date: 2026-10-08
Action: Inspected textbook schema, renderer, catalog, and reading-flow CSS.
Target / location:
- `src/domain/textbookSchema.ts`
- `src/pages/TextbookUnitPage.tsx`
- `src/domain/textbookCatalog.ts`
- `src/styles/global.css`
- `src/styles/mobile.css`
Result: SUCCESS

## A-005

Date: 2026-10-08
Action: Searched existing Work/Decision/Lesson records for an already-approved Mathematics learning-mode correction.
Target / location: `work/`, `memory/DECISIONS/`, `memory/LESSONS/`
Result: no approved correction proposal found.

## A-006

Date: 2026-10-08
Related proposal: P-002
Action: Fixed canonical Mathematics I・A chapter ordering and implemented sequential chapter unlocking.
Target / location:
- `src/domain/textbookCatalog.ts`
- `src/pages/LearningSetupPage.tsx`
Reason: enforce the approved rule that the next chapter cannot be entered before the current chapter is complete.
Result: SUCCESS.
Evidence: chapter-order/unlock unit test passes.

## A-007

Date: 2026-10-08
Related proposal: P-002
Action: Added a direct-URL guard for locked Mathematics textbook chapters.
Target / location: `src/pages/TextbookUnitPage.tsx`
Reason: disabling the setup selector alone would still allow manual URL entry.
Result: SUCCESS.
Evidence: frontend typecheck/build passes and the guard uses the same canonical unlock helper.

## A-008

Date: 2026-10-08
Related proposal: P-002
Action: Replaced ambiguous plain-text absolute-value pipes inside Mathematics Textbook reading prose with explicit KaTeX `\\lvert ... \\rvert` rendering.
Target / location:
- `src/pages/TextbookUnitPage.tsx`
- `src/styles/global.css`
Reason: make expressions such as `|x+1|` visually unambiguous.
Result: SUCCESS at code/build level; visual user confirmation still pending.
Evidence: frontend typecheck and production build SUCCESS.

## A-009

Date: 2026-10-08
Related proposal: P-002
Action: Added optional semantic reading roles and role-aware rendering.
Target / location:
- `src/domain/textbookSchema.ts`
- `src/pages/TextbookUnitPage.tsx`
- `src/styles/global.css`
Reason: allow Definition / Property / Proof / Example to be structurally and visually distinct while keeping old data valid.
Result: SUCCESS.
Evidence: compatibility and pilot-role unit tests pass.

## A-010

Date: 2026-10-08
Related proposal: P-002
Action: Applied semantic roles to the Mathematics A 「図形の性質」 pilot without changing item IDs or answer data.
Target / location: `backend/data/textbooks/math-1a/geometric-properties/unit.json`
Reason: test the canonical textbook architecture on one chapter before bulk migration.
Result: SUCCESS.
Evidence: loaded-unit tests confirm definition/property/proof/example/focus/check roles.

## A-011

Date: 2026-10-08
Related proposal: P-002
Action: Reduced double worksheet headings in the pilot.
Target / location: `backend/data/textbooks/math-1a/geometric-properties/unit.json`
Details:
- 29 `教科書対応問` headings renamed to `例題`
- 34 `問題文` headings demoted to example paragraphs
Reason: restore textbook prose hierarchy without changing the mathematical statements.
Result: SUCCESS.
Evidence: pilot hierarchy unit test passes.

## A-012

Date: 2026-10-08
Related proposal: P-002
Action: Ran latest draft PR #11 CI after all current pilot changes.
Target / location: PR #11
Result: SUCCESS.
Evidence:
- Repository Governance Check: SUCCESS
- backend typecheck: SUCCESS
- frontend typecheck: SUCCESS
- unit tests: SUCCESS
- production build: SUCCESS.

## A-013

Date: 2026-10-08
Action: Applied the new proposal-review rule to the live W-MATH-001 record as a regression simulation.
Target / location: draft PR #11 / W-MATH-001 work records
Reason: verify that review feedback cannot remain recorded as implementation approval.
Result: BLOCKED-CORRECTLY.
Evidence: W-MATH-001 moved from VERIFYING to REVISE-PROPOSAL; P-002 moved from APPROVED to PROPOSED/WAITING; existing implementation preserved but frozen and unmerged.

