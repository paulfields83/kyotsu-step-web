# Current Schema Map

Status: CANONICAL  
Updated: 2026-10-05

This file maps educational modes to the data contracts that currently implement them. It is not itself a substitute for the subject/mode pedagogical specs.

## 1. Common-Test question schema

Primary file:
- `src/domain/questionSchema.ts`

Used for:
- guided learning questions
- Physics Common-Test presentation
- simulation
- analytics/related-question flows

Key contracts:
- stable `questionId` + `revision`
- subject/taxonomy/difficulty
- stem/assets
- learning `solutionFlow`
- blanks
- variants
- optional Common-Test `flowType`
- separate `finalBlankId`
- simulation material/items
- related questions

Important validation:
- IDs/references must exist
- final Common-Test answer must not be placed inside the reasoning flow
- variants must reference real blanks
- related-question references must resolve within the catalog

## 2. Textbook schema

Primary file:
- `src/domain/textbookSchema.ts`

Companion contracts:
- `src/domain/textbookPublic.ts`
- `backend/src/textbookContract.ts`
- `backend/src/publicTextbook.ts`

Core hierarchy:

```text
TextbookUnit
  └─ sections[]
      ├─ figures[]
      ├─ readingFlow[]
      │   ├─ topic
      │   ├─ heading
      │   ├─ paragraph
      │   ├─ formula
      │   ├─ figure
      │   └─ note
      └─ items[]
```

Interactive blanks are represented by `choice` parts inside readingFlow blocks that point to item IDs.

Private answer keys live in a separate answer book.

Contract validator checks:
- answer coverage
- answer-book unit match
- choice/item relations
- public export behavior
- figure asset existence

## 3. Ordinary Practice schema

Primary file:
- `backend/src/practiceSchema.ts`

Source-bank schema:
- `backend/src/practiceSourceSchema.ts`

Current interactive hierarchy:

```text
PracticeCatalog
  └─ subcategories[]
       └─ problemTypes[]

PracticeQuestion
  ├─ stem[]
  ├─ solutionSteps[]
  │    ├─ dependsOn[]
  │    ├─ basis[]
  │    ├─ purpose
  │    ├─ operation
  │    ├─ content[]
  │    └─ blankIds[]
  ├─ blanks[]
  └─ interaction
```

Current validation checks within a question:
- referenced step dependencies exist
- referenced blanks exist
- blank step IDs exist
- correct option IDs exist
- catalog taxonomy matches question taxonomy

## 4. Identified schema gap: cross-question dependency

The canonical Math Practice spec requires explicit relationships when a question uses the result of a prior question.

Current practice schema has **no fields** equivalent to:
- `dependsOnQuestions`
- `usesResultFrom`
- `producesReusableResult`
- `prerequisiteConcepts`

Therefore, current schema can validate a reasoning DAG **inside one question** but cannot express or validate a reasoning edge **between questions**.

This is an implementation gap, not a reason to weaken the canonical mode spec.

Target behavior is tracked under:
- `work/active/PRACTICE_CROSS_QUESTION_DEPENDENCY.md`

## 5. Schema authority rule

Pedagogical spec answers:
**what the learning mode must mean**.

Schema answers:
**how that meaning is represented and validated in data**.

If the canonical spec requires information that the current schema cannot express:
1. record the gap,
2. extend/migrate the schema,
3. update validators and consumers,
4. then promote content.

Do not delete the requirement merely to make existing data pass.

## 6. Versioning rule

Schema changes that break existing content require an explicit migration path.

For each schema evolution:
- define old version
- define new version
- define migration/default behavior
- update runtime readers
- update validators/tests
- update public serialization
- update mode QA

No silent reinterpretation of an existing field.
