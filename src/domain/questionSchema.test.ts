import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { builtInQuestions } from '../data/questions'
import { formatQuestionIssues, validateQuestionCatalog } from './questionSchema'

describe('question catalog schema', () => {
  it('accepts the four built-in versioned questions', () => {
    expect(builtInQuestions).toHaveLength(4)
    expect(new Set(builtInQuestions.map((question) => question.questionId)).size).toBe(4)
  })

  it('reports a precise path for a missing correct option', () => {
    const invalid = structuredClone(builtInQuestions)
    invalid[0].learning.blanks['mq-blank-sign'].correctOptionIds = ['missing-option']
    expect(() => validateQuestionCatalog(invalid)).toThrow(z.ZodError)
    try { validateQuestionCatalog(invalid) } catch (error) {
      const issues = formatQuestionIssues(error as z.ZodError)
      expect(issues.join('\n')).toContain('learning.blanks.mq-blank-sign.correctOptionIds')
      expect(issues.join('\n')).toContain('missing-option')
    }
  })

  it('rejects missing image and related question references', () => {
    const invalid = structuredClone(builtInQuestions)
    invalid[2].assets = []
    invalid[2].relatedQuestions.reinforcement = ['missing-question']
    expect(() => validateQuestionCatalog(invalid)).toThrow(/存在しない画像参照/)
    expect(() => validateQuestionCatalog(invalid)).toThrow(/存在しない関連問題/)
  })
})
