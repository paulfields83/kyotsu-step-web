# front-ui--test — 32 Path Disposition

Updated: 2026-10-05  
Base: `main`  
Head under audit: `front-ui--test`

Status meanings:
- KEEP-MAIN: branch版で置換しない
- PORT-FRONT: branchの機能意図をmainへ移植
- REIMPLEMENT: branchコードをそのまま使わず、現行Spec/APIに合わせて再実装
- SEMANTIC-REVIEW: 有用性はあるが仕様/挙動確認が必要
- QUARANTINE: 削除せず隔離。現行productへ入れるには明示レビュー必要
- ABSORB-HISTORY: 有効な知識だけ現行docsへ吸収し、元ファイルはhistory扱い

## A. front-ui--test only — 10 files

| Path | Disposition | Reason |
|---|---|---|
| `docs/frontend-integration.md` | ABSORB-HISTORY | repository/store/domain boundaryの考え方は有用だが、現行backend contract全体の正本ではない。 |
| `src/domain/practice.ts` | PORT-FRONT | Practice frontendに必要な型。現行backend practice schemaと照合して移植。 |
| `src/repositories/practiceRepository.ts` | PORT-FRONT | mainのPractice APIへ自然に接続できる。endpoint/schemaテスト追加後に移植。 |
| `src/pages/PracticeSessionPage.tsx` | REIMPLEMENT | UI意図は救出価値大。ただし最新Math Practice Specとmain APIへ合わせて再実装/整理する。 |
| `src/redesign/layout/RedesignShell.tsx` | QUARANTINE | product navigation redesign。現在承認UIと比較してから採否。 |
| `src/redesign/layout/app-v2.css` | QUARANTINE | redesign専用style。全体styleへ混ぜない。 |
| `src/redesign/pages/AppHomePage.tsx` | QUARANTINE | home redesign案。 |
| `src/redesign/pages/LearningHubPage.tsx` | QUARANTINE | 学習導線のproduct decisionが必要。 |
| `src/redesign/pages/ProgressHubPage.tsx` | QUARANTINE | analytics UI案として保存。 |
| `src/redesign/pages/SettingsHubPage.tsx` | QUARANTINE | settings UI案として保存。 |

## B. modified — 22 files

| Path | Disposition | Reason |
|---|---|---|
| `.github/workflows/deploy-pages.yml` | KEEP-MAIN | deploymentはmainの現行構成を基準にする。 |
| `backend/package.json` | KEEP-MAIN | main側に後続backend機能/scriptsがある。 |
| `backend/src/server.ts` | KEEP-MAIN | mainはPractice APIを含む。front-ui版で置換すると機能退行。 |
| `backend/src/setsPropositionsDefs1.ts` | KEEP-MAIN | branchの教材文はmode authorityではない。最新Math Textbook Specを基準にmain側を再検証する。 |
| `backend/src/setsPropositionsDefs2.ts` | KEEP-MAIN | 同上。 |
| `backend/src/setsPropositionsDefs3.ts` | KEEP-MAIN | 同上。 |
| `backend/src/setsPropositionsDefs4.ts` | KEEP-MAIN | 同上。 |
| `backend/src/setsPropositionsDefs5.ts` | KEEP-MAIN | 同上。 |
| `backend/src/setsPropositionsStrict.ts` | KEEP-MAIN | main側の方がguided/figure関連の現行構造を多く保持。 |
| `backend/src/textbookData.ts` | SEMANTIC-REVIEW | front-ui版はDOCX直importを有効化。便利だがruntimeでWordを正本化するかはarchitecture decision。mainを置換しない。 |
| `package.json` | KEEP-MAIN | mainの後続figure/tooling scriptsを保持。 |
| `pnpm-lock.yaml` | KEEP-MAIN | package.jsonの正本に従う。必要dependencyは機能移植時に再生成。 |
| `src/app/App.tsx` | REIMPLEMENT | Practice routeは追加候補。RedesignShell全面切替は別product decision。branch版丸ごと移植禁止。 |
| `src/components/learning/LearningFlowRenderer.tsx` | PORT-FRONT-SELECTIVE | practice用inline flowの考え方/実装を救う。common-test/textbook既存behaviorを壊さないよう分離する。 |
| `src/domain/questionSchema.test.ts` | KEEP-MAIN | main schemaを基準。branch差分はPractice新schemaの別testとして追加すべき。 |
| `src/domain/textbookBackendData.test.ts` | KEEP-MAIN | main側の方が現行figure/backend data coverageが大きい。 |
| `src/pages/LearningSessionPage.tsx` | KEEP-MAIN | Physics Common-Test Practiceの既存主線。Practice普通練習は別Pageへ分離する。 |
| `src/pages/SimulationSetupPage.tsx` | KEEP-MAIN | SimulationはPracticeと分離。branch表示変更だけで置換しない。 |
| `src/pages/TextbookUnitPage.tsx` | SEMANTIC-REVIEW | branchにguided-example/UI実験がある。最新Math Textbook Specと照合し、必要behaviorだけ再実装。 |
| `src/repositories/textbookRepository.ts` | QUARANTINE/REVIEW | `source=original` + `VITE_ORIGINAL_API_BASE_URL` は比較実験用の可能性が高い。production contractへ無条件移植しない。 |
| `src/styles/global.css` | PORT-FRONT-SELECTIVE | Practice inline stylesは救出候補。global全置換禁止。redesign/style実験を分離。 |
| `vite.config.ts` | KEEP-MAIN | branchの `base:'/'` はGitHub Pages構成を壊す可能性。mainのdeployment baseを維持。 |

## C. Salvage plan

### S1 — Ordinary Practice vertical slice

mainを土台に以下を作る:

1. Practice domain contractをmain backend schemaへ合わせる。
2. `practiceRepository` を移植。
3. `PracticeSessionPage` をMath Practice Specに合わせて再実装。
4. routeをAppへ追加。
5. Practice用renderer/styleを専用component/styleへ分離。
6. API contract tests + browser E2E。
7. 36題/165孔データとの接続を検査。

### S2 — Textbook experiments

`TextbookUnitPage`, DOCX import, original-source toggleを別々に評価する。  
「branchに存在する」ことは採用理由にならない。最新Math Textbook Specの必要機能だけを採用する。

### S3 — Redesign

redesign 6 filesはproduct UI review用quarantineへ。  
現行UIとスクリーン単位で比較し、採用を決めるまでmain routeへ入れない。

## D. Branch deletion gate

`front-ui--test` を削除可能とする条件:

- S1がcanonical branch上でPASS
- S2の各実験が KEEP/REJECT 決定済み
- S3の採否がdecision logへ記録済み
- 10 unique filesすべてに最終disposition
- 22 modified filesすべてに最終disposition
- branchからしか復元できない成果が0
- fresh checkoutでbuild/test/E2E PASS

現在: **NOT READY TO DELETE**
