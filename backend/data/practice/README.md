# Practice question backend data

普通「問題練習」題庫はフロントエンドにハードコードせず、ここを正本にする。

## Hierarchy

```text
subject
└── course
    └── majorUnit
        └── subcategory
            └── problemType
                └── question
```

数学 I の現在の試験導入例：

```text
math-1a
└── math-i
    └── sets-and-logic（集合と命題）
        ├── set-basics
        ├── set-operations
        ├── set-regions
        ├── propositions
        ├── necessary-sufficient
        ├── proposition-negation
        ├── converse-inverse-contrapositive
        └── proofs
```

- `catalog.json`：大分類・小分類・問題タイプの taxonomy。題数が 0 のタイプも、今後量産するため先に定義できる。
- `source/*.json`：教材・教輔から整理した制作ソース層。問題本文／ミニガイド／解答／要点を保持し、まだ学生向け interactive item とはみなさない。
- `questions.json`：v5 形式まで制作・レビューが完了し、学生向けに公開できる interactive 問題。各問題は `subcategory` と `problemType` に所属する。
- `solutionSteps`：v5 の解法関係。各 step に `dependsOn / basis / purpose / operation` を保持する。
- `blanks`：学生が回答する穴と選択肢。正解はバックエンド側に保持する。
- `interaction`：普通練習では `sequential + inline-expand + substituteCorrectAnswer + lockFutureSteps` を固定する。

## API

- `GET /api/practice/catalog?subject=math-1a&course=math-i&majorUnit=sets-and-logic`
- `GET /api/practice/questions?majorUnit=sets-and-logic&subcategory=proofs`
- `GET /api/practice/questions/:questionId`
- `POST /api/practice/questions/:questionId/blanks/:blankId/answer`

公開 question payload からは `correctOptionIds`、`explanation`、`wrongReason` を除外する。
回答判定は POST endpoint で行い、正解時だけ正解 option と explanation を返す。

## Current data

`source/` には「集合と命題」4STEP 全問版テンプレートの 36 組を登録済み。

- 問90～120：31組
- 演習問題A 8～10：3組
- 演習問題B 11～12：2組
- 例題13・14：除外

ソース項目は Word の「問題本文／ミニガイド／解答／要点」をそのまま分離して保持し、NFKC 正規化した問題本文から SHA-256 先頭16桁の `contentHash` を付与する。

`questions.json` には、UI と v5 データ契約を検証するための interactive 代表 6 問を現在登録している。
ソース 36 組をそのまま公開問題へ変換せず、完全解法 → solution graph → blank / distractor → relation / leak QA を通過したものだけ `questions.json` に昇格させる。
