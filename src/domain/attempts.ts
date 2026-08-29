import type { LearningVariant, Question } from './questionSchema'

export type LearningBlankAnswer = {
  blankId: string
  firstSelectedOptionIds: string[]
  isFirstCorrect: boolean
  responseMs: number
  answeredAt: number
  explanationOpened: boolean
  explanationReadMs: number
  revisitCount: number
  resolved?: boolean
  attemptCount?: number
  lastSelectedOptionIds?: string[]
}

export type LearningSession = {
  sessionId: string
  questionId: string
  questionRevision: number
  questionTitle: string
  subject: Question['subject']
  variant: LearningVariant
  startedAt: number
  activeBlankId: string | null
  answers: Record<string, LearningBlankAnswer>
  completedAt?: number
}

export type LearningAttempt = LearningSession & { completedAt: number }

export type SimulationAnswer = {
  itemId: string
  selectedOptionIds: string[]
  numericValue?: number
  responseMs: number
  markedForReview: boolean
}

export type SimulationSession = {
  sessionId: string
  questionIds: string[]
  questionRevisions: Record<string, number>
  questionTitles: Record<string, string>
  subject: Question['subject']
  timeMode: 'unlimited' | 'exam-1.2' | 'exam'
  startedAt: number
  durationSeconds: number | null
  currentQuestionIndex: number
  answers: Record<string, SimulationAnswer>
  submittedAt?: number
  timedOut: boolean
}

export type ScoredSimulationItem = {
  itemId: string
  questionId: string
  isCorrect: boolean
  isUnanswered: boolean
  earnedScore: number
  maxScore: number
  knowledgeTags: string[]
  skillTags: string[]
  selectedOptionIds: string[]
  numericValue?: number
}

export type SimulationResult = {
  earnedScore: number
  maxScore: number
  unansweredCount: number
  items: ScoredSimulationItem[]
  errorTypes: string[]
}

export type SimulationAttempt = SimulationSession & { submittedAt: number; result: SimulationResult }
