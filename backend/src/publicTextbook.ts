import { getTextbookChoices } from '../../src/domain/textbook'
import type { TextbookAnswerBook, TextbookUnit } from '../../src/domain/textbookSchema'

export function publicTextbookUnit(unit: TextbookUnit, answerBook: TextbookAnswerBook) {
  return {
    ...unit,
    sections: unit.sections.map((section) => ({
      ...section,
      figures: section.figures.map((figure) => ({
        ...figure,
        src: figure.src.startsWith('assets/') ? `/api/textbooks/${encodeURIComponent(unit.unitId)}/assets/${encodeURIComponent(figure.src.slice('assets/'.length))}` : figure.src,
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
