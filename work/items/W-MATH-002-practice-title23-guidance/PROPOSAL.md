# Proposals — W-MATH-002

## P-001 — Rebuild Title 2–3 guidance from the reasoning graph

Status: PROPOSED
Created: 2026-10-10

### Problem / Need

The user confirmed after viewing Mathematics Ordinary Practice that the guidance from Title 2 and Title 3 is not sufficient.

Current catalog mapping:
- Title 2 = `set-operations` / 「集合の演算」
- Title 3 = `set-regions` / 「集合の領域」

The issue is not merely a shortage of explanatory sentences. These titles require more multi-stage reasoning than Title 1, while the current Practice frontend exposes too little of the reasoning structure.

### Confirmed structural causes

#### Cause A — Guidance data exists but is not shown

The Practice question payload contains per-step:
- `basis`
- `purpose`
- `operation`

But the salvaged `front-ui--test` Practice UI renders essentially:
- STEP number
- `operation`
- step content
- blank/options

It does not render the canonical Mini Guide pair:
- 「考えること」
- 「使うもの」

Thus the learner sees what operation is next but not sufficiently why it is next or which prior knowledge/result should be used.

#### Cause B — Current schema is below the canonical node contract

The canonical spec requires each reasoning node to preserve:
- `dependsOn`
- `basis`
- `operation`
- `purpose`
- `feeds`
- `releaseAfterCorrect`

Current runtime schema has the first four but not `feeds` or `releaseAfterCorrect`.

The current prototype UI also gates by global blank order rather than by the actual dependency graph.

#### Cause C — Title 2–3 questions need intermediate-state guidance

Title 1 questions are often close to one-step recognition or conversion.
Title 2–3 introduces:
- representation normalization
- multiple set operations
- complement scope
- nested expressions
- candidate generation and rejection
- four-region reconstruction

A one-line `miniGuide` is therefore not enough as the learner-facing path.

### Proposed correction

#### Phase A — Rebuild the seven Title 2–3 thought graphs before UI prose

Do not edit prompts first.

For each question, create a complete solution and decompose it into:
- state before the node
- what the learner must decide
- basis
- operation
- purpose
- dependsOn
- feeds
- release condition
- blank
- choices
- wrongReason
- figure need / placement

Questions in scope:
- 95 共通部分と和集合
- 96 3集合の演算
- 97 補集合を含む演算
- 99 3集合と補集合
- 100 共通部分から定数を決定
- 演習A-8 集合と定数
- 98 領域から集合を復元

#### Phase B — Required reasoning path per question

##### Q95 — 共通部分と和集合

Required guide sequence:
1. Decide how A and B should be represented in the current subproblem.
2. If needed, convert both to a directly comparable representation.
3. For `A∩B`, apply “belongs to both”.
4. For `A∪B`, apply “belongs to at least one”.
5. For interval form, separately verify left/right endpoint inclusion.

The endpoint check must be its own thinking node for the interval subproblem, not hidden in feedback.

##### Q96 — 3集合の演算

Required guide sequence:
1. Expand A, B, C into explicit elements.
2. Build `A∩B` or equivalent intermediate state first.
3. Intersect with C for the triple intersection.
4. Build the union by adding elements while removing duplicates.
5. Final check: elements such as 5 and 7 that appear only through C must not be lost.

##### Q97 — 補集合を含む演算

Required guide sequence:
1. Fix the universe U first.
2. Compute `Ā` and `B̄` as explicit reusable intermediate results.
3. For an expression with parentheses, compute the inner set first.
4. Apply complement only after the scope is fixed.
5. For composite expressions, reuse earlier intermediate sets instead of re-deriving them.
6. Use the De Morgan pair only as a check after the learner has produced the relevant results.

##### Q99 — 3集合と補集合

Required guide sequence:
1. Identify the operator structure before calculating.
2. For each expression, isolate the smallest operation or complement scope.
3. Store each intermediate set.
4. Feed that set into the next operation.
5. For `(A∩B∩C)^c`, make the complement scope explicit.
6. For `(A∪C)∩B̄`, compute `A∪C` and `B̄` separately before the final intersection.

The learner should never be told merely “calculate from the left” when the actual structure is parenthesized.

##### Q100 — 共通部分から定数を決定

Required guide sequence:
1. Read `A∩B={1,4}` as two obligations: 1 and 4 must both belong to A and B.
2. Use “4 belongs to A” to generate candidate conditions for a.
3. Use “4 belongs to B” to intersect/filter those candidates.
4. Check that 1 is also common.
5. Reject any candidate that creates an extra common element.
6. Only after a is fixed, construct `A∪B`.

The key pedagogical point is candidate generation → candidate verification → rejection, not a direct jump to `a=2`.

