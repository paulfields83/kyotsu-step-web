import type { PracticeQuestion } from './practiceSchema'

function normalizeLatex(value: string) {
  const slash = String.fromCharCode(92)
  return value.split(slash + slash).join(slash)
}

function publicContentBlocks(blocks: PracticeQuestion['stem']) {
  return blocks.map((block) => block.type === 'latex'
    ? { ...block, latex: normalizeLatex(block.latex) }
    : block)
}

export function publicPracticeQuestion(question: PracticeQuestion) {
  return {
    ...question,
    stem: publicContentBlocks(question.stem),
    solutionSteps: question.solutionSteps.map((step) => ({
      ...step,
      content: publicContentBlocks(step.content),
    })),
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
