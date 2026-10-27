import type { SymbolNote } from '../components/question/SymbolGlossary'
import type { PublicTextbookSection, PublicTextbookUnit } from './textbookPublic'
import type { TextbookReadingBlock } from './textbookSchema'

// Definitions belong to the current problem / textbook section, NOT a global
// dictionary of what a letter "usually" means.
const note = (symbol: string, ja: string, zh: string, label?: string): SymbolNote =>
  ({ symbol, ja, zh, ...(label ? { label } : {}) })

export const builtInPracticeSymbolNotes: Record<string, SymbolNote[]> = {
  'math-quadratic-01': [
    note('x', '噴水を出してからの経過時間（秒）', '喷水之后经过的时间（秒）'),
    note('y', 'その時刻における水の高さ（m）', '相应时刻水柱的高度（m）'),
  ],
  // Class values and frequencies are given directly in the table; there is
  // no dedicated, repeatedly defined symbolic parameter in this question.
  'math-statistics-01': [],
  'physics-motion-01': [
    note('t', '速度–時間グラフの横軸：時刻（秒）', '速度—时间图的横轴：时刻（秒）'),
    note('v', '速度–時間グラフの縦軸：速度（m/s）', '速度—时间图的纵轴：速度（m/s）'),
    note('a', '速度–時間グラフの傾きで求める加速度（m/s²）', '速度—时间图斜率给出的加速度（m/s²）'),
  ],
  'physics-circuit-01': [
    note('R', '2つの抵抗器それぞれの抵抗値（Ω）', '两个电阻器各自相同的电阻值（Ω）'),
    note('V', '直列・並列ともに共通の電源電圧（V）', '串联、并联比较中相同的电源电压（V）'),
  ],
  'physics-magnetic-01': [
    note('v', '負電荷をもつ粒子の、紙面右向きの速度', '带负电粒子沿纸面向右的速度'),
    note('B', '紙面奥向きに一様な磁束密度', '垂直纸面向里的均匀磁感应强度'),
  ],
}

const displacementVelocity: SymbolNote[] = [
  note('vavg', '変位を経過時間で割った平均速度ベクトル', '位移除以经过时间所得的平均速度矢量', 'v⃗_avg'),
  note('Δr', '後の位置ベクトルから初めの位置ベクトルを引いた変位ベクトル', '末位置矢量减初始位置矢量所得的位移矢量', 'Δr⃗'),
  note('Δt', '時刻 t₂ と t₁ の差。t₂−t₁', '结束与开始时刻之差，即 t₂−t₁'),
  note('r1', '時刻 t₁ の位置ベクトル。原点 O から点 P₁ に向かう', 't₁ 时刻的位置矢量：从原点 O 指向 P₁', 'r⃗₁'),
  note('r2', '時刻 t₂ の位置ベクトル。原点 O から点 P₂ に向かう', 't₂ 时刻的位置矢量：从原点 O 指向 P₂', 'r⃗₂'),
  note('t1', '初めの位置を観測した時刻', '观测初始位置的时刻', 't₁'),
  note('t2', '後の位置を観測した時刻', '观测末位置的时刻', 't₂'),
  note('P1', '初めに物体がいる点', '物体初始所在的位置点', 'P₁'),
  note('P2', '移動後に物体がいる点', '物体移动后所在的位置点', 'P₂'),
  note('O', '位置ベクトルの基準となる原点', '定义位置矢量所采用的坐标原点'),
  note('v', '速度の大きさ（速さ）。向きのある速度ベクトル v⃗ と区別する', '速度的大小（速率），与带方向的速度矢量 v⃗ 不同'),
  note('vecv', 'その瞬間の速度ベクトル（向きと大きさを含む）', '瞬时速度矢量（包含大小和方向）', 'v⃗'),
]

const motionComposition: SymbolNote[] = [
  note('v1', '合成する1つ目の速度ベクトル', '参与合成的第一个速度矢量', 'v⃗₁'),
  note('v2', '合成する2つ目の速度ベクトル', '参与合成的第二个速度矢量', 'v⃗₂'),
  note('vx', '速度の x 軸（水平方向）成分', '速度沿 x 轴的水平分量', 'vₓ'),
  note('vy', '速度の y 軸（鉛直方向）成分', '速度沿 y 轴的竖直分量', 'vᵧ'),
  note('v', 'ベクトルの大きさとしての速さ', '该速度矢量的大小（速率）'),
  note('θ', '速度ベクトルと x 軸のなす角', '速度矢量与 x 轴之间的夹角'),
]

const relativeMotion: SymbolNote[] = [
  note('vA', '地面から見た A の速度ベクトル', '以地面为参照时 A 的速度矢量', 'v⃗_A'),
  note('vB', '地面から見た B の速度ベクトル', '以地面为参照时 B 的速度矢量', 'v⃗_B'),
  note('vB/A', 'A から見た B の相対速度。v⃗_B−v⃗_A', 'B 相对于 A 的速度，即 v⃗_B−v⃗_A', 'v⃗_{B/A}'),
]

