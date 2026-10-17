# 数学I 数と式 — 改訂版 16講（テスト用）

## Source
User-provided DOCX: N01–N14, NE01–NE02 (2026-10-11).
Markdown conversion: Pandoc / docx -> gfm. Preserves inline TeX math tokens.
UTF-8 Markdown dictionary encoded as Brotli+Base64. Seven chunks (01–07) together are one corpus.
Byte-accurate chunk transport was checked (24,112 base64 characters; FNV-1a32 e715ec66).
Importer: `backend/src/revisedNumbersExpressions.ts`.

## Runtime
Unit ID: `math-1a-numbers-expressions-revised`.
`backend/src/textbookData.ts` registers 16 sections with existing
`/api/textbooks`, `/api/textbooks/:unitId`,
`/api/textbooks/:unitId/items/:itemId/answer`, and export/health contracts.
The old `math-1a-numbers-expressions` remains intact on this branch.

## QA state
- N01–N14 + NE01–NE02 order: validated in Vitest.
- Math parts: retained; test expects >100 structured math parts.
- N01 ten answer slots: validated and checked through backend contract.
- Unreviewed blanks: original printed `【　】`, deliberately ungraded.
- Original Word diagrams: **NOT imported yet**. Temporary explanatory placeholders only.
- N05 coefficient table / complex page layout: further visual review needed.
- Render deployment: **NOT done**. Isolated backend service must be selected
  explicitly, then UI points to that service via `VITE_API_BASE_URL`.
- Test UI: `合并版ui` branch based on `front-ui--test` with minimal catalog updates.

## Release status
**PILOT / NOT PRODUCTION COMPLETE.**
Do not replace production textbook content and do not merge either integration branch
before end-to-end browser/mobile visual verification and remaining answer/figure QA.
