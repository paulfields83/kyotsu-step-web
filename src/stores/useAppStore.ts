import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { builtInQuestions, getBuiltInQuestion } from '../data/questions'
import { builtInQuestionsZh } from '../data/questions.zh'
import type { LearningAttempt, LearningSession, SimulationAttempt, SimulationSession } from '../domain/attempts'
import { activateLearningBlank, answerLearningBlank, createLearningSession, recordExplanationOpen, recordExplanationRead, revisitLearningBlank, toLearningAttempt } from '../domain/learning'
import type { LearningVariant, Question } from '../domain/questionSchema'
import { answerTextbookItem, type TextbookUnitProgress } from '../domain/textbook'
import type { TextbookUnit } from '../domain/textbookSchema'
import { scoreSimulation } from '../domain/scoring'
import { answerSimulationItem, createSimulationSession, setSimulationQuestion, toggleSimulationReview } from '../domain/simulation'
import type { AppLanguage } from '../i18n/types'

export type UserSettings = {
  displayName: string
  defaultSubject: Question['subject']
  reduceMotion: boolean
  showTimer: boolean
  language: AppLanguage
}

type AppState = {
  learningSessions: Record<string, LearningSession>
  learningAttempts: LearningAttempt[]
  simulationSessions: Record<string, SimulationSession>
  simulationAttempts: SimulationAttempt[]
  textbookProgress: Record<string, TextbookUnitProgress>
  customQuestions: Question[]
  settings: UserSettings
  startLearning: (questionId: string, variant: LearningVariant) => string
  answerLearning: (sessionId: string, blankId: string, selectedOptionIds: string[]) => void
  activateLearning: (sessionId: string, blankId: string) => void
  openLearningExplanation: (sessionId: string, blankId: string) => void
  closeLearningExplanation: (sessionId: string, blankId: string, readMs: number) => void
  revisitLearning: (sessionId: string, blankId: string) => void
  answerTextbook: (unit: TextbookUnit, itemId: string, value: string) => void
  resetTextbookUnit: (unitId: string) => void
  startSimulation: (questionIds: string[], timeMode: SimulationSession['timeMode']) => string
  answerSimulation: (sessionId: string, itemId: string, selectedOptionIds: string[], numericValue?: number) => void
  toggleSimulationReview: (sessionId: string, itemId: string) => void
  goToSimulationQuestion: (sessionId: string, index: number) => void
  submitSimulation: (sessionId: string, timedOut?: boolean) => void
  setCustomQuestions: (questions: Question[]) => void
  setSettings: (settings: Partial<UserSettings>) => void
  resetProgress: () => void
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function findQuestion(state: Pick<AppState, 'customQuestions'>, questionId: string) {
  return state.customQuestions.find((question) => question.questionId === questionId) ?? getBuiltInQuestion(questionId)
}

export const useAppStore = create<AppState>()(persist((set, get) => ({
  learningSessions: {},
  learningAttempts: [],
  simulationSessions: {},
  simulationAttempts: [],
  textbookProgress: {},
  customQuestions: [],
  settings: { displayName: '学習者', defaultSubject: 'math-1a', reduceMotion: false, showTimer: true, language: 'ja' },
  startLearning: (questionId, variant) => {
    const question = findQuestion(get(), questionId) ?? builtInQuestions[0]
    const sessionId = makeId('learn')
    const session = createLearningSession(question, variant, Date.now(), sessionId)
    set((state) => ({ learningSessions: { ...state.learningSessions, [sessionId]: session } }))
    return sessionId
  },
  answerLearning: (sessionId, blankId, selectedOptionIds) => set((state) => {
    const session = state.learningSessions[sessionId]
    const question = session ? findQuestion(state, session.questionId) : undefined
    if (!session || !question) return state
    const updated = answerLearningBlank(session, question, blankId, selectedOptionIds, Date.now())
    if (updated === session) return state
    const attempt = toLearningAttempt(updated)
    const alreadySaved = state.learningAttempts.some((candidate) => candidate.sessionId === sessionId)
    return {
      learningSessions: { ...state.learningSessions, [sessionId]: updated },
      learningAttempts: attempt && !alreadySaved ? [...state.learningAttempts, attempt] : state.learningAttempts,
    }
  }),
  activateLearning: (sessionId, blankId) => set((state) => {
    const session = state.learningSessions[sessionId]
    const question = session ? findQuestion(state, session.questionId) : undefined
    if (!session || !question) return state
    return { learningSessions: { ...state.learningSessions, [sessionId]: activateLearningBlank(session, question, blankId) } }
  }),
  openLearningExplanation: (sessionId, blankId) => set((state) => {
    const session = state.learningSessions[sessionId]
    if (!session) return state
    return { learningSessions: { ...state.learningSessions, [sessionId]: recordExplanationOpen(session, blankId) } }
  }),
  closeLearningExplanation: (sessionId, blankId, readMs) => set((state) => {
    const session = state.learningSessions[sessionId]
    if (!session) return state
    return { learningSessions: { ...state.learningSessions, [sessionId]: recordExplanationRead(session, blankId, readMs) } }
  }),
  revisitLearning: (sessionId, blankId) => set((state) => {
    const session = state.learningSessions[sessionId]
    if (!session) return state
    return { learningSessions: { ...state.learningSessions, [sessionId]: revisitLearningBlank(session, blankId) } }
  }),
  answerTextbook: (unit, itemId, value) => set((state) => {
    const item = unit.sections.flatMap((section) => section.items).find((candidate) => candidate.id === itemId)
    if (!item) return state
    const updated = answerTextbookItem(state.textbookProgress[unit.unitId], unit, item, value, Date.now())
    return { textbookProgress: { ...state.textbookProgress, [unit.unitId]: updated } }
  }),
  resetTextbookUnit: (unitId) => set((state) => {
    const next = { ...state.textbookProgress }
    delete next[unitId]
    return { textbookProgress: next }
  }),
  startSimulation: (questionIds, timeMode) => {
    const state = get()
    const questions = questionIds.map((id) => findQuestion(state, id)).filter((question): question is Question => Boolean(question))
    if (!questions.length) throw new Error('選択した問題が見つかりません')
    const sessionId = makeId('sim')
    const session = createSimulationSession(questions, timeMode, Date.now(), sessionId)
    set((current) => ({ simulationSessions: { ...current.simulationSessions, [sessionId]: session } }))
    return sessionId
  },
  answerSimulation: (sessionId, itemId, selectedOptionIds, numericValue) => set((state) => {
    const session = state.simulationSessions[sessionId]
    if (!session) return state
    return { simulationSessions: { ...state.simulationSessions, [sessionId]: answerSimulationItem(session, itemId, selectedOptionIds, numericValue, Date.now()) } }
  }),
  toggleSimulationReview: (sessionId, itemId) => set((state) => {
    const session = state.simulationSessions[sessionId]
    if (!session) return state
    return { simulationSessions: { ...state.simulationSessions, [sessionId]: toggleSimulationReview(session, itemId, Date.now()) } }
  }),
  goToSimulationQuestion: (sessionId, index) => set((state) => {
    const session = state.simulationSessions[sessionId]
    if (!session) return state
    return { simulationSessions: { ...state.simulationSessions, [sessionId]: setSimulationQuestion(session, index) } }
  }),
  submitSimulation: (sessionId, timedOut = false) => set((state) => {
    const session = state.simulationSessions[sessionId]
    if (!session || session.submittedAt) return state
    const questions = session.questionIds.map((id) => findQuestion(state, id)).filter((question): question is Question => Boolean(question))
    if (questions.length !== session.questionIds.length) return state
    const submittedAt = Date.now()
    const submittedSession = { ...session, submittedAt, timedOut }
    const attempt: SimulationAttempt = { ...submittedSession, submittedAt, result: scoreSimulation(submittedSession, questions) }
    return {
      simulationSessions: { ...state.simulationSessions, [sessionId]: submittedSession },
      simulationAttempts: [...state.simulationAttempts, attempt],
    }
  }),
  setCustomQuestions: (questions) => set({ customQuestions: questions }),
  setSettings: (partial) => set((state) => ({ settings: { ...state.settings, ...partial } })),
  resetProgress: () => set({ learningSessions: {}, learningAttempts: [], simulationSessions: {}, simulationAttempts: [], textbookProgress: {} }),
}), {
  name: 'kyotsu-step-store',
  version: 1,
  partialize: (state) => ({
    learningSessions: state.learningSessions,
    learningAttempts: state.learningAttempts,
    simulationSessions: state.simulationSessions,
    simulationAttempts: state.simulationAttempts,
    textbookProgress: state.textbookProgress,
    customQuestions: state.customQuestions,
    settings: state.settings,
  }),
  merge: (persistedState, currentState) => {
    const persisted = persistedState as Partial<AppState>
    return {
      ...currentState,
      ...persisted,
      settings: { ...currentState.settings, ...persisted.settings },
    }
  },
}))

export function getQuestionCatalog(customQuestions: Question[] = [], language: AppLanguage = 'ja') {
  return [...(language === 'zh' ? builtInQuestionsZh : builtInQuestions), ...customQuestions]
}