const acceleration: SymbolNote[] = [
  note('v0', '時刻0における初速度', 't=0 时的初速度', 'v₀'),
  note('v', '時刻 t における速度', 't 时刻的速度'),
  note('a', '一直線上の運動で一定とした加速度', '直线运动中设为常量的加速度'),
  note('Δv', '後の速度から前の速度を引いた速度の変化', '末速度减初速度所得的速度变化量'),
  note('Δt', '速度変化にかかった時間間隔', '发生速度变化所经过的时间'),
  note('t', '初めの時刻からの経過時間', '从初始时刻起经过的时间'),
  note('x', '初めの位置から測った変位（この節の等加速度運動式）', '从初始位置起算的位移（本节匀加速运动公式）'),
]

const horizontalProjectile: SymbolNote[] = [
  note('v0', '水平方向へ投げた瞬間の初速度の大きさ', '物体水平抛出时的初速度大小', 'v₀'),
  note('v0x', '初速度の水平成分。水平投射では v₀', '初速度的水平分量，水平抛射时等于 v₀', 'v₀ₓ'),
  note('v0y', '初速度の鉛直成分。水平投射では0', '初速度的竖直分量，水平抛射时为0', 'v₀ᵧ'),
  note('vx', '時刻 t の水平速度成分', 't 时刻速度的水平分量', 'vₓ'),
  note('vy', '時刻 t の鉛直速度成分', 't 时刻速度的竖直分量', 'vᵧ'),
  note('ax', '水平方向の加速度。空気抵抗なしでは0', '水平方向加速度，忽略空气阻力时为0', 'aₓ'),
  note('ay', '鉛直方向の加速度。下向きを正とする場合は g', '竖直方向加速度，以向下为正时为 g', 'aᵧ'),
  note('g', '重力加速度の大きさ', '重力加速度的大小'),
  note('t', '投げてからの経過時間', '抛出后经过的时间'),
]

const obliqueProjectile: SymbolNote[] = [
  note('v0', '斜めに投げたときの初速度の大きさ', '斜抛时初速度的大小', 'v₀'),
  note('v0x', '初速度の水平成分 v₀cosθ', '初速度的水平分量 v₀cosθ', 'v₀ₓ'),
  note('v0y', '初速度の鉛直成分 v₀sinθ', '初速度的竖直分量 v₀sinθ', 'v₀ᵧ'),
  note('vx', '運動中の速度の水平成分', '运动中速度的水平分量', 'vₓ'),
  note('vy', '運動中の速度の鉛直成分。最高点では0', '运动中速度的竖直分量，最高点处为0', 'vᵧ'),
  note('θ', '初速度ベクトルが水平方向となす投射角', '初速度方向与水平方向之间的抛射角'),
  note('g', '重力加速度の大きさ。鉛直上向きを正とすると aᵧ=−g', '重力加速度大小，以竖直向上为正时 aᵧ=−g'),
  note('x', '投射点から測った水平位置', '相对于抛出点的水平位置'),
  note('y', '投射点から測った鉛直位置', '相对于抛出点的竖直位置'),
  note('T', '投射点と同じ高さに戻るまでの飛行時間（T>0）', '返回抛出高度所需的飞行时间（T>0）'),
  note('D', '水平方向の飛距離', '水平方向的射程'),
]

const fallingWithDrag: SymbolNote[] = [
  note('Fnet', '物体にはたらく力を足し合わせた合力ベクトル', '作用于物体的合力矢量', 'F⃗_net'),
  note('m', '落下する物体の質量', '下落物体的质量'),
  note('g', '重力加速度の大きさ', '重力加速度的大小'),
  note('a', '物体の加速度。空気抵抗があると速さにより変化する', '物体的加速度，存在空气阻力时随速度变化'),
  note('v', '落下中の速さ（下向きを正とする）', '下落过程中的速率（以向下为正）'),
  note('k', '速度比例の空気抵抗係数（単位 kg/s）', '与速度成正比的空气阻力系数（单位 kg/s）'),
  note('f', '空気抵抗力の大きさ。f=kv', '空气阻力的大小，f=kv'),
  note('vt', '加速度が0に近づくときの終端速度', '加速度趋于零时的终端速度', 'vₜ'),
]

