# Branch Salvage Audit — front-ui--test

Updated: 2026-10-05  
Branch: `front-ui--test`  
Compared against: `main`

## Executive Finding

このbranchをそのままmergeしてはいけない。  
しかし「古いテストbranch」として削除してもいけない。

Git history上は main に対して 127 commits ahead / 181 behind だが、最終tree差分は次まで縮約できる。

- front-ui--test only: 10 files
- same path but different content: 22 files
- main only: 451 files

つまり救出対象は「127コミット」ではなく、まず32パスを機能単位で評価すればよい。

## A. High-Value Salvage Candidate — Practice Frontend

front-ui--test only:
- `src/domain/practice.ts`
- `src/repositories/practiceRepository.ts`
- `src/pages/PracticeSessionPage.tsx`

related modified paths:
- `src/app/App.tsx`
- `src/components/learning/LearningFlowRenderer.tsx`
- `src/styles/global.css`
- selected learning/setup files

Reason:
branch側には backend-driven Practice Session UI があり、main側にはより新しい Practice backend API/data/validation が存在する。

Important:
main `backend/src/server.ts` は Practice API を持つ一方、front-ui--test の server はそのAPIを持たない古い状態。  
したがって branch merge ではなく、Practice frontend契約だけを main の現行backendへ port するのが正しい。

Provisional disposition: SALVAGE-BY-PORT

## B. Experimental Redesign

front-ui--test only:
- `src/redesign/layout/RedesignShell.tsx`
- `src/redesign/layout/app-v2.css`
- `src/redesign/pages/AppHomePage.tsx`
- `src/redesign/pages/LearningHubPage.tsx`
- `src/redesign/pages/ProgressHubPage.tsx`
- `src/redesign/pages/SettingsHubPage.tsx`

これは home/navigation/front-end redesign の実験成果。

Risk:
mainは従来 AppShell route を維持している。どちらが最新承認UIかをGit commit時刻だけで決めてはいけない。

Provisional disposition: QUARANTINE + VISUAL/PRODUCT REVIEW

## C. Textbook UI / Guided Example Differences

Modified candidates include:
- `src/pages/TextbookUnitPage.tsx`
- `src/components/learning/LearningFlowRenderer.tsx`
- `src/repositories/textbookRepository.ts`
- `src/pages/LearningSessionPage.tsx`
- `src/styles/global.css`

branch commit history shows guided-example cards, original-vs-guided test controls, example-boundary fixes, follow-up-note styling等の実験。

main側はその後 backend/data/figure/export contract を追加しているため、ファイル単位置換は禁止。

Provisional disposition: SEMANTIC DIFF REQUIRED

## D. Backend Differences

front-ui--test `backend/src/server.ts` is older with respect to Practice API.  
main server includes:
- practice catalog API
- practice question API
- answer submission API
- source/unit health reporting
- textbook export contract related state

Therefore:
- DO NOT take backend/server.ts from front-ui--test.
- DO NOT merge branch wholesale.
- Only inspect branch backend changes where main does not have equivalent behavior.

Provisional disposition: MAIN WINS unless specific missing behavior is proven.

## E. Unique Documentation

front-ui--test only:
- `docs/frontend-integration.md`

Provisional disposition:
HISTORICAL/CANDIDATE TECH NOTE. Read and absorb useful current information into technical docs rather than preserving as top-level authority.

## Salvage Procedure

For each of the 32 differing paths:
1. identify feature intent
2. identify user-approved/latest behavior
3. compare main equivalent
4. classify KEEP-MAIN / PORT-FRONT / REIMPLEMENT / ARCHIVE
5. add tests before porting behavior
6. do not cherry-pick blindly

## Branch Deletion Gate

front-ui--test may be deleted only after:
- all 10 unique files are dispositioned
- all 22 modified paths are dispositioned
- salvaged behavior exists on canonical branch or is explicitly rejected
- decision log records the rejection/port rationale
