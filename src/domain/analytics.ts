import type { LearningAttempt, LearningSession, SimulationAttempt } from './attempts'
import type { Question } from './questionSchema'

export type TagMetric = {
  tag: string
  dimension: 'knowledge' | 'skill'
  attempts: number
  correct: number
  accuracy: number
  averageResponseMs: number
  explanationRate: number
  repeatErrors: number
  mastery: number
}

export type AnalyticsSummary = {
  totalSessions: number
  learningSessions: number
  simulationSessions: number
  learningCompletionRate: number
  firstTryAccuracy: number
  simulationAccuracy: number
  averageResponseMs: number
  explanationRate: number
  totalStudySeconds: number
  knowledgeMetrics: TagMetric[]
  skillMetrics: TagMetric[]
}

export type MistakeStatus = 'reviewing' | 'similar-passed' | 'mastered'

export type MistakeRecord = {
  questionId: string
  questionTitle: string
  subject: Question['subject']
  wrongCount: number
  latestAt: number
  weakTags: string[]
  status: MistakeStatus
}

type Observation = {
  correct: boolean
  responseMs: number
  explanationOpened?: boolean
  sourceKey: string
}

type MetricBucket = {
  observations: Observation[]
  explanationEligible: number
}

const percent = (value: number, total: number) => total ? Math.round((value / total) * 100) : 0

function addObservation(map: Map<string, MetricBucket>, tag: string, observation: Observation, explanationEligible: boolean) {
  const bucket = map.get(tag) ?? { observations: [], explanationEligible: 0 }
  bucket.observations.push(observation)
  if (explanationEligible) bucket.explanationEligible += 1
  map.set(tag, bucket)
}

function materializeMetrics(map: Map<string, MetricBucket>, dimension: TagMetric['dimension']) {
  return [...map.entries()].map(([tag, bucket]) => {
    const correct = bucket.observations.filter((item) => item.correct).length
    const wrongBySource = new Map<string, number>()
    for (const item of bucket.observations.filter((item) => !item.correct)) wrongBySource.set(item.sourceKey, (wrongBySource.get(item.sourceKey) ?? 0) + 1)
    const repeatErrors = [...wrongBySource.values()].reduce((total, count) => total + Math.max(0, count - 1), 0)
    const accuracy = percent(correct, bucket.observations.length)
    const explanations = bucket.observations.filter((item) => item.explanationOpened).length
    return {
      tag,
      dimension,
      attempts: bucket.observations.length,
      correct,
      accuracy,
      averageResponseMs: Math.round(bucket.observations.reduce((total, item) => total + item.responseMs, 0) / bucket.observations.length),
      explanationRate: percent(explanations, bucket.explanationEligible),
      repeatErrors,
      mastery: Math.max(0, Math.min(100, accuracy - repeatErrors * 5)),
    }
  }).sort((left, right) => left.mastery - right.mastery || right.attempts - left.attempts || left.tag.localeCompare(right.tag))
}

