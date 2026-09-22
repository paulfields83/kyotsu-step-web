# V2 functional parity and cleanup baseline

This document is the acceptance baseline for the `ui-redesign-test` frontend.

## Canonical user routes

- `/` — Home: next action / continue
- `/courses` — textbook knowledge hierarchy
- `/practice` — question bank, Standard / Light, simulation entry
- `/progress` — summary, mistakes, analysis, history
- `/settings` — user settings

Legacy entry routes are compatibility redirects only:

- `/learn` -> `/courses`
- `/problems` -> `/practice`
- `/profile` -> `/settings`
- `/learning/setup` -> `/practice`

The V2 UI must not link users back to the legacy setup flow.

## Preserved learning behavior

Textbook mode keeps these behaviors from the validated legacy UI:

1. The sentence remains visible while a blank is answered.
2. Correct first answers resolve immediately.
3. A wrong answer is marked wrong, the correct option is revealed immediately, and the blank is resolved.
4. The backend reveals `correctAnswer` only after a wrong submission; answer keys are not included in public textbook payloads.
5. The next subsection / knowledge item stays locked until the current one is resolved.
6. Future textbook sections stay locked until the current section is complete.
7. Figures, formulas, progress, reset, saved progress, and completion states remain available.

## V2 exposure rules

Visible user features:

- Home / continue
- Math I-A and Physics courses
- Textbook reading
- Practice
- Standard
- Light (currently backed by the existing `selfCheck` learning variant)
- Simulation
- Mistakes
- Analysis
- History
- Settings and language switching

Hidden from normal V2 navigation:

- legacy Problems page
- legacy Learning Setup page
- legacy Profile page
- Ranking
- Detailed-mode selector
- internal question catalog

The backend + legacy UI remain preserved on `refactor/textbook-backend-split` as the fallback/reference line.

## Code cleanup completed on V2

- Split the old combined Learn hub into Courses and Practice.
- Removed the obsolete V2 LearningHub page.
- Removed unused legacy Problems/Profile/Ranking/LearningSetup/AppShell files from the V2 branch.
- Consolidated V2 CSS into `app-v2.css`.
- Moved Settings out of bottom navigation.
- Restored reduce-motion handling in the V2 shell.
- Redirected old page actions to V2 routes.
- Added Playwright checks for V2 routing and textbook parity.

## Merge rule for main

Do not merge to `main` until:

- frontend typecheck passes;
- backend typecheck passes;
- unit tests pass;
- production build passes;
- textbook Playwright parity tests pass;
- Render V2 smoke test confirms the existing backend API is reachable.
