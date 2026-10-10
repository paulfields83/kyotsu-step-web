import type { PracticeResolvedAnswer, PublicPracticeQuestion, PublicPracticeStep } from './practice'

export function isPracticeStepResolved(step: PublicPracticeStep, answers: Record<string, PracticeResolvedAnswer | undefined>) {
  return step.blankIds.every((blankId) => answers[blankId]?.resolved)
}

export function resolvedPracticeStepIds(
  question: PublicPracticeQuestion,
  answers: Record<string, PracticeResolvedAnswer | undefined>,
) {
  return new Set(
    question.solutionSteps
      .filter((step) => isPracticeStepResolved(step, answers))
      .map((step) => step.id),
  )
}

export function isPracticeStepAvailable(
  step: PublicPracticeStep,
  resolvedStepIds: Set<string>,
) {
  return step.dependsOn.every((dependency) => resolvedStepIds.has(dependency))
}

export function visiblePracticeBlankIds(
  step: PublicPracticeStep,
  answers: Record<string, PracticeResolvedAnswer | undefined>,
) {
  const firstUnresolvedIndex = step.blankIds.findIndex((blankId) => !answers[blankId]?.resolved)
  if (firstUnresolvedIndex < 0) return step.blankIds
  return step.blankIds.slice(0, firstUnresolvedIndex + 1)
}

export function practiceCompleted(
  question: PublicPracticeQuestion,
  answers: Record<string, PracticeResolvedAnswer | undefined>,
) {
  return question.blanks.length > 0 && question.blanks.every((blank) => answers[blank.id]?.resolved)
}

export function dependencyResultLabels(
  question: PublicPracticeQuestion,
  step: PublicPracticeStep,
  answers: Record<string, PracticeResolvedAnswer | undefined>,
) {
  const stepById = new Map(question.solutionSteps.map((candidate) => [candidate.id, candidate]))
  return step.dependsOn.flatMap((dependencyId) => {
    const dependency = stepById.get(dependencyId)
    if (!dependency) return []
    return dependency.blankIds.flatMap((blankId) => {
      const answer = answers[blankId]
      return answer?.resolved ? [answer.selectedLabel] : []
    })
  })
}
