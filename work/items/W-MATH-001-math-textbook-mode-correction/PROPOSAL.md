# Proposals — W-MATH-001

## P-001 — Semantic structure + pilot correction

Status: PROPOSED
Created: 2026-10-08

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

The current published Mathematics textbook implementation cannot represent these roles explicitly and therefore cannot reliably render or validate the canonical structure.

### Confirmed implementation gaps

1. `TextbookReadingBlockSchema` only has:
   - topic
   - heading
   - paragraph
   - formula
   - figure
   - note

   It has no semantic role for concept / definition / property / proof / example.

2. `TextbookUnitPage.tsx` renders headings and notes generically. A proof and an example can therefore be visually identical apart from literal text.

3. Published Mathematics units contain 427 heading blocks; 407 are worksheet-like 「教科書対応問 / 問題文」 style headings. This makes the learner flow closer to a sequence of prompts than the canonical textbook-prose backbone.

4. All seven current published Mathematics units declare zero figures and contain zero figure blocks, even though many curated figure assets and figure-source QA files exist in the repository. This does not mean every topic needs a figure; it confirms that figure integration is currently absent from the published learning-flow data.

5. The current CSS can style `note` as muted/colored, but because semantic concept/definition roles do not exist, the canonical rule “concept/definition prose is basically black; color is functional” cannot be enforced structurally.

### Proposed correction

#### Phase A — Backward-compatible semantic foundation

Add optional semantic role metadata to reading blocks instead of replacing the shared schema.

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

Existing Physics and Mathematics data remains valid when role is omitted.

Renderer behavior:
- concept / definition: black prose, strong local term emphasis
- property: clearly separated but still textbook prose
- proof: dedicated proof visual hierarchy
- example: dedicated example visual hierarchy distinct from proof
- motivation/focus/check/support: functional presentation without turning every block into a card

Add tests that semantic roles render distinctly and existing untagged data still validates.

#### Phase B — Pilot: Mathematics A 「図形の性質」

Use `backend/data/textbooks/math-1a/geometric-properties/unit.json` as the pilot because it contains definitions, properties, proofs, examples, and existing figure assets.

For the pilot:
1. identify each topic's natural motivating question;
2. mark focus / thought sequence;
3. tag concept/definition/property/proof/example roles;
4. reduce repetitive worksheet headings where prose can carry the flow;
5. preserve mathematical content, item IDs, answers, and stable section IDs where possible;
6. integrate existing figures only where they materially improve understanding;
7. verify no answer leakage.

#### Phase C — Pilot review

After browser/mobile QA, stop and show the pilot to the user.

Do not bulk-migrate the remaining published Mathematics units until the user approves the pilot direction.

### Out of Scope

- Mathematics Practice
- bulk rewriting of all seven published units in this proposal
- new mathematical theorems/content
- changing source DOCX authority
- changes to Physics textbook semantics without separate review

### Risks

- semantic-role schema is shared by Physics; therefore the change must remain backward-compatible
- content migration could accidentally change answer order or leak answers
- excessive card styling could recreate the “too many headings/boxes” problem
- figure integration must follow node placement, not asset availability alone

### Verification Plan

Schema / compatibility:
- existing textbook units validate unchanged
- role-tagged blocks validate
- public/private answer boundary unchanged

UI:
- proof and example visually distinct
- concept/definition prose remains black
- mobile flow readable
- no excessive heading/card fragmentation

Pilot pedagogy:
- motivating question exists where appropriate
- concept → property → proof if needed → example order is meaningful
- nontrivial reasoning is not skipped
- no unknown-term guessing
- no answer leakage

Figures:
- only purpose-driven figures
- correct placement before/after the relevant thought node
- asset legibility and numerical/geometry QA preserved

### Approval

Status: WAITING
Approved by user: NO
Approval date:
Approval evidence:
