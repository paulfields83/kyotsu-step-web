import { describe, expect, it } from 'vitest'
import { builtInQuestions } from './questions'
import { builtInQuestionsZh } from './questions.zh'
import { getQuestionCatalog } from '../stores/useAppStore'

function gradingSignature(question: (typeof builtInQuestions)[number]) {
  return {
    questionId: question.questionId,
    revision: question.revision,
    subject: question.subject,
    status: question.status,
    taxonomy: question.taxonomy,
    difficulty: question.difficulty,
    assets: question.assets.map(({ id, type, src }) => ({ id, type, src })),
    variants: question.learning.variants,
    blanks: Object.values(question.learning.blanks).map((blank) => ({
      id: blank.id,
      answerType: blank.answerType,
      optionIds: blank.options.map((option) => option.id),
      correctOptionIds: blank.correctOptionIds,
      knowledgeTags: blank.knowledgeTags,
      skillTag: blank.skillTag,
      shortPracticeQuestionId: blank.shortPracticeQuestionId,
    })),
    simulationItems: question.simulation.items.map((item) => ({
      id: item.id,
      answerType: item.answerType,
      optionIds: item.options?.map((option) => option.id),
      correctOptionIds: item.correctOptionIds,
      correctValue: item.correctValue,
      tolerance: item.tolerance,
      score: item.score,
      estimatedSeconds: item.estimatedSeconds,
      knowledgeTags: item.knowledgeTags,
      skillTags: item.skillTags,
    })),
    relatedQuestions: question.relatedQuestions,
  }
}

describe('independently authored Chinese question catalog', () => {
  it('matches every Japanese question and preserves all grading logic', () => {
    expect(builtInQuestionsZh.map(gradingSignature)).toEqual(builtInQuestions.map(gradingSignature))
  })

  it('contains complete Chinese content instead of Japanese text fallbacks', () => {
    expect(JSON.stringify(builtInQuestionsZh)).not.toMatch(/[ぁ-んァ-ン]/)
    expect(builtInQuestionsZh.map((question) => question.title)).toEqual([
      '二次函数的最大值',
      '频数分布表与平均数',
      '速度–时间图像的读取',
      '长题：串联与并联电路的测量方案',
    ])
  })

  it('selects the requested language without changing stable question IDs', () => {
    const japanese = getQuestionCatalog([], 'ja')
    const chinese = getQuestionCatalog([], 'zh')
    expect(chinese[0].title).toBe('二次函数的最大值')
    expect(japanese[0].title).toBe('二次関数の最大値')
    expect(chinese.map((question) => question.questionId)).toEqual(japanese.map((question) => question.questionId))
  })
})
