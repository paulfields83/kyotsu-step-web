import { z } from 'zod'

const IdSchema = z.string().min(2).regex(/^[a-z0-9][a-z0-9-]*$/, 'ID は小文字英数字とハイフンで指定してください')

export const ContentBlockSchema = z.discriminatedUnion('type', [
  z.object({ id: IdSchema, type: z.literal('text'), text: z.string().min(1), speaker: z.string().min(1).optional() }),
  z.object({ id: IdSchema, type: z.literal('latex'), latex: z.string().min(1), display: z.enum(['inline', 'block']) }),
  z.object({ id: IdSchema, type: z.literal('image'), assetId: IdSchema, alt: z.string().min(1), caption: z.string().optional() }),
  z.object({
    id: IdSchema,
    type: z.literal('table'),
    caption: z.string().optional(),
    columns: z.array(z.string().min(1)).min(1),
    rows: z.array(z.array(z.string())).min(1),
  }).superRefine((table, context) => {
    table.rows.forEach((row, rowIndex) => {
      if (row.length !== table.columns.length) {
        context.addIssue({ code: 'custom', path: ['rows', rowIndex], message: `列数は ${table.columns.length} である必要があります` })
      }
    })
  }),
])

export const AssetSchema = z.object({
  id: IdSchema,
  type: z.literal('image'),
  src: z.string().min(1),
  alt: z.string().min(1),
})

const OptionSchema = z.object({
  id: IdSchema,
  content: z.array(ContentBlockSchema).min(1),
  misconceptionTags: z.array(IdSchema).default([]),
  wrongReason: z.array(ContentBlockSchema).default([]),
})

const LearningBlankSchema = z.object({
  id: IdSchema,
  answerType: z.enum(['single-choice', 'multi-choice', 'number', 'formula']),
  prompt: z.string().min(1),
  options: z.array(OptionSchema).min(2),
  correctOptionIds: z.array(IdSchema).min(1),
  knowledgeTags: z.array(IdSchema).min(1),
  skillTag: z.enum(['reading', 'condition-reading', 'law-selection', 'equation-building', 'calculation', 'graph-reading', 'case-classification', 'unit', 'conclusion']),
  explanation: z.array(ContentBlockSchema).min(1),
  shortPracticeQuestionId: IdSchema.optional(),
})

const LearningFlowBlockSchema = z.discriminatedUnion('type', [
  z.object({ id: IdSchema, type: z.literal('content'), content: z.array(ContentBlockSchema).min(1) }),
  z.object({ id: IdSchema, type: z.literal('blank'), blankId: IdSchema }),
])

const SimulationOptionSchema = z.object({ id: IdSchema, content: z.array(ContentBlockSchema).min(1) })

const SimulationItemSchema = z.object({
  id: IdSchema,
  label: z.string().min(1),
  prompt: z.array(ContentBlockSchema).min(1),
  answerType: z.enum(['single-choice', 'multi-choice', 'number']),
  options: z.array(SimulationOptionSchema).optional(),
  correctOptionIds: z.array(IdSchema).optional(),
  correctValue: z.number().finite().optional(),
  tolerance: z.number().min(0).default(0),
  score: z.number().int().positive(),
  estimatedSeconds: z.number().int().positive(),
  knowledgeTags: z.array(IdSchema).min(1),
  skillTags: z.array(IdSchema).min(1),
})

const RelatedQuestionsSchema = z.object({
  sameKnowledge: z.array(IdSchema),
  sameMethod: z.array(IdSchema),
  reinforcement: z.array(IdSchema),
})

