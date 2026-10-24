import { describe, expect, it } from 'vitest'
import { loadRevisedNumbersExpressions } from './revisedNumbersExpressions'
import { assertTextbookContract } from './textbookContract'
import { publicTextbookUnit } from './publicTextbook'

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
  it('preserves math expressions as structured KaTeX-capable parts', () => {
    const math = unit.sections.flatMap(s => s.readingFlow)
      .filter(b => b.type === 'paragraph' || b.type === 'formula')
      .flatMap(b => b.type === 'paragraph' || b.type === 'formula' ? b.parts : [])
      .filter(part => part.type === 'math')
    expect(math.length).toBeGreaterThan(100)
  })
  it('only publishes verified answer keys and no duplicates', () => {
    const items = unit.sections.flatMap(s => s.items)
    expect(items).toHaveLength(237)
    expect(new Set(items.map(x => x.id)).size).toBe(items.length)
    expect(unit.sections.find(section => section.id === 'revised-n01')?.items).toHaveLength(10)
    expect(unit.sections.find(section => section.id === 'revised-n02')?.items).toHaveLength(12)
    expect(unit.sections.find(section => section.id === 'revised-n03')?.items).toHaveLength(13)
    expect(unit.sections.find(section => section.id === 'revised-n04')?.items).toHaveLength(20)
    expect(unit.sections.find(section => section.id === 'revised-n05')?.items).toHaveLength(25)
    expect(unit.sections.find(section => section.id === 'revised-n06')?.items).toHaveLength(17)

    const report = assertTextbookContract(unit, answerBook)
    expect(report.errors).toEqual([])
    const publicUnit = JSON.stringify(publicTextbookUnit(unit, answerBook))
    expect(publicUnit).not.toContain('correctOptionIds')
    expect(publicUnit).not.toContain('acceptedAnswers')
  })
})
