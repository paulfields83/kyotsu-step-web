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

export const TextbookReadingPartSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string().min(1) }),
  z.object({ type: z.literal('math'), latex: z.string().min(1) }),
  z.object({ type: z.literal('choice'), itemId: IdSchema }),
])

export const TextbookReadingBlockSchema = z.discriminatedUnion('type', [
  z.object({ id: IdSchema, type: z.literal('heading'), text: z.string().min(1) }),
  z.object({ id: IdSchema, type: z.literal('paragraph'), parts: z.array(TextbookReadingPartSchema).min(1) }),
  z.object({ id: IdSchema, type: z.literal('formula'), parts: z.array(TextbookReadingPartSchema).min(1) }),
  z.object({ id: IdSchema, type: z.literal('figure'), figureId: IdSchema }),
  z.object({ id: IdSchema, type: z.literal('note'), text: z.string().min(1) }),
])

export const TextbookSectionSchema = z.object({
  id: IdSchema,
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  figures: z.array(TextbookFigureSchema).default([]),
  readingFlow: z.array(TextbookReadingBlockSchema).default([]),
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

    const sectionItemIds = new Set(section.items.map((item) => item.id))
    const figureIds = new Set(section.figures.map((figure) => figure.id))
    const referencedItems = new Set<string>()

    for (const [itemIndex, item] of section.items.entries()) {
      if (itemIds.has(item.id)) context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'items', itemIndex, 'id'], message: 'item id が重複しています' })
      itemIds.add(item.id)
    }

    section.readingFlow.forEach((block, blockIndex) => {
      if (block.type === 'figure' && !figureIds.has(block.figureId)) {
        context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'readingFlow', blockIndex, 'figureId'], message: `存在しない figure 参照: ${block.figureId}` })
      }
      if (block.type === 'paragraph' || block.type === 'formula') {
        block.parts.forEach((part, partIndex) => {
          if (part.type !== 'choice') return
          if (!sectionItemIds.has(part.itemId)) {
            context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'readingFlow', blockIndex, 'parts', partIndex, 'itemId'], message: `存在しない item 参照: ${part.itemId}` })
          }
          referencedItems.add(part.itemId)
        })
      }
    })

    if (section.readingFlow.length > 0) {
      section.items.forEach((item, itemIndex) => {
        if (!referencedItems.has(item.id)) {
          context.addIssue({ code: 'custom', path: ['sections', sectionIndex, 'items', itemIndex, 'id'], message: 'readingFlow から参照されていません' })
        }
      })
    }
  }
})

export type TextbookUnit = z.infer<typeof TextbookUnitSchema>
export type TextbookSection = z.infer<typeof TextbookSectionSchema>
export type TextbookItem = z.infer<typeof TextbookItemSchema>
export type TextbookReadingPart = z.infer<typeof TextbookReadingPartSchema>
export type TextbookReadingBlock = z.infer<typeof TextbookReadingBlockSchema>

export function validateTextbookUnits(input: unknown): TextbookUnit[] {
  return z.array(TextbookUnitSchema).parse(input)
}
