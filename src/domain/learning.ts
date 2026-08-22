import type { LearningAttempt, LearningBlankAnswer, LearningSession } from './attempts'
import type { LearningVariant, Question } from './questionSchema'

export function activeBlankIds(question: Question, variant: LearningVariant): string[] {
  const enabled = new Set(question.learning.variants[variant])
  return question.learning.solutionFlow
    .filter((block): block is Extract<Question['learning']['solutionFlow'][number], { type: 'blank' }> => block.type === 'blank')
    .map((block) => block.blankId)
    .filter((blankId) => enabled.has(blankId))
}

export function createLearningSession(question: Question, variant: LearningVariant, now: number, sessionId: string): LearningSession {
  const blankIds = activeBlankIds(question, variant)
  return {
    sessionId,
    questionId: question.questionId,
    questionRevision: question.revision,
    questionTitle: question.title,
    subject: question.subject,
    variant,
    startedAt: now,
    activeBlankId: blankIds[0] ?? null,
    answers: {},
  }
}

function sameAnswer(left: string[], right: string[]) {
  if (left.length !== right.length) return false
  const expected = [...right].sort()
  return [...left].sort().every((value, index) => value === expected[index])
}

export function answerLearningBlank(session: LearningSession, question: Question, blankId: string, selectedOptionIds: string[], now: number): LearningSession {
  if (session.completedAt || session.answers[blankId]) return session
  const enabledBlankIds = activeBlankIds(question, session.variant)
  if (!enabledBlankIds.includes(blankId)) return session
  const blank = question.learning.blanks[blankId]
  if (!blank || selectedOptionIds.some((id) => !blank.options.some((option) => option.id === id))) return session

  const answer: LearningBlankAnswer = {
    blankId,
    firstSelectedOptionIds: [...selectedOptionIds],
    isFirstCorrect: sameAnswer(selectedOptionIds, blank.correctOptionIds),
    responseMs: Math.max(0, now - session.startedAt),
    answeredAt: now,
    explanationOpened: false,
    explanationReadMs: 0,
    revisitCount: 0,
  }
  const answers = { ...session.answers, [blankId]: answer }
  const nextBlankId = enabledBlankIds.find((id) => !answers[id]) ?? null
  return { ...session, answers, activeBlankId: nextBlankId, ...(nextBlankId ? {} : { completedAt: now }) }
}

export function activateLearningBlank(session: LearningSession, question: Question, blankId: string): LearningSession {
  if (session.completedAt || session.answers[blankId] || !activeBlankIds(question, session.variant).includes(blankId)) return session
  return { ...session, activeBlankId: blankId }
}

export function recordExplanationOpen(session: LearningSession, blankId: string): LearningSession {
  const answer = session.answers[blankId]
  if (!answer || answer.isFirstCorrect) return session
  return { ...session, answers: { ...session.answers, [blankId]: { ...answer, explanationOpened: true } } }
}

export function recordExplanationRead(session: LearningSession, blankId: string, readMs: number): LearningSession {
  const answer = session.answers[blankId]
  if (!answer) return session
  return { ...session, answers: { ...session.answers, [blankId]: { ...answer, explanationReadMs: answer.explanationReadMs + Math.max(0, readMs) } } }
}

export function revisitLearningBlank(session: LearningSession, blankId: string): LearningSession {
  const answer = session.answers[blankId]
  if (!answer) return session
  return { ...session, answers: { ...session.answers, [blankId]: { ...answer, revisitCount: answer.revisitCount + 1 } } }
}

export function toLearningAttempt(session: LearningSession): LearningAttempt | undefined {
  if (!session.completedAt) return undefined
  return { ...session, completedAt: session.completedAt }
}
