import type { ContentBlock } from './questionSchema'

export type PracticeProblemType = {
  id: string
  label: string
  order: number
  questionCount: number
}

export type PracticeSubcategory = {
  id: string
  label: string
  order: number
  questionCount: number
  problemTypes: PracticeProblemType[]
}

export type PracticeCatalog = {
  schemaVersion: '1.0'
  subject: 'math-1a'
  course: 'math-i'
  majorUnit: { id: string; label: string; order: number }
  subcategories: PracticeSubcategory[]
}

export type PracticeQuestionSummary = {
  questionId: string
  revision: number
  subject: 'math-1a'
  course: 'math-i'
  majorUnit: string
  subcategory: string
  problemType: string
  title: string
  difficulty: 'basic' | 'standard' | 'advanced'
  source: { type: 'original' | 'reference' | 'licensed'; label: string; rightsNote?: string }
}

export type PublicPracticeOption = {
  id: string
  label: string
}

export type PublicPracticeBlank = {
  id: string
  stepId: string
  prompt: string
  answerType: 'single-choice'
  options: PublicPracticeOption[]
}

export type PublicPracticeStep = {
  id: string
  dependsOn: string[]
  basis: string[]
  purpose: string
  operation: string
  content: ContentBlock[]
  blankIds: string[]
}

export type PublicPracticeQuestion = PracticeQuestionSummary & {
  schemaVersion: '1.0'
  status: 'draft' | 'review' | 'published'
  stem: ContentBlock[]
  solutionSteps: PublicPracticeStep[]
  blanks: PublicPracticeBlank[]
  interaction: {
    reveal: 'sequential'
    options: 'inline-expand'
    substituteCorrectAnswer: true
    lockFutureSteps: true
  }
}

export type PracticeAnswerResult = {
  correct: boolean
  resolved: boolean
  selectedOptionIds: string[]
  correctOptionIds?: string[]
  explanation?: string
  wrongReason?: string
}
