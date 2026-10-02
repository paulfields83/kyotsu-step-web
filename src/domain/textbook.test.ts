import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from '../data/textbookUnits'
import { answerTextbookItem, getTextbookChoices, isTextbookAnswerCorrect, normalizeTextbookAnswer, textbookUnitProgress } from './textbook'

const unit = builtInTextbookUnits[0]
const firstItem = unit.sections[0].items[0]
const formulaItem = unit.sections[0].items.find((item) => item.id === 'a-5')!

describe('textbook learning state', () => {
  it('normalizes spacing, unicode minus and vector marks for formula entry', () => {
    expect(normalizeTextbookAnswer(' r₂ − r₁ ')).toBe(normalizeTextbookAnswer('r2-r1'))
    expect(isTextbookAnswerCorrect(formulaItem, 'r2 - r1')).toBe(true)
  })

  it('builds stable multiple-choice options from answers in the same source unit', () => {
    const choices = getTextbookChoices(unit, firstItem)
    expect(choices).toContain('位置ベクトル')
    expect(choices.length).toBeGreaterThanOrEqual(3)
    expect(getTextbookChoices(unit, firstItem)).toEqual(choices)
  })

  it('keeps a wrong first choice unresolved and resolves after a correct retry', () => {
    const wrongProgress = answerTextbookItem(undefined, unit, firstItem, '変位', 1000)
    const wrongRecord = wrongProgress.answers[firstItem.id]

    expect(wrongRecord.isFirstCorrect).toBe(false)
    expect(wrongRecord.firstValue).toBe('変位')
    expect(wrongRecord.value).toBe('変位')
    expect(wrongRecord.resolved).toBe(false)
    expect(wrongRecord.attemptCount).toBe(1)
    expect(textbookUnitProgress(unit, wrongProgress).completed).toBe(0)

    const recovered = answerTextbookItem(wrongProgress, unit, firstItem, '位置ベクトル', 2000)
    const recoveredRecord = recovered.answers[firstItem.id]
    expect(recoveredRecord.isFirstCorrect).toBe(false)
    expect(recoveredRecord.firstValue).toBe('変位')
    expect(recoveredRecord.value).toBe('位置ベクトル')
    expect(recoveredRecord.resolved).toBe(true)
    expect(recoveredRecord.attemptCount).toBe(2)
    expect(textbookUnitProgress(unit, recovered).completed).toBe(1)
  })
})
