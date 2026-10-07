# Command Word — 「憲法から」

Status: CANONICAL
Version: 1.1.0
Updated: 2026-10-07

## Definition

「憲法から」は、塾プロジェクトで作業を開始・再開するときの一語マクロである。

意味は、**GitHubの正式記憶から現在状態を復元し、対象Workと承認状態を確認し、許可された段階まで進むこと**。

「憲法から」自体は、未承認案の実装許可を意味しない。

## Expanded meaning

```text
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
⑥ 今回対象の Mode SPEC / technical canon
↓
⑦ 関連 Decision / Lesson
↓
⑧ 関連 Work record
   WORK / PROPOSAL / ACTION_LOG / FINDINGS / VERIFICATION
↓
⑨ 現在状態を再構成
↓
⑩ 承認状態を判定
   ├─ 未承認 → ASSESS → PROPOSE → USER APPROVAL で停止
   └─ 承認済み → approved scope 内で実行
↓
⑪ Verification / QA
↓
⑫ Work record + project memory を更新
```

## Phase A — Recovery

必ず必要範囲で以下を読む。

1. `AGENTS.md`
2. `governance/CONSTITUTION.md`
3. `navigation/CURRENT_POSITION.md`
4. `navigation/MASTER_MATCH_GRAPH.md`
5. `memory/ACTIVE_CONTEXT.md`
6. `memory/PROGRESS.md`
7. 今回の subject / mode / technical canon
8. 関連する `memory/DECISIONS/` / `memory/LESSONS/`
9. 対象Workがあれば、その5記録

全資料を無差別に読むのではなく Progressive Disclosure を使う。

## Phase B — Reconstruction

最低限、以下を復元する。

- 今回のWork ID / objective
- current node / current step
- 完了済み成果物
- 未解決点 / dependencies
- approved proposal の有無
- 何がCONFIRMEDか
- 過去のERROR / Lesson
- 今回触ってよい範囲 / Do Not Touch
- 次に実行可能な行為

復元できない状態で大量実装へ進まない。

## Phase C — Approval Check

`governance/WORK_SYSTEM.md` に従って、実装前に承認状態を判定する。

```text
approved proposal exists?
      │
  ┌───┴───┐
  │       │
 NO      YES
  │       │
  ▼       ▼
ASSESS    approved scope 内で
PROPOSE   PLAN / IMPLEMENT
  │
  ▼
USER APPROVAL
  │
  ▼
APPROVED
```

### Important

- ユーザーが作業内容を説明しただけでは、必ずしもProposal承認ではない。
- 明示的に通した案がrepositoryに記録されていれば、同じ承認を毎Chat取り直さない。
- approved scope を実質的に変える必要が出たら `REVISE-PROPOSAL` に戻る。

## Phase D — Execution

承認済みの範囲だけ実行する。

GitHub変更:
- `main` を直接編集しない
- 一Work一feature branchを基本とする
- Actionごとに対象場所・結果・証拠を `ACTION_LOG.md` に残す
- 正誤・問題発見は `FINDINGS.md` に分類して残す
- destructive action は provenance / replacement / references を先に確認する

## Phase E — Verification

「作った」と「DONE」を分ける。

対象に応じて:
- content/math/physics correctness
- pedagogy / dependency integrity
- answer leakage
- figure/rendering
- typecheck / lint / tests / build
- E2E / browser / mobile
- repository governance check

結果は `VERIFICATION.md` に残す。

## Phase F — Memory Close

Workの詳細はWork内へ残し、耐久性があるものだけ上位へ昇格する。

- durable design choice → `memory/DECISIONS/`
- reusable success/failure rule → `memory/LESSONS/`
- project current state → `CURRENT_POSITION.md` / `PROGRESS.md`
- dependency/state change → `MASTER_MATCH_GRAPH.md`
- significant chronology → `CHANGELOG.md`

WorkがDONEになるには Verification と Memory Close の両方が必要。

## Usage

### 未承認の修正

```text
憲法から。数学学習モードの例題と証明の見分けが弱い。修正したい。
```

Agent:
1. 現状と過去記録を復元
2. 何を修正すべきか調査
3. Proposal作成
4. ユーザーへ提示
5. 承認前には実装しない

### 承認済み作業の続き

```text
憲法から。前に通したPhysics 3-chunk案の続きをやって。
```

Repositoryに承認記録があり、現在作業がその範囲内なら、同じ承認を聞き直さず続行する。

### 状態確認だけ

```text
憲法から。今どこまで？
```

Recovery / Reconstructionまで行い、変更しない。

## Anti-patterns

- 過去会話の曖昧な記憶だけで続ける
- approved proposal の存在を確認せず実装する
- 未承認案を「作戦」と呼んでそのまま実行する
- user correction を会話だけに残す
- user confirmation を会話だけに残す
- Actionの対象場所を記録しない
- failed verificationを消して最終PASSだけ残す
- Work終了後に次Chat用記憶を更新しない

## One-line semantic

**「憲法から」 = 正式記憶から現在状態と対象Workを復元し、承認状態を判定し、許可された段階まで作業し、正誤・操作・検証を記録して次Chatへ引き継げる状態にする。**
