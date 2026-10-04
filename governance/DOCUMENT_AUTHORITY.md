# Document Authority Model

## 目的

同じ内容を説明する README、Word、JSON、handoff、chat-derived note が複数存在しても、Agent が「どれを信じるか」を推測しなくてよい状態を作る。

## Authority Layers

### L0 — Direct Instruction
現在のユーザーによる明示指示。既存文書より優先する。ただし永続化が必要なら正式文書へ反映する。

### L1 — Constitution
プロジェクト全体の非交渉原則。

### L2 — Active Specification
現在の task/feature の intent と acceptance criteria。実装の直接根拠。

### L3 — Canonical Mode / Subject Specification
例: Mathematics/Textbook、Mathematics/Practice、Physics/Textbook、Physics/Practice 固有ルール。

### L4 — Repository Technical Canon
Architecture、schema、design system、API contract 等。

### L5 — Implementation
コード・canonical JSON・公開教材。上位仕様と矛盾した場合は「コードが正しい」のではなく矛盾として扱う。

### L6 — Historical Evidence
worklog、checkpoint、過去の decision、旧 handoff。経緯確認用。

### L7 — Archive / Deprecated
仕様権限なし。比較・復旧目的のみ。

## Conflict Rule

矛盾を発見した場合:
1. 勝手に平均化しない。
2. 上位 authority を確認する。
3. active spec と実装の差を finding として記録する。
4. 正本が未確定なら BLOCKED とする。
5. 解決後、古い資料へ DEPRECATED/HISTORICAL 状態を付与する。

## 既存文書の暫定扱い

2026-10-05 の監査完了までは、既存の root README / WORKFLOW / docs 内文書を自動的に L2-L4 とみなさない。  
内容ごとに現状実装との整合性を確認し、canonical / historical / deprecated を再分類する。
