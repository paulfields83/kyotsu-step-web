# Mathematics Mode Map

Updated: 2026-10-05

```text
                         [MATHEMATICS]
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
        [M-TEXTBOOK]                 [M-PRACTICE]
        concept learning              problem solving
                 │                         │
     ┌───────────┼───────────┐        ┌────┼──────────────┐
     ▼           ▼           ▼        ▼    ▼              ▼
 concept     property      proof?    full  node graph   question graph
     │           │           │       solve    │              │
     └───────────┴──────┬────┘        └───────┴──────┬───────┘
                        ▼                            ▼
                     example                    blanks/gates
                        │                            │
                     figure?                     figure?
                        │                            │
                        ▼                            ▼
                       QA                           QA
```

## Mode boundary

M-TEXTBOOK asks:
「この概念をまだ知らない生徒が、なぜ必要かから理解できるか」

M-PRACTICE asks:
「この既習問題を解くとき、どの判断をどの順に自分で行うべきか」

共通化してよいもの:
- 数学的正確性
- provenance
- no answer leakage
- figure QA
- stable IDs
- verification gate

共通化してはいけないもの:
- 会話の必須性
- concept introduction order
- practice staged unlock
- textbook prose density
