import type { ReactNode } from 'react'

/**
 * Teaching-purpose typography only. Every highlighted span is a substring of
 * the original Japanese prose; this component NEVER rewrites the lesson,
 * changes math/formula blocks, or reveals option/blank content.
 *
 * Unlike a word list, the patterns below identify WHY the term matters:
 * a definition condition + its named concept, or a specific reasoning test.
 */
export type EmphasisScope =
  | 'math-sets-propositions'
  | 'physics-1a' | 'physics-1b' | 'physics-1c' | 'physics-1d'
  | 'physics-1e' | 'physics-1f' | 'physics-1g'

type TeachingPattern = {
  expression: RegExp
  groups: readonly number[]
}

const definition = (expression: RegExp, ...groups: number[]): TeachingPattern =>
  ({ expression, groups })

// Curated against the Japanese sets/propositions textbook and ZIP-based
// 4STEP guided practice. Highlight a criterion and its term, rather than every
// incidental appearance of 命題/集合/反例 in an unrelated sentence.
const mathPatterns: TeachingPattern[] = [
  definition(/(真か偽かを判断できる文)を(命題)という/gu, 1, 2),
  definition(/(正しいか正しくないかがはっきり決まる)[^。]{0,8}?(命題)という/gu, 1, 2),
  definition(/(真偽を客観的に決められる)[^。]{0,24}?(命題)/gu, 1, 2),
  definition(/(客観的に真[・\/]偽のどちらか(?:一方)?へ定まる)/gu, 1),
  definition(/(何を入れるかがはっきり決まる)[^。]{0,10}?(集合)という/gu, 1, 2),
  definition(/(条件を満たすもの)[^。]{0,55}?(集合)という/gu, 1, 2),
  // Some textbook definitions end in a graded answer blank. Keep the
  // criterion visible but never pre-reveal the missing concept name.
  definition(/このように、ある(条件を満たすもの)をひとまとまりとして考えた/gu, 1),
  definition(/(一つ一つのもの)[^。]{0,22}?(要素)という/gu, 1, 2),
  definition(/集合をつくっている(一つ一つのもの)/gu, 1),
  definition(/(同じ条件)[^。]{0,24}?(満たしている)/gu, 1),
  definition(/(要素である)ことを/gu, 1),
  definition(/反対に、(要素でない)ことを/gu, 1),
  definition(/(その数は集合の中に入っているか)/gu, 1),
  definition(/(すべての要素)[^。]{0,80}?(部分集合)/gu, 1, 2),
  definition(/(すべての要素)[^。]{0,55}?含まれるかを調べる/gu, 1),
  definition(/(どの要素も別の集合の要素であるとき)/gu, 1),
  definition(/(どれか1つ選んだとき、それが必ず [A-Z] にも入るなら)[^。]{0,30}?(部分集合)/gu, 1, 2),
  definition(/(両方に入る要素を集めた集合)が(共通部分)/gu, 1, 2),
  definition(/(少なくとも一方に入る要素を集めた集合)が(和集合)/gu, 1, 2),
  definition(/(A と B の両方に入る要素を集めた集合)が(共通部分)/gu, 1, 2),
  definition(/(A または B の少なくとも一方に入る要素を集めた集合)が(和集合)/gu, 1, 2),
  definition(/(要素を1つももたない集合)[^。]{0,15}?(空集合)/gu, 1, 2),
  definition(/(U の中で A に入らないもの全体)を A の(補集合)/gu, 1, 2),
  definition(/(その対象全体)が(全体集合)/gu, 1, 2),
  definition(/(要素が有限個)[^。]{0,24}?(有限集合)/gu, 1, 2),
  definition(/(要素が無限[^。]{0,20}?)(無限集合)/gu, 1, 2),
  definition(/(仮定を満たしながら結論を満たさない)[^。]{0,30}?(反例)/gu, 1, 2),
  definition(/(前件を満たして結論を破るこのような具体例)を、?(反例)という/gu, 1, 2),
  definition(/(「p は満たすが q は満たさない」例)[^。]{0,60}?(反例)/gu, 1, 2),
  definition(/(命題が偽だと示すには)[^。]{0,45}?(例を1つ見つければよい)/gu, 1, 2),
  definition(/(p を満たすすべてのものが)[^」]{0,30}?(も満たす)/gu, 1, 2),
  definition(/(両方向とも真)[^。]{0,30}?(必要十分条件)/gu, 1, 2),
  definition(/(「p があれば q まで言える」)/gu, 1),
  definition(/(もとの命題)[^。]{0,65}?(対偶)[^。]{0,28}?(同じ真偽)/gu, 1, 2, 3),
  definition(/(仮定と結論を入れ替える)\s*→\s*(逆)/gu, 1, 2),
  definition(/(両方を否定する)\s*→\s*(裏)/gu, 1, 2),
  definition(/(入れ替えて両方を否定する)\s*→\s*(対偶)/gu, 1, 2),
  definition(/(結論が成り立たない)[^。]{0,42}?(矛盾を出す方法)/gu, 1, 2),
  definition(/(背理法)は[^。]{0,50}?(矛盾を出す方法)/gu, 1, 2),
  definition(/(否定して)[^。]{0,25}?(仮定する)/gu, 1, 2),
  definition(/(仮定と結論を分けること)/gu, 1),
  definition(/(真偽を決めること)/gu, 1),
  definition(/(反例を1つ探す)/gu, 1),
  definition(/(端の数を含むか判断する)/gu, 1),
  definition(/(等号があるか)/gu, 1),
  definition(/(どの要素を数えているか)/gu, 1),
  definition(/(元の条件を満たしながら結論を満たしていない)/gu, 1),
]

