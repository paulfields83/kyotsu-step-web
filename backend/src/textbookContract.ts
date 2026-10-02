import { getTextbookChoices, isTextbookAnswerCorrect, normalizeTextbookAnswer } from '../../src/domain/textbook'
import type { TextbookAnswerBook, TextbookUnit } from '../../src/domain/textbookSchema'

export type TextbookContractReport = {
  unitId: string
  sections: number
  items: number
  blanks: number
  figures: number
  errors: string[]
  warnings: string[]
}

function collectChoiceReferences(unit: TextbookUnit) {
  const counts = new Map<string, number>()
  for (const section of unit.sections) {
    for (const block of section.readingFlow) {
      if (block.type !== 'paragraph' && block.type !== 'formula') continue
      for (const part of block.parts) {
        if (part.type !== 'choice') continue
        counts.set(part.itemId, (counts.get(part.itemId) ?? 0) + 1)
      }
    }
  }
  return counts
}

export function validateTextbookContract(unit: TextbookUnit, answerBook: TextbookAnswerBook): TextbookContractReport {
  const errors: string[] = []
  const warnings: string[] = []
  const items = unit.sections.flatMap((section) => section.items)
  const itemIds = new Set(items.map((item) => item.id))
  const answerIds = new Set(Object.keys(answerBook.answers))
  const references = collectChoiceReferences(unit)

  if (answerBook.unitId !== unit.unitId) {
    errors.push(`answerBook.unitId mismatch: ${answerBook.unitId}`)
  }

  for (const item of items) {
    const answer = answerBook.answers[item.id]
    if (!answer) {
      errors.push(`missing answer for item: ${item.id}`)
      continue
    }

    const referenceCount = references.get(item.id) ?? 0
    if (referenceCount !== 1) {
      errors.push(`item ${item.id} must map to exactly one blank; found ${referenceCount}`)
    }

    if (!isTextbookAnswerCorrect(answer, answer.answer)) {
      errors.push(`primary answer does not validate for item: ${item.id}`)
    }

    if (item.answerType === 'number') {
      const numericAnswer = Number(normalizeTextbookAnswer(answer.answer))
      if (!Number.isFinite(numericAnswer)) {
        errors.push(`number item has non-numeric primary answer: ${item.id}`)
      }
    }

    const choices = getTextbookChoices(unit, item, answerBook.answers)
    const normalizedChoices = choices.map(normalizeTextbookAnswer)
    const uniqueChoices = new Set(normalizedChoices)
    if (choices.length < 2) {
      errors.push(`item ${item.id} has fewer than 2 exportable choices`)
    }
    if (choices.length > 4) {
      warnings.push(`item ${item.id} exports ${choices.length} choices (expected at most 4)`)
    }
    if (uniqueChoices.size !== choices.length) {
      errors.push(`item ${item.id} has duplicate choices after normalization`)
    }
    if (!uniqueChoices.has(normalizeTextbookAnswer(answer.answer))) {
      errors.push(`item ${item.id} choices do not contain the primary answer`)
    }
  }

  for (const answerId of answerIds) {
    if (!itemIds.has(answerId)) errors.push(`orphan answer key: ${answerId}`)
  }

  for (const referencedId of references.keys()) {
    if (!itemIds.has(referencedId)) errors.push(`blank references unknown item: ${referencedId}`)
  }

  const figureCount = unit.sections.reduce((total, section) => total + section.figures.length, 0)
  return {
    unitId: unit.unitId,
    sections: unit.sections.length,
    items: items.length,
    blanks: [...references.values()].reduce((total, count) => total + count, 0),
    figures: figureCount,
    errors,
    warnings,
  }
}

export function assertTextbookContract(unit: TextbookUnit, answerBook: TextbookAnswerBook) {
  const report = validateTextbookContract(unit, answerBook)
  if (report.errors.length) {
    throw new Error(`textbook contract failed for ${unit.unitId}:\n- ${report.errors.join('\n- ')}`)
  }
  return report
}

export const textbookInteractionContract = {
  schemaVersion: '1.0',
  blankPart: {
    blockTypes: ['paragraph', 'formula'],
    partType: 'choice',
    itemIdField: 'itemId',
  },
  item: {
    idField: 'id',
    promptField: 'prompt',
    answerTypeField: 'answerType',
    choicesField: 'choices',
  },
  answerCheck: {
    method: 'POST',
    pathTemplate: '/api/textbooks/{unitId}/items/{itemId}/answer',
    requestBody: { value: 'string' },
    response: {
      correct: 'boolean',
      resolved: 'boolean',
      correctAnswer: 'string | omitted when correct',
    },
  },
  security: {
    answerKeysInPublicExport: false,
    acceptedAnswersInPublicExport: false,
  },
} as const
