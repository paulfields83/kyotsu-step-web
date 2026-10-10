import { describe, expect, it } from 'vitest'
import type { PracticeResolvedAnswer, PublicPracticeQuestion } from './practice'
import { dependencyResultLabels, isPracticeStepAvailable, practiceCompleted, resolvedPracticeStepIds, visiblePracticeBlankIds } from './practiceFlow'

const question = {
  questionId: 'pilot-q',
  blanks: [
    { id: 'b1', stepId: 's1' },
    { id: 'b2', stepId: 's1' },
    { id: 'b3', stepId: 's2' },
  ],
  solutionSteps: [
    { id: 's1', dependsOn: [], blankIds: ['b1', 'b2'] },
    { id: 's2', dependsOn: ['s1'], blankIds: ['b3'] },
  ],
} as unknown as PublicPracticeQuestion

function answer(label: string): PracticeResolvedAnswer {
  return {
    correct: true,
    resolved: true,
    selectedOptionIds: ['x'],
    selectedLabel: label,
  }
}

describe('practice dependency flow', () => {
  it('reveals only the first unresolved blank within a step', () => {
    expect(visiblePracticeBlankIds(question.solutionSteps[0], {})).toEqual(['b1'])
    expect(visiblePracticeBlankIds(question.solutionSteps[0], { b1: answer('A') })).toEqual(['b1', 'b2'])
  })

  it('unlocks dependent steps only after all dependency blanks resolve', () => {
    let answers: Record<string, PracticeResolvedAnswer | undefined> = {}
    expect(isPracticeStepAvailable(question.solutionSteps[1], resolvedPracticeStepIds(question, answers))).toBe(false)

    answers = { b1: answer('A') }
    expect(isPracticeStepAvailable(question.solutionSteps[1], resolvedPracticeStepIds(question, answers))).toBe(false)

    answers = { b1: answer('A'), b2: answer('B') }
    expect(isPracticeStepAvailable(question.solutionSteps[1], resolvedPracticeStepIds(question, answers))).toBe(true)
    expect(dependencyResultLabels(question, question.solutionSteps[1], answers)).toEqual(['A', 'B'])
  })

  it('marks the question complete only after every blank resolves', () => {
    expect(practiceCompleted(question, { b1: answer('A'), b2: answer('B') })).toBe(false)
    expect(practiceCompleted(question, { b1: answer('A'), b2: answer('B'), b3: answer('C') })).toBe(true)
  })
})
