import type { SimulationAnswer, SimulationSession } from './attempts'
import type { Question } from './questionSchema'
import { simulationDurationSeconds } from './scoring'

export function createSimulationSession(questions: Question[], timeMode: SimulationSession['timeMode'], now: number, sessionId: string): SimulationSession {
  if (!questions.length) throw new Error('模擬テストには少なくとも 1 問必要です')
  return {
    sessionId,
    questionIds: questions.map((question) => question.questionId),
    questionRevisions: Object.fromEntries(questions.map((question) => [question.questionId, question.revision])),
    questionTitles: Object.fromEntries(questions.map((question) => [question.questionId, question.title])),
    subject: questions[0].subject,
    timeMode,
    startedAt: now,
    durationSeconds: simulationDurationSeconds(questions, timeMode),
    currentQuestionIndex: 0,
    answers: {},
    timedOut: false,
  }
}

export function answerSimulationItem(session: SimulationSession, itemId: string, selectedOptionIds: string[], numericValue: number | undefined, now: number): SimulationSession {
  if (session.submittedAt) return session
  const previous = session.answers[itemId]
  const answer: SimulationAnswer = {
    itemId,
    selectedOptionIds: [...selectedOptionIds],
    ...(numericValue === undefined ? {} : { numericValue }),
    responseMs: Math.max(previous?.responseMs ?? 0, now - session.startedAt),
    markedForReview: previous?.markedForReview ?? false,
  }
  return { ...session, answers: { ...session.answers, [itemId]: answer } }
}

export function toggleSimulationReview(session: SimulationSession, itemId: string, now: number): SimulationSession {
  if (session.submittedAt) return session
  const previous = session.answers[itemId] ?? { itemId, selectedOptionIds: [], responseMs: Math.max(0, now - session.startedAt), markedForReview: false }
  return { ...session, answers: { ...session.answers, [itemId]: { ...previous, markedForReview: !previous.markedForReview } } }
}

export function setSimulationQuestion(session: SimulationSession, index: number): SimulationSession {
  if (session.submittedAt || index < 0 || index >= session.questionIds.length) return session
  return { ...session, currentQuestionIndex: index }
}