// Additional textbook chapters with explicit quantities in their authored
// knowledge checks / formula derivations. Other chapters remain unannotated
// until the definitions have been checked rather than guessed by letter.
const momentOfForce: SymbolNote[] = [
  note('M', '支点まわりの力のモーメント（回転させる効果）', '相对支点的力矩（使物体转动的效应）'),
  note('F', '剛体に加える力の大きさ', '作用于刚体的力的大小'),
  note('L', '支点から力の作用点までの長さ', '支点到力的作用点的距离'),
  note('h', '支点から力の作用線までの垂直距離（腕の長さ）', '支点到力的作用线的垂直距离（力臂）'),
  note('θ', '棒と力の向きがなす角', '杆与力方向的夹角'),
]
const momentum: SymbolNote[] = [
  note('p', '物体の運動量。質量と速度の積 p⃗=m v⃗', '物体的动量，质量乘以速度 p⃗=m v⃗', 'p⃗'),
  note('m', '運動する物体の質量', '运动物体的质量'),
  note('v', '運動する物体の速度（符号で向きも表す）', '物体的速度（可用正负号表示方向）'),
]
const circularKinematics: SymbolNote[] = [
  note('ω', '単位時間あたりの回転角度（角速度、rad/s）', '单位时间转过的角度（角速度，rad/s）'),
  note('θ', '回転した角度（rad）', '转过的角度（弧度）'),
  note('T', '一周するのに必要な時間（周期）', '转一周所需的时间（周期）'),
  note('n', '単位時間あたりの回転数', '单位时间内转过的圈数'),
  note('r', '円運動の半径', '圆周运动的半径'),
  note('v', '円周に沿う速さ', '沿圆周运动的速率'),
  note('s', '円周に沿って動いた弧の長さ', '沿圆周走过的弧长'),
]
const keplerLaws: SymbolNote[] = [
  note('T', '惑星の公転周期', '行星的公转周期'),
  note('a', '惑星の楕円軌道の長半径', '行星椭圆轨道的半长轴'),
  note('r1', '近日点での太陽までの距離', '近日点到太阳的距离', 'r₁'),
  note('r2', '遠日点での太陽までの距離', '远日点到太阳的距离', 'r₂'),
  note('v1', '近日点での惑星の速さ', '行星位于近日点时的速度大小', 'v₁'),
  note('v2', '遠日点での惑星の速さ', '行星位于远日点时的速度大小', 'v₂'),
]

function physicsChapterNotes(unit: PublicTextbookUnit): SymbolNote[] {
  const id = unit.unitId.toLowerCase()
  if (id.includes('displacement-velocity')) return displacementVelocity
  if (id.includes('velocity-composition')) return motionComposition
  if (id.includes('relative-velocity')) return relativeMotion
  if (id.includes('acceleration')) return acceleration
  if (id.includes('horizontal-project')) return horizontalProjectile
  if (id.includes('oblique-project') || id.includes('projectile-motion')) return obliqueProjectile
  if (id.includes('gravity-drag-terminal-velocity')) return fallingWithDrag
  if (id.includes('moment-of-force')) return momentOfForce
  if (id.includes('3a-momentum')) return momentum
  if (id.includes('4a-circular-motion-kinematics')) return circularKinematics
  if (id.includes('5a-kepler-laws')) return keplerLaws
  // Other physics chapters need their own reviewed definitions. Generic
  // guesses such as "x=position" or "θ=angle" are intentionally disabled.
  return []
}

function mathGroupDefinitions(blocks: TextbookReadingBlock[]): SymbolNote[] {
  // Only one clearly defined and reused set per currently visible group.
  // A new definition of A in the same group makes A ambiguous: suppress it.
  const body = blocks.flatMap((block) => {
    if (block.type !== 'formula' && block.type !== 'paragraph') return []
    return block.parts.flatMap((part) => part.type === 'math'
      ? [part.latex] : part.type === 'text' ? [part.text] : [])
  }).join(' ')
  const found = new Map<string, Set<string>>()
  const declaration = /(^|[^A-Za-z])([A-Z])\s*=\s*(\\\{|\{)/g
  for (const match of body.matchAll(declaration)) {
    const start = (match.index ?? 0) + match[0].length
    const latexBrace = match[3] === '\\{'
    let end = -1
    if (latexBrace) {
      end = body.indexOf('\\}', start)
    } else {
      let depth = 1
      for (let index = start; index < body.length; index++) {
        if (body[index] === '{') depth++
        if (body[index] === '}') {
          depth--
          if (depth === 0) { end = index; break }
        }
      }
    }
    if (end < 0 || end - start > 140) continue
    const definition = body.slice(start, end)
      .replace(/\\text\{([^{}]*)\}/g, '$1')
      .replace(/\\mid/g, '｜')
      .replace(/\\leq?/g, '≤')
      .replace(/\\geq?/g, '≥')
      .replace(/\\in/g, '∈')
      .replace(/\\/g, '')
      .trim()
    if (!definition) continue
    const symbol = match[2]
    const set = found.get(symbol) ?? new Set<string>()
    set.add(definition)
    found.set(symbol, set)
  }
  return [...found].flatMap(([symbol, definitions]) => {
    if (definitions.size !== 1) return []
    if ((body.match(new RegExp('\\b' + symbol + '\\b', 'g')) ?? []).length < 2) return []
    const definition = [...definitions][0]
    return [note(symbol, 'この問題で定義された集合：{' + definition + '}',
      '本题定义的集合：{' + definition + '}')]
  })
}

export function textbookSymbolNotes(
  unit: PublicTextbookUnit,
  _section: PublicTextbookSection,
  visibleBlocks: TextbookReadingBlock[] = [],
): SymbolNote[] {
  if (unit.subject === 'physics') return physicsChapterNotes(unit)
  return mathGroupDefinitions(visibleBlocks)
}
