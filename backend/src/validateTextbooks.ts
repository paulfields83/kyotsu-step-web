import { textbookContractReports } from './textbookData'

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

console.log(JSON.stringify({ ok: true, totals, units: textbookContractReports }, null, 2))
