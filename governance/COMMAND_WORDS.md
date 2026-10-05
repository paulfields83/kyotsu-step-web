# Command Word — 「憲法から」

Status: CANONICAL
Version: 1.0.0
Updated: 2026-10-05

## Definition

「憲法から」は、塾プロジェクトで作業を開始するときの**一語マクロ**である。

ユーザーが「憲法から」と言った場合、Agent は過去会話を覚えているつもりで作業を始めてはならない。GitHub の authoritative project memory から現在状態を復元し、その上で今回の作業を進める。

## Expanded meaning

```text
「憲法から」
   ↓
① AGENTS
   ↓
② Constitution
   ↓
③ CURRENT_POSITION
   ↓
④ MASTER_MATCH_GRAPH
   ↓
⑤ ACTIVE_CONTEXT + PROGRESS
   ↓
⑥ 今回対象の Mode SPEC
   ↓
⑦ そのNodeに関係する Decision / Lesson
   ↓
⑧ ここまで読んで今回の作戦を作る
   ↓
⑨ 作業を実行する
   ↓
⑩ Verification / QA
   ↓
⑪ CURRENT_POSITION / PROGRESS / 必要な Decision・Lesson・Match Graph を更新する
```

## Phase A — Recovery

必ず以下の順に読む。

1. `AGENTS.md`
2. `governance/CONSTITUTION.md`
3. `navigation/CURRENT_POSITION.md`
4. `navigation/MASTER_MATCH_GRAPH.md`
5. `memory/ACTIVE_CONTEXT.md`
6. `memory/PROGRESS.md`
7. 今回の subject / mode の canonical spec
8. 対象Nodeに直接関係する `memory/DECISIONS/` と `memory/LESSONS/`

必要に応じて technical canon、quality、active work spec を追加で読む。

## Phase B — Reconstruction

作業前に最低限これを復元する。

- 前回どこまで完了したか
- 今の current node
- 今回の直接目的
- 既に完成済みの成果物
- 未解決の問題
- 依存関係
- 今回触ってよい範囲
- 今回触ってはいけない範囲
- 過去に同じ種類の失敗があったか
- どの文書が canonical authority か

この復元ができない状態では大量実装へ進まない。

## Phase C — Strategy

復元後、今回の作戦を短く整理する。

最低限:

- Objective
- Current Node
- Inputs
- Changes
- Do Not Touch
- Steps
- Verification
- Expected Next

ユーザーがすでに十分具体的に作業を指示している場合、不要な再確認質問はせず、この作戦に従って進める。

## Phase D — Execution

GitHub変更を伴う場合:
- `main` を直接編集しない
- 一作業一feature branch
- canonical spec / task spec を基準に実装
- 別subject / 別mode の規則を勝手に混ぜない
- 待ち時間中に独立して進められる監査・文書・テストを進める
- destructive action は provenance / replacement / references を確認してから行う

教材制作では、対象Mode SPECの authoring workflow に従う。

## Phase E — Verification

「作った」だけでDONEにしない。

対象に応じて:
- content/math/physics correctness
- dependency/reference integrity
- answer leakage
- figure correctness
- typecheck/lint/test/build
- E2E/browser/mobile QA
- repository governance check

必要なgateを通す。

## Phase F — Memory Close

終了前に、今回の仕事で状態が変わった場合は必ず authoritative memory を更新する。

最低限:
- `navigation/CURRENT_POSITION.md`
- `memory/PROGRESS.md`

必要に応じて:
- `navigation/MASTER_MATCH_GRAPH.md`
- `memory/ACTIVE_CONTEXT.md`
- `memory/DECISIONS/`
- `memory/LESSONS/`
- `memory/CHANGELOG.md`
- active work spec

重要な設計判断は会話だけに残さない。

## Usage

### 続きの作業

```text
憲法から。数学練習の続きをやって。
```

意味:
現在状態を完全に復元し、Math Practice canonical spec と関連Node/Decision/Lessonを読み、前回の続きから作業する。

### 新規機能

```text
憲法から。物理1章の3-chunk UIを実装して。
```

意味:
Repository OS → Physics Textbook canon → Chapter 1 architecture → current implementation gap を復元してから、feature branchで実装・検証・記憶更新まで行う。

### 状態確認だけ

```text
憲法から。今どこまで進んでいるか教えて。
```

意味:
Recoveryまでは行うが、変更は行わない。現在地と次のworkを報告する。

## Anti-patterns

「憲法から」を受けたAgentは以下をしてはならない。

- 過去会話の曖昧な記憶だけで続ける
- CURRENT_POSITIONを読まずに昔のtaskを再開する
- 完成済み成果物をゼロから再制作する
- old Word / ZIP / historical docsを正本扱いする
- Mode SPECを読まずに別モードの成功例を流用する
- 作業後にCurrent Position/Progressを更新せず終了する

## One-line semantic

**「憲法から」 = GitHubの正式記憶から現在状態を復元し、正本に従って作業し、検証し、次のChatが続けられる状態まで記憶を更新して終える。**
