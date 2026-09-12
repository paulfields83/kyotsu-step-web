import type { TextbookAnswerEntry, TextbookItem, TextbookUnit } from './textbookSchema'

export type TextbookAnswerRecord = {
  itemId: string
  value: string
  firstValue?: string
  isFirstCorrect: boolean
  resolved: boolean
  attemptCount: number
  firstAnsweredAt: number
  lastAnsweredAt: number
}

export type TextbookUnitProgress = {
  unitId: string
  unitRevision: number
  startedAt: number
  updatedAt: number
  answers: Record<string, TextbookAnswerRecord>
  completedAt?: number
}

type TextbookProgressUnit = {
  unitId: string
  revision: number
  sections: Array<{
    id: string
    items: Array<{ id: string }>
  }>
}

export function normalizeTextbookAnswer(value: string) {
  return value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\s　]/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/[⃗→]/g, '')
}

function stableHash(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function stableShuffle(values: string[], seed: string) {
  const next = [...values]
  let state = stableHash(seed) || 1
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const swapIndex = state % (index + 1)
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

export function getTextbookChoices(unit: TextbookUnit, item: TextbookItem, answers?: Record<string, TextbookAnswerEntry>) {
  const itemAnswer = answers?.[item.id]?.answer ?? item.answer
  if (!itemAnswer) return item.choices ?? []
  if (item.choices?.length) return stableShuffle(item.choices, item.id)

  const currentSection = unit.sections.find((section) => section.items.some((candidate) => candidate.id === item.id))
  const sameTypeInSection = currentSection?.items.filter((candidate) => candidate.answerType === item.answerType) ?? []
  const sameTypeInUnit = unit.sections.flatMap((section) => section.items).filter((candidate) => candidate.answerType === item.answerType)

  const pool = [...sameTypeInSection, ...sameTypeInUnit]
    .map((candidate) => answers?.[candidate.id]?.answer ?? candidate.answer)
    .filter((answer): answer is string => Boolean(answer))
    .filter((answer) => normalizeTextbookAnswer(answer) !== normalizeTextbookAnswer(itemAnswer))

  const distinctDistractors: string[] = []
  for (const answer of pool) {
    if (distinctDistractors.some((existing) => normalizeTextbookAnswer(existing) === normalizeTextbookAnswer(answer))) continue
    distinctDistractors.push(answer)
    if (distinctDistractors.length === 3) break
  }

  return stableShuffle([itemAnswer, ...distinctDistractors.slice(0, 3)], item.id)
}

export function isTextbookAnswerCorrect(answer: TextbookAnswerEntry | TextbookItem, value: string) {
  if (!answer.answer) throw new Error(`textbook answer is missing for ${'id' in answer ? answer.id : 'answer entry'}`)
  const candidates = [answer.answer, ...answer.acceptedAnswers]

  if ('validator' in answer) {
    if (answer.validator === 'number') {
      return candidates.some((candidate) => Number(normalizeTextbookAnswer(value)) === Number(normalizeTextbookAnswer(candidate)))
    }
    if (answer.validator === 'exact') {
      const submitted = value.trim()
      return candidates.some((candidate) => candidate.trim() === submitted)
    }
    // TODO(math-equivalent): replace normalized comparison with symbolic equivalence when a math parser is introduced.
    // Until then, math-equivalent intentionally falls back to the same normalization used by normalized-text.
  }

  const normalized = normalizeTextbookAnswer(value)
  return candidates.some((candidate) => normalizeTextbookAnswer(candidate) === normalized)
}

export function answerTextbookItem(progress: TextbookUnitProgress | undefined, unit: TextbookUnit, item: TextbookItem, value: string, now: number): TextbookUnitProgress {
  const previous = progress?.answers[item.id]
  if (previous?.resolved) return progress!

  const correct = isTextbookAnswerCorrect(item, value)
  const nextRecord: TextbookAnswerRecord = {
    itemId: item.id,
    value,
    firstValue: previous?.firstValue ?? value,
    isFirstCorrect: previous?.isFirstCorrect ?? correct,
    resolved: true,
    attemptCount: (previous?.attemptCount ?? 0) + 1,
    firstAnsweredAt: previous?.firstAnsweredAt ?? now,
    lastAnsweredAt: now,
  }

  const answers = { ...(progress?.answers ?? {}), [item.id]: nextRecord }
  const allItemIds = unit.sections.flatMap((section) => section.items.map((candidate) => candidate.id))
  const completed = allItemIds.every((id) => answers[id]?.resolved)

  return {
    unitId: unit.unitId,
    unitRevision: unit.revision,
    startedAt: progress?.startedAt ?? now,
    updatedAt: now,
    answers,
    ...(completed ? { completedAt: progress?.completedAt ?? now } : {}),
  }
}

export function textbookSectionProgress(unit: TextbookProgressUnit, progress: TextbookUnitProgress | undefined, sectionId: string) {
  const section = unit.sections.find((candidate) => candidate.id === sectionId)
  if (!section) return { completed: 0, total: 0 }
  return {
    completed: section.items.filter((item) => progress?.answers[item.id]?.resolved).length,
    total: section.items.length,
  }
}

export function textbookUnitProgress(unit: TextbookProgressUnit, progress: TextbookUnitProgress | undefined) {
  const items = unit.sections.flatMap((section) => section.items)
  const completed = items.filter((item) => progress?.answers[item.id]?.resolved).length
  return { completed, total: items.length, percent: items.length ? Math.round((completed / items.length) * 100) : 0 }
}
