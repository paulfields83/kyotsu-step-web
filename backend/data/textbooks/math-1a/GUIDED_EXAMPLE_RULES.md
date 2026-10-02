# Math textbook guided-example rules

This branch applies the geometry experiment to all published Math I / Math A textbook-learning units.

## Guided example structure

Every `教科書対応問` must be structured as:

1. `問題文`
2. `着眼点` — the concrete condition or form that should trigger the method
3. `使う知識` — the definition, theorem, formula, or representation used here
4. actual solution steps — follow the real solution order; do not reuse concept-fill wording as the solution
5. `確認` — only a check that is meaningful for this problem

Do not put `研究`, `探究`, `自力確認`, `コンピュータの活用`, chapter-end material, or the next exercise inside the preceding guided example.

## Writing style

Use concise Japanese close to a high-school textbook / textbook guide:

- prefer: `〜に着目する`, `〜を用いる`, `〜より`, `したがって`, `〜が成り立つ`
- write the mathematical condition directly instead of meta-instructions
- keep terminology, formulas, definitions, and source meaning unchanged
- do not add a method that belongs to another chapter
- do not reveal a later blank answer in `着眼点` or `使う知識`

Avoid generic generated prose such as:

- `問題文の条件と求めるものを別々に...`
- `使う定理を名前だけで当てず...`
- `固定レール`, `判断軸`
- cross-topic templates such as quadratic-function guidance inside geometry/data/probability

## Audit

For every published example, verify:

- one explicit problem statement
- one focus step
- one knowledge/method step
- at least one actual solution step
- one check
- no following research/self-check material inside the example
- no cross-topic template contamination
