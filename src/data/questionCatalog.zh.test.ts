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
    presentation: question.learning.presentation,
    flowType: question.learning.flowType,
    finalBlankId: question.learning.finalBlankId,
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
      '通过对话理解二次函数最大值',
      '通过对话读取频数分布表与平均数',
      '计算推导型｜速度–时间图像',
      '现象分析型｜串联与并联电路候选比较',
      '关系式分析型｜负电荷与磁场',
    ])
  })

  it('selects the requested language without changing stable question IDs', () => {
    const japanese = getQuestionCatalog([], 'ja')
    const chinese = getQuestionCatalog([], 'zh')
    expect(chinese[0].title).toBe('通过对话理解二次函数最大值')
    expect(japanese[0].title).toBe('会話で考える二次関数の最大値')
    expect(chinese.map((question) => question.questionId)).toEqual(japanese.map((question) => question.questionId))
  })
})
