import { describe, expect, it } from 'vitest'
import { loadedPracticeUnits } from '../../backend/src/practiceData'
import { loadedPracticeSourceItems } from '../../backend/src/practiceSourceData'

describe('backend guided practice data', () => {
  it('publishes the full 集合と命題 guided bank', () => {
    const unit = loadedPracticeUnits.find(({ catalog }) => catalog.majorUnit.id === 'sets-and-logic')
    expect(unit).toBeTruthy()
    const questions = unit!.questions.filter((question) => question.status === 'published')
    expect(questions).toHaveLength(36)
    expect(questions.reduce((total, question) => total + question.blanks.length, 0)).toBe(165)
    expect(questions.every((question) => question.blanks.every((blank) => blank.options.length === 4))).toBe(true)
    expect(new Set(questions.map((question) => question.questionId)).size).toBe(36)
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
