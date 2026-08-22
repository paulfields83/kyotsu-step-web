import { builtInQuestions } from '../data/questions'
import type { Question } from '../domain/questionSchema'
import type { QuestionFilter, QuestionRepository } from './questionRepository'

export class LocalQuestionRepository implements QuestionRepository {
  constructor(private readonly customQuestions: Question[] = []) {}

  async getQuestion(questionId: string) {
    return [...builtInQuestions, ...this.customQuestions].find((question) => question.questionId === questionId)
  }

  async listQuestions(filter: QuestionFilter = {}) {
    return [...builtInQuestions, ...this.customQuestions].filter((question) =>
      (!filter.subject || question.subject === filter.subject)
      && (!filter.difficulty || question.difficulty === filter.difficulty)
      && (!filter.knowledgeTag || question.taxonomy.knowledgeTags.includes(filter.knowledgeTag)),
    )
  }
}
