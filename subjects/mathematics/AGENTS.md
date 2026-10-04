# Mathematics Agent Router

Scope: `subjects/mathematics/**`

数学作業では、root `AGENTS.md` と governance/navigation を読んだ後、このファイルを使う。

## Mode routing

- 教科書・学習モード → `textbook/SPEC.md`
- 普通練習モード → `practice/SPEC.md`

同じ「数学」でも両モードの目的は異なる。教科書モードの会話・概念導入構造を普通練習へ機械的に移植しない。普通練習の段階解放UIを教科書本文へ機械的に移植しない。

## Shared mathematics principles

- 数学的内容・記号・定理・出題条件を勝手に変えない。
- 原資料が指定されている場合、範囲・用語・順序・難度の基準は原資料。
- 非自明な数学操作を「整理すると」で飛ばさない。
- 図は数学関係を変えず、説明目的・配置理由・QA条件を先に決める。
- 正答漏洩と循環依存を検査する。
- 「完成版」「vN」というファイル名だけでcanonical判定しない。

## Before editing

1. 対象mode SPECを読む。
2. 対象教材・原資料を確認する。
3. 現在のNode/Taskを確認する。
4. Input / Output / Verification を短く書く。
5. それから制作・実装へ入る。
