// Imported unchanged from rrikunagasige-dot/kyotsu-step-web at e4c4d3bda282523521d4f8f2d44a71aa277e82f7 (ZIP practice authority).
import type { LearningBlank } from '../../../src/domain/questionSchema'
import type { MathPracticeSectionId } from './catalog'

export type MathPracticeSourceBlock =
  | { type: 'text'; text: string }
  | { type: 'latex'; latex: string; display?: 'inline' | 'block' }

export type MathPracticeSourceChoice = {
  id: string
  label: string
  correct?: boolean
  wrongReason?: string
}

export type MathPracticeSourceBlank = {
  id: string
  prompt: string
  choices: MathPracticeSourceChoice[]
  skillTag: LearningBlank['skillTag']
  knowledgeTags: string[]
  explanation: string
}

export type MathPracticeGuideNode =
  | { type: 'content'; blocks: MathPracticeSourceBlock[] }
  | { type: 'blank'; blankId: string }

export type MathPracticeSimulationItem =
  | {
      id: string
      label: string
      prompt: string
      answerType: 'single-choice' | 'multi-choice'
      choices: MathPracticeSourceChoice[]
      score: number
      estimatedSeconds: number
      knowledgeTags: string[]
      skillTags: string[]
    }
  | {
      id: string
      label: string
      prompt: string
      answerType: 'number'
      correctValue: number
      tolerance?: number
      score: number
      estimatedSeconds: number
      knowledgeTags: string[]
      skillTags: string[]
    }

export type MathPracticeSourceQuestion = {
  problemNo: number
  section: MathPracticeSectionId
  sectionTitle: string
  title: string
  estimatedSeconds: number
  knowledgeTags: string[]
  skillTags: string[]
  problem: MathPracticeSourceBlock[]
  guide: MathPracticeGuideNode[]
  blanks: MathPracticeSourceBlank[]
  simulation: MathPracticeSimulationItem[]
  fullExplanation: string
}