// Context-sensitive physics definitions for the revised 1A-1G lessons.
// These are not a glossary: terms are emphasized at the point of explanation,
// not in every subsequent calculation or sentence mentioning them.
const physicsPatterns: Record<Exclude<EmphasisScope, 'math-sets-propositions'>, TeachingPattern[]> = {
  'physics-1a': [
    definition(/(原点から物体の位置へ向かう)ベクトルを(位置ベクトル)という/gu, 1, 2),
    definition(/(変位ベクトル)[^。]{0,55}?(位置の変化)/gu, 1, 2),
    definition(/(位置の変化)[^。]{0,20}?(変位)といい/gu, 1, 2),
    definition(/(変位)は(「後の位置から最初の位置を引いたもの」)/gu, 1, 2),
    definition(/(変位)は(途中の経路には依存しない)/gu, 1, 2),
    definition(/(単位時間あたり)[^。]{0,42}?(位置が変化したか)/gu, 1, 2),
    definition(/(この量)を(平均の速度)という/gu, 1, 2),
    definition(/(時間間隔)[^。]{0,40}?(瞬間の速度)という/gu, 1, 2),
    definition(/(Δt→0 とした極限で得られる速度)を(瞬間の速度)という/gu, 1, 2),
    definition(/(大きさと向きの両方をもつベクトル量)/gu, 1),
    definition(/(その大きさだけを取り出した)[^。]{0,40}?(速さ)という/gu, 1, 2),
    definition(/(接線方向)[^。]{0,30}?(瞬間の速度)/gu, 1, 2),
  ],
  'physics-1b': [
    definition(/(速度の合成)という/gu, 1),
    definition(/(複数の速度をベクトルとして足し合わせ、一つの速度を求めること)を(速度の合成)という/gu, 1, 2),
    definition(/(一つの速度ベクトルを水平方向と鉛直方向に分ける)/gu, 1),
    definition(/(水平方向の成分)[^。]{0,75}?(鉛直方向の成分)/gu, 1, 2),
    definition(/(向きも符号に含めて考える)/gu, 1),
    definition(/(逆向きのベクトル)[^。]{0,35}?(足す)/gu, 1, 2),
  ],
  'physics-1c': [
    definition(/(相対速度)は[^。]{0,85}?(速度の差)/gu, 1, 2),
    definition(/(観測者)[^。]{0,75}?(相対速度)/gu, 1, 2),
    definition(/(観測者によって)[^。]{0,45}?(速度が変わる)/gu, 1, 2),
    definition(/(基準となる物体)[^。]{0,55}?(差)/gu, 1, 2),
  ],
  'physics-1d': [
    definition(/(単位時間あたりの速度の変化)[^。]{0,30}?(加速度)/gu, 1, 2),
    definition(/(速度の変化)[^。]{0,45}?(加速度)という/gu, 1, 2),
    definition(/(速度の変化量)[^。]{0,30}?(時間間隔)/gu, 1, 2),
    definition(/(v-tグラフ)[^。]{0,35}?(傾き)/gu, 1, 2),
    definition(/(グラフの傾き)[^。]{0,35}?(加速度)/gu, 1, 2),
    definition(/(グラフの面積)[^。]{0,35}?(変位)/gu, 1, 2),
    definition(/(加速度が一定)[^。]{0,35}?(等加速度運動)/gu, 1, 2),
  ],
  'physics-1e': [
    definition(/(水平方向)[^。]{0,75}?(鉛直方向)/gu, 1, 2),
    definition(/(水平投射)では[^。]{0,80}?(重力加速度)/gu, 1, 2),
    definition(/(水平方向の速度)[^。]{0,50}?(一定)/gu, 1, 2),
    definition(/(鉛直方向)[^。]{0,45}?(自由落下)/gu, 1, 2),
  ],
  'physics-1f': [
    definition(/(初速度)[^。]{0,60}?(水平成分)[^。]{0,35}?(鉛直成分)/gu, 1, 2, 3),
    definition(/(最高点)[^。]{0,35}?(鉛直方向の速度)[^。]{0,20}?(0)/gu, 1, 2, 3),
    definition(/(最高点)[^。]{0,42}?(0)/gu, 1, 2),
    definition(/(水平到達距離)[^。]{0,55}?(飛行時間)/gu, 1, 2),
    definition(/(斜方投射)[^。]{0,60}?(初速度)/gu, 1, 2),
  ],
  'physics-1g': [
    definition(/(空気抵抗)[^。]{0,60}?(速度に比例)/gu, 1, 2),
    definition(/(終端速度)[^。]{0,65}?(合力)[^。]{0,28}?(0)/gu, 1, 2, 3),
    definition(/(合力)[^。]{0,36}?(0)[^。]{0,26}?(終端速度)/gu, 1, 2, 3),
    definition(/(重力)[^。]{0,45}?(空気抵抗)[^。]{0,40}?(つり合う)/gu, 1, 2, 3),
    definition(/(合力)[^。]{0,48}?(加速度)/gu, 1, 2),
    definition(/(運動方程式)[^。]{0,60}?(終端速度)/gu, 1, 2),
  ],
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

export type EmphasisTone = 'condition' | 'concept'
export type HighlightRange = {
  start: number
  end: number
  phrase: string
  tone: EmphasisTone
}

// A concept is blue only when a contextual definition/comparison pattern
// matched it; merely mentioning the same term elsewhere never decorates it.
const conceptPhrases = new Set([
  '集合', '要素', '部分集合', '空集合', '全体集合', '補集合',
  '共通部分', '和集合', '有限集合', '無限集合',
  '命題', '反例', '対偶', '逆', '裏', '背理法', '必要十分条件',
  '要素である', '要素でない',
  '位置ベクトル', '変位', '変位ベクトル', '平均の速度',
  '瞬間の速度', '速さ', '速度の合成', '相対速度',
  '加速度', '等加速度運動', '水平投射', '斜方投射',
  '最高点', '終端速度', '空気抵抗',
])

function toneFor(phrase: string): EmphasisTone {
  return conceptPhrases.has(phrase) ? 'concept' : 'condition'
}

export function keyConceptRanges(
  value: string,
  scope: EmphasisScope | undefined,
  maxCount?: number,
): HighlightRange[] {
  if (!scope || !value.trim()) return []
  const limit = maxCount ?? (value.length < 40 ? 2 : value.length < 70 ? 3 : 4)
  if (limit <= 0) return []
  const rules = scope === 'math-sets-propositions' ? mathPatterns : physicsPatterns[scope]
  const candidates: { range: HighlightRange; ruleRank: number }[] = []
  for (let ruleRank = 0; ruleRank < rules.length; ruleRank++) {
    const rule = rules[ruleRank]
    for (const match of value.matchAll(rule.expression)) {
      let cursor = 0
      for (const group of rule.groups) {
        const phrase = match[group]
        if (!phrase) continue
        const offset = match[0].indexOf(phrase, cursor)
        if (offset < 0) continue
        const start = (match.index ?? 0) + offset
        candidates.push({ range: { start, end: start + phrase.length, phrase, tone: toneFor(phrase) }, ruleRank })
        cursor = offset + phrase.length
      }
    }
  }
  // Pick coherent, curriculum-authored patterns first, then move through the
  // paragraph in reading order. No generic "bold every occurrence of X".
  candidates.sort((a, b) => a.ruleRank - b.ruleRank
    || a.range.start - b.range.start || b.range.phrase.length - a.range.phrase.length)
  const picked: HighlightRange[] = []
  const seen = new Set<string>()
  for (const item of candidates) {
    if (picked.length >= limit) break
    const candidate = item.range
    if (seen.has(candidate.phrase)) continue
    if (picked.some((x) => candidate.start < x.end && candidate.end > x.start)) continue
    picked.push(candidate)
    seen.add(candidate.phrase)
  }
  return picked.sort((a, b) => a.start - b.start)
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
  const ranges = keyConceptRanges(value, scope, maxCount)
  if (!ranges.length) return value
  const result: ReactNode[] = []
  let cursor = 0
  for (const range of ranges) {
    if (range.start > cursor) result.push(value.slice(cursor, range.start))
    result.push(
      <strong className={'key-concept-emphasis key-concept-emphasis--' + range.tone} key={range.start}>
        {value.slice(range.start, range.end)}
      </strong>,
    )
    cursor = range.end
  }
  if (cursor < value.length) result.push(value.slice(cursor))
  return <>{result}</>
}
