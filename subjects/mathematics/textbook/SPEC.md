# Mathematics Textbook / Learning Mode — Canonical Spec

Status: CANONICAL  
Version: 1.0.0  
Updated: 2026-10-05  
Scope: 数学の教科書・学習モード

## 0. Authority / provenance

このSpecは以下を統合して作る。

- 2026-10-03 `MATHEMATICS_TEXTBOOK_MODE_MASTER_SKILL_v1`
- 完成例 `集合_教科書モード_完成版_v1`
- repository candidate rules:
  - `backend/data/textbooks/math-1a/GUIDED_EXAMPLE_RULES.md`
  - `backend/data/textbooks/math-1a/MATH_FIGURE_MANIFEST.md`
- その後のユーザー明示修正:
  - 概念名を付けた後、性質を説明する。
  - 証明が必要な性質は証明する。不要なら証明段階を飛ばす。
  - その後、例題で使う。
  - 概念本文は黒字を基本とし、色は穴・操作・状態・フィードバック等の機能へ使う。
  - 例題と証明は視覚的に混同させない。

矛盾時は root の Document Authority Model に従う。最新の明示修正が過去Master Skillの機械的テンプレートより上位。

## 1. Purpose

数学・教科書モードは、初学者が具体的な問いから出発し、

読む
→ 何を見るか決める
→ 既習知識を必要な瞬間に呼び戻す
→ 一段考える
→ 穴へ答える
→ 式/表現を作る
→ 意味を確認する
→ 概念として整理する
→ 性質を理解する
→ 必要なら証明する
→ 別例で使う
→ 支援を少し減らして使う

という学習線を繰り返す教材である。

これは辞書型説明、会話劇、穴埋め問題集のいずれか単独ではない。本文・数式・穴・必要な会話・必要な図を一つの自然な教材文章へ統合する。

## 2. Learner model

基準読者は、その概念を初めて学ぶ、または習った直後の高校生。

制作時には必ず確認する。

- この用語/記号は既知か。
- この一行は前行から導けるか。
- なぜこの式を作るのか分かるか。
- 後ろの本文/図が先の穴を漏らしていないか。
- この穴は本当に認知操作を要求するか。

未知の名称を当てさせない。未知の事実は教える。既知知識から導ける判断は考えさせる。

## 3. Natural lesson architecture

一つの小単位は一つの自然な問いを中心にする。

標準形:

1. 具体的な問い/導入問題
2. 焦点化 — 何を見るか
3. 一段ずつ思考
4. 答えた内容の意味確認
5. 概念名・記号の導入
6. 概念の性質
7. 証明 — 必要な場合のみ
8. 例題 — 学んだ概念/性質を別設定で使用
9. 必要なら一般化・導出
10. 軽い自力確認 / fading

重要: 「概念名 → 一般化 → すぐ別例」を機械的固定しない。概念によっては性質や定理が先に必要であり、その性質に証明価値がある場合は証明してから例題へ進む。

## 4. Textbook prose is the backbone

教材の骨格は本文。

本文:
- 問題状況
- 数式の必要性
- 推論接続
- 定義
- 性質
- 証明
- 前後概念の接続

会話:
- 注意を向ける
- 違和感を言語化する
- 迷いやすい点を問いにする
- 必要な既習知識を思い出させる

会話だけで数段の論理を運ばない。三者全員を毎回出さない。

### Character contract

花子: 自然な気づき・違和感。答えを言わない。  
太郎: 数学的整理・構造化。穴を完成させない。  
先生: 問いを絞る、ヒント、回答後の概念化/正式化。生徒の代わりに全計算しない。

## 5. Blank = thinking node

穴は削除語ではなく認知操作。

Allowed classes:
- 問題理解
- 復習
- 状態更新
- 方針選択
- 式/表現生成
- 導出
- 理由
- 意味/解釈

主要な非自明ノードを穴で覆う。穴数をKPIにしない。

### Two-step rule

一行の遷移に2個以上の非自明操作が必要なら、途中を分解する。

### Retrieval rule

既習知識は単独復習問題としてではなく、今の問題に必要になった瞬間に呼び戻す。

## 6. Concept / property / proof / example contract

### Concept
具体的な必要性から導入し、名称・記号・定義を正式化する。

### Property / theorem
定義後に何が成り立つかを説明する。単なる箇条書きではなく、なぜその性質を見るのかを接続する。

### Proof
次の場合に入れる:
- 教科書範囲で証明対象
- 理解上重要
- 後続の使い方を支える

証明不要な場合は空の「証明」見出しを作らず、そのまま例題へ進む。

### Example
定義の言い換えではなく、性質・定理を実際に使う。ProofとExampleはラベル/UI/余白で明確に区別する。

## 7. Derivation policy

公式・一般式は結果だけ出さない。

最低限:
- 何を一般化するか
- 変数の意味
- 具体例との対応
- 1段ごとの変化
- 最終項/係数の由来
- 使用する既習法則
- 最終式の意味

## 8. Answer leakage

禁止:
- 会話で直後の穴の答えを言う
- 後続の式で先の穴を露出
- 完成図で未回答部分を先に見せる
- 選択肢説明で正解を実質断定

必要なら回答後unlockを使う。

## 9. Figure policy

図は「見た方が構造を理解しやすい」ときだけ使う。

制作前に決める:
- 何を説明する図か
- どのノードの前/後に置くか
- 未回答の答えを漏らさないか
- 数学的制約
- visual/numerical QA

数学図の制作パイプラインは原則:
Figure Spec → LaTeX/TikZ/PGFPlots → PDF review → SVG/public asset → QA.

既存 `MATH_FIGURE_MANIFEST.md` の数値検証原則を継承する。

## 10. Visual semantics

- 概念・定義の本文: 黒字を基本。
- 太字: 概念名、重要語の局所強調。
- 色: 穴、操作可能要素、状態、正誤/feedback等の機能的意味に使う。
- Proof / Example / Definition は同じカードに見えないよう階層を分ける。
- 小見出しを増やしすぎない。文章の自然な流れを優先。

## 11. Authoring workflow

T1 Scope lock  
→ T2 Concept dependency graph  
→ T3 Natural motivating problem  
→ T4 Thought-node decomposition  
→ T5 Blank design  
→ T6 Coherent textbook prose  
→ T7 Dialogue insertion only where useful  
→ T8 Concept formalization  
→ T9 Property/theorem explanation  
→ T10 Proof if required  
→ T11 Immediate example/application  
→ T12 Figure placement decision  
→ T13 QA / leakage audit  
→ T14 app-format conversion  
→ T15 app/browser QA

図を先に描かない。本文/思考ノード上の役割を決めてから作る。

## 12. Verification gate

A lesson cannot be DONE until:

Content:
- source range preserved
- no invented out-of-scope theorem
- terminology consistent

Pedagogy:
- initial learner assumptions valid
- major reasoning nodes covered
- no unknown-term guessing
- concept/property/proof/example order is meaningful

Math:
- no 2-step unexplained jumps
- formulas/definitions correct
- proof logically complete where present
- figure constraints correct

Leakage:
- no answer visible before required response

Writing:
- reads as one textbook passage
- dialogue does not replace prose
- headings are not excessive

Visual/App:
- definition/example/proof distinguishable
- equations compile
- figures legible and unoccluded
- no retired section IDs or duplicated formulas
- mobile flow checked

## 13. Out of scope

このSpecは普通練習問題、共通テストsimulation、物理教材の制作規則ではない。
