# Proposals — W-MATH-001

## P-001 — Semantic structure + pilot correction

Status: SUPERSEDED
Created: 2026-10-08

Superseded by P-002 after user review feedback with additional requirements. No approval was granted at that point.

## P-002 — Semantic structure + sequential chapter gate + pilot correction

Status: PROPOSED
Created: 2026-10-08
Approved:

### Problem / Need

The canonical Mathematics Textbook spec requires a natural learning architecture:

motivating question
→ focus
→ thinking
→ concept/formalization
→ property
→ proof when needed
→ example/application
→ fading

and requires Definition / Proof / Example to be visually distinct, while concept/definition prose is primarily black.

The current implementation also allows learners to select later chapters before finishing the current chapter, and the user identified an absolute-value readability defect where `|x+1|` is visually easy to misread as plain `x+1`.

### Confirmed implementation gaps

1. `TextbookReadingBlockSchema` has no semantic role for concept / definition / property / proof / example.
2. `TextbookUnitPage.tsx` renders those roles generically.
3. Published Mathematics content is strongly worksheet-shaped rather than prose-backbone shaped.
4. Raw static Mathematics `unit.json` files do not carry the injected figure blocks themselves; the backend currently enriches loaded units through `mathLearningFigures.ts`. The pilot must preserve this pipeline and assess placement rather than rebuild figures from zero.
5. `LearningSetupPage.tsx` currently allows arbitrary chapter selection; later chapters are not gated by previous-chapter completion.
6. Absolute-value notation must be visually unambiguous. The supplied screenshot shows `|x+1|` with the vertical bars too easy to miss.

### Revised correction proposal

#### Phase A — Backward-compatible semantic foundation

Add optional semantic role metadata to textbook reading blocks.

Proposed roles:
- motivation
- focus
- concept
- definition
- property
- proof
- example
- check
- support

Existing data remains valid when role is omitted.

Renderer:
- concept / definition: black prose, local bold emphasis only
- property: distinct but still part of continuous textbook prose
- proof: dedicated proof hierarchy
- example: dedicated example hierarchy, clearly different from proof
- avoid excessive cards/headings

#### Phase B — Sequential chapter gate

For Mathematics Textbook / Learning Mode:
- later chapters are locked until the preceding chapter is complete;
- specifically, Chapter 2 must not be enterable while Chapter 1 is incomplete;
- completion is based on all learning items belonging to the preceding chapter being resolved;
- locked chapters remain visible but non-enterable, with a short explanation;
- existing progress must be respected.

Do not apply this rule to Mathematics Practice.

#### Phase C — Absolute-value readability

Where absolute-value expressions are rendered in learning content:
- use math rendering that makes both delimiters unmistakable;
- prefer explicit `\lvert ... \rvert` / equivalent robust math markup over ambiguous plain-text pipes;
- verify desktop and mobile line wrapping;
- do not alter the mathematical statement.

If the supplied screenshot is traced to Practice-only source data, do not rewrite Practice content inside this Work. Fix only shared rendering if the defect is shared; otherwise record a separate Practice issue.

#### Phase D — Pilot: Mathematics A 「図形の性質」

Use `backend/data/textbooks/math-1a/geometric-properties/unit.json` as the semantic-structure pilot.

1. identify natural motivating question;
2. mark focus / thought sequence;
3. tag concept/definition/property/proof/example roles;
4. reduce repetitive worksheet headings;
5. preserve mathematical content, item IDs, answers, stable section IDs where possible;
6. preserve the existing backend figure-enrichment pipeline and adjust/integrate figures only where pedagogically justified;
7. verify no answer leakage.

#### Phase E — Pilot review

After browser/mobile QA, stop and show the pilot to the user.

Do not bulk-migrate remaining published Mathematics units until user approval of the pilot direction.

### Out of Scope

- Mathematics Practice content rewrite
- Physics mode changes
- bulk migration of all Mathematics units before pilot review
- source DOCX changes
- new mathematical theorems/content

### Risks

- shared schema changes must stay backward-compatible
- chapter-gating logic must not destroy existing progress
- absolute-value fix must not accidentally modify unrelated punctuation
- excessive role styling could create too many visual boxes
- figure placement must follow pedagogy, not asset availability

### Verification Plan

- existing textbook units validate unchanged
- role-tagged blocks validate
- proof/example/definition render distinctly
- concept/definition prose remains black
- Chapter 2 cannot be entered before Chapter 1 completion
- after Chapter 1 completion, Chapter 2 unlocks
- existing completed users are not re-locked incorrectly
- `|x+1|` is visually unmistakable on desktop/mobile
- no answer leakage
- pilot browser/mobile QA
- typecheck / tests / build / governance check

### Approval

Status: WAITING
Approved by user: NO
Approval date:
Approval evidence:

### Review History

- Review status: FEEDBACK-RECEIVED
- User feedback:
  1. 「1章が終わるまで次章に入らないこと」
  2. 「絶対値のx+1が見えにくい」
- Interpretation under live governance: review feedback, not approval.
- Required next action: present this full P-002 and wait for explicit approval before further implementation or merge.
