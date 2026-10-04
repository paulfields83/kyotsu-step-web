# Practice Cross-Question Dependency

Status: READY-FOR-IMPLEMENTATION  
Owner node: R05/R06 follow-up  
Created: 2026-10-05

## Problem

The Math Ordinary Practice canonical candidate spec requires explicit dependency edges between questions when a later problem uses a result established by an earlier problem.

Current `backend/src/practiceSchema.ts` only models:

```text
question
  └─ solutionSteps[]
       └─ dependsOn[]   # step IDs inside the same question
```

It cannot represent:

```text
Q1 result ──▶ Q2 reasoning
```

## Why this matters

Without an explicit question-level edge:
- the frontend may unlock Q2 too early
- authoring tools may duplicate or silently restate Q1's result
- a later AI can redesign Q2 as if it were independent
- relation/fire diagrams cannot reconstruct the true exercise sequence
- validators cannot detect a missing prerequisite

## Proposed backward-compatible schema extension

Add optional fields to `PracticeQuestionSchema`:

```ts
questionDependencies: {
  dependsOnQuestions: string[]
  usesResults: {
    questionId: string
    resultId: string
    purpose: string
  }[]
  producesResults: {
    resultId: string
    label: string
  }[]
  prerequisiteConcepts: string[]
}
```

Default all arrays to empty.

Do not use display title/number as the reference. Use stable question/result IDs.

## Validation required

Dataset-level validation must check:

1. referenced question exists
2. no self-dependency
3. referenced result exists on producer
4. no duplicate edge/result IDs
5. dependency graph has no cycle
6. a question does not consume a result from a question that is unavailable in the selected exercise set
7. published question cannot reference a draft-only prerequisite unless explicitly allowed by a bundle policy

## Runtime behavior

The schema must distinguish:
- mathematical dependency
- UI completion gate

Default policy for Ordinary Practice:
- if Q2 mathematically depends on Q1, Q1 must be completed before Q2 becomes independently actionable
- the UI may display Q2's title/preview, but must not leak the reusable result before Q1 is complete

## Authoring behavior

When Q2 uses Q1:
- do not re-derive Q1 solely because the schema lacked a relation
- show a short reference such as “前問で得た結果を使う”
- expose the actual reusable result only according to the release/gating rule
- include the edge in the fire/relation graph

## Migration

Existing questions without cross-question dependencies parse unchanged because fields are optional/default-empty.

Migration steps:
1. extend schema types
2. extend public summary/payload only with non-answer dependency metadata needed by UI
3. update `practiceData.ts` to validate the whole question set as a graph
4. add unit tests for valid chain, missing question, missing result, self-edge, cycle
5. annotate the first exercise set with real dependencies
6. add E2E for locked/unlocked later question
7. update repository governance/content validators as appropriate

## Acceptance criteria

- a Q1→Q2 dependency is representable without title parsing
- invalid/cyclic references fail validation
- independent questions remain unaffected
- frontend can determine prerequisite completion from IDs
- relation graph can be regenerated from data
- no answer/reusable result is leaked through public metadata before intended release

## Non-goal

This task does not redesign within-question `solutionSteps.dependsOn`. Both graph layers must coexist.
