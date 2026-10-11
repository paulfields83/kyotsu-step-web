import { describe, expect, it } from 'vitest'
import { loadRevisedNumbersExpressions } from '../../backend/src/revisedNumbersExpressions'
import { assertTextbookContract } from '../../backend/src/textbookContract'
import { publicTextbookUnit } from '../../backend/src/publicTextbook'

describe('revised 数と式 corpus', () => {
  const { unit, answerBook } = loadRevisedNumbersExpressions()
  it('imports N01-N14 and two advanced chapters in source order', () => {
    expect(unit.sections.map(section => section.id)).toEqual([
      ...Array.from({ length: 14 }, (_, i) => 'revised-n' + String(i + 1).padStart(2, '0')),
      'revised-ne01', 'revised-ne02',
    ])
    expect(unit.sections.every(section => section.readingFlow.length > 10)).toBe(true)
    expect(unit.status).toBe('published')
  })
  it('publishes the 14 supplied diagrams at their original lesson positions', () => {
    const expected = new Map([
      ['revised-n03', ['n03-f01']],
      ['revised-n04', ['n04-f01']],
      ['revised-n05', ['n05-f01', 'n05-f02']],
      ['revised-n08', ['n08-f01']],
      ['revised-n09', ['n09-f01']],
      ['revised-n11', ['n11-f01', 'n11-f02']],
      ['revised-n12', ['n12-f01', 'n12-f02', 'n12-f03']],
      ['revised-n13', ['n13-f02', 'n13-f01']],
      ['revised-n14', ['n14-f01']],
    ])
    const figureCount = unit.sections.reduce((n, section) => n + section.figures.length, 0)
    expect(figureCount).toBe(14)
    for (const section of unit.sections) {
      const figureIds = section.readingFlow.filter((block) => block.type === 'figure').map(block => block.figureId)
      expect(figureIds).toEqual(expected.get(section.id) ?? [])
      expect(section.figures.map(f => f.id)).toEqual(figureIds)
      for (const figure of section.figures) expect(figure.src).toMatch(/^assets\/N\d{2}-F\d{2}\.webp$/)
    }
  })
  it('preserves math expressions as structured KaTeX-capable parts', () => {
    const math = unit.sections.flatMap(s => s.readingFlow)
      .filter(b => b.type === 'paragraph' || b.type === 'formula')
      .flatMap(b => b.type === 'paragraph' || b.type === 'formula' ? b.parts : [])
      .filter(part => part.type === 'math')
    expect(math.length).toBeGreaterThan(100)
  })
  it('only publishes verified answer keys and no duplicates', () => {
    const items = unit.sections.flatMap(s => s.items)
    expect(items).toHaveLength(10)
    expect(new Set(items.map(x => x.id)).size).toBe(items.length)
    const report = assertTextbookContract(unit, answerBook)
    expect(report.errors).toEqual([])
    const publicUnit = JSON.stringify(publicTextbookUnit(unit, answerBook))
    expect(publicUnit).not.toContain('correctOptionIds')
    expect(publicUnit).not.toContain('acceptedAnswers')
  })
})
