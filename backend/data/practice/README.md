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
- `questions.json`：実際の問題。各問題は `subcategory` と `problemType` に所属する。
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

## Current sample

現在は UI とデータ契約を検証するため、集合と命題の代表 6 問だけを登録している。
これは単元全題ではない。正式量産時は 4STEP + 啓林館から題型を棚卸しし、この taxonomy の problemType ごとに必要数を追加する。
