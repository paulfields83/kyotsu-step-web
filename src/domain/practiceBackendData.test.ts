import { describe, expect, it } from 'vitest'
import { loadedPracticeUnits } from '../../backend/src/practiceData'
import { loadedPracticeSourceItems } from '../../backend/src/practiceSourceData'

describe('backend guided practice data', () => {
  it('publishes the full 集合と命題 guided bank', () => {
    const unit = loadedPracticeUnits.find(({ catalog }) => catalog.majorUnit.id === 'sets-and-logic')
    expect(unit).toBeTruthy()
    const questions = unit!.questions.filter((question) => question.status === 'published')
    expect(questions).toHaveLength(36)
    expect(questions.reduce((total, question) => total + question.blanks.length, 0)).toBeGreaterThanOrEqual(165)
    expect(questions.every((question) => question.blanks.every((blank) => blank.options.length === 4))).toBe(true)
    expect(new Set(questions.map((question) => question.questionId)).size).toBe(36)
  })

  it('overrides only the Q95/Q98 pilot with the restored guidance pattern', () => {
    const unit = loadedPracticeUnits.find(({ catalog }) => catalog.majorUnit.id === 'sets-and-logic')!
    const q95 = unit.questions.find((question) => question.questionId === 'math-i-4step-set-095')
    const q98 = unit.questions.find((question) => question.questionId === 'math-i-4step-set-098')

    expect(q95).toBeTruthy()
    expect(q98).toBeTruthy()
    expect(q95!.revision).toBe(2)
    expect(q98!.revision).toBe(2)

    expect(q95!.blanks).toHaveLength(14)
    expect(q98!.blanks).toHaveLength(4)

    expect(q95!.solutionSteps.map((step) => step.operation)).toEqual([
      '(1) 共通部分と和集合を分けて求める',
      '(2) 重なりの有無を確認してから統合する',
      '(3) 重なる区間と端点条件を読む',
      '(4) まずAとBを要素表示に直す',
      '(5) nを代入してAとBを具体化する',
    ])
    expect(q98!.solutionSteps[1].dependsOn).toEqual(['q98-f1'])
    expect(q98!.solutionSteps[2].basis).toContain('STEP2で確定したBだけ領域')
    expect(q98!.solutionSteps[4].purpose).toContain('再利用')

    for (const question of [q95!, q98!]) {
      expect(question.solutionSteps.every((step) => step.basis.length > 0)).toBe(true)
      expect(question.solutionSteps.every((step) => step.purpose.length > 0)).toBe(true)
      expect(question.solutionSteps.every((step) => step.operation.length > 0)).toBe(true)
    }
  })

  it('keeps the 36 source questions as the archival authoring layer', () => {
    expect(loadedPracticeSourceItems).toHaveLength(36)
    expect(new Set(loadedPracticeSourceItems.map((item) => item.sourceQuestionId)).size).toBe(36)
  })

  it('keeps guided dependencies and answer references valid', () => {
    const unit = loadedPracticeUnits.find(({ catalog }) => catalog.majorUnit.id === 'sets-and-logic')!
    for (const question of unit.questions) {
      const stepIds = new Set(question.solutionSteps.map((step) => step.id))
      const blankIds = new Set(question.blanks.map((blank) => blank.id))
      for (const step of question.solutionSteps) {
        for (const dependency of step.dependsOn) expect(stepIds.has(dependency)).toBe(true)
        for (const blankId of step.blankIds) expect(blankIds.has(blankId)).toBe(true)
      }
      for (const blank of question.blanks) {
        expect(stepIds.has(blank.stepId)).toBe(true)
        expect(blank.correctOptionIds).toHaveLength(1)
        expect(blank.options.some((option) => blank.correctOptionIds.includes(option.id))).toBe(true)
      }
    }
  })
})
