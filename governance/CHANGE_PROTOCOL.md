# Change Protocol

All concrete work follows `governance/WORK_SYSTEM.md`.

The common gate is:

```text
RECOVER
→ IDENTIFY WORK
→ ASSESS
→ CHECK APPROVAL
→ PROPOSE / USER APPROVAL when needed
→ PLAN / TASKS
→ IMPLEMENT
→ CONVERGE
→ VERIFY
→ MEMORY CLOSE
```

No workflow below bypasses the approval gate.

## A. 通常の機能・教材変更

### RECOVER / CONTEXT
CURRENT_POSITION、Match Graph、対象 canonical spec、必要な lessons / decisions、関連Work recordsを読む。

### IDENTIFY WORK
既存Workなら再利用する。新しい明確な目的なら新しいWork IDを作る。

### ASSESS / SPECIFY
What / Why / Acceptance Criteria / Out of Scope と現状差分を明確にする。

### CHECK APPROVAL
exact scope の approved proposal があるか確認する。

- ある → PLANへ
- ない → Proposalを作成しユーザーへ提示、承認まで実装しない
- 既存Proposalからmaterialに変わる → `REVISE-PROPOSAL`

### PLAN
How / files / migration / risk / tests を決める。承認済みSpecの意味を変えてはならない。

### TASKS
依存順の小さな Task ID に分解する。

### IMPLEMENT
承認済みscope内だけ実装し、Actionと対象場所を記録する。

### CONVERGE
Spec / Proposal / Tasks と現物の差を再評価する。新しいmaterial decisionが必要なら実装継続ではなくProposalへ戻す。

### VERIFY
対象 gate を通し、PASS/FAIL双方をVerificationへ残す。

### MEMORY CLOSE
Work recordを閉じ、durableなDecision/Lesson/Current Stateだけ上位memoryへ昇格する。

## B. 修正 / バグ修正

```text
RECOVER
→ ASSESS WHAT IS WRONG
→ identify exact correction
→ CHECK APPROVED CORRECTION
→ PROPOSE if absent
→ USER REVIEW
   ├─ feedback / added conditions → REVISE-PROPOSAL → present revised proposal → STOP
   └─ explicit approval of exact proposal → APPROVED
→ FIX
→ VALIDATE ORIGINAL SYMPTOM + REGRESSION
→ RECORD FINDINGS
→ MEMORY CLOSE
```

重要:
- 「修正」という言葉だけを実装許可と扱わない。
- まず何を修正するべきか確認する。
- ユーザーの修正コメント・追加条件・「いいけど…」は承認ではない。内容が変わるなら必ず `REVISE-PROPOSAL`。
- 修正版を全文提示してSTOPし、その修正版そのものへの明示承認後に実装する。
- 既に承認済みで内容が変わっていない修正案なら同じ承認を取り直さない。
- 原因分析前の一括書き換えは禁止。

## C. Cleanup

```text
RECOVER
→ INVENTORY
→ CLASSIFY
→ TRACE REFERENCES
→ CHOOSE CANONICAL
→ PROPOSE CLEANUP
→ USER APPROVAL
→ QUARANTINE
→ VALIDATE
→ DELETE / ARCHIVE
→ MEMORY CLOSE
```

Cleanupでは「削除」より provenance / canonical 判定 / 承認が先。

## D. Constitution Amendment

```text
PROPOSAL
→ IMPACT
→ USER APPROVAL
→ VERSION BUMP
→ SYNC CHECK
```

通常タスクから暗黙にamendmentへ入らない。

## E. Recording rule

各Workで最低限残す:
- `WORK.md` — state / scope / next
- `PROPOSAL.md` — proposal / approval
- `ACTION_LOG.md` — what / where / result
- `FINDINGS.md` — confirmed facts / errors / risks
- `VERIFICATION.md` — PASS/FAIL evidence

ユーザーから「それは違う」と訂正された内容は、単なる会話として捨てず、適切なERROR findingとして記録する。
ユーザーが正しい案を正式に通した場合も、必要に応じてCONFIRMED / Decisionとして残す。
