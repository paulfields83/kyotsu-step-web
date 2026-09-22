import type { TextbookUnit } from './textbookSchema'

type InternalSection = TextbookUnit['sections'][number]
type InternalItem = InternalSection['items'][number]

export type PublicTextbookItem = Omit<InternalItem, 'answer' | 'acceptedAnswers' | 'choices'> & {
  choices: string[]
}

export type PublicTextbookSection = Omit<InternalSection, 'items'> & {
  items: PublicTextbookItem[]
}

export type PublicTextbookUnit = Omit<TextbookUnit, 'sections'> & {
  sections: PublicTextbookSection[]
}

export type TextbookAnswerResult = {
  correct: boolean
  resolved: boolean
}
