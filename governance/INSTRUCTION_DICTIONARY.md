# 指示辞書 / Instruction Dictionary

Status: CANONICAL
Version: 1.3.0
Updated: 2026-10-08

## Purpose

この辞書は、ユーザーがGitHub上の塾プロジェクトに対して与える**上位命令**を登録する。

Agentは、登録された命令の意味を勝手に拡張してはならない。
辞書に存在しないGitHub命令を、推測だけで実行してはならない。

---

## Instruction Matching Rule

ユーザーのGitHub指示は、実行前にこの辞書と照合する。

### 1. EXACT

Canonical Phrase と明確に一致する場合、そのCommandとして処理する。

### 2. SIMILAR

登録済みCommandに意味が近いが、Canonical Phraseと一致しない場合:

1. 実行しない。
2. 最も近いCommandを特定する。
3. Command ID / Canonical Phrase / 実行内容をユーザーへ提示する。
4. **「今回この指示として扱いますか？」** と確認する。
5. ユーザーが肯定した場合のみ、そのCommandとして処理する。

類似していること自体は:
- 同一Commandであること
- Aliasであること
- 実行許可

を意味しない。

### 3. UNKNOWN

適切な登録Commandが存在しない場合:

- GitHub変更作業を開始しない。
- その指示がGitHub作業に重要なら、通常Workを停止する。
- まず指示辞書の不足をユーザーへ報告し、辞書修正案を優先する。
- ユーザー承認前に新Commandを勝手に登録しない。

### Alias rule

自然言語表現をAgentが勝手にAlias登録してはならない。
Alias化にはユーザーの明示承認が必要。

---

## CMD-ROOT-001 — 憲法から

Status: ACTIVE  
Class: ROOT  
Priority: HIGHEST  
Canonical Phrase: **憲法から**

### Purpose

GitHub上の正式なRepository OSを起点に、現在の正本・現在地・作業状態を復元し、以後のGitHub作業を正しい前提から開始できる状態を作る。

これは最上位の起動命令である。

### Stage 0 — Repository identity verification

他の資料を読む前に、まず実際のGitHubを確認する。

最低限:

1. Repository が `paulfields83/kyotsu-step-web` であること
2. authoritative branch が `main` であること
3. live `main` の現在HEADを取得すること
4. そのlive `main` 上で必須Repository OSファイルの存在を確認すること

必須確認対象:

- `AGENTS.md`
- `governance/CONSTITUTION.md`
- `navigation/CURRENT_POSITION.md`
- `navigation/MASTER_MATCH_GRAPH.md`
- `memory/ACTIVE_CONTEXT.md`
- `memory/PROGRESS.md`
- `governance/INSTRUCTION_DICTIONARY.md`

### Critical rule

必須ファイルについて「存在しない」と結論する前に、repository / branch / live HEAD が正しいことを確認する。

古いclone、古いbranch、古いsnapshot、別worktreeの状態を、live `main` の状態として扱ってはならない。

### Stage 1 — Repository OS recovery

Stage 0 が通った後、`AGENTS.md` と `governance/COMMAND_WORDS.md` に従ってRepository OSを復元する。

少なくとも:

- Constitution
- Current Position
- Master Match Graph
- Active Context
- Progress
- 対象subject / modeのcanonical spec
- 必要なDecision / Lesson

を必要範囲で確認する。

### Stage 2 — Instruction dictionary load

この辞書を読み、以後のGitHub命令解釈の基準とする。

「憲法から」自身は、この辞書を読み込むためのRoot Commandでもある。

### Authorization

「憲法から」だけを理由に、未確認のGitHub操作へ権限を拡張してはならない。

後続の具体的な作業は、現行のcanonical governance / command / approval rulesに従う。

### Failure behavior

Stage 0でrepository identityまたはlive mainを確定できない場合:

- 実装・修正・削除・merge等へ進まない
- 不確定な内容を「現行mainの事実」として報告しない
- 何が確認できていないかを明示する

### Evidence rule

「存在する / 存在しない」「現在mainでは〜」というRepository状態の主張は、可能な限りlive GitHub確認を根拠にする。

