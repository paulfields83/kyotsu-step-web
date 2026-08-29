import { z } from 'zod'

const IdSchema = z.string().min(2).regex(/^[a-z0-9][a-z0-9-]*$/, 'ID は小文字英数字とハイフンで指定してください')

export const TextbookAnswerTypeSchema = z.enum(['text', 'formula', 'number'])

export const TextbookItemSchema = z.object({
  id: IdSchema,
  label: z.string().min(1),
  prompt: z.string().min(1),
  answer: z.string().min(1),
  acceptedAnswers: z.array(z.string().min(1)).default([]),
  answerType: TextbookAnswerTypeSchema.default('text'),
  choices: z.array(z.string().min(1)).min(2).optional(),
  unit: z.string().optional(),
})

export const TextbookFigureSchema = z.object({
  id: IdSchema,
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
})

export const TextbookSectionSchema = z.object({
  id: IdSchema,
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  figures: z.array(TextbookFigureSchema).default([]),
  items: z.array(TextbookItemSchema).min(1),
})

const TextbookUnitBaseSchema = z.object({
  schemaVersion: z.literal('1.0'),
  unitId: IdSchema,
  revision: z.number().int().positive(),
  status: z.enum(['draft', 'review', 'published']),
  subject: z.literal('physics'),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  source: z.object({
    type: z.enum(['original', 'licensed', 'reference']),
    label: z.string().min(1),
    rightsNote: z.string().optional(),
  }),
  objectives: z.array(z.string().min(1)).min(1),
  sections: z.array(TextbookSectionSchema).min(1),
})

export const TextbookUnitSchema = TextbookUnitBaseSchema.superRefine((unit, context) => {
  const sectionIds = new Set<string>()
  const itemIds = new Set<string>()
  for (const [sectionIndex, section] of unit.sections.entries()) {
    if (sectionIds.has(section.id)) context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'id'], message: 'section id が重複しています' })
    sectionIds.add(section.id)
    for (const [itemIndex, item] of section.items.entries()) {
      if (itemIds.has(item.id)) context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'items', itemIndex, 'id'], message: 'item id が重複しています' })
      itemIds.add(item.id)
    }
  }
})

export type TextbookUnit = z.infer<typeof TextbookUnitSchema>
export type TextbookSection = z.infer<typeof TextbookSectionSchema>
export type TextbookItem = z.infer<typeof TextbookItemSchema>

export function validateTextbookUnits(input: unknown): TextbookUnit[] {
  return z.array(TextbookUnitSchema).parse(input)
}
