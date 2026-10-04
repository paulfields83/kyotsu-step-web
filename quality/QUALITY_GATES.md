# Quality Gates

Status: CANONICAL  
Updated: 2026-10-05

This document extracts still-valid checks from the historical TEST_PLAN and extends them to the current backend/content architecture.

## 1. Gate layers

A change is DONE only after all applicable layers pass.

### Q0 — Governance
- repository governance validator
- current node/status updated
- canonical references valid
- no silent mode/spec conflict

### Q1 — Static code
Frontend:
- TypeScript
- ESLint

Backend:
- TypeScript

### Q2 — Unit/domain tests
- schema reference integrity
- scoring
- learning state transitions
- simulation state transitions
- analytics/recommendation where applicable
- textbook answer logic
- content/public-export contracts

### Q3 — Content validation
Textbook:
- schema parse
- answer-book coverage
- reading-flow references
- figure references/assets
- public export does not leak private answer fields

Ordinary Practice:
- catalog hierarchy
- step dependency references
- blank references
- correct option references
- source-bank hierarchy/provenance

Planned:
- cross-question dependency integrity

### Q4 — Build
- frontend production build
- backend startup/content validation

### Q5 — Browser/E2E
Applicable journeys must be tested, not only component rendering.

Examples:
- learning correct/wrong/retry/explanation/refresh/complete
- textbook load/answer/progress/figure rendering
- simulation no-feedback/navigation/refresh/submit/timeout
- Practice staged reveal/answer/retry/complete after frontend integration
- language/session continuity for content families that support bilingual UI/data

### Q6 — Mobile/visual
At minimum check representative mobile and desktop widths.

Regression targets:
- no page-level horizontal overflow
- navigation does not cover final content
- formulas remain readable
- tables scroll locally when necessary
- figures are not cropped/hidden/blurry
- touch targets remain usable
- long Japanese text does not break layout
- interactive blanks/options remain visible and understandable

### Q7 — Mode-specific pedagogical QA
Use the subject/mode SPEC, not a generic checklist.

Examples:
- Math Textbook: concept/property/proof/example order, no unknown-term guessing
- Math Practice: actual dependency graph, distractors, question-to-question dependencies
- Physics Textbook: figure↔concept↔formula integration, derivation continuity
- Physics Practice: original problem → reasoning guide → original options, no final-answer leak

## 2. Defect severity

### P0
- wrong scoring/answer key
- data loss/corruption
- answer leakage that destroys the task
- primary learning path cannot complete
- mathematically/physically wrong canonical content

### P1
- primary route inaccessible
- refresh/resume broken
- severe clipping/overlap
- required figure/formula unreadable
- dependency/gating logic broken
- accessibility blocker for core flow

### P2
- secondary wording
- non-blocking visual inconsistency
- historical/provenance gap with no current wrong behavior

## 3. Completion evidence

For a substantial change, record:
- commands/tests run
- affected mode/spec
- relevant screenshots or browser verification when UI changes
- content validator result
- known remaining warnings
- next node/task

“Build passed” alone is not sufficient for curriculum changes.

## 4. Regression principle

Whenever a bug class recurs, prefer adding:
- schema validation
- static validator
- unit test
- E2E assertion
- content audit rule

over relying on memory/checklists alone.

## 5. Current command baseline

Frontend root:
- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run figures:verify` when math figures change
- `node tools/repo-governance-check.mjs`

Backend:
- backend TypeScript check
- textbook/content checks through backend scripts/startup

## 6. Migration note

Historical `docs/TEST_PLAN.md` remains evidence for the original app phase.  
This file is the candidate current quality authority after Repository OS ratification.