export function buildAnalytics(
  learningSessions: Record<string, LearningSession>,
  learningAttempts: LearningAttempt[],
  simulationAttempts: SimulationAttempt[],
  catalog: Question[],
): AnalyticsSummary {
  const questionMap = new Map(catalog.map((question) => [question.questionId, question]))
  const knowledge = new Map<string, MetricBucket>()
  const skills = new Map<string, MetricBucket>()
  const allResponses: number[] = []
  let learningCorrect = 0
  let learningTotal = 0
  let explanations = 0
  let simulationCorrect = 0
  let simulationTotal = 0

  for (const attempt of learningAttempts) {
    const question = questionMap.get(attempt.questionId)
    if (!question) continue
    for (const answer of Object.values(attempt.answers)) {
      const blank = question.learning.blanks[answer.blankId]
      if (!blank) continue
      const observation = { correct: answer.isFirstCorrect, responseMs: answer.responseMs, explanationOpened: answer.explanationOpened, sourceKey: attempt.questionId }
      for (const tag of blank.knowledgeTags) addObservation(knowledge, tag, observation, true)
      addObservation(skills, blank.skillTag, observation, true)
      learningCorrect += Number(answer.isFirstCorrect)
      learningTotal += 1
      explanations += Number(answer.explanationOpened)
      allResponses.push(answer.responseMs)
    }
  }

  for (const attempt of simulationAttempts) {
    for (const item of attempt.result.items) {
      const answer = attempt.answers[item.itemId]
      const observation = { correct: item.isCorrect, responseMs: answer?.responseMs ?? 0, sourceKey: item.questionId }
      for (const tag of item.knowledgeTags) addObservation(knowledge, tag, observation, false)
      for (const tag of item.skillTags) addObservation(skills, tag, observation, false)
      simulationCorrect += Number(item.isCorrect)
      simulationTotal += 1
      if (answer) allResponses.push(answer.responseMs)
    }
  }

  const totalStudyMs = learningAttempts.reduce((total, attempt) => total + (attempt.completedAt - attempt.startedAt), 0)
    + simulationAttempts.reduce((total, attempt) => total + (attempt.submittedAt - attempt.startedAt), 0)
  const learningSessionCount = Object.keys(learningSessions).length
  return {
    totalSessions: learningAttempts.length + simulationAttempts.length,
    learningSessions: learningAttempts.length,
    simulationSessions: simulationAttempts.length,
    learningCompletionRate: percent(learningAttempts.length, learningSessionCount),
    firstTryAccuracy: percent(learningCorrect, learningTotal),
    simulationAccuracy: percent(simulationCorrect, simulationTotal),
    averageResponseMs: allResponses.length ? Math.round(allResponses.reduce((total, value) => total + value, 0) / allResponses.length) : 0,
    explanationRate: percent(explanations, learningTotal),
    totalStudySeconds: Math.max(0, Math.round(totalStudyMs / 1000)),
    knowledgeMetrics: materializeMetrics(knowledge, 'knowledge'),
    skillMetrics: materializeMetrics(skills, 'skill'),
  }
}

type PerformanceEvent = { at: number; correct: boolean; tags: string[] }

export function buildMistakeRecords(learningAttempts: LearningAttempt[], simulationAttempts: SimulationAttempt[], catalog: Question[]) {
  const eventMap = new Map<string, PerformanceEvent[]>()
  const addEvent = (questionId: string, event: PerformanceEvent) => eventMap.set(questionId, [...(eventMap.get(questionId) ?? []), event])
  for (const attempt of learningAttempts) {
    const question = catalog.find((item) => item.questionId === attempt.questionId)
    const answers = Object.values(attempt.answers)
    if (!question || !answers.length) continue
    const wrong = answers.filter((answer) => !answer.isFirstCorrect)
    addEvent(attempt.questionId, {
      at: attempt.completedAt,
      correct: wrong.length === 0,
      tags: wrong.flatMap((answer) => question.learning.blanks[answer.blankId]?.knowledgeTags ?? []),
    })
  }
  for (const attempt of simulationAttempts) {
    for (const questionId of attempt.questionIds) {
      const items = attempt.result.items.filter((item) => item.questionId === questionId)
      if (!items.length) continue
      const wrong = items.filter((item) => !item.isCorrect)
      addEvent(questionId, { at: attempt.submittedAt, correct: wrong.length === 0, tags: wrong.flatMap((item) => [...item.knowledgeTags, ...item.skillTags]) })
    }
  }
  const records: MistakeRecord[] = []
  for (const [questionId, unsortedEvents] of eventMap) {
    const events = [...unsortedEvents].sort((left, right) => left.at - right.at)
    const wrongEvents = events.filter((event) => !event.correct)
    if (!wrongEvents.length) continue
    const lastWrongIndex = events.map((event) => event.correct).lastIndexOf(false)
    const passesAfterWrong = events.slice(lastWrongIndex + 1).filter((event) => event.correct).length
    const question = catalog.find((item) => item.questionId === questionId)
    const learningSnapshot = learningAttempts.find((attempt) => attempt.questionId === questionId)
    const simulationSnapshot = simulationAttempts.find((attempt) => attempt.questionIds.includes(questionId))
    records.push({
      questionId,
      questionTitle: question?.title ?? learningSnapshot?.questionTitle ?? simulationSnapshot?.questionTitles[questionId] ?? questionId,
      subject: question?.subject ?? learningSnapshot?.subject ?? simulationSnapshot?.subject ?? 'math-1a',
      wrongCount: wrongEvents.length,
      latestAt: events.at(-1)?.at ?? 0,
      weakTags: [...new Set(wrongEvents.flatMap((event) => event.tags))],
      status: passesAfterWrong >= 2 ? 'mastered' : passesAfterWrong === 1 ? 'similar-passed' : 'reviewing',
    })
  }
  return records.sort((left, right) => right.latestAt - left.latestAt)
}
