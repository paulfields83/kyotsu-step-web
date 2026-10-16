import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { loadRevisedNumbersExpressions } from '../../backend/src/revisedNumbersExpressions'

describe('revised textbook rendering diagnostics', () => {
  it('audits all expressions and visible unbound holes', () => {
    const { unit } = loadRevisedNumbersExpressions()
    const issues: Array<{ section: string; block: string; latex: string; reason: string }> = []
    const residual: Array<{ section: string; block: string; text: string }> = []
    let mathCount = 0
    for (const section of unit.sections) {
      for (const block of section.readingFlow) {
        if (block.type !== 'paragraph' && block.type !== 'formula') continue
        for (const part of block.parts) {
          if (part.type === 'math') {
            mathCount++
            try { katex.renderToString(part.latex, { throwOnError: true, strict: 'ignore' }) }
            catch (e) { issues.push({ section: section.id, block: block.id, latex: part.latex.slice(0, 130), reason: String(e).slice(0, 170) }) }
          }
          if (part.type === 'text' && (/【[^】]*】|\\underline\{|�|\u25a1|\u25ab/.test(part.text))) {
            residual.push({ section: section.id, block: block.id, text: part.text.slice(0, 140) })
          }
        }
      }
    }
    const sectionCounts = Object.fromEntries(unit.sections.map((sec) => [
      sec.id, {
        items: sec.items.length,
        remainingTextBlanks: residual.filter((entry) => entry.section === sec.id).length,
      },
    ]))
    console.log('REVISED_MATH_RENDER_AUDIT ' + JSON.stringify({ mathCount, latexErrors: issues.length, errors: issues.slice(0, 25), unboundMarkers: residual.length, sectionCounts, residual: residual.slice(0, 25) }))
    expect(issues).toEqual([])
    expect(mathCount).toBeGreaterThan(100)
  })
})
