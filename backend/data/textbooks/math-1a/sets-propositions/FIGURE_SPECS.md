# 集合と命題 Figure Manifest / QA

対象: 数学I「集合と命題」学習モード  
原典: 啓林館版 α数学I 第3章「集合と命題」＋ユーザー確認済み Word 母本

## 制作ルール
- App 本文を教学目的の基準とする。
- 教材・Guide の数学関係を壊さない。
- 空欄の正答を画像だけで直接読み取れる構成は避ける。
- 図は SVG で管理し、同系統の図で線幅・文字サイズ・余白を統一する。
- 数学関係を先に固定し、見栄えのために点や線の関係を変えない。

## Figure specs

| figure_id | 挿入先 | source | 目的 | QA |
| --- | --- | --- | --- | --- |
| subset-relationship | 1.3 集合の包含関係と相等 | 教科書 p.102 / Guide p.132 | 部分集合を「内側の全要素が外側にも入る」と視覚化。問4の具体的答えは表示しない。 | nested geometry / no answer leakage |
| venn | 1.4 共通部分と和集合 | 教科書 pp.102–103 / Guide pp.133–134 | A∩B の位置関係を示す。 | overlap correct |
| numline | 1.4 共通部分と和集合 | 教科書 pp.102–103 / Guide pp.133–134 | −3<x<4 と −2≦x≦5 の開閉端点を区別する。 | endpoints checked |
| three-set-venn | 1.5 空集合・部分集合・3つの集合 | 教科書 p.103 / Guide p.134 | 3集合の共通部分の位置だけを示し、具体的要素は表示しない。 | no answer leakage |
| complement-region | 1.6 全体集合と補集合 | 教科書 p.104 / Guide pp.135–136 | 補集合が U の中の A 外部であることを示す。 | region checked |
| demorgan | 1.7 ド・モルガンの法則 | 教科書 p.105 / Guide pp.136–137 | A∩B の補集合と Ā∪B̄ が同じ領域であることを左右比較する。V3 では右辺を2つの補集合の和として LaTeX/TikZ で構成する。 | truth table checked / regions identical / PDF visual QA passed |
| section1-q2-diagrams | 1.8 第1節節末 | 教科書 p.106 / Guide pp.138–139 | 4種類の包含関係を区別する。 | ① disjoint / ③ B inside A / ④ A inside B |
| condition-counterexample | 2.2 条件と集合・反例 | 教科書 pp.108–109 / Guide pp.140–141 | 真の命題と反例の位置を集合の包含で理解する。P⊂Q の文字答えは画像に直接表示しない。 | no direct blank answer |
| q14-counterexample | 2.3 必要条件と十分条件 | 教科書 p.109 / Guide p.142 | AC=BD でも長方形とは限らない反例。二等辺台形を使用。 | AC and BD equal by symmetry; non-rectangle |
| negation-numberline | 2.4 条件の否定 | 教科書 p.110 / Guide p.143 | 一般形 x≦a と x>a で境界の開閉を示す。問15の a=2 を直接描かない。 | boundary checked |

## 今回あえて図を追加しない topic
- 1.1 集合と要素、1.2 集合の表し方: 本文だけで十分。
- 2.1 命題と真偽: 記号説明が中心で、図が必須ではない。
- 2.5 逆・裏・対偶: 図にすると空欄【1】〜【3】を直接漏らしやすいため保留。
- 3.x 証明系: 現段階では証明の論理文を優先し、装飾的な図は追加しない。

## Visual QA baseline
- 主線 4px、補助線 2.5px 前後。
- 主要ラベル 24–30px、補助説明 18–22px。
- 図形とラベルは原則 12px 以上離す。
- 重要な点・端点は線に埋もれない大きさで表示。
- 開区間は白丸、閉区間は塗り丸。
- 色だけに依存せず、ラベルと位置関係でも意味が分かるようにする。