const QuestionBaseSchema = z.object({
  schemaVersion: z.literal('1.0'),
  questionId: IdSchema,
  revision: z.number().int().positive(),
  status: z.enum(['draft', 'review', 'published']),
  subject: z.enum(['math-1a', 'physics']),
  unitType: z.enum(['small-question', 'major-question']),
  title: z.string().min(1),
  source: z.object({ type: z.enum(['original', 'licensed', 'reference']), label: z.string().min(1), year: z.number().int().optional(), rightsNote: z.string().optional() }),
  taxonomy: z.object({
    majorUnit: IdSchema,
    minorUnit: IdSchema,
    knowledgeTags: z.array(IdSchema).min(1),
    skillTags: z.array(IdSchema).min(1),
  }),
  difficulty: z.enum(['basic', 'standard', 'advanced', 'exam']),
  examLevel: z.enum(['foundation', 'common-test', 'challenge']),
  estimatedSeconds: z.number().int().positive(),
  assets: z.array(AssetSchema),
  stem: z.array(ContentBlockSchema).min(1),
  learning: z.object({
    presentation: z.enum(['standard', 'common-test']).default('standard'),
    flowType: z.enum(['math-narrative', 'phenomenon-analysis', 'calculation-derivation', 'relation-analysis']).optional(),
    finalBlankId: IdSchema.optional(),
    solutionFlow: z.array(LearningFlowBlockSchema).min(1),
    blanks: z.record(IdSchema, LearningBlankSchema),
    variants: z.object({ detailed: z.array(IdSchema).min(1), standard: z.array(IdSchema).min(1), selfCheck: z.array(IdSchema).min(1) }),
  }),
  simulation: z.object({ material: z.array(ContentBlockSchema).min(1), items: z.array(SimulationItemSchema).min(1) }),
  fullExplanation: z.array(ContentBlockSchema).min(1),
  relatedQuestions: RelatedQuestionsSchema,
})

function duplicateValues(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) !== index)
}

function allContentBlocks(question: z.infer<typeof QuestionBaseSchema>) {
  const blocks = [...question.stem, ...question.simulation.material, ...question.fullExplanation]
  for (const flow of question.learning.solutionFlow) if (flow.type === 'content') blocks.push(...flow.content)
  for (const blank of Object.values(question.learning.blanks)) {
    blocks.push(...blank.explanation)
    blank.options.forEach((option) => blocks.push(...option.content, ...option.wrongReason))
  }
  question.simulation.items.forEach((item) => {
    blocks.push(...item.prompt)
    item.options?.forEach((option) => blocks.push(...option.content))
  })
  return blocks
}

