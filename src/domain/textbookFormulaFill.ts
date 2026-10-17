import katex from 'katex'

type AnswerRecord = { value: string; resolved: boolean }

const superscripts: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
}
const mathHolePattern = /\\square\b|\\underline\{[^}]*\}/g

function answerAsLatex(value: string): string {
  const candidate = value.trim()
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, digits => '^{' + [...digits].map(c => superscripts[c]).join('') + '}')
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/√(\d+)/g, '\\sqrt{$1}')

  try {
    katex.renderToString(candidate, { throwOnError: true, strict: 'ignore' })
    return candidate
  } catch {
    // Japanese prose, or another non-math value, stays readable in a formula.
    return '\\text{' + value.replace(/\\/g, '\\textbackslash ')
      .replace(/[{}$%&#_^~]/g, c => '\\' + c) + '}'
  }
}

/**
 * Fill source markers in reading order, preserving still-unanswered markers.
 * The linked holeIds array comes directly from the source importer.
 */
export function fillResolvedMathHoles(
  latex: string,
  holeIds: readonly string[],
  answers: Record<string, AnswerRecord> | undefined,
): string {
  let index = 0
  return latex.replace(mathHolePattern, marker => {
    const itemId = holeIds[index++]
    const record = itemId ? answers?.[itemId] : undefined
    return record?.resolved ? answerAsLatex(record.value) : marker
  })
}
