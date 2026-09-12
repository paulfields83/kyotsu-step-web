import { getTextbookChoices } from '../../src/domain/textbook'
import type { TextbookAnswerBook, TextbookUnit } from '../../src/domain/textbookSchema'

function publicAssetSrc(unitId: string, src: string, apiOrigin?: string) {
  if (!src.startsWith('assets/')) return src
  const path = `/api/textbooks/${encodeURIComponent(unitId)}/assets/${encodeURIComponent(src.slice('assets/'.length))}`
  if (!apiOrigin) return path
  return `${apiOrigin.replace(/\/$/, '')}${path}`
}

export function publicTextbookUnit(unit: TextbookUnit, answerBook: TextbookAnswerBook, apiOrigin?: string) {
  return {
    ...unit,
    sections: unit.sections.map((section) => ({
      ...section,
      figures: section.figures.map((figure) => ({
        ...figure,
        src: publicAssetSrc(unit.unitId, figure.src, apiOrigin),
      })),
      items: section.items.map((item) => {
        const { answer: _answer, acceptedAnswers: _acceptedAnswers, choices: _choices, ...publicItem } = item
        return {
          ...publicItem,
          choices: getTextbookChoices(unit, item, answerBook.answers),
        }
      }),
    })),
  }
}
