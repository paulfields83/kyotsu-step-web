import { describe, expect, it } from 'vitest'
import { builtInTextbookUnits } from './textbookUnits'

describe('textbook unit catalog', () => {
  it('imports A displacement and velocity as one sequential physics unit', () => {
    expect(builtInTextbookUnits).toHaveLength(1)
    const unit = builtInTextbookUnits[0]
    expect(unit.unitId).toBe('physics-a-displacement-velocity')
    expect(unit.subject).toBe('physics')
    expect(unit.sections.map((section) => section.id)).toEqual([
      'knowledge-check',
      'figure-reading',
      'example-q1',
      'example-q2',
      'final-review',
    ])
  })

  it('contains all 78 source blanks with stable ids', () => {
    const unit = builtInTextbookUnits[0]
    const items = unit.sections.flatMap((section) => section.items)
    expect(items).toHaveLength(78)
    expect(new Set(items.map((item) => item.id)).size).toBe(78)
    expect(items[0].label).toBe('A-1')
    expect(items.at(-1)?.label).toBe('F-8')
  })

  it('keeps the four source diagrams as independent assets', () => {
    const figures = builtInTextbookUnits[0].sections.flatMap((section) => section.figures)
    expect(figures).toHaveLength(4)
    expect(figures.every((figure) => figure.src.startsWith('/assets/physics/textbook/a-displacement/'))).toBe(true)
  })
})
