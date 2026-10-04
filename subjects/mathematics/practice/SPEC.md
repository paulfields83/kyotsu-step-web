# Mathematics Ordinary Practice Mode — Canonical Spec

Status: CANONICAL  
Version: 1.0.0  
Updated: 2026-10-05  
Scope: 数学の普通練習 / guided practice

## 0. Authority / provenance

統合元:
- 完成教材 `数学I_普通練習_集合と命題_4STEP全問_引導版`
- repository `backend/data/practice/README.md`
- latest project corrections:
  - 解法関係を先に固定してから教材文/UIへ落とす
  - 問題内だけでなく、問題間の依存も記録する
  - 図が必要か・どこに置くかは思考ノード再設計表/火柴図で先に決める
  - 原問題を別物へ作り替えず、解くための思考経路を可視化する

## 1. Purpose

普通練習モードは、既存問題を単に解説するのではなく、解答に必要な数学的判断をノードへ分解し、生徒が一段ずつ自分で決定して進む練習システム。

基本体験:

問題
→ 現在の思考ノード
→ 「考えること」
→ 「使うもの」
→ 式/判断の未完成部分
→ holeをタップ
→ A〜Dを選ぶ
→ 正誤feedback
→ 正解値を本文へ反映
→ 次の必要ノードを解放
→ 最終結果

## 2. Do not confuse with Textbook Mode

普通練習では、新概念を最初から教育することが第一目的ではない。既習概念を使って問題を解く思考経路の訓練が中心。

したがって:
- 花子/太郎/先生の教材会話を必須化しない。
- 長い概念導入を各問題へ繰り返さない。
- 問題を別の導入教材へ変形しない。
- 必要な既習知識は `basis` と短いguideで呼び戻す。

## 3. Production order — graph before prose

問題を見てすぐ穴を作らない。

P1 原問題を確定  
→ P2 求める最終結果を確定  
→ P3 完全解法を作る  
→ P4 数学的思考ノードへ分解  
→ P5 node graphを作る  
→ P6 問題間依存を確認  
→ P7 blank / choices / feedbackを設計  
→ P8 staged revealを設計  
→ P9 figure necessity / positionを決める  
→ P10 学生表示文へ変換  
→ P11 relation/leak QA  
→ P12 app dataへ昇格

「本文を書きながらdepends_onを後付け」は禁止。

## 4. Node schema

各回答ノードは最低限:

- `id`
- `dependsOn`: このノードの計算/判断が実際に参照する前ノード
- `basis`: 定義、定理、与条件、既習知識
- `operation`: 何をするか
- `purpose`: なぜこのノードが必要か
- `feeds`: この結果を直接利用する後続ノード
- `prompt`: 学生に何を判断させるか
- `blank`: 回答位置
- `choices`
- `correctOptionIds`
- `wrongReason` per plausible distractor
- `releaseAfterCorrect`

`dependsOn` は表示順ではない。論理依存だけを書く。

UI上は分かりやすさのため逐次表示しても、graphは独立した実依存を保存する。

## 5. Question-level dependency

問題群では各問題を独立と仮定しない。

各questionは必要に応じて:

- `dependsOnQuestions`
- `usesResultFrom`
- `prerequisiteConcepts`
- `producesReusableResult`

を持つ。

例:
Q2がQ1で証明/計算した結論を使う場合、Q2側でその結論を再発明させず、Q1→Q2 edgeを正式に記録する。

QA:
- referenced question exists
- dependency direction is acyclic unless意図した復習循環を別構造で表現
- Q2本文に必要結果が勝手に先出しされていない
- Q1未完了時のUI behaviorが定義されている

## 6. Step presentation

基準:
- 開始時は最初の必要STEPのみ表示。
- holeをタップした時だけ選択肢を展開。
- 正解後、値を式/本文へ代入して確定。
- 次の許可されたSTEPを解放。
- 未解決future answerは見せない。
- 最終孔正解後に完了を表示。

表示順はpedagogical sequence、dependency graphはmathematical sequence。両者を混同しない。

## 7. Choice design

A〜Dは単なる数字のシャッフルではなく、可能なら具体的な誤りを表す。

良いdistractor由来:
- 条件の一部だけ読む
- 不等号/端点
- 符号
- 集合記号向き
- 逆/対偶
- 途中計算
- 場合分け漏れ
- 必要十分の向き
- 前段結果の誤使用

`wrongReason` はその誤りに対応する。全部同じ汎用文で済ませない。

## 8. Mini guide

各stepで必要なら:
- 考えること
- 使うもの

を見せる。

ただし正解を言わない。ガイドは「どこを見るか」「何を使うか」までで、学生が行う判断/式を完成させない。

## 9. Figure planning

図は制作前に計画する。

思考ノード再設計時に各nodeへ:
- `figureNeeded: yes/no`
- `figurePurpose`
- `placement`
- `revealsAnswerRisk`
- `source/generated`
- `qaRules`

を決める。

図を作るのはこの表が確定した後。火柴図にも図の配置nodeを載せ、文章・式・図の矛盾を発見できるようにする。

## 10. Fire / relation graph

最低2層を持つ。

### Layer A — within question
hole/node dependency:
`dependsOn / basis / operation / purpose / feeds`

### Layer B — across questions
question dependency / reusable conclusions / prerequisite relations.

必要ならLayer Cとして単元concept graphを持つ。

火柴図は詳細を全部箱内へ書かず、Node IDで詳細表へリンクする。見ただけで:
- current node
- prerequisite
- next unlock
- figure placement
- blocked edge
が分かること。

## 11. Source fidelity

原問題の:
- 条件
- 求めるもの
- 数学的意味
- 問題間参照

を維持する。

guideを作るために別問題へ改変しない。数値・条件・図形関係を勝手に変えない。

## 12. Promotion pipeline

`source/`
→ reviewed full solution
→ relation graph
→ blank/distractor design
→ gating design
→ figure plan
→ relation/leak QA
→ interactive question
→ app/browser QA
→ PUBLISHED

sourceをそのままinteractiveへ自動変換しない。

## 13. Verification gate

### Coverage
- 対象問題が抜けていない
- 除外問題が明示されている

### Mathematical graph
- every hole has purpose
- dependsOn is real dependency
- feeds consistent
- no missing prerequisite
- no accidental cycles

### Cross-question graph
- reused prior conclusions encoded
- no hidden inter-question dependency
- prerequisite order valid

### Interaction
- only permitted content visible
- options open on hole interaction
- correct substitution works
- future steps remain locked
- wrong answer does not corrupt later state

### Distractors
- plausible
- feedback specific
- correct answer unique/valid

### Figures
- need and placement justified
- no answer leakage
- mathematics correct
- legible

### Writing/UI
- STEP / proof / final answer boundaries clear
- not cluttered
- mobile readable

Only after all relevant gates pass may source data be promoted to published interactive data.

## 14. Out of scope

このSpecは数学教科書モード、共通テストsimulation、物理モードの仕様ではない。
