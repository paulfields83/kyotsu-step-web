# Document Authority Classification — Initial Pass

Updated: 2026-10-05

この分類は cleanup 前の初期監査であり、mode canonical spec が確定するまで一部は CANDIDATE / PARTIAL のまま保持する。

| Current path | Initial status | Meaning / next action |
|---|---|---|
| `README.md` | HISTORICAL-PARTIAL | 初期アプリの入口としては有用だが、現在の塾全体を表していない。後で人間向けrouterへ縮小・再設計する。 |
| `WORKFLOW.md` | HISTORICAL-PARTIAL | 旧アプリ開発のphase workflow。Repository全体の現行SOPとしては使わない。必要部分をquality/technical workflowへ移す。 |
| `docs/PRODUCT_REQUIREMENTS.md` | HISTORICAL BASELINE | 初期アプリ要件。現在の数学/物理教材量産scopeを含まない。 |
| `docs/REQUIREMENTS_MATRIX.md` | HISTORICAL VERIFIED SNAPSHOT | 旧アプリ機能の検証証拠。現在全体のrequirements matrixではない。 |
| `docs/WORKLOG.md` | HISTORICAL | 経緯記録。仕様権限なし。 |
| `docs/checkpoints/*` | HISTORICAL | phase 0-13 の完了証拠。削除ではなくhistoryへ移行候補。 |
| `docs/ARCHITECTURE.md` | PARTIAL-CANONICAL | frontend/local app architectureの一部は現役。ただしbackend textbook/practice拡張を十分に表していないため再監査。 |
| `docs/DESIGN_SYSTEM.md` | CANDIDATE-CANONICAL | UIの基本視覚原則として有効候補。redesign branchと最新承認UIを照合後に確定。 |
| `docs/TEST_PLAN.md` | PARTIAL-CANONICAL | 初期app QAとして有効。教材生成/figure/practice backend用gateが不足。quality配下へ再編候補。 |
| `docs/QUESTION_SCHEMA.md` | PARTIAL-CANONICAL | 旧共通テストQuestion schemaの説明。現在のtextbook/practice schema全体を代表しない。 |
| `docs/backend-separation.md` | HISTORICAL-MIGRATION NOTE | backend分離時の有用な経緯だが、記載branchやmigration状態は現在とずれる。現行architectureへ必要部分を吸収。 |
| `backend/data/practice/README.md` | CANDIDATE MODE CANON | Math Practice backend hierarchy/interaction contractの有力正本候補。最新の練習モード設計と照合して確定する。 |
| `backend/data/textbooks/math-1a/GUIDED_EXAMPLE_RULES.md` | CANDIDATE MODE CANON | Math Textbook guided-example固有ルールの有力候補。最新の教科書モード母本/教訓と統合必要。 |
| `backend/data/textbooks/math-1a/MATH_FIGURE_MANIFEST.md` | CANDIDATE FIGURE CANON | 数学図の制作/QA policyとして強い。実装参照と最新figure pipelineを照合後にcanonical化。 |
| `backend/data/textbooks/**/unit.json` | IMPLEMENTATION / PUBLISHED DATA | 実行データ。仕様そのものではない。上位specと矛盾したらfinding。 |
| `backend/data/textbooks/**/answers.json` | PRIVATE-LIKE IMPLEMENTATION DATA IN PUBLIC REPO | 判定用実装データ。公開repoのため secrecy は保証しない。spec authorityではない。 |
| `backend/data/textbooks/**/source/*.docx` | SOURCE EVIDENCE | 母本/制作元候補。ファイル名の「完成版」「v8」だけでcanonical判定しない。manifest/decisionとの紐付けが必要。 |
| `figure.zip` | UNCLASSIFIED BINARY | Archive / delivery / backup のどれか未確定。削除禁止。 |
| `数学IA_教科書学習モード.zip` | UNCLASSIFIED BINARY | handoff/delivery候補。内容・由来・再生成可否を確認するまで削除禁止。 |

## Current Conflict Pattern

現在の主要問題は「同じ一枚の文書が間違っている」ことではない。  
それぞれの文書は作られた時点では正しかったが、プロジェクトが拡張された後も root で現役に見え続けていることが問題。

したがって cleanup は内容削除より先に authority metadata とscopeを付ける。

## Target State

最終的には以下に分離する。

- governance/: 不変に近いルール
- navigation/: 現在地と依存
- memory/: brief / active / progress / lessons / decisions
- subjects/<subject>/<mode>/: mode canonical spec
- technical/: app/backend/schema/design/QA
- work/: active feature spec/plan/tasks
- history/: worklog/checkpoints/old decisions
- archive/: deprecated binary/old handoff
