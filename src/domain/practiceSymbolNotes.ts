import type { SymbolNote } from '../components/question/SymbolGlossary'
import type { PublicTextbookSection, PublicTextbookUnit } from './textbookPublic'

// Small audited first pass: meanings must be tied to the current subject /
// textbook unit rather than an ambiguous global letter-to-definition table.
const entry = (symbol: string, ja: string, zh: string): SymbolNote => ({ symbol, ja, zh })

export const builtInPracticeSymbolNotes: Record<string, SymbolNote[]> = {
  'math-quadratic-01': [
    entry('x', '水を出してからの経過時間（秒）', '从喷水开始经过的时间（秒）'),
    entry('y', '水の高さ（m）', '水柱的高度（m）'),
  ],
  'math-statistics-01': [],
  'physics-motion-01': [
    entry('t', '時刻・経過時間（秒）', '时刻或经过的时间（秒）'),
    entry('v', '速度（m/s）', '速度（m/s）'),
    entry('a', '加速度（m/s²）', '加速度（m/s²）'),
  ],
  'physics-circuit-01': [
    entry('R', '2つの抵抗器に共通する抵抗値（Ω）', '两个电阻器各自相同的电阻值（Ω）'),
    entry('V', '電源の電圧（V）', '电源的电压（V）'),
    entry('I', '回路の電流（A）', '电路中的电流（A）'),
  ],
  'physics-magnetic-01': [
    entry('v', '負電荷をもつ粒子の速度', '带负电粒子的速度'),
    entry('B', '紙面の奥向きの一様な磁場（磁束密度）', '垂直纸面向里的均匀磁场（磁感应强度）'),
  ],
}

const setSymbols = [
  entry('∈', '左の値が右の集合に属する記号', '左侧元素属于右侧集合的符号'),
  entry('∉', '左の値が右の集合に属さない記号', '左侧元素不属于右侧集合的符号'),
  entry('∩', '共通部分（両方の集合に属する要素）', '交集（同时属于两个集合的元素）'),
  entry('∪', '和集合（いずれかの集合に属する要素）', '并集（属于至少一个集合的元素）'),
  entry('⇒', '前件が成り立つとき後件も成り立つ、という含意', '蕴含关系：若前件成立，后件也成立'),
]

const physicsMotionSymbols = [
  entry('t', '運動している時間・時刻（問題文の設定に従う）', '运动时间或时刻（以题目定义为准）'),
  entry('v', '速度（向きがある場合は符号・ベクトルで表す）', '速度（根据题意可带方向、正负号或表示为矢量）'),
  entry('a', '加速度（単位時間あたりの速度の変化）', '加速度（单位时间内速度的变化）'),
  entry('x', '選んだ軸に沿った位置座標', '沿所选坐标轴的位置坐标'),
  entry('y', '選んだ軸に沿った位置座標', '沿所选坐标轴的位置坐标'),
  entry('θ', '角度（どの角かは図・問題文で確認）', '角度（具体角度以图和题目定义为准）'),
  entry('Δ', '物理量の変化量（後の記号の差）', '物理量的变化量（后面物理量的差）'),
]

const physicsForceSymbols = [
  entry('F', '力（大きさ・向きは問題文を参照）', '力（大小和方向以题目为准）'),
  entry('m', '物体の質量', '物体的质量'),
  entry('g', '重力加速度', '重力加速度'),
]

const physicsElectricSymbols = [
  entry('I', '電流', '电流'),
  entry('R', '電気抵抗', '电阻'),
  entry('V', '電圧', '电压'),
]

function unique(notes: SymbolNote[]) {
  return [...new Map(notes.map((note) => [note.symbol, note])).values()]
}

export function textbookSymbolNotes(unit: PublicTextbookUnit, section: PublicTextbookSection): SymbolNote[] {
  const context = [unit.title, section.title, unit.unitId].join(' ')
  if (unit.subject === 'math-1a') {
    const notes = [...setSymbols]
    if (/二次関数|quadratic/.test(context)) notes.push(
      entry('x', '二次関数に入力する数（横軸の変数）', '二次函数的自变量（横轴）'),
      entry('y', 'x に対応する関数の値（縦軸）', '对应 x 的函数值（纵轴）'),
    )
    if (/集合|命題|set|proposition/.test(context)) notes.push(
      entry('A', '問題文で定義された集合 A', '题目中定义的集合 A'),
      entry('B', '問題文で定義された集合 B', '题目中定义的集合 B'),
      entry('U', '問題文で定義された全体集合', '题目中定义的全集'),
    )
    return unique(notes)
  }

  const notes: SymbolNote[] = []
  if (/運動|速度|加速度|投射|落下|gravity-drag|motion|velocity|acceleration|projectile|projection/i.test(context)) {
    notes.push(...physicsMotionSymbols)
  }
  if (/力|質量|重心|摩擦|運動量|衝撃|重力|円運動|force|momentum|gravity|friction|circular/i.test(context)) {
    notes.push(...physicsForceSymbols)
  }
  if (/電流|抵抗|電圧|回路|electric|circuit/i.test(context)) notes.push(...physicsElectricSymbols)
  return unique(notes)
}
