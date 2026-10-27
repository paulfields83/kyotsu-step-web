import type { ReactNode } from 'react'
import { mathSetsEmphasis, type EmphasisMark } from '../../domain/emphasis/mathSetsEmphasis'
import { physicsMotionEmphasis } from '../../domain/emphasis/physicsMotionEmphasis'

/**
 * Reviewed, ID-addressed emphasis, NOT a global regex or term detector.
 * A block can contain original text, separate term atoms, formulas and
 * choices. Only explicitly annotated visible text/terms are decorated.
 */
export type EmphasisScope =
  | 'math-sets-propositions'
  | 'physics-1a' | 'physics-1b' | 'physics-1c' | 'physics-1d'
  | 'physics-1e' | 'physics-1f' | 'physics-1g'

const mathUnitIds = new Set([
  'math-sets',
  'math-propositions-reading',
  'math-quantifiers-all-exists',
  'math-propositions-proof',
])

export function textbookEmphasisScope(subject: string, unitId: string): EmphasisScope | undefined {
  if (subject === 'math-1a' && mathUnitIds.has(unitId)) return 'math-sets-propositions'
  if (subject !== 'physics' || !unitId.endsWith('-revised')) return undefined
  if (unitId.startsWith('physics-a-displacement-velocity-')) return 'physics-1a'
  const section = unitId.match(/^physics-1([b-g])-/)?.[1]
  return section ? ('physics-1' + section) as EmphasisScope : undefined
}

function marksFor(
  scope?: EmphasisScope,
  blockId?: string,
  unitId?: string,
): readonly EmphasisMark[] {
  if (!scope || !blockId) return []
  if (scope === 'math-sets-propositions')
    return mathSetsEmphasis[unitId ?? '']?.[blockId] ?? []
  return physicsMotionEmphasis[scope]?.[blockId] ?? []
}

export type HighlightRange = {
  start: number
  end: number
  phrase: string
  tone: EmphasisMark['tone']
}

// Each range is a substring in a specific authored reading block.
// Formula rendering, choices and future steps never pass through here.
export function keyConceptRanges(
  value: string,
  scope?: EmphasisScope,
  blockId?: string,
  unitId?: string,
): HighlightRange[] {
  if (!value || !scope || !blockId) return []
  const marks = marksFor(scope, blockId, unitId)
  const ranges: HighlightRange[] = []
  for (const mark of marks) {
    const start = value.indexOf(mark.phrase)
    if (start < 0) continue // Phrase belongs to another text part in this block.
    const end = start + mark.phrase.length
    if (ranges.some((r) => start < r.end && end > r.start)) continue
    ranges.push({ start, end, phrase: mark.phrase, tone: mark.tone })
  }
  return ranges.sort((a, b) => a.start - b.start)
}

export function isReviewedConceptTerm(
  value: string,
  scope?: EmphasisScope,
  blockId?: string,
  unitId?: string,
): boolean {
  return marksFor(scope, blockId, unitId).some((mark) =>
    mark.tone === 'concept' && mark.phrase === value)
}

export function KeyConceptText({
  value, scope, blockId, unitId,
}: {
  value: string
  scope?: EmphasisScope
  blockId?: string
  unitId?: string
}): ReactNode {
  const ranges = keyConceptRanges(value, scope, blockId, unitId)
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
