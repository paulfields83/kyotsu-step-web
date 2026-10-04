# 塾 Repository Constitution

Version: 1.0.0  
Ratified: 2026-10-05  
Drafted: 2026-10-05  
Ratification record: `audit/REPOSITORY_OS_RATIFICATION_2026-10-05.md`

この文書は塾プロジェクト全体の最上位運用原則を定める。通常の教材制作、UI修正、コード実装の都合で暗黙に変更してはならない。

## Principle I — Canonical Truth

同じ事柄について複数の資料が存在するとき、必ず canonical source を一つに定める。  
「最新版っぽい」「ファイル名が完成版」「昔からある」を canonical 判定基準にしてはならない。

各重要文書・成果物は少なくとも次の状態のどれかを持つ。

- CANONICAL: 現在の正本。
- ACTIVE: 作業中であり、まだ正本ではない。
- HISTORICAL: 過去の判断・経緯を保存する資料。
- DEPRECATED: 置換済み。新規作業で参照禁止。
- ARCHIVED: 保存のみ。仕様権限なし。
- GENERATED: canonical data から再生成できる派生成果物。

## Principle II — Progressive Disclosure

Agent は毎回全資料を読むのではなく、入口 → 現在地 → 対象ノード → 対象 spec の順に必要な文脈だけ読む。  
ルート文書は短い router とし、詳細は subject / mode / task 単位へ分割する。

## Principle III — Spec Before Production

重要な変更は、What/Why を定める Spec と How を定める Plan を分離する。  
仕様が曖昧なまま大量生成・大量置換・教材量産・UI全面修正に入ってはならない。

標準フロー:
SPECIFY → PLAN → TASKS → IMPLEMENT → CONVERGE → VERIFY → CLOSE

## Principle IV — Navigation by Stable Nodes

長期作業は安定した Node ID で管理する。Node ID は途中で意味をすり替えない。  
各ノードは最低限、Status / Depends On / Input / Output / Canonical Files / Verification / Next を持つ。

火柴図は装飾ではなく、現在地・依存関係・次に実行可能な作業を示すプロジェクト状態図である。

## Principle V — Memory Separation

以下を一つの「記憶ファイル」に混在させない。

- Project Brief: プロジェクトの長期目的。
- Active Context: 現在の短期作業。
- Progress: 完了・未完了・blocked。
- Lessons: 再利用可能な教訓。
- Decisions: 重要判断と理由。
- Changelog: 何が変わったか。
- Archive: 過去資料。

## Principle VI — No Destructive Cleanup Without Provenance

削除・統合・改名・ブランチ廃棄の前に、由来・参照先・代替正本・未統合差分を確認する。  
不明なものは削除せず QUARANTINE / ARCHIVE 候補として扱う。

特に binary archive、Word母本、古いブランチ、大量生成図は内容・参照関係を確認せず削除してはならない。

## Principle VII — Verification Is Part of the Artifact

「作った」ことと「完成した」ことを分離する。  
DONE には対象に応じた QA が必要であり、少なくとも内容・構造・参照整合性・UI/実装・回帰のうち該当する gate を通す。

失敗を発見した場合、単発修正で終わらせず、再発を防げる validator / checklist / rule にできるか検討する。

## Principle VIII — Scope Isolation

数学と物理、教科書学習と問題練習、教材データとUI実装、runtime と project memory を分離する。  
一方の成功パターンを、検証なしに別モードへ自動適用してはならない。

## Governance

この Constitution の変更は通常コミットでは行わない。  
変更には以下を必須とする。

1. Amendment proposal
2. 変更理由
3. 影響範囲
4. 旧規則との比較
5. ユーザー承認
6. version bump
7. 依存文書の整合性確認

Versioning:
- MAJOR: 原則削除・意味変更など非互換変更
- MINOR: 新原則・重要な運用拡張
- PATCH: 意味を変えない明確化
