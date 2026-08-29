import { describe, expect, it } from 'vitest'
import { builtInQuestions } from './questions'

describe('built-in content coverage', () => {
  it('contains two math and three physics golden samples', () => {
    expect(builtInQuestions.filter((question) => question.subject === 'math-1a')).toHaveLength(2)
    expect(builtInQuestions.filter((question) => question.subject === 'physics')).toHaveLength(3)
  })

  it('covers common-test narrative, images, tables and all three physics flow types', () => {
    expect(builtInQuestions.every((question) => question.learning.presentation === 'common-test')).toBe(true)
    expect(builtInQuestions.some((question) => question.assets.length > 0)).toBe(true)
    expect(builtInQuestions.some((question) => question.stem.some((block) => block.type === 'table'))).toBe(true)
    expect(builtInQuestions.some((question) => question.learning.solutionFlow.some((block) => block.type === 'content' && block.content.some((content) => content.type === 'text' && Boolean(content.speaker))))).toBe(true)

    const physicsTypes = new Set(
      builtInQuestions
        .filter((question) => question.subject === 'physics')
        .map((question) => question.learning.flowType),
    )
    expect(physicsTypes).toEqual(new Set(['phenomenon-analysis', 'calculation-derivation', 'relation-analysis']))
  })

  it('keeps the original final choice separate from the guide flow', () => {
    for (const question of builtInQuestions) {
      const finalBlankId = question.learning.finalBlankId
      expect(finalBlankId).toBeTruthy()
      expect(question.learning.solutionFlow.some((block) => block.type === 'blank' && block.blankId === finalBlankId)).toBe(false)
      expect(Object.values(question.learning.variants).every((ids) => finalBlankId ? ids.includes(finalBlankId) : false)).toBe(true)
    }
  })

  it('uses stable option ids independent from array positions', () => {
    for (const question of builtInQuestions) {
      for (const blank of Object.values(question.learning.blanks)) {
        expect(blank.correctOptionIds.every((id) => blank.options.some((option) => option.id === id))).toBe(true)
      }
    }
  })
})
