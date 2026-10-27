// Reviewed, problem-specific ZIP 4STEP definitions only.
// Keep an entry only when the original problem assigns a meaningful role to
// the symbol and a learner may need to recall it later in the solution.
// Do not annotate ordinary unknowns, generic number domains or operators.
export type PracticeSymbolNote = { symbol: string; ja: string; zh: string }
export const zipPracticeSymbolNotes: Record<number, PracticeSymbolNote[]> = {
  87: [
    {"symbol":"A","ja":"30以下の素数全体の集合","zh":"30 以下所有素数组成的集合"},
  ],
  89: [
    {"symbol":"A","ja":"1以上10以下の偶数全体の集合","zh":"1 到 10 的所有偶数组成的集合"},
    {"symbol":"B","ja":"集合 {1,2,3}","zh":"集合 {1,2,3}"},
    {"symbol":"C","ja":"集合 {2,4,6}","zh":"集合 {2,4,6}"},
    {"symbol":"D","ja":"集合 {10,12}","zh":"集合 {10,12}"},
    {"symbol":"E","ja":"集合 {8}","zh":"集合 {8}"},
  ],
  93: [
    {"symbol":"A","ja":"16の正の約数全体の集合","zh":"16 的所有正约数构成的集合"},
    {"symbol":"B","ja":"24の正の約数全体の集合","zh":"24 的所有正约数构成的集合"},
    {"symbol":"C","ja":"8以下の自然数全体の集合","zh":"不大于 8 的自然数集合"},
  ],
  94: [
    {"symbol":"U","ja":"1～10 の整数全体の集合（全体集合）","zh":"1 到 10 的所有整数（全集）"},
    {"symbol":"A","ja":"集合 {1,2,3,5,7}","zh":"集合 {1,2,3,5,7}"},
    {"symbol":"B","ja":"集合 {2,3,8,10}","zh":"集合 {2,3,8,10}"},
  ],
  95: [
    {"symbol":"U","ja":"集合 {1,2,3,4,5,6,7,8,9}（全体集合）","zh":"集合 {1,2,3,4,5,6,7,8,9}（全集）"},
  ],
  96: [
    {"symbol":"U","ja":"1～10 の整数全体の集合（全体集合）","zh":"1 到 10 的所有整数（全集）"},
    {"symbol":"A","ja":"集合 {1,2,3,4,8}","zh":"集合 {1,2,3,4,8}"},
    {"symbol":"B","ja":"集合 {3,4,5,6}","zh":"集合 {3,4,5,6}"},
    {"symbol":"C","ja":"集合 {2,3,6,7}","zh":"集合 {2,3,6,7}"},
  ],
  97: [
    {"symbol":"A","ja":"集合 {1,3,3a−2}","zh":"集合 {1,3,3a−2}"},
    {"symbol":"B","ja":"集合 {−5,a+2,a²−2a+1}","zh":"集合 {−5,a+2,a²−2a+1}"},
    {"symbol":"a","ja":"共通部分 A∩B={1,4} から求める定数","zh":"利用交集 A∩B={1,4} 求出的常数"},
  ],
  106: [
    {"symbol":"p","ja":"「2の倍数である」という条件","zh":"“是 2 的倍数”这个条件"},
    {"symbol":"q","ja":"「3の倍数である」という条件","zh":"“是 3 的倍数”这个条件"},
    {"symbol":"P","ja":"条件 p を満たす自然数の集合","zh":"满足条件 p 的自然数集合"},
    {"symbol":"Q","ja":"条件 q を満たす自然数の集合","zh":"满足条件 q 的自然数集合"},
  ],
  107: [
    {"symbol":"a","ja":"第(5)問の辺 BC の長さ","zh":"第 (5) 小题三角形边 BC 的长度"},
    {"symbol":"b","ja":"第(5)問の辺 CA の長さ","zh":"第 (5) 小题三角形边 CA 的长度"},
    {"symbol":"c","ja":"第(5)問の辺 AB の長さ","zh":"第 (5) 小题三角形边 AB 的长度"},
  ],
  108: [
    {"symbol":"p","ja":"条件 a>1 かつ b>1","zh":"条件 a>1 且 b>1"},
    {"symbol":"q","ja":"条件 a+b>2 かつ (a−1)(b−1)>0","zh":"条件 a+b>2 且 (a−1)(b−1)>0"},
  ],
  113: [
    {"symbol":"x","ja":"正の無理数","zh":"正无理数"},
  ],
  116: [
    {"symbol":"p","ja":"有理数","zh":"有理数"},
    {"symbol":"q","ja":"有理数","zh":"有理数"},
    {"symbol":"X","ja":"無理数（大文字の X）","zh":"无理数（大写 X）"},
  ],
}
