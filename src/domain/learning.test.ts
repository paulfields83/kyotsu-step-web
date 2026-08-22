import { describe, expect, it } from 'vitest'
import { getBuiltInQuestion } from '../data/questions'
import { activeBlankIds, answerLearningBlank, createLearningSession, recordExplanationOpen } from './learning'

const question = getBuiltInQuestion('math-quadratic-01')!

describe('learning state machine', () => {
  it('uses the same flow with three blank-density variants', () => {
    expect(activeBlankIds(question, 'detailed')).toEqual(['mq-blank-sign', 'mq-blank-vertex', 'mq-blank-max'])
    expect(activeBlankIds(question, 'standard')).toEqual(['mq-blank-vertex', 'mq-blank-max'])
    expect(activeBlankIds(question, 'selfCheck')).toEqual(['mq-blank-max'])
  })

  it('records the first answer once and advances after a wrong answer', () => {
    const session = createLearningSession(question, 'detailed', 1000, 'learn-test')
    const correct = answerLearningBlank(session, question, 'mq-blank-sign', ['mq-sign-minus'], 1800)
    expect(correct.answers['mq-blank-sign'].isFirstCorrect).toBe(true)
    expect(correct.activeBlankId).toBe('mq-blank-vertex')

    const wrong = answerLearningBlank(correct, question, 'mq-blank-vertex', ['mq-vertex-minus-two'], 2400)
    expect(wrong.answers['mq-blank-vertex'].isFirstCorrect).toBe(false)
    expect(wrong.activeBlankId).toBe('mq-blank-max')

    const ignoredSecondAnswer = answerLearningBlank(wrong, question, 'mq-blank-vertex', ['mq-vertex-two'], 2600)
    expect(ignoredSecondAnswer).toBe(wrong)
    expect(ignoredSecondAnswer.answers['mq-blank-vertex'].firstSelectedOptionIds).toEqual(['mq-vertex-minus-two'])
  })

  it('marks completion only after every active blank and records explanation use', () => {
    let session = createLearningSession(question, 'selfCheck', 1000, 'learn-self')
    session = answerLearningBlank(session, question, 'mq-blank-max', ['mq-max-one'], 1500)
    expect(session.completedAt).toBe(1500)
    expect(recordExplanationOpen(session, 'mq-blank-max').answers['mq-blank-max'].explanationOpened).toBe(true)
  })
})
