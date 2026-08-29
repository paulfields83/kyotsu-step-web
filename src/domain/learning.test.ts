import { describe, expect, it } from 'vitest'
import { getBuiltInQuestion } from '../data/questions'
import { activeBlankIds, answerLearningBlank, createLearningSession, isLearningAnswerResolved, recordExplanationOpen } from './learning'

const question = getBuiltInQuestion('math-quadratic-01')!

describe('learning state machine', () => {
  it('uses one common-test flow with three guide-density variants and a final choice', () => {
    expect(activeBlankIds(question, 'detailed')).toEqual(['mq-blank-sign', 'mq-blank-vertex', 'mq-blank-max', 'mq-final-choice'])
    expect(activeBlankIds(question, 'standard')).toEqual(['mq-blank-vertex', 'mq-blank-max', 'mq-final-choice'])
    expect(activeBlankIds(question, 'selfCheck')).toEqual(['mq-blank-max', 'mq-final-choice'])
  })

  it('preserves the first wrong answer and requires a correct retry before advancing', () => {
    const session = createLearningSession(question, 'detailed', 1000, 'learn-test')
    const correct = answerLearningBlank(session, question, 'mq-blank-sign', ['mq-sign-minus'], 1800)
    expect(correct.answers['mq-blank-sign'].isFirstCorrect).toBe(true)
    expect(correct.activeBlankId).toBe('mq-blank-vertex')

    const wrong = answerLearningBlank(correct, question, 'mq-blank-vertex', ['mq-vertex-minus-two'], 2400)
    expect(wrong.answers['mq-blank-vertex'].isFirstCorrect).toBe(false)
    expect(isLearningAnswerResolved(wrong.answers['mq-blank-vertex'])).toBe(false)
    expect(wrong.activeBlankId).toBe('mq-blank-vertex')

    const retried = answerLearningBlank(wrong, question, 'mq-blank-vertex', ['mq-vertex-two'], 2600)
    expect(retried.answers['mq-blank-vertex'].firstSelectedOptionIds).toEqual(['mq-vertex-minus-two'])
    expect(retried.answers['mq-blank-vertex'].attemptCount).toBe(2)
    expect(isLearningAnswerResolved(retried.answers['mq-blank-vertex'])).toBe(true)
    expect(retried.activeBlankId).toBe('mq-blank-max')
  })

  it('marks completion only after the final original-choice blank is resolved', () => {
    let session = createLearningSession(question, 'selfCheck', 1000, 'learn-self')
    session = answerLearningBlank(session, question, 'mq-blank-max', ['mq-max-five'], 1500)
    expect(session.completedAt).toBeUndefined()
    expect(session.activeBlankId).toBe('mq-final-choice')

    session = answerLearningBlank(session, question, 'mq-final-choice', ['mq-final-b'], 1800)
    expect(session.completedAt).toBeUndefined()
    expect(recordExplanationOpen(session, 'mq-final-choice').answers['mq-final-choice'].explanationOpened).toBe(true)

    session = answerLearningBlank(session, question, 'mq-final-choice', ['mq-final-a'], 2100)
    expect(session.completedAt).toBe(2100)
  })
})