##### 演習A-8 — 集合と定数

Required guide sequence:
1. Since 3 must belong to A, solve `|a-2|=3` to generate the two candidates.
2. For each candidate, construct the necessary elements of B.
3. Check that 2 is common.
4. Check that no extra element becomes common.
5. Explicitly reject `a=5` because 10 becomes an unwanted common element.
6. Accept `a=-1`.
7. Build the union only after the candidate is fixed.

This question needs a visible branch-and-reject reasoning path.

##### Q98 — 領域から集合を復元

Use four explicit Venn regions as the reasoning state:
- `R11=A∩B={2}`
- `R10=A∩B̄={4,6,8}`
- `R00=Ā∩B̄={1,9}`
- `R01=Ā∩B` = unknown

Required guide sequence:
1. Partition U into the four regions.
2. Place the three given regions.
3. Compute the missing region by subtraction from U.
4. Store `R01={3,5,7}`.
5. Construct `A∪B` from all regions except R00.
6. Construct `B̄` from R10 + R00.
7. Read `Ā∩B` directly as R01.

A Venn/region figure should be planned at the partition node, but it must not reveal R01 before the learner derives it.

#### Phase C — Make the Mini Guide real in the UI

For each active step, visibly separate:

**考えること**
- derived from `purpose` / the actual decision to make

**使うもの**
- derived from `basis`
- definitions, given conditions, or already-resolved prior results only

The guide must appear before the blank but stop short of completing the blank.

After a correct answer:
- substitute the result into the visible solution state;
- show a short bridge such as “この結果を次のSTEPで使う” only when a real dependency exists;
- then release the graph-permitted next step.

Do not display all future steps at once.

#### Phase D — Restore graph semantics

Extend the within-question data contract backward-compatibly so the runtime can preserve:
- `feeds`
- `releaseAfterCorrect`

Then make UI release logic consult the actual node dependency/release data rather than only the global blank index.

Existing independent/simple questions remain valid through defaults.

#### Phase E — Title 2 → Title 3 transition bridge

Before Title 3 begins, show only a short practice-oriented bridge:

> Title 2で使った ∩ / ∪ / 補集合を、今度は「両方・Aだけ・Bだけ・どちらでもない」の4領域として追う。

This is not a Textbook-style concept lecture.
It only tells the learner how the already-known operation language maps to the next problem-solving representation.

Do not reveal Q98's missing region or final answers.

#### Phase F — Practice frontend handling

Do not merge `front-ui--test` wholesale.

Use current `main` backend/API as the base and reimplement only the required Practice behavior:
- Practice domain types aligned to current backend
- Practice repository
- Practice Session page
- guide rendering
- graph-aware staged release
- Practice-only styles
- route/integration needed for the vertical slice

The old branch is evidence/reference, not authority.

#### Phase G — Review gate

Implement only Titles 2–3 first.

After browser/mobile QA:
- show Title 2 and Title 3 to the user;
- compare whether the learner can explain “why this next step?” at every node;
- STOP.

Do not propagate the redesign to Titles 4+ until the user approves the Title 2–3 result.

### Out of Scope

- Mathematics Textbook Mode
- Physics modes
- rewriting original 4STEP problems
- changing mathematical answers
- bulk migration of Titles 4–8
- wholesale merge of `front-ui--test`
- unrelated redesign shell/navigation
- full cross-question reusable-result implementation unless a real Title 2–3 dependency requires it

### Verification Plan

For each of the seven questions:
- every nontrivial operation has a node
- every node has a real purpose and basis
- no two nontrivial operations are hidden in one transition
- resolved results feed later steps explicitly
- future answers remain hidden
- distractors map to plausible mistakes
- figure placement does not leak the missing result

UI:
- 「考えること」「使うもの」 are visible and distinct
- the guide does not reveal the answer
- only graph-permitted next steps unlock
- correct result substitution is visible
- wrong answers do not corrupt later state
- mobile layout remains readable

Regression:
- Title 1 remains usable
- Titles 4+ are not rewritten
- current main Practice API remains the backend authority
- `front-ui--test` remains protected
- backend/frontend typecheck, unit tests, build, governance checks pass

### Risks

- over-guiding can turn Practice into Textbook Mode
- a generic “hint card” can become decorative instead of reflecting the real node graph
- changing display order without preserving mathematical dependency can create fake guidance
- region figures can leak Q98's missing set
- reusing the old branch UI wholesale can regress newer backend behavior

### Approval

Status: WAITING
Approved by user: NO
Approval date:
Approval evidence:

### Review History

- Review status: NOT-REVIEWED
- User feedback:
- Supersedes:
- Superseded by:
