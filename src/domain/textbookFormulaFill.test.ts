import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { fillResolvedMathHoles } from './textbookFormulaFill'

describe('textbook in-formula answer placement', () => {
  it('fills the original square instead of appending a separate answer', () => {
    const input = '-x^2y^2=\\square\\times x\\times x\\times y\\times y'
    const filled = fillResolvedMathHoles(input, ['math-revised-n01-question-01'], {
      'math-revised-n01-question-01': { value: '-1', resolved: true },
    })
    expect(filled).toBe('-x^2y^2=-1\\times x\\times x\\times y\\times y')
    expect(filled).not.toContain('\\square')
    expect(() => katex.renderToString(filled, { throwOnError: true })).not.toThrow()
  })

  it('fills two separate math holes in order and leaves an unanswered hole', () => {
    const input = 'a=\\square,\\ b=\\square'
    expect(fillResolvedMathHoles(input, ['one','two'], {
      one: { value: '2', resolved: true },
      two: { value: '3', resolved: false },
    })).toBe('a=2,\\ b=\\square')
    expect(fillResolvedMathHoles(input, ['one','two'], {
      one: { value: '2', resolved: true },
      two: { value: '3', resolved: true },
    })).toBe('a=2,\\ b=3')
  })

  it('supports underlined manuscript gaps and mathematical superscripts', () => {
    const filled = fillResolvedMathHoles('x=\\underline{\\quad}+\\square', ['one','two'], {
      one: { value: '5x²', resolved: true },
      two: { value: '2', resolved: true },
    })
    expect(filled).toBe('x=5x^{2}+2')
    expect(() => katex.renderToString(filled, { throwOnError: true })).not.toThrow()
  })

  it('preserves unchanged formulas and source holes when no answer was submitted', () => {
    expect(fillResolvedMathHoles('x=\\square', ['one'], undefined)).toBe('x=\\square')
    expect(fillResolvedMathHoles('x=4', [], undefined)).toBe('x=4')
  })
})
