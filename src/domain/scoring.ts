import type { SimulationResult, SimulationSession } from './attempts'
import type { Question, SimulationItem } from './questionSchema'

function sameIds(left: string[], right: string[]) {
  return left.length === right.length && [...left].sort().every((value, index) => value === [...right].sort()[index])
}

export function isSimulationItemCorrect(item: SimulationItem, answer: SimulationSession['answers'][string] | undefined) {
  if (!answer) return false
  if (item.answerType === 'number') {
    if (answer.numericValue === undefined || item.correctValue === undefined) return false
    return Math.abs(answer.numericValue - item.correctValue) <= item.tolerance
  }
  return sameIds(answer.selectedOptionIds, item.correctOptionIds ?? [])
}

export function remainingSimulationSeconds(session: SimulationSession, now: number) {
  if (session.durationSeconds === null) return null
  const elapsed = Math.max(0, Math.floor((now - session.startedAt) / 1000))
  return Math.max(0, session.durationSeconds - elapsed)
}

export function simulationDurationSeconds(questions: Question[], timeMode: SimulationSession['timeMode']) {
  if (timeMode === 'unlimited') return null
  const base = questions.flatMap((question) => question.simulation.items).reduce((total, item) => total + item.estimatedSeconds, 0)
  return Math.max(30, Math.round(base * (timeMode === 'exam-1.2' ? 1.2 : 1)))
}

function classifyWrongItem(item: SimulationItem) {
  if (item.skillTags.includes('calculation')) return 'calculation-error'
  if (item.skillTags.includes('graph-reading')) return 'graph-reading-error'
  if (item.skillTags.some((tag) => ['law-selection', 'equation-building', 'conclusion'].includes(tag))) return 'method-error'
  return 'knowledge-error'
}

export function scoreSimulation(session: SimulationSession, questions: Question[]): SimulationResult {
  const scoredItems = questions.flatMap((question) => question.simulation.items.map((item) => {
    const answer = session.answers[item.id]
    const isUnanswered = !answer || (item.answerType === 'number' ? answer.numericValue === undefined : answer.selectedOptionIds.length === 0)
    const isCorrect = !isUnanswered && isSimulationItemCorrect(item, answer)
    return {
      itemId: item.id,
      questionId: question.questionId,
      isCorrect,
      isUnanswered,
      earnedScore: isCorrect ? item.score : 0,
      maxScore: item.score,
      knowledgeTags: item.knowledgeTags,
      skillTags: item.skillTags,
      selectedOptionIds: answer?.selectedOptionIds ?? [],
      ...(answer?.numericValue === undefined ? {} : { numericValue: answer.numericValue }),
    }
  }))
  const errorTypes = new Set<string>()
  if (session.timedOut) errorTypes.add('time-insufficient')
  if (scoredItems.some((item) => item.isUnanswered)) errorTypes.add('unanswered')
  for (const scored of scoredItems.filter((item) => !item.isCorrect && !item.isUnanswered)) {
    const item = questions.flatMap((question) => question.simulation.items).find((candidate) => candidate.id === scored.itemId)
    if (item) errorTypes.add(classifyWrongItem(item))
  }
  return {
    earnedScore: scoredItems.reduce((total, item) => total + item.earnedScore, 0),
    maxScore: scoredItems.reduce((total, item) => total + item.maxScore, 0),
    unansweredCount: scoredItems.filter((item) => item.isUnanswered).length,
    items: scoredItems,
    errorTypes: [...errorTypes],
  }
}
