# Document Authority Model

## 目的

同じ内容を説明する README、Word、JSON、handoff、chat-derived note が複数存在しても、Agent が「どれを信じるか」を推測しなくてよい状態を作る。

## Authority Layers

### L0 — Direct Instruction
現在のユーザーによる明示指示。既存文書より優先する。ただし永続化が必要なら正式文書へ反映する。

### L1 — Constitution
プロジェクト全体の非交渉原則。

### L2 — Approved Active Work / Specification
現在のWorkの approved proposal、active task/feature spec、acceptance criteria。実装の直接根拠。

未承認のProposalはL2実装権限を持たない。

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

## Work records

`work/items/` の各Workは詳細な作業証拠である。

- APPROVED proposal: そのWorkのL2実装根拠
- ACTION_LOG / FINDINGS / VERIFICATION: 実行・発見・検証の証拠
- Work内の記録は、それだけでL1/L3/L4のcanonical authorityを上書きしない

上位canonicalとの矛盾を発見した場合はWorkをBLOCKEDまたはREVISE-PROPOSALへ戻す。

## Historical documents

旧root/docs資料は2026-10-05監査で分類・移行済み。 `history/` / `archive/` の資料は、新たに正式昇格されない限り現行仕様権限を持たない。
