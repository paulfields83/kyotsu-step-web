import type { TextbookItem, TextbookUnit } from './textbookSchema'

export type TextbookAnswerRecord = {
  itemId: string
  value: string
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

export function getTextbookChoices(unit: TextbookUnit, item: TextbookItem) {
  if (item.choices?.length) return stableShuffle(item.choices, item.id)

  const currentSection = unit.sections.find((section) => section.items.some((candidate) => candidate.id === item.id))
  const sameTypeInSection = currentSection?.items.filter((candidate) => candidate.answerType === item.answerType) ?? []
  const sameTypeInUnit = unit.sections.flatMap((section) => section.items).filter((candidate) => candidate.answerType === item.answerType)

  const pool = [...sameTypeInSection, ...sameTypeInUnit]
    .map((candidate) => candidate.answer)
    .filter((answer) => normalizeTextbookAnswer(answer) !== normalizeTextbookAnswer(item.answer))

  const distinctDistractors: string[] = []
  for (const answer of pool) {
    if (distinctDistractors.some((existing) => normalizeTextbookAnswer(existing) === normalizeTextbookAnswer(answer))) continue
    distinctDistractors.push(answer)
    if (distinctDistractors.length === 3) break
  }

  return stableShuffle([item.answer, ...distinctDistractors.slice(0, 3)], item.id)
}

export function isTextbookAnswerCorrect(item: TextbookItem, value: string) {
  const normalized = normalizeTextbookAnswer(value)
  return [item.answer, ...item.acceptedAnswers].some((answer) => normalizeTextbookAnswer(answer) === normalized)
}

export function answerTextbookItem(progress: TextbookUnitProgress | undefined, unit: TextbookUnit, item: TextbookItem, value: string, now: number): TextbookUnitProgress {
  const previous = progress?.answers[item.id]
  if (previous?.resolved) return progress!

  const correct = isTextbookAnswerCorrect(item, value)
  const nextRecord: TextbookAnswerRecord = previous
    ? { ...previous, value, resolved: correct, attemptCount: previous.attemptCount + 1, lastAnsweredAt: now }
    : { itemId: item.id, value, isFirstCorrect: correct, resolved: correct, attemptCount: 1, firstAnsweredAt: now, lastAnsweredAt: now }

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

export function textbookSectionProgress(unit: TextbookUnit, progress: TextbookUnitProgress | undefined, sectionId: string) {
  const section = unit.sections.find((candidate) => candidate.id === sectionId)
  if (!section) return { completed: 0, total: 0 }
  return {
    completed: section.items.filter((item) => progress?.answers[item.id]?.resolved).length,
    total: section.items.length,
  }
}

export function textbookUnitProgress(unit: TextbookUnit, progress: TextbookUnitProgress | undefined) {
  const items = unit.sections.flatMap((section) => section.items)
  const completed = items.filter((item) => progress?.answers[item.id]?.resolved).length
  return { completed, total: items.length, percent: items.length ? Math.round((completed / items.length) * 100) : 0 }
}
