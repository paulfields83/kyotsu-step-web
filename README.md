# 塾 / Kyotsu Step

高校数学・物理の学習を、**概念理解・思考過程・guided practice・本番演習**まで一貫して扱う学習システム。

このREADMEは詳細仕様書ではなく、人間向けの入口である。

## まず読む場所

### 今どこまで進んでいるか
- `navigation/CURRENT_POSITION.md`
- `navigation/MASTER_MATCH_GRAPH.md`

### プロジェクトの絶対ルール
- `governance/CONSTITUTION.md`
- `governance/DOCUMENT_AUTHORITY.md`
- `governance/CHANGE_PROTOCOL.md`
- `governance/WORK_SYSTEM.md`
- `governance/COMMAND_WORDS.md`

### AI / Agent が作業するとき
- `AGENTS.md`

## 教材モード

### Mathematics
- 教科書・学習モード: `subjects/mathematics/textbook/SPEC.md`
- 普通練習モード: `subjects/mathematics/practice/SPEC.md`
- モード境界: `subjects/mathematics/MODE_MAP.md`

### Physics
- 教科書・学習モード: `subjects/physics/textbook/SPEC.md`
- Chapter 1表示構造: `subjects/physics/textbook/CHAPTER_01_ARCHITECTURE.md`
- 共通テスト guided practice: `subjects/physics/practice/SPEC.md`

各SPECは Repository OS v1 の正式 `CANONICAL`。変更は `governance/CHANGE_PROTOCOL.md` に従う。

## 技術仕様

- 現行アーキテクチャ: `technical/architecture/APP_ARCHITECTURE.md`
- データ/内容ポリシー: `technical/content/CONTENT_DATA_POLICY.md`
- Schema map: `technical/schemas/CURRENT_SCHEMA_MAP.md`
- UI design system: `technical/ui/DESIGN_SYSTEM.md`
- Deployment: `technical/deployment/DEPLOYMENT.md`
- Quality gates: `quality/QUALITY_GATES.md`

## 現行アプリ構成

```text
React/Vite frontend
    │
    ├─ guided learning / simulation
    ├─ textbook UI
    ├─ analytics / history
    └─ browser-local progress
    │
    └── HTTP API
          ├─ textbook content / answer checking / assets
          └─ ordinary-practice content / answer checking
```

FrontendはGitHub Pagesへdeployされ、API-backed機能はbackend serviceを利用する。

## 開発コマンド

Root:

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
pnpm run test:e2e
node tools/repo-governance-check.mjs
```

Backend:

```bash
cd backend
pnpm install --frozen-lockfile
pnpm dev
pnpm run check
```

ローカルAPI設定例は `.env.example` / `backend/.env.example` を参照。

## Repository Operating System

このrepositoryはコード置き場だけではなく、プロジェクトのauthoritative memoryとして運用する。

```text
governance/   絶対ルール・権威
navigation/   現在地・火柴図
memory/       brief / active / progress / lessons / decisions
subjects/     教育モード正本
technical/    現行技術正本
quality/      完了条件・validator
work/         Work ID / proposal / action / findings / verification
history/      過去資料（仕様権限なし）
archive/      deprecated / deliverable
```

## Work Operating System

具体的な作業は `work/items/<WORK-ID>-<short-name>/` で追跡する。

各Workは:
- `WORK.md`
- `PROPOSAL.md`
- `ACTION_LOG.md`
- `FINDINGS.md`
- `VERIFICATION.md`

を持つ。未承認Proposalは実装しない。詳細は `governance/WORK_SYSTEM.md`。

## 過去資料

初期アプリ時代のREADME・WORKFLOW・旧docs/checkpoints等は `history/` へ保存済み。受け渡し用ZIPはprovenance確認後 `archive/deliverables/` へ移した。

**過去資料を現行仕様の根拠にしない。**  
現行仕様との矛盾時は `governance/DOCUMENT_AUTHORITY.md` に従う。

## Repository OS v1 の現在地

Repository OS v1 は 2026-10-05 に正式批准され、PR #3 を squash merge して `main` へ導入済み。現在はこの構造がプロジェクトの正式な運用基盤である。

完了:
- legacy control docsのhistory移行
- root archive provenance整理
- 29個の旧重複pathの狭域cleanup
- governance validator + GitHub Actions
- fresh-agent recovery test

残る別workstream:
- Physics Chapter 1の3-chunk learner-facing UI実装
- Math Practiceのcross-question dependency実装
- `front-ui--test` からPractice frontendを選択的に救出

重要:
- Physics内部1A〜1G IDはURL/progress/tests/provenance用に保持する。
- learner-facing major titleだけを3 chunkへ整理する。
- `front-ui--test` は救出完了まで削除しない。
