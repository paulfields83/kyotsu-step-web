import type { ReactNode } from 'react'

/**
 * Presentation-only emphasis. Original Japanese prose is never rewritten.
 * The glossary, question options, answer values, mathematics, and hidden
 * future steps are intentionally outside this component.
 */
export type EmphasisScope =
  | 'math-sets-propositions'
  | 'physics-1a' | 'physics-1b' | 'physics-1c' | 'physics-1d'
  | 'physics-1e' | 'physics-1f' | 'physics-1g'

const mathTerms = [
  'すべての要素', '全部の要素', 'すべて一致する',
  '同じ条件を満たす', 'どんな条件', '条件を満たすか', '条件に戻って判断する',
  '部分集合', '空集合', '全体集合', '補集合',
  '共通部分', '和集合', '有限集合', '無限集合', '集合の要素',
  'ド・モルガンの法則', '両方向の包含', '包含関係',
  '真偽が決まる', '真偽を決める', '真偽が同じ',
  '必要十分条件', '十分条件', '必要条件',
  '前件を満たして結論を満たさない', '仮定を満たして結論を破る',
  '仮定と結論', '反例', '命題', '対偶', '背理法',
  '結論の否定', '矛盾', '互いに素',
  '2方向を調べる', '逆方向を調べる',
  '等号がある', '等号がない',
  '要素を列挙する', '条件で表す', '要素を書き並べる',
]

const commonPhysics = [
  'ベクトル量', '大きさと向き', '向きと大きさ',
  '単位時間あたり', '条件を式に代入', '符号に注意',
]
const physicsTerms: Record<Exclude<EmphasisScope, 'math-sets-propositions'>, string[]> = {
  'physics-1a': [
    '位置ベクトル', '変位ベクトル', '平均の速度', '平均速度',
    '瞬間の速度', '瞬間速度', '位置の変化',
    '途中の経路には依存しない', '接線方向', '速さ',
    '変位',
  ],
  'physics-1b': [
    '速度の合成', '速度の分解', '速度ベクトル', 'ベクトルの和',
    'ベクトルの差', '水平方向の成分', '鉛直方向の成分',
    '水平成分', '鉛直成分', '向きも符号',
  ],
  'physics-1c': [
    '相対速度', '観測者', '基準となる', '速度の差',
    '地面から見た', 'A から見た', '向きが逆',
  ],
  'physics-1d': [
    '等加速度運動', '速度の変化', '平均加速度', '瞬間加速度',
    '加速度', '時間間隔', '速度–時間グラフ', '速度時間グラフ',
    'グラフの傾き', '面積', '一定の加速度',
  ],
  'physics-1e': [
    '水平投射', '初速度', '水平成分', '鉛直成分',
    '水平方向の速度', '鉛直方向の速度', '水平方向', '鉛直方向',
    '重力加速度', '自由落下',
  ],
  'physics-1f': [
    '斜方投射', '最高点', '初速度', '投射角',
    '飛行時間', '水平到達距離', '水平方向の速度', '鉛直方向の速度',
    '水平成分', '鉛直成分', '重力加速度',
  ],
  'physics-1g': [
    '終端速度', '終端条件', '空気抵抗', '抵抗力',
    '重力加速度', '合力', '運動方程式',
    '速度に比例', '加速度が0', '加速度がゼロ',
    '力がつり合う',
  ],
}

function keywords(scope: EmphasisScope): string[] {
  return scope === 'math-sets-propositions'
    ? mathTerms
    : [...physicsTerms[scope], ...commonPhysics]
}

export function textbookEmphasisScope(subject: string, unitId: string): EmphasisScope | undefined {
  if (subject === 'math-1a' && (
    unitId === 'math-1a-sets-propositions'
    || unitId === 'math-sets'
    || unitId === 'math-1a-math-a-sets'
  )) return 'math-sets-propositions'
  if (subject !== 'physics' || !unitId.endsWith('-revised')) return undefined
  if (unitId.startsWith('physics-a-displacement-velocity-')) return 'physics-1a'
  const section = unitId.match(/^physics-1([b-g])-/)?.[1]
  return section ? ('physics-1' + section) as EmphasisScope : undefined
}

export type HighlightRange = { start: number; end: number; phrase: string }

export function keyConceptRanges(
  value: string,
  scope: EmphasisScope | undefined,
  maxCount?: number,
): HighlightRange[] {
  if (!scope || !value.trim()) return []
  // Short lines should have just one highlight. Longer explanation paragraphs
  // can have two or three, but never turn into an all-bold paragraph.
  const limit = maxCount ?? (value.length < 35 ? 1 : value.length < 105 ? 2 : 3)
  if (limit <= 0) return []
  const candidates: HighlightRange[] = []
  const phrases = [...new Set(keywords(scope))].sort((a, b) => b.length - a.length)
  for (const phrase of phrases) {
    let from = 0
    let at = value.indexOf(phrase, from)
    while (at !== -1) {
      candidates.push({ start: at, end: at + phrase.length, phrase })
      from = at + phrase.length
      at = value.indexOf(phrase, from)
    }
  }
  // Prefer the longer match at the same point (e.g. 必要十分条件 rather than 十分条件).
  candidates.sort((a, b) => a.start - b.start || b.phrase.length - a.phrase.length)
  const chosen: HighlightRange[] = []
  for (const match of candidates) {
    if (chosen.length >= limit) break
    if (chosen.some((existing) => match.start < existing.end && match.end > existing.start)) continue
    // Do not repeatedly emphasize the same term within a single paragraph.
    if (chosen.some((existing) => existing.phrase === match.phrase)) continue
    chosen.push(match)
  }
  return chosen
}

export function KeyConceptText({
  value,
  scope,
  maxCount,
}: {
  value: string
  scope?: EmphasisScope
  maxCount?: number
}): ReactNode {
  const spans = keyConceptRanges(value, scope, maxCount)
  if (!spans.length) return value
  const result: ReactNode[] = []
  let cursor = 0
  for (const span of spans) {
    if (span.start > cursor) result.push(value.slice(cursor, span.start))
    result.push(<strong className="key-concept-emphasis" key={span.start}>{value.slice(span.start, span.end)}</strong>)
    cursor = span.end
  }
  if (cursor < value.length) result.push(value.slice(cursor))
  return <>{result}</>
}
