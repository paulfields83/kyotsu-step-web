# Common-Test Question Contract

Status: CANONICAL  
Updated: 2026-10-05  
Runtime source of truth: `src/domain/questionSchema.ts`

This document explains the current schema in human terms. The executable Zod schema remains the implementation contract.

## 1. Question identity

Required identity/state:
- `schemaVersion`
- `questionId`
- `revision`
- `status`
- `subject`

Stable IDs are used for questions, assets, content blocks, blanks, options and simulation items.

## 2. Content

Supported content blocks:
- text
- LaTeX
- image
- table

Text blocks may include a speaker, allowing dialogue-style guided reasoning where the mode requires it.

## 3. Learning

Learning contains:
- `presentation`
- optional `flowType`
- optional `finalBlankId`
- ordered `solutionFlow`
- blank record
- detailed / standard / selfCheck variants

Current flow types:
- `math-narrative`
- `phenomenon-analysis`
- `calculation-derivation`
- `relation-analysis`

## 4. Common-Test presentation

When `presentation = common-test`:
- `flowType` is required
- `finalBlankId` is required
- final blank must exist
- final blank must **not** appear in the reasoning `solutionFlow`
- each learning variant must contain the final blank

This implements the three-stage educational contract:

```text
original problem
   ↓
reasoning guide
   ↓
original final choice
```

## 5. Blank contract

A learning blank contains:
- answer type
- prompt
- options
- correct option IDs
- knowledge tags
- one skill tag
- explanation
- optional short-practice relation

Options can carry:
- misconception tags
- wrong-reason content

The schema validates that correct option references exist.

## 6. Simulation contract

Simulation is separate from guided learning.

Each simulation item contains:
- prompt
- answer type
- options/correct IDs or numeric value
- tolerance
- score
- estimated seconds
- knowledge/skill tags

This lets the same curriculum item support guided practice and no-feedback simulation without conflating their state machines.

## 7. Relation validation

The catalog validator checks:
- no duplicate question IDs
- related question IDs exist
- short-practice targets exist
- a question does not relate to itself through those fields

This relation system is different from the Math Ordinary Practice cross-question result dependency planned in the backend Practice schema.

## 8. Public/pedagogical authority

The schema validates representation.  
The corresponding Physics Common-Test pedagogical meaning is defined in:

- `subjects/physics/practice/SPEC.md`

Do not infer teaching order solely from field order in the TypeScript type.

## 9. Change rule

Any change to:
- Common-Test final-answer separation
- learning state semantics
- scoring
- ID/reference behavior

requires:
1. schema change
2. domain test
3. E2E impact review
4. relevant mode-spec consistency check
