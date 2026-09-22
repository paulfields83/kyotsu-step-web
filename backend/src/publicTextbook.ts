import { getTextbookChoices } from '../../src/domain/textbook'
import type { TextbookAnswerBook, TextbookReadingPart, TextbookUnit } from '../../src/domain/textbookSchema'

function publicAssetSrc(unitId: string, src: string, apiOrigin?: string) {
  if (!src.startsWith('assets/')) return src
  const path = `/api/textbooks/${encodeURIComponent(unitId)}/assets/${encodeURIComponent(src.slice('assets/'.length))}`
  if (!apiOrigin) return path
  return `${apiOrigin.replace(/\/$/, '')}${path}`
}

function normalizeInteractiveFormulaParts(parts: TextbookReadingPart[]): TextbookReadingPart[] {
  const fractionToken = '\\frac{'
  const sqrtToken = '\\sqrt{'

  // A fraction whose numerator and denominator are both interactive choices cannot
  // be split into separate KaTeX fragments. Render it as a readable inline ratio
  // so every math fragment remains syntactically complete.
  if (
    parts.length === 5
    && parts[0]?.type === 'math'
    && parts[1]?.type === 'choice'
    && parts[2]?.type === 'math'
    && parts[3]?.type === 'choice'
    && parts[4]?.type === 'math'
    && parts[0].latex.endsWith(fractionToken)
    && parts[2].latex === '}{'
    && parts[4].latex === '}'
  ) {
    const prefix = parts[0].latex.slice(0, -fractionToken.length)
    return [
      { type: 'math', latex: prefix },
      parts[1],
      { type: 'text', text: ' / ' },
      parts[3],
    ]
  }

  // A fraction with an interactive numerator and a fixed denominator.
  if (
    parts.length === 3
    && parts[0]?.type === 'math'
    && parts[1]?.type === 'choice'
    && parts[2]?.type === 'math'
    && parts[0].latex.endsWith(fractionToken)
    && parts[2].latex.startsWith('}{')
    && parts[2].latex.endsWith('}')
  ) {
    const prefix = parts[0].latex.slice(0, -fractionToken.length)
    const denominator = parts[2].latex.slice(2, -1)
    return [
      { type: 'math', latex: prefix },
      parts[1],
      { type: 'text', text: ' / ' },
      { type: 'math', latex: denominator },
    ]
  }

  // The same issue occurs when interactive choices are embedded inside a square
  // root. Keep the root visually explicit while avoiding incomplete KaTeX input.
  if (
    parts.length === 5
    && parts[0]?.type === 'math'
    && parts[1]?.type === 'choice'
    && parts[2]?.type === 'math'
    && parts[3]?.type === 'choice'
    && parts[4]?.type === 'math'
    && parts[0].latex.endsWith(sqrtToken)
    && parts[2].latex === '^2+'
    && parts[4].latex === '^2}'
  ) {
    const prefix = parts[0].latex.slice(0, -sqrtToken.length)
    return [
      { type: 'math', latex: prefix },
      { type: 'text', text: '√(' },
      parts[1],
      { type: 'text', text: '² + ' },
      parts[3],
      { type: 'text', text: '²)' },
    ]
  }

  return parts
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
      readingFlow: section.readingFlow.map((block) => (
        block.type === 'formula'
          ? { ...block, parts: normalizeInteractiveFormulaParts(block.parts) }
          : block
      )),
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
