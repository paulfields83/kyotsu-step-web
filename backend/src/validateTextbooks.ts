import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { loadedTextbookUnits, textbookContractReports } from './textbookData'
import { publicTextbookUnit } from './publicTextbook'

const exportErrors: string[] = []

for (const loaded of loadedTextbookUnits) {
  const { unit, answerBook, dataDir } = loaded
  const publicUnit = publicTextbookUnit(unit, answerBook)

  for (const section of publicUnit.sections) {
    for (const item of section.items) {
      const rawItem = item as Record<string, unknown>
      if ('answer' in rawItem) exportErrors.push(`${unit.unitId}/${item.id}: public export leaks answer`)
      if ('acceptedAnswers' in rawItem) exportErrors.push(`${unit.unitId}/${item.id}: public export leaks acceptedAnswers`)
      if (unit.subject === 'math-1a' && (!Array.isArray(item.choices) || item.choices.length < 2)) {
        exportErrors.push(`${unit.unitId}/${item.id}: public export has fewer than 2 choices`)
      }
    }
  }

  if (dataDir) {
    for (const section of unit.sections) {
      for (const figure of section.figures) {
        if (!figure.src.startsWith('assets/')) continue
        const filePath = join(dataDir, figure.src)
        if (!existsSync(filePath)) exportErrors.push(`${unit.unitId}/${figure.id}: missing asset ${figure.src}`)
      }
    }
  }
}

if (exportErrors.length) {
  throw new Error(`textbook export validation failed:\n- ${exportErrors.join('\n- ')}`)
}

const totals = textbookContractReports.reduce(
  (acc, report) => {
    acc.units += 1
    acc.sections += report.sections
    acc.items += report.items
    acc.blanks += report.blanks
    acc.figures += report.figures
    acc.warnings += report.warnings.length
    return acc
  },
  { units: 0, sections: 0, items: 0, blanks: 0, figures: 0, warnings: 0 },
)

const mathTotals = loadedTextbookUnits
  .filter(({ unit }) => unit.subject === 'math-1a')
  .reduce(
    (acc, { unit }) => {
      acc.units += 1
      acc.sections += unit.sections.length
      acc.items += unit.sections.reduce((sum, section) => sum + section.items.length, 0)
      acc.figures += unit.sections.reduce((sum, section) => sum + section.figures.length, 0)
      return acc
    },
    { units: 0, sections: 0, items: 0, figures: 0 },
  )

console.log(JSON.stringify({ ok: true, totals, mathTotals, units: textbookContractReports }, null, 2))
