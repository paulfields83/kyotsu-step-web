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
    expect(items).toHaveLength(243)
    expect(unit.sections.find(x => x.id === 'revised-n01')?.items).toHaveLength(16)
    expect(unit.sections.find(x => x.id === 'revised-n04')?.items).toHaveLength(20)
    expect(unit.sections.find(x => x.id === 'revised-n05')?.items).toHaveLength(25)
    expect(unit.sections.find(x => x.id === 'revised-n06')?.items).toHaveLength(17)
    expect(new Set(items.map(x => x.id)).size).toBe(items.length)
    // Every reviewed answer must be reachable at the exact manuscript blank.
    const references = new Map<string, number>()
    const mathHoleExamples: string[] = []
    for (const section of unit.sections) {
      for (const block of section.readingFlow) {
        if (block.type !== 'paragraph' && block.type !== 'formula') continue
        for (const part of block.parts) {
          const ids = part.type === 'choice' ? [part.itemId] : part.type === 'math' ? (part.holeIds ?? []) : []
          for (const id of ids) references.set(id, (references.get(id) ?? 0) + 1)
          if (part.type === 'math' && (part.holeIds?.length ?? 0) > 0) mathHoleExamples.push(part.holeIds![0])
          if (part.type === 'math' && /\\\\square\\b/.test(part.latex)) {
            expect(part.holeIds?.length).toBeGreaterThan(0)
          }
          if (part.type === 'text') expect(part.text).not.toMatch(/【[^】]*】|\\\\square/)
        }
      }
    }
    expect(mathHoleExamples).toContain('math-revised-n01-question-01')
    expect(mathHoleExamples).toContain('math-revised-n01-question-03')
    expect(mathHoleExamples).toContain('math-revised-n01-question-07')
    expect(mathHoleExamples).toContain('math-revised-n01-question-09')
    expect(references.size).toBe(items.length)
    expect([...references.values()].every(count => count >= 1)).toBe(true)
    const report = assertTextbookContract(unit, answerBook)
    expect(report.errors).toEqual([])
    const publicUnit = JSON.stringify(publicTextbookUnit(unit, answerBook))
    expect(publicUnit).not.toContain('correctOptionIds')
    expect(publicUnit).not.toContain('acceptedAnswers')
  })
})
