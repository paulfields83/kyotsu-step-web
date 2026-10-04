# Math IA Word Source Manifest

Status: AUTHORING-PROVENANCE  
Updated: 2026-10-05  
Directory: `backend/data/textbooks/math-1a/source/`

## Role

These Word files are **authoring sources / historical production evidence**.

They are not:
- runtime production inputs on current main
- automatically canonical because a filename contains `完成版` or `v8`
- higher authority than the current Mathematics Textbook mode spec

Current production behavior in `backend/src/textbookData.ts` states that Math Word files are authoring sources only and production textbook units use static validated data.

## Provenance

The source-document family was added in commit:
- `e063e82e`
- message: `Add Math IA textbook source documents`
- date: 2026-09-22

A delivery ZIP was added immediately afterward:
- `25a112aa`
- message: `Add Math IA textbook archive`

A runtime DOCX importer was subsequently experimented with in the repository history, but current main deliberately does not depend on DOCX parsing at runtime.

## Files

### Lesson authoring sources

- `塾_数学A_序章_集合_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx`
- `塾_数学A_教科書学習モード_第1節・第2節_完全版.docx`
- `塾_数学A_第1章_第3節・第4節_確率_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx`
- `塾_数学A_第2章_図形の性質_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx`
- `塾_数学A_第3章_数学と人間の活動_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx`
- `塾_数学I_第1章_数と式_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx`
- `塾_数学I_第2章_2次関数_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx`
- `塾_数学I_第3章_集合と命題_教科書学習モード_完全版_厳格誘導版.docx`
- `塾_数学I_第4章_図形と計量_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx`
- `塾_数学I_第5章_データの分析_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx`

### Coverage / production evidence

- `数学IA_母本準拠_再制作_v8_Coverage.docx`

## Authority order

For new Math Textbook work:

1. direct user instruction
2. `subjects/mathematics/textbook/SPEC.md`
3. current task spec
4. current technical/content contracts
5. these Word authoring sources
6. historical ZIP/archive

If a Word source conflicts with the current mode spec, record the conflict instead of silently reviving the old behavior.

## Future improvement

A machine-readable manifest should eventually add per-file:
- source revision
- covered chapters/pages
- derived unit IDs
- supersedes/superseded-by
- latest QA status
- generated-data relationship