---

## CMD-WORK-001 — 修正

Status: ACTIVE  
Class: WORK  
Priority: NORMAL  
Canonical Phrase: **修正**

### Purpose

既存成果物について、**何を修正すべきかを確認し、承認済み修正案がある場合だけその範囲を実装する**。

「修正」は、問題点が未確定の状態からいきなり書き換える命令ではない。

### Expanded behavior

```text
対象を特定
↓
対象Mode / subject / technical canon を確認
↓
現在の実物・既存Work・Decision・Lessonを確認
↓
何を修正すべきか確認
↓
approved correction proposal exists?
   │
   ├─ NO
   │   ↓
   │  問題点を整理
   │   ↓
   │  修正案を作成
   │   ↓
   │  ユーザーへ提示
   │   ↓
   │  REVIEW
   │   ├─ 修正コメントあり
   │   │   ↓
   │   │  REVISE-PROPOSAL
   │   │   ↓
   │   │  修正版を再提示
   │   │   ↓
   │   │  STOP
   │   └─ exact Proposalを明示承認
   │       ↓
   │      APPROVED
   │
   └─ YES
       ↓
      承認済みscope内だけ修正
       ↓
      Action Log
       ↓
      Findings
       ↓
      Verification
       ↓
      Memory Close
```

### Approval behavior

**REVIEW-FEEDBACK ≠ APPROVAL**

- 承認済み修正案が存在しない場合、実装してはならない。
- ユーザーの修正コメント、追加条件、反対意見、改善案は、たとえ「いい」「結構」「OK」などの肯定表現を含んでいても、Proposalの内容を変更するなら承認として扱わない。
- Proposalへのレビューで内容が追加・削除・変更・条件付きになった場合:
  1. 実装しない。
  2. Workを `REVISE-PROPOSAL` に戻す。
  3. 新しいProposal revision / IDを作る。
  4. 旧Proposalを上書きせず履歴として残す。
  5. **修正版Proposalをユーザーへ全文提示する。**
  6. **そこでSTOPする。**
  7. 修正版そのものへの明示承認を受けて初めて `APPROVED` / `IMPLEMENTING` へ進む。
- 「そう」「OK」などの短い肯定は、**直前に exact Proposal の承認を尋ねる明確な質問へ直接答えており、かつ新しい変更条件を含まない場合だけ**承認証拠になり得る。
- 承認なのかレビューなのか曖昧なら、実装せず確認する。
- 既に同じ未変更Proposalが明示承認済みなら、承認を取り直さず続行できる。
- 修正中にmaterialな変更が必要になった場合も `REVISE-PROPOSAL` へ戻り、修正版提示 → 再承認を行う。

### Assessment requirement

修正前に最低限確認する:

- 現在の症状 / 問題
- 何を修正すべきか
- 影響範囲
- 既存の承認済み修正案の有無
- Do Not Touch
- 必要なverification

### Review-link handoff

Every time a correction Work reaches a user-reviewable stopping point, the final handoff must include at least one usable review link.

Priority:
1. rendered app / preview / directly reviewable screen;
2. Pull Request;
3. branch or exact GitHub location if no better review surface exists.

Rules:
- Prefer the link that lets the user inspect the actual corrected result.
- If no preview/app link exists, say so and provide the best available fallback.
- This applies both when the Work is DONE and when it intentionally stops at a user review gate.
- Do not finish a correction handoff with prose only when a review link is available.

### Record requirement

修正Workでは必要に応じて:

- `WORK.md`
- `PROPOSAL.md`
- `ACTION_LOG.md`
- `FINDINGS.md`
- `VERIFICATION.md`

を使う。

ユーザーから「それは違う」と訂正された内容は、適切なERROR findingとして残す。
正しいと確認された重要事項はCONFIRMEDとして残す。

---

## Registry rule

この辞書に新しい上位命令を追加・変更する場合は、ユーザーの明示承認を必要とする。

未登録の命令を、Agentが勝手に既存命令として登録・同一視してはならない。
