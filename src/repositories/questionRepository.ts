import type { Question } from '../domain/questionSchema'

export type QuestionFilter = { subject?: Question['subject']; difficulty?: Question['difficulty']; knowledgeTag?: string }

export interface QuestionRepository {
  getQuestion(questionId: string): Promise<Question | undefined>
  listQuestions(filter?: QuestionFilter): Promise<Question[]>
}
