# 塾 Repository Agent Entry Point

このファイルは百科事典ではなく、AI/Agent が迷子にならないための入口である。

## 1. 作業開始時の必須ルート

1. `governance/CONSTITUTION.md` を確認する。
2. `navigation/CURRENT_POSITION.md` で現在地を確認する。
3. `navigation/MASTER_MATCH_GRAPH.md` で対象ノードと依存関係を確認する。
4. 対象作業に必要な canonical spec / subject / mode 文書だけを読む。
5. `memory/ACTIVE_CONTEXT.md` と関連する lessons / decisions を必要な範囲だけ読む。
6. 実装前に、今回の Input / Output / Verification / Next を明示する。

全リポジトリ文書を毎回読み込まない。Progressive Disclosure を使い、対象に必要な文書だけを追加で読む。

## 2. 権威順位

直接のユーザー指示
> Constitution
> active task spec
> mode canonical spec
> subject canonical spec
> repository architecture / design rules
> implementation
> historical notes / archive

Archive、deprecated、古い handoff、古い Word/ZIP は、明示的に canonical と昇格されない限り仕様根拠にしてはならない。

## 3. 禁止事項

- 仕様を確認せずコード・教材・Word・JSONを作り始めない。
- 数学/物理、教科書/練習のルールを混用しない。
- Constitution を通常作業のついでに変更しない。
- 「古そう」「重複に見える」だけを理由に削除しない。
- main と分岐ブランチの差分を監査せずブランチを削除しない。
- 完成済み成果物を、canonical status を確認せずゼロから作り直さない。
- QA を通していない成果物を DONE としない。

## 4. 作業終了時

- verification を実行する。
- `CURRENT_POSITION.md` と `ACTIVE_CONTEXT.md` を更新する。
- 再発防止に一般化できる知見だけを lessons に追加する。
- 重要な判断変更は decision log に残す。
- 完了ノードと次の実行可能ノードを Match Graph 上で更新する。