export const QuestionSchema = QuestionBaseSchema.superRefine((question, context) => {
  const assetIds = question.assets.map((asset) => asset.id)
  duplicateValues(assetIds).forEach((id) => context.addIssue({ code: 'custom', path: ['assets'], message: `重複した assetId: ${id}` }))

  const blockIds = allContentBlocks(question).map((block) => block.id)
  duplicateValues(blockIds).forEach((id) => context.addIssue({ code: 'custom', path: ['stem'], message: `重複した content block ID: ${id}` }))
  allContentBlocks(question).forEach((block) => {
    if (block.type === 'image' && !assetIds.includes(block.assetId)) {
      context.addIssue({ code: 'custom', path: ['assets'], message: `存在しない画像参照: ${block.assetId}` })
    }
  })

  const blankIds = Object.keys(question.learning.blanks)
  Object.entries(question.learning.blanks).forEach(([key, blank]) => {
    if (key !== blank.id) context.addIssue({ code: 'custom', path: ['learning', 'blanks', key, 'id'], message: 'record key と blank.id が一致しません' })
    const optionIds = blank.options.map((option) => option.id)
    duplicateValues(optionIds).forEach((id) => context.addIssue({ code: 'custom', path: ['learning', 'blanks', key, 'options'], message: `重複した option ID: ${id}` }))
    blank.correctOptionIds.forEach((id) => {
      if (!optionIds.includes(id)) context.addIssue({ code: 'custom', path: ['learning', 'blanks', key, 'correctOptionIds'], message: `正解 option が存在しません: ${id}` })
    })
  })

  const flowBlankIds = question.learning.solutionFlow.filter((block) => block.type === 'blank').map((block) => block.blankId)
  flowBlankIds.forEach((blankId) => {
    if (!blankIds.includes(blankId)) context.addIssue({ code: 'custom', path: ['learning', 'solutionFlow'], message: `存在しない blank 参照: ${blankId}` })
  })

  const finalBlankId = question.learning.finalBlankId
  if (question.learning.presentation === 'common-test') {
    if (!finalBlankId) {
      context.addIssue({ code: 'custom', path: ['learning', 'finalBlankId'], message: '共通テスト形式には finalBlankId が必要です' })
    }
    if (!question.learning.flowType) {
      context.addIssue({ code: 'custom', path: ['learning', 'flowType'], message: '共通テスト形式には flowType が必要です' })
    }
  }
  if (finalBlankId) {
    if (!blankIds.includes(finalBlankId)) {
      context.addIssue({ code: 'custom', path: ['learning', 'finalBlankId'], message: `存在しない final blank: ${finalBlankId}` })
    }
    if (flowBlankIds.includes(finalBlankId)) {
      context.addIssue({ code: 'custom', path: ['learning', 'solutionFlow'], message: 'finalBlankId は推論ガイド内に置かず、最後の選択画面で表示してください' })
    }
  }

  blankIds.forEach((blankId) => {
    if (!flowBlankIds.includes(blankId) && blankId !== finalBlankId) {
      context.addIssue({ code: 'custom', path: ['learning', 'blanks', blankId], message: 'solutionFlow または finalBlankId から参照されていません' })
    }
  })
  Object.entries(question.learning.variants).forEach(([variant, ids]) => {
    duplicateValues(ids).forEach((id) => context.addIssue({ code: 'custom', path: ['learning', 'variants', variant], message: `重複した blankId: ${id}` }))
    ids.forEach((id) => {
      if (!blankIds.includes(id)) context.addIssue({ code: 'custom', path: ['learning', 'variants', variant], message: `存在しない blankId: ${id}` })
    })
    if (finalBlankId && !ids.includes(finalBlankId)) {
      context.addIssue({ code: 'custom', path: ['learning', 'variants', variant], message: `finalBlankId ${finalBlankId} を含めてください` })
    }
  })

  question.simulation.items.forEach((item, itemIndex) => {
    if (item.answerType === 'number') {
      if (item.correctValue === undefined) context.addIssue({ code: 'custom', path: ['simulation', 'items', itemIndex, 'correctValue'], message: '数値問題には correctValue が必要です' })
      return
    }
    if (!item.options?.length) context.addIssue({ code: 'custom', path: ['simulation', 'items', itemIndex, 'options'], message: '選択問題には options が必要です' })
    if (!item.correctOptionIds?.length) context.addIssue({ code: 'custom', path: ['simulation', 'items', itemIndex, 'correctOptionIds'], message: '選択問題には正解が必要です' })
    const optionIds = item.options?.map((option) => option.id) ?? []
    duplicateValues(optionIds).forEach((id) => context.addIssue({ code: 'custom', path: ['simulation', 'items', itemIndex, 'options'], message: `重複した option ID: ${id}` }))
    item.correctOptionIds?.forEach((id) => {
      if (!optionIds.includes(id)) context.addIssue({ code: 'custom', path: ['simulation', 'items', itemIndex, 'correctOptionIds'], message: `正解 option が存在しません: ${id}` })
    })
  })
})

export const QuestionCatalogSchema = z.array(QuestionSchema).min(1).superRefine((questions, context) => {
  const ids = questions.map((question) => question.questionId)
  duplicateValues(ids).forEach((id) => context.addIssue({ code: 'custom', path: [], message: `重複した questionId: ${id}` }))
  questions.forEach((question, index) => {
    const relations = Object.values(question.relatedQuestions).flat()
    const shortPractice = Object.values(question.learning.blanks).flatMap((blank) => blank.shortPracticeQuestionId ? [blank.shortPracticeQuestionId] : [])
    for (const relatedId of [...relations, ...shortPractice]) {
      if (relatedId === question.questionId) context.addIssue({ code: 'custom', path: [index, 'relatedQuestions'], message: `自分自身を関連問題にできません: ${relatedId}` })
      else if (!ids.includes(relatedId)) context.addIssue({ code: 'custom', path: [index, 'relatedQuestions'], message: `存在しない関連問題: ${relatedId}` })
    }
  })
})

export type ContentBlock = z.infer<typeof ContentBlockSchema>
export type QuestionAsset = z.infer<typeof AssetSchema>
export type Question = z.infer<typeof QuestionSchema>
export type LearningBlank = Question['learning']['blanks'][string]
export type SimulationItem = Question['simulation']['items'][number]
export type LearningVariant = keyof Question['learning']['variants']

export function validateQuestionCatalog(input: unknown): Question[] {
  return QuestionCatalogSchema.parse(input)
}

export function formatQuestionIssues(error: z.ZodError): string[] {
  return error.issues.map((issue) => `${issue.path.length ? issue.path.join('.') : 'catalog'}: ${issue.message}`)
}
