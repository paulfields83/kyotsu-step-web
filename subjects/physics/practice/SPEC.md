# Physics Common-Test Guided Practice — Canonical Spec

Status: CANONICAL  
Version: 1.0.0  
Updated: 2026-10-05  
Scope: 共通テスト物理のguided practice

## 0. Authority / provenance

統合元:
- `共通テスト物理App_3種類の問題形式_最終設計案`
- repository `docs/QUESTION_SCHEMA.md`
- current learning UI / answer-flow implementation

このModeは無誘導Simulationではない。

## 1. Purpose

正しい選択肢だけ覚えさせず、

元の問題を読む
→ 条件を捉える
→ 物理知識へ接続
→ 推論/計算
→ 元の選択肢へ戻る

という全過程を経験させる。

原問題の意味を保持したまま、途中の思考をguided nodesへ分解する。

## 2. Fixed three-stage architecture

### Screen 1 — 元の問題
問題文、図、条件、元選択肢を表示する。正解は示さない。ここでは原問題を読む。

### Screen 2 — 推論ガイド
問題形式ごとの reasoning nodes を進める。最終選択肢そのものを途中回答として使わない。

### Screen 3 — 元の選択肢
元問題と元選択肢へ戻り、ガイドで得た推論を使って最終回答する。

Final answerはreasoning flowの通常blankと分離する。

## 3. Three problem types

### P-A Phenomenon Analysis
対象: 回路、波、複数候補の物理現象等。

流れ:
各対象の基本性質
→ 効果カテゴリを定義
→ 全候補を分析
→ 問題が求める現象を確認
→ 元選択肢

一つの候補だけ見て答えを当てない。原選択肢の全候補を扱う。

### P-B Calculation Derivation
対象: 衝突、熱力学、電場等の式展開。

流れ:
求める量
→ 重要条件
→ 定義/親式
→ 方程式
→ 重要な式変形
→ 結果・符号・単位
→ 元選択肢

複雑な代数変形を「整理すると」で飛ばさない。ただし単純算術を無意味に穴にしない。

### P-C Relation Analysis
対象: ローレンツ力、向き、符号、大小、効率等。

流れ:
一般概念
→ この問題への第1適用
→ 別概念
→ 第2適用
→ 関係の接続
→ 元選択肢

一般法則と個別問題への適用を混同しない。

## 4. Reasoning node contract

各nodeは最低限:
- id
- type
- prompt
- basis
- operation
- dependsOn
- choices / input
- correct answer
- targeted feedback
- revealAfterCorrect
- finalAnswerLeakRisk

問題文の条件を物理的意味へ翻訳するnodeを積極的に作る。
例: 固定壁 → 壁速度0。

## 5. Blank policy

穴は:
- 重要概念
- 条件解釈
- 方向/符号
- 使う法則
- 重要な式変形
- 候補分類
- 因果関係

に置く。

禁止:
- 書き写しだけ
- 単純算術だけ
- 最終選択肢を途中で直接当てる穴
- 後続解答を漏らす説明

## 6. Feedback

Correct:
- 現在の答えを固定
- その答えが成り立つ短い因果説明
- 次nodeへ

Wrong:
- 選択状態を明示
- 現在nodeの誤りに対応したfeedback
- 再回答またはhint

Hint/explanation:
- 現在nodeに必要な知識だけ
- future nodeの答えを出さない

first attemptは分析用に保持してよいが、学習フローでは訂正して先へ進める。

## 7. Source fidelity

以下を保持:
- 元問題文
- 必要条件
- 元図
- 選択肢
- 複数小問の参照関係
- 単位/符号条件

guideの都合で問題そのものを作り替えない。

複数小問で前問結果を使う場合はquestion-level dependencyを明示する。

## 8. Final-answer separation

final answer:
- reasoning guide内へ混入させない
- final blank / final selectionとして別管理
- Screen 3で初めて回答可能
- 全guided nodeから正解が論理的に得られても、UIで選択肢正解を先に強調しない

## 9. Figures

原問題図はScreen 1で保持する。

Screen 2で追加図が必要なら:
- 何を補助するか
- 原図との関係
- answer leakage
- physical constraints
を定義する。

追加図が最終選択肢を直接特定する場合は、回答前に表示しない。

## 10. Practice vs Simulation

Guided Practice:
- step feedbackあり
- hintあり
- staged reasoningあり
- retry可
- learning analyticsでfirst attemptを保持可

Simulation:
- 作答中feedbackなし
- reasoning guideなし
- 本番型navigation/timeout/scoring

この2つのUI/stateを共有しても、pedagogical behaviorは混ぜない。

## 11. Production workflow

PP1 source extraction
→ PP2 problem-type classification
→ PP3 complete physics solution
→ PP4 reasoning-node graph
→ PP5 final-answer separation
→ PP6 blanks/choices/feedback
→ PP7 figure plan
→ PP8 leakage audit
→ PP9 schema validation
→ PP10 browser flow test
→ PUBLISHED

## 12. Verification gate

Source:
- original conditions/figure/options complete

Type:
- phenomenon: every candidate analyzed
- calculation: meaningful algebra steps visible
- relation: general rule and specific application separated

Physics:
- signs/directions/units correct
- no invalid simplification

Interaction:
- Screen 1 read-only
- Screen 2 guided
- Screen 3 original answer UI
- feedback only reveals current knowledge
- final answer not leaked

Schema:
- stable IDs
- references valid
- final answer separated from solutionFlow
- question dependency valid

## 13. Out of scope

物理教科書モード、数学普通練習、無誘導Simulationは別Specで管理する。
