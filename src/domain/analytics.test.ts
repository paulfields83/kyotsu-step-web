import { describe, expect, it } from 'vitest'
import { builtInQuestions } from '../data/questions'
import type { LearningAttempt, SimulationAttempt } from './attempts'
import { buildAnalytics, buildMistakeRecords } from './analytics'

const learning = (sessionId: string, correct: boolean, at: number): LearningAttempt => ({
  sessionId,
  questionId: 'math-quadratic-01',
  questionRevision: 1,
  questionTitle: '二次関数の最大値',
  subject: 'math-1a',
  variant: 'selfCheck',
  startedAt: at - 1000,
  completedAt: at,
  activeBlankId: null,
  answers: {
    'mq-blank-max': {
      blankId: 'mq-blank-max',
      firstSelectedOptionIds: [correct ? 'mq-max-five' : 'mq-max-one'],
      isFirstCorrect: correct,
      responseMs: 1000,
      answeredAt: at,
      explanationOpened: !correct,
      explanationReadMs: correct ? 0 : 400,
      revisitCount: 0,
    },
  },
})

const simulation: SimulationAttempt = {
  sessionId: 'sim-1',
  questionIds: ['math-quadratic-01'],
  questionRevisions: { 'math-quadratic-01': 1 },
  questionTitles: { 'math-quadratic-01': '二次関数の最大値' },
  subject: 'math-1a',
  timeMode: 'exam',
  startedAt: 2000,
  submittedAt: 4000,
  durationSeconds: 120,
  currentQuestionIndex: 0,
  timedOut: false,
  answers: { item: { itemId: 'item', selectedOptionIds: ['wrong'], responseMs: 1500, markedForReview: false } },
  result: {
    earnedScore: 0,
    maxScore: 3,
    unansweredCount: 0,
    errorTypes: ['method-error'],
    items: [{ itemId: 'item', questionId: 'math-quadratic-01', isCorrect: false, isUnanswered: false, earnedScore: 0, maxScore: 3, knowledgeTags: ['maximum'], skillTags: ['conclusion'], selectedOptionIds: ['wrong'] }],
  },
}

describe('analytics', () => {
  it('derives knowledge, behavior, response and explanation metrics from attempts', () => {
    const attempt = learning('learn-1', false, 1000)
    const summary = buildAnalytics({ [attempt.sessionId]: attempt }, [attempt], [simulation], builtInQuestions)
    expect(summary.totalSessions).toBe(2)
    expect(summary.firstTryAccuracy).toBe(0)
    expect(summary.simulationAccuracy).toBe(0)
    expect(summary.explanationRate).toBe(100)
    expect(summary.averageResponseMs).toBe(1250)
    expect(summary.knowledgeMetrics.find((metric) => metric.tag === 'maximum')).toMatchObject({ attempts: 2, correct: 0 })
  })

  it('advances mistake state only through later successful performance', () => {
    const wrong = learning('learn-wrong', false, 1000)
    expect(buildMistakeRecords([wrong], [], builtInQuestions)[0].status).toBe('reviewing')
    expect(buildMistakeRecords([wrong, learning('learn-pass-1', true, 2000)], [], builtInQuestions)[0].status).toBe('similar-passed')
    expect(buildMistakeRecords([wrong, learning('learn-pass-1', true, 2000), learning('learn-pass-2', true, 3000)], [], builtInQuestions)[0].status).toBe('mastered')
  })
})
