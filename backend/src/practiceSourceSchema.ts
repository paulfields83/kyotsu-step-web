import { z } from 'zod'

const IdSchema = z.string().min(2).regex(/^[a-z0-9][a-z0-9-]*$/)

export const PracticeSourceItemSchema = z.object({
  sourceQuestionId: IdSchema,
  sourceNumber: z.string().min(1),
  contentHash: z.string().regex(/^[0-9a-f]{16}$/),
  title: z.string().min(1),
  sourcePage: z.number().int().positive(),
  sourceLevel: z.string().min(1),
  majorUnit: IdSchema,
  subcategory: IdSchema,
  problemType: IdSchema,
  problemText: z.string().min(1),
  miniGuide: z.string().min(1),
  answer: z.string().min(1),
  keyPoint: z.string().min(1),
  authoringStatus: z.literal('source-ready'),
})

export const PracticeSourceBankSchema = z.object({
  schemaVersion: z.literal('1.0'),
  subject: z.literal('math-1a'),
  course: z.literal('math-i'),
  majorUnit: IdSchema,
  subcategory: IdSchema,
  source: z.object({
    label: z.string().min(1),
    coverage: z.string().min(1),
    excluded: z.array(z.string().min(1)),
    itemCount: z.number().int().positive(),
    rightsNote: z.string().min(1),
  }),
  items: z.array(PracticeSourceItemSchema).min(1),
})

export type PracticeSourceItem = z.infer<typeof PracticeSourceItemSchema>
export type PracticeSourceBank = z.infer<typeof PracticeSourceBankSchema>
