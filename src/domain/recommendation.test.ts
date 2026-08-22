import { describe, expect, it } from 'vitest'
import { builtInQuestions, getBuiltInQuestion } from '../data/questions'
import { scoreSimulation } from './scoring'
import { createSimulationSession } from './simulation'
import { generateReinforcement } from './recommendation'

describe('reinforcement rules', () => {
  it('recommends an existing related question and excludes recently used ids', () => {
    const source = getBuiltInQuestion('math-quadratic-01')!
    const session = { ...createSimulationSession([source], 'unlimited', 1000, 'sim-rec'), submittedAt: 2000, timedOut: false }
    const attempt = { ...session, submittedAt: 2000, result: scoreSimulation(session, [source]) }
    const recommendations = generateReinforcement(attempt, builtInQuestions)
    expect(recommendations[0]?.questionId).toBe('math-statistics-01')
    expect(builtInQuestions.some((question) => question.questionId === recommendations[0]?.questionId)).toBe(true)
    const afterRecentExclusion = generateReinforcement(attempt, builtInQuestions, ['math-statistics-01'])
    expect(afterRecentExclusion.some((item) => item.questionId === 'math-statistics-01')).toBe(false)
    expect(afterRecentExclusion.some((item) => attempt.questionIds.includes(item.questionId))).toBe(false)
  })
})
