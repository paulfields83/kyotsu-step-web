import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from '../data/textbookUnits'
import { answerTextbookItem, isTextbookAnswerCorrect, normalizeTextbookAnswer, textbookUnitProgress } from './textbook'

const unit = builtInTextbookUnits[0]
const firstItem = unit.sections[0].items[0]
const formulaItem = unit.sections[0].items.find((item) => item.id === 'a-5')!

describe('textbook learning state', () => {
  it('normalizes spacing, unicode minus and vector marks for formula entry', () => {
    expect(normalizeTextbookAnswer(' r₂ − r₁ ')).toBe(normalizeTextbookAnswer('r2-r1'))
    expect(isTextbookAnswerCorrect(formulaItem, 'r2 - r1')).toBe(true)
  })

  it('keeps first-try accuracy while allowing retry until correct', () => {
    let progress = answerTextbookItem(undefined, unit, firstItem, '変位', 1000)
    expect(progress.answers[firstItem.id].isFirstCorrect).toBe(false)
    expect(progress.answers[firstItem.id].resolved).toBe(false)

    progress = answerTextbookItem(progress, unit, firstItem, '位置ベクトル', 1500)
    expect(progress.answers[firstItem.id].isFirstCorrect).toBe(false)
    expect(progress.answers[firstItem.id].resolved).toBe(true)
    expect(progress.answers[firstItem.id].attemptCount).toBe(2)
    expect(textbookUnitProgress(unit, progress).completed).toBe(1)
  })
})
