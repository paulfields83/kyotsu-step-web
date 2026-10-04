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

### AI / Agent が作業するとき
- `AGENTS.md`

## 教材モード

### Mathematics
- 教科書・学習モード: `subjects/mathematics/textbook/SPEC.md`
- 普通練習モード: `subjects/mathematics/practice/SPEC.md`
- モード境界: `subjects/mathematics/MODE_MAP.md`

### Physics
- 教科書・学習モード: `subjects/physics/textbook/SPEC.md`
- 共通テスト guided practice: `subjects/physics/practice/SPEC.md`

各SPECは現在 `CANONICAL-CANDIDATE`。Repository OS v1の移行監査後に正式canonicalへ昇格する。

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
work/         現在のfeature/task
history/      過去資料（仕様権限なし）
archive/      deprecated / deliverable
```

## 過去資料

初期アプリ時代のREADME・WORKFLOW・docs/checkpoints等は、Repository OS移行中に `history/` へ保存している。

**過去資料を現行仕様の根拠にしない。**  
現行仕様との矛盾時は `governance/DOCUMENT_AUTHORITY.md` に従う。

## 現在の大掃除

現在は `chore/juku-repository-os-v1` 上でRepository OS v1を構築中。

主な残件:
- legacy docs migration完了
- root binary/Word provenance整理
- ordinary Practice frontend救出
- Math Practice cross-question dependency実装
- physics旧section ID移行
- validator hardening
- fresh-agent recovery test
- 最後にのみdestructive cleanup
