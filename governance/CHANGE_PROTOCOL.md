# Change Protocol

## A. 通常の機能・教材変更

INTAKE
→ CONTEXT
→ SPECIFY
→ PLAN
→ TASKS
→ IMPLEMENT
→ CONVERGE
→ VERIFY
→ CLOSE

### INTAKE
依頼内容、対象 subject/mode、変更禁止範囲を特定する。

### CONTEXT
CURRENT_POSITION、Match Graph、対象 canonical spec、必要な lessons / decisions のみ読む。

### SPECIFY
What / Why / Acceptance Criteria / Out of Scope を固定する。

### PLAN
How / files / migration / risk / tests を決める。Spec の意味を変えてはならない。

### TASKS
依存順の小さな Task ID に分解する。

### IMPLEMENT
Task の範囲内だけ実装する。

### CONVERGE
Spec / Plan / Tasks と現物の差を再評価し、残件を追跡可能な task に戻す。

### VERIFY
対象 gate を通す。教材なら内容・導出・図・穴・漏洩、コードなら type/lint/test/build/E2E 等。

### CLOSE
現在地、progress、decision、必要な lesson を更新する。

## B. バグ修正

ASSESS → FIX → VALIDATE を分離する。

- ASSESS: 症状、再現条件、原因仮説、影響範囲。
- FIX: 評価した原因だけを修正。
- VALIDATE: 元症状が消え、回帰がないことを確認。

原因分析前の一括書き換えは禁止。

## C. Cleanup

INVENTORY
→ CLASSIFY
→ TRACE REFERENCES
→ CHOOSE CANONICAL
→ QUARANTINE
→ VALIDATE
→ DELETE/ARCHIVE

Cleanup では「削除」より canonical 判定が先。

## D. Constitution Amendment

PROPOSAL → IMPACT → USER APPROVAL → VERSION BUMP → SYNC CHECK

通常タスクから暗黙に amendment へ入らない。
