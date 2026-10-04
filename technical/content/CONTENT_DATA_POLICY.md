# Content and Data Policy

Status: CANONICAL  
Updated: 2026-10-05

This document extracts the still-valid data rules from the old `docs/CONTENT_GUIDE.md` and reconciles them with current runtime schemas.

## 1. Stable identifiers

IDs are technical identity, not display order.

For content entities such as:
- question
- textbook unit/section/item
- blank
- option
- asset
- source item
- graph node

IDs should be stable, machine-readable, lowercase alphanumeric/hyphen where schema requires it.

Do not rename an ID merely because:
- display order changes
- title wording changes
- chapter labels are reorganized

If semantic identity changes substantially, create a new ID.

## 2. Revision

Where a schema has `revision`, increment it when changing:
- answer semantics
- scoring
- mathematical/physical meaning
- learning path
- structural dependencies

Pure wording corrections may remain the same only if consumers do not need change tracking; otherwise incrementing is preferred.

## 3. Source provenance

Every publishable curriculum unit/question must identify its source role.

Allowed source roles in current schemas include:
- original
- licensed
- reference

In addition, Repository OS provenance should distinguish artifact role:
- canonical authoring source
- implementation data
- generated artifact
- evidence/backup
- historical/deprecated

A filename such as `final`, `完成版`, or `v8` does not establish authority.

## 4. Runtime vs authoring source

### Textbook

Current runtime truth is validated static data loaded by the backend:
- `unit.json`
- `answers.json`
- assets
- selected generated units

Word files in `backend/data/textbooks/**/source/` are authoring sources/evidence and are not parsed at production runtime on current `main`.

### Ordinary Practice

Practice has two layers:
- source bank: extraction/classification-ready items
- interactive question bank: solution steps, blanks, options, interaction

Source-ready does not mean published-interactive.

## 5. Public/private content boundary

Public textbook payloads must not expose private answer-key fields.

Public practice question payloads must not expose correct-option IDs or private answer feedback before submission.

Never rely on “the UI does not display it” as the only separation mechanism; public serialization should remove it.

## 6. Stable relation references

All relation fields must point to real entities.

Current examples:
- textbook reading part → item
- textbook figure block → figure
- practice step → prior step
- practice step → blank
- Common-Test related question → question

New canonical requirement:
Math Ordinary Practice must also support explicit **cross-question dependencies** when one question consumes a result from another.

This is not yet implemented in current practice schema; see active gap task.

## 7. Blank and option semantics

A blank is not an arbitrary deleted token.

Each interactive blank should represent a real cognitive decision and have:
- a prompt
- answer type
- options/input contract
- correct-answer definition
- specific explanation/feedback
- relation to a step/node

Distractors should correspond to plausible errors where possible.

## 8. Assets

Images/figures must be addressable assets with:
- stable ID
- source path
- useful alt text
- caption where useful
- provenance
- QA state

Do not store essential question meaning only inside an inaccessible screenshot.

## 9. Generated artifacts

Generated files must be traceable back to:
- source specification
- generation tool/script
- source inputs
- validation evidence

Generated output is not automatically the editable source.

## 10. Publishing gate

A content artifact is not PUBLISHED merely because it renders.

At minimum:
- schema validates
- references resolve
- answer contract validates
- source provenance exists
- mode-specific QA passes
- no answer leakage
- browser/app flow works for the target mode

## 11. Legacy bilingual rules

The old content guide defined paired Japanese/Chinese built-in question catalogs. That remains relevant only for content families that still use those catalogs.

Do not generalize that old dual-file mechanism to textbook/practice data unless the current mode schema explicitly adopts it.

## 12. Migration rule

When extracting valid rules from historical docs, keep:
- stable ID principles
- revision tracking
- provenance
- reference integrity
- error-specific feedback
- release validation

Do not preserve old architectural assumptions merely because they were written beside those rules.
