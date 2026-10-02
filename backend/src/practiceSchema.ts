import { z } from 'zod'

const IdSchema = z.string().min(2).regex(/^[a-z0-9][a-z0-9-]*$/)

export const PracticeContentBlockSchema = z.discriminatedUnion('type', [
  z.object({ id: IdSchema, type: z.literal('text'), text: z.string().min(1) }),
  z.object({ id: IdSchema, type: z.literal('latex'), latex: z.string().min(1), display: z.enum(['inline', 'block']).default('block') }),
])

export const PracticeCatalogSchema = z.object({
  schemaVersion: z.literal('1.0'),
  subject: z.literal('math-1a'),
  course: z.literal('math-i'),
  majorUnit: z.object({
    id: IdSchema,
    label: z.string().min(1),
    order: z.number().int().positive(),
  }),
  subcategories: z.array(z.object({
    id: IdSchema,
    label: z.string().min(1),
    order: z.number().int().positive(),
    problemTypes: z.array(z.object({
      id: IdSchema,
      label: z.string().min(1),
      order: z.number().int().positive(),
    })).min(1),
  })).min(1),
})

const PracticeOptionSchema = z.object({
  id: IdSchema,
  label: z.string().min(1),
  wrongReason: z.string().optional(),
})

const PracticeBlankSchema = z.object({
  id: IdSchema,
  stepId: IdSchema,
  prompt: z.string().min(1),
  answerType: z.literal('single-choice'),
  options: z.array(PracticeOptionSchema).min(2),
  correctOptionIds: z.array(IdSchema).min(1),
  explanation: z.string().min(1),
})

const PracticeSolutionStepSchema = z.object({
  id: IdSchema,
  dependsOn: z.array(IdSchema),
  basis: z.array(z.string().min(1)),
  purpose: z.string().min(1),
  operation: z.string().min(1),
  content: z.array(PracticeContentBlockSchema).min(1),
  blankIds: z.array(IdSchema),
})

export const PracticeQuestionSchema = z.object({
  schemaVersion: z.literal('1.0'),
  questionId: IdSchema,
  revision: z.number().int().positive(),
  status: z.enum(['draft', 'review', 'published']),
  subject: z.literal('math-1a'),
  course: z.literal('math-i'),
  majorUnit: IdSchema,
  subcategory: IdSchema,
  problemType: IdSchema,
  title: z.string().min(1),
  difficulty: z.enum(['basic', 'standard', 'advanced']),
  source: z.object({
    type: z.enum(['original', 'reference', 'licensed']),
    label: z.string().min(1),
    rightsNote: z.string().optional(),
  }),
  stem: z.array(PracticeContentBlockSchema).min(1),
  solutionSteps: z.array(PracticeSolutionStepSchema).min(1),
  blanks: z.array(PracticeBlankSchema).min(1),
  interaction: z.object({
    reveal: z.literal('sequential'),
    options: z.literal('inline-expand'),
    substituteCorrectAnswer: z.literal(true),
    lockFutureSteps: z.literal(true),
  }),
})

export const PracticeQuestionSetSchema = z.object({
  schemaVersion: z.literal('1.0'),
  questions: z.array(PracticeQuestionSchema).min(1),
})

export type PracticeCatalog = z.infer<typeof PracticeCatalogSchema>
export type PracticeQuestion = z.infer<typeof PracticeQuestionSchema>
export type PracticeQuestionSet = z.infer<typeof PracticeQuestionSetSchema>
