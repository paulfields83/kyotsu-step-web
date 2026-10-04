# ACTIVE CONTEXT

Updated: 2026-10-05

## Current Focus

GitHub大掃除そのものではなく、掃除を安全に行える Repository Operating System v1 の構築。

## Recent Findings

1. 既存 root README / WORKFLOW は初期アプリ完成フェーズの説明が中心。
2. 現在の repository は数学教科書データ、物理教科書データ、数学練習backend、図ソース、Word、ZIPまで大幅に拡張済み。
3. runtime/application docs と long-term project memory の境界がない。
4. `front-ui--test` に main 未統合の大量成果が残る。
5. 旧section namingの残存など、現在仕様と過去データの混在候補がある。
6. 「完成版」「v8」等のファイル名だけでは authority を判断できない。

## Active Decisions

- cleanup は inventory → authority → salvage → migration → validators → destructive apply の順。
- AGENTS.md は詳細説明ではなく router にする。
- Constitution は通常編集禁止、amendment protocol 経由。
- Match Graph は Node ID と verification を持つ。
- memory は project brief / active context / progress / lessons / decisions に分離する。
- 既存資料は監査完了まで暫定扱い。

## Open Risks

- 10月3〜4日の最新成果がGitHubへ完全に反映されていない可能性。
- branch divergence により main だけでは最新状態を復元できない。
- binary/Word の由来・重複・正本関係が未監査。
- mode別canonical specがまだ未確定。

## Next

R01 authority classification と R04 branch salvage audit を進める。
