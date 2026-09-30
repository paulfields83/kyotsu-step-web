import type { PracticeQuestion } from './practiceSchema'

export function publicPracticeQuestion(question: PracticeQuestion) {
  return {
    ...question,
    blanks: question.blanks.map((blank) => ({
      id: blank.id,
      stepId: blank.stepId,
      prompt: blank.prompt,
      answerType: blank.answerType,
      options: blank.options.map(({ wrongReason: _wrongReason, ...option }) => option),
    })),
  }
}

export function publicPracticeSummary(question: PracticeQuestion) {
  return {
    questionId: question.questionId,
    revision: question.revision,
    subject: question.subject,
    course: question.course,
    majorUnit: question.majorUnit,
    subcategory: question.subcategory,
    problemType: question.problemType,
    title: question.title,
    difficulty: question.difficulty,
    source: question.source,
  }
}
