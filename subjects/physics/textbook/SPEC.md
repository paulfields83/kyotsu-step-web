# Physics Textbook / Learning Mode — Canonical Spec

Status: CANONICAL  
Version: 1.0.0  
Updated: 2026-10-05  
Scope: 物理の教科書・学習モード

## 0. Authority / provenance

統合元:
- `物理_教科書モード_A_変位と速度`
- `第1章_物体の運動_数式導出穴強化版_v2.2_20260929`
- repository内の現行 textbook data / figure assets
- 9月末のユーザー修正:
  - 初学者は問題演習の前に概念を形成する必要がある
  - 「知識点チェック」と「図の読み取り」を別ブロックに分離せず、概念に応じて交互に組み合わせる
  - ベクトル、速度など図との往復が理解を速める概念は図を学習線の中核にする
  - 数式導出の穴は増やすが、単純計算を穴だらけにしない
  - 式の途中にも選択肢を持つ意味ある穴を置く
  - スマートフォンだけでも途中式を追えるようにする
  - learner-facing major titleでは内部コード `1A〜1G` を露出しない
  - ただし内部stable ID / URL / progress / tests / provenance用の1A〜1G identityは維持する

旧Wordの `1A〜1G` は内容証拠として参照できるが、learner-facing title architectureのauthorityではない。Chapter 1の表示構造は `CHAPTER_01_ARCHITECTURE.md` を参照する。

## 1. Purpose

初学者が、現象・図・言葉・式・グラフを往復しながら、

「何が起きているか」
→「どの物理量で表すか」
→「量どうしがどう関係するか」
→「どの式になるか」
→「その式は何を意味するか」
→「例題でどう使うか」

まで一つの学習線として理解する教材。

公式暗記→問題演習ではなく、表現を結び付けて概念を作ることを第一にする。

## 2. Interleaved learning architecture

「知識点チェック」「図の読み取り」「数式」「例題」を大きな独立章として順番に並べない。

概念ごとに必要な表現を交互に置く。

例:
現象の文章
→ 図で方向/位置を読む
→ 意味穴
→ ベクトル表現
→ 式生成
→ 図へ戻って式の意味を確認
→ 短い例題

別概念では:
グラフ
→ 傾きの意味
→ 瞬間量
→ 式
→ 現象へ戻る

順序は概念が最も理解しやすいrepresentation pathで決める。

## 3. Blank taxonomy

穴は以下の認知操作に限定する。

- H1 Meaning: 図・現象から何を表すか読む
- H2 Relation: 物理量どうしの重要関係
- H3 Representation: 図↔言葉↔式↔グラフ
- H4 Strategy: 次に何を求める/どの原理を使う
- H5 Physical condition: 最高点、終端、固定端等の条件
- H6 Meaningful math operation: 変数消去、符号、重要代入等

数式導出では特に:
- F1 Parent equation selection
- F2 Physical-condition substitution
- F3 Variable elimination
- F4 Meaningful transformation
- F5 Reconstruction into reusable final formula

禁止:
- 単純な四則演算だけを大量に穴にする
- 同じ知識の機械的反復
- 未習用語の当て物
- 一つの穴で複数判断を要求

## 4. Formula derivation contract

重要導出は:

親式
→ 使う物理条件
→ 条件の代入
→ 1段ずつ式変形
→ 必要なら変数消去
→ 最終式
→ 物理的意味

の順を画面内に残す。

2段以上の非自明導出では、少なくとも一度は学習者が「次の式」を作る。

ただし見た目として、独立した大きな白い回答枠を3個以上連続させるような設計を避ける。式の文脈内に穴を埋め込み、回答後に完成式へ戻し、次の意味を説明してから次の穴へ進む。

## 5. Figure / representation policy

図は補助画像ではなく、物理表現の一部。

各図は:
- learning purpose
- related node
- before/after-answer placement
- mathematical/physical constraints
- labels
- answer-leak risk
- visual QA

を持つ。

未回答の答えを直接図が示す場合、図は回答後の確認へ移す。

図・式・本文のいずれかが同じ情報を不必要に二重表示しない。重複は教育的役割がある場合のみ残す。

## 6. Mobile-first

紙とペンがなくても:
- 親式
- 条件
- 代入
- 中間式
- 結論
- 単位/符号
を画面だけで追える。

式は横溢れ、根号崩れ、compile errorを許さない。長い式は意味単位で分ける。

## 7. Concept / example progression

初学概念はまず:
現象/図
→ 意味
→ 名称・物理量
→ 関係
→ 必要な式/導出
→ 例題

へ進む。

最初から例題を解かせて「知らない概念を問題から推測させる」設計にしない。

既習概念の確認問題は入れてよいが、新規概念導入と区別する。

## 8. Titles / chapter structure

学習内容を細かい番号見出しで過剰分割しない。

- UI上の大見出しは少数
- 内部Node IDは細かく持てる
- 表示タイトルと管理IDを分離する

`1A/1B/1C/1D...` は**内部stable identityとして維持**するが、learner-facing major titleのauthorityにはしない。

Chapter 1では学習者に次の3タイトルを見せる。
- 運動を表す — internal 1A/1B/1C
- 速度の変化 — internal 1D/1E/1F
- 力と運動 — internal 1G

詳細・bridge sentence・UI契約は `CHAPTER_01_ARCHITECTURE.md` を正とする。内部IDを見た目の簡潔化だけのためにrenameしてはならない。

## 9. Answer leakage

禁止:
- 図が先に答えを示す
- 式の次行で前穴の答えが露出
- 会話/説明が選択肢を実質断定
- 解説を開くと将来ステップまで見える

回答後に必要情報をunlockしてよい。

## 10. Authoring workflow

PT1 source range / learner prior knowledge
→ PT2 concept dependency
→ PT3 representation plan
→ PT4 figure placement plan
→ PT5 reasoning/derivation nodes
→ PT6 blank design
→ PT7 prose integration
→ PT8 equation rendering
→ PT9 figure integration
→ PT10 leakage audit
→ PT11 mobile/UI QA
→ PT12 published data

図・コード・Word生成を、PT1〜PT5より先に始めない。

## 11. Verification gate

Content:
- source scope complete
- concept order valid for beginner
- no internal unit code silently revived as a learner-facing major title
- stable internal IDs remain migration-compatible

Physics:
- vector directions/signs correct
- units/dimensions consistent
- boundary conditions correct
- derivations complete

Pedagogy:
- knowledge and representation interleaved where useful
- meaningful holes only
- no unexplained 2-step jumps
- formula meaning stated

Figure/UI:
- figure not blurry/cropped/hidden
- equations compile
- no duplicate formula without purpose
- no long runs of isolated blank cards
- mobile readable
- titles not excessively fragmented

Leakage:
- no future answer shown early

## 12. Out of scope

このSpecは共通テスト guided practice / simulation / 数学教材の仕様ではない。
