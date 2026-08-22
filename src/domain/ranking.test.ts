import { describe, expect, it } from 'vitest'
import type { LearningAttempt } from './attempts'
import { buildLocalRanking, localPerformancePoints } from './ranking'

const attempt: LearningAttempt = {
  sessionId: 'learn-1', questionId: 'q', questionRevision: 1, questionTitle: '問題', subject: 'math-1a', variant: 'selfCheck', startedAt: 0, completedAt: 10, activeBlankId: null,
  answers: { b: { blankId: 'b', firstSelectedOptionIds: ['a'], isFirstCorrect: true, responseMs: 10, answeredAt: 10, explanationOpened: false, explanationReadMs: 0, revisitCount: 0 } },
}

describe('local demo ranking', () => {
  it('calculates the current user from real attempts and keeps demo peers labeled', () => {
    expect(localPerformancePoints([attempt], [])).toBe(10)
    const ranking = buildLocalRanking('私', [attempt], [])
    expect(ranking.find((entry) => entry.isCurrentUser)).toMatchObject({ name: '私', points: 10 })
    expect(ranking.filter((entry) => !entry.isCurrentUser).every((entry) => entry.name.startsWith('演示'))).toBe(true)
  })
})
