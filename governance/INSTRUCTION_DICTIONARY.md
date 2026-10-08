# 指示辞書 / Instruction Dictionary

Status: CANONICAL
Version: 1.0.0
Updated: 2026-10-08

## Purpose

この辞書は、ユーザーがGitHub上の塾プロジェクトに対して与える**上位命令**を登録する。

Agentは、登録された命令の意味を勝手に拡張してはならない。

現時点では、ユーザーが正式に登録を指示したRoot Commandだけを収録する。
他の命令語は、ユーザー承認前に追加しない。

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

### Expansion source

詳細な作業開始フローは:

- `AGENTS.md`
- `governance/COMMAND_WORDS.md`

を参照する。

---

## Registry rule

この辞書に新しい上位命令を追加・変更する場合は、ユーザーの明示承認を必要とする。

未登録の命令を、Agentが勝手に既存命令として登録・同一視してはならない。
