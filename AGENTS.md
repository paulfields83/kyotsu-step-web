# 塾 Repository Agent Entry Point

## 0. Root Command — 「憲法から」

ユーザーが **「憲法から」** と言った場合、まず `governance/INSTRUCTION_DICTIONARY.md` の `CMD-ROOT-001` を実行し、live repository / `main` / HEAD を確認する。

Stage 0 が通った後、`governance/COMMAND_WORDS.md` の作業開始マクロへ進む。

これは単なる「Constitutionを読む」命令でも、「自動で実装まで進める」命令でもない。

```text
Live Repository Verification
→ Recovery
→ Reconstruction
→ Work Identification
→ Approval Check
→ permitted work
→ Verification
→ Memory Close
```

Root recovery後のユーザー指示は `governance/INSTRUCTION_DICTIONARY.md` の **Instruction Matching Rule** で照合する。

- EXACT → 登録Commandとして処理
- SIMILAR → 候補Commandの内容を提示し、ユーザー確認まで実行しない
- UNKNOWN → GitHub変更を停止し、重要なら辞書修正を優先

具体的なWork管理は `governance/WORK_SYSTEM.md` に従う。

このファイルは百科事典ではなく、AI/Agent が迷子にならないための入口である。

## 1. 作業開始時の必須ルート

0. `governance/INSTRUCTION_DICTIONARY.md` の `CMD-ROOT-001` で repository / branch / live HEAD を確定する。
1. `governance/CONSTITUTION.md` を確認する。
2. `navigation/CURRENT_POSITION.md` で現在地を確認する。
3. `navigation/MASTER_MATCH_GRAPH.md` で対象ノードと依存関係を確認する。
4. `memory/ACTIVE_CONTEXT.md` と `memory/PROGRESS.md` を確認する。
5. 対象作業に必要な canonical spec / subject / mode / technical 文書だけを読む。
6. 関連 Decision / Lesson を必要な範囲だけ読む。
7. 対象Workがあれば `WORK / PROPOSAL / ACTION_LOG / FINDINGS / VERIFICATION` を読む。
8. 実装前に approved proposal の存在とscopeを確認する。

全リポジトリ文書を毎回読み込まない。Progressive Disclosure を使う。

## 2. 権威順位

直接のユーザー指示
> Constitution
> approved active Work / task specification
> mode canonical spec
> subject canonical spec
> repository architecture / design rules
> implementation
> historical notes / archive

Archive、deprecated、古い handoff、古い Word/ZIP は、明示的に canonical と昇格されない限り仕様根拠にしてはならない。

## 3. 実装承認ルール

- 未承認Proposalを実装してはならない。
- 既に同一scopeのProposalが明示承認済みなら、毎Chat承認を取り直さない。
- materialなscope/design変更が必要なら `REVISE-PROPOSAL` に戻る。
- **REVIEW-FEEDBACK ≠ APPROVAL**：ユーザーの修正コメント・追加条件・反対意見を承認として扱わない。
- Proposalがレビューで変わったら、新revisionを作成 → 修正版を提示 → STOP → exact revisionの明示承認、の順を必ず守る。
- 「修正したい」「作りたい」という依頼だけで、修正案・制作案まで自動承認されたと解釈しない。
- ユーザーの訂正・承認は必要に応じて Work record へ残す。

## 4. 禁止事項

- live repository / main / HEAD を確認せず、現行GitHub状態を断定しない。
- 仕様を確認せずコード・教材・Word・JSONを作り始めない。
- 数学/物理、教科書/練習のルールを混用しない。
- Constitution を通常作業のついでに変更しない。
- 「古そう」「重複に見える」だけを理由に削除しない。
- main と分岐ブランチの差分を監査せずブランチを削除しない。
- 完成済み成果物を canonical status を確認せずゼロから作り直さない。
- QA を通していない成果物を DONE としない。
- 実際に行った操作場所や失敗を、最終結果だけ残して消さない。

## 5. 作業終了時

- `VERIFICATION.md` に verification を記録する。
- `ACTION_LOG.md` と `FINDINGS.md` を閉じる。
- `CURRENT_POSITION.md` / `PROGRESS.md` を必要に応じて更新する。
- 再利用できる知見だけを lessons に昇格する。
- 重要な正式判断だけを decision log に昇格する。
- 完了ノードと次の実行可能ノードを必要に応じて Match Graph 上で更新する。
- 修正Workがユーザー確認可能な状態で止まるときは、最終報告に必ず確認リンクを付ける。優先順位は preview/app → PR → branch/対象GitHub位置。
