import { describe, expect, it } from 'vitest'
import { builtInQuestions } from './questions'

describe('built-in content coverage', () => {
  it('contains two math and two physics questions', () => {
    expect(builtInQuestions.filter((question) => question.subject === 'math-1a')).toHaveLength(2)
    expect(builtInQuestions.filter((question) => question.subject === 'physics')).toHaveLength(2)
  })

  it('covers images, tables, long Japanese text and five blanks', () => {
    expect(builtInQuestions.some((question) => question.assets.length > 0)).toBe(true)
    expect(builtInQuestions.some((question) => question.stem.some((block) => block.type === 'table'))).toBe(true)
    expect(builtInQuestions.some((question) => question.stem.some((block) => block.type === 'text' && block.text.length > 120))).toBe(true)
    expect(builtInQuestions.some((question) => Object.keys(question.learning.blanks).length >= 5)).toBe(true)
  })

  it('uses stable option ids independent from array positions', () => {
    for (const question of builtInQuestions) {
      for (const blank of Object.values(question.learning.blanks)) {
        expect(blank.correctOptionIds.every((id) => blank.options.some((option) => option.id === id))).toBe(true)
      }
    }
  })
})
