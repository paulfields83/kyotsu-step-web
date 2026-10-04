# Current UI / Educational Design System

Status: CANONICAL  
Updated: 2026-10-05

This document combines the still-valid visual foundation of the historical design system with newer educational-mode requirements.

## 1. Visual character

Base direction:
- restrained academic/printed-test feeling
- light paper-like surface
- dark blue-black text/borders
- functional accent colors
- low-to-moderate corner radius
- clear section hierarchy
- avoid excessive gradients/glassmorphism/game-like oversized cards

The goal is not nostalgia. The visual language should keep mathematical/physical reading calm and dense enough for study.

## 2. Semantic color rule

Color is for **function**, not decoration.

Use color for:
- interactive blanks
- current/locked/completed state
- correct/incorrect feedback
- navigation/action emphasis

Do not color ordinary concept text merely to make it “look educational”.

For Mathematics Textbook mode in particular:
- concept/definition prose is normally black
- important concept names may use weight
- Definition / Proof / Example should be distinguished mainly through structure, label, spacing, and restrained surface treatment

## 3. Typography / readability

- body line height: at least approximately 1.65 where long-form reading is used
- equations must not be compressed into unreadable lines
- long formulas may use local horizontal scrolling only when no better semantic line break exists
- Japanese text should not create awkward narrow columns on mobile
- numeric/analytics displays may use tabular/monospaced treatment where useful

## 4. Touch / mobile

Minimum interactive target should remain approximately 48 px where practical.

Mobile rules:
- no page-level horizontal overflow
- safe space below fixed navigation
- options/buttons remain individually tappable
- a long derivation should remain understandable without paper by keeping relevant parent/intermediate equations visible
- figures should scale without being cropped
- response UI should not become a vertical wall of identical large blank cards

## 5. Educational component hierarchy

Different pedagogical objects must look different.

### Definition / concept
Purpose: formalize a name/meaning after motivation.

### Property / theorem
Purpose: state what follows from the concept.

### Proof
Purpose: justify a statement. Must not visually blend into an example.

### Example
Purpose: use a learned concept/property in a concrete setting.

### Guided step
Purpose: make one reasoning decision.

### Feedback
Purpose: explain the current answer state only; must not visually dominate the textbook prose.

Do not render all six as the same generic “card”.

## 6. Headings

Display headings should be fewer and shorter than internal content IDs.

Rule:
- stable internal IDs may be detailed
- user-visible headings should reflect meaningful conceptual sections
- avoid showing implementation-style section codes such as retired `1D` identifiers
- do not fragment one continuous explanation into many one-line titled boxes

## 7. Figures

Figures are content, not decoration.

UI must preserve:
- aspect ratio
- meaningful labels
- readable line/text size
- caption when useful
- relation to nearby explanation

Do not:
- crop essential labels
- place another layer over the figure
- upscale a low-quality raster until visibly blurry
- show a figure that directly reveals an unanswered blank unless the mode intentionally unlocks it after response

## 8. Formula rendering

Requirements:
- no visible raw/failed compile markup
- square roots/fractions must be typographically coherent
- interactive choices embedded in formulas must not break KaTeX fragments
- repeated copies of the same formula require a pedagogical reason

When an interactive blank would split LaTeX into invalid fragments, render a semantically equivalent readable structure rather than forcing malformed math.

## 9. Feedback semantics

Correct/incorrect states must not rely only on color.

Include:
- icon/text/state change
- concise explanation
- explicit retry/continue action where relevant

Wrong feedback should diagnose the current misconception, not reveal later steps.

## 10. Existing technical tokens

The historical design system points to:
- `src/styles/tokens.css`

Existing product styles remain implementation evidence, but no CSS token overrides the mode-specific pedagogical rules in `subjects/**/SPEC.md`.

## 11. Mode-specific extension

This file defines shared UI principles only.

Always read the relevant mode spec for:
- staged reveal
- textbook prose density
- proof/example distinction
- figure timing
- Common-Test three-screen behavior
- Practice inline blank behavior

Shared design must not flatten those differences.
