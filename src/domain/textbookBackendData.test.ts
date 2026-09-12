import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { publicTextbookUnit } from '../../backend/src/publicTextbook'
import { loadedTextbookUnits } from '../../backend/src/textbookData'

const mathRoot = join(process.cwd(), 'backend', 'data', 'textbooks', 'math-1a', 'counting-permutation')

function choiceRefs(unit: (typeof loadedTextbookUnits)[number]['unit']) {
  return unit.sections.flatMap((section) =>
    section.readingFlow.flatMap((block) =>
      block.type === 'paragraph' || block.type === 'formula'
        ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
        : [],
    ),
  )
}

describe('backend textbook data', () => {
  it('loads physics and math-1a units through the shared textbook contract', () => {
    expect(loadedTextbookUnits.map(({ unit }) => unit.unitId)).toContain('physics-a-displacement-velocity')
    expect(loadedTextbookUnits.map(({ unit }) => unit.unitId)).toContain('math-1a-counting-permutation')
  })

  it('keeps math item IDs unique while preserving per-section display labels', () => {
    const math = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-1a-counting-permutation')!
    const items = math.unit.sections.flatMap((section) => section.items)
    expect(items.length).toBe(162)
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length)
    expect(math.unit.sections[0].items[0]).toMatchObject({ id: 'math-a-s1-sets-001', label: '1' })
    expect(math.unit.sections[1].items[0]).toMatchObject({ id: 'math-a-s1-counting-001', label: '1' })
  })

  it('keeps math blanks, items, and private answers in one-to-one sync', () => {
    const math = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-1a-counting-permutation')!
    const itemIds = new Set(math.unit.sections.flatMap((section) => section.items.map((item) => item.id)))
    const referencedIds = new Set(choiceRefs(math.unit))
    const answerIds = new Set(Object.keys(math.answerBook.answers))
    expect(referencedIds).toEqual(itemIds)
    expect(answerIds).toEqual(itemIds)
  })

  it('keeps every math figure reference backed by an extracted asset file', () => {
    const math = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-1a-counting-permutation')!
    const figures = math.unit.sections.flatMap((section) => section.figures)
    expect(figures.map((figure) => figure.id)).toEqual([
      'venn-diagram',
      'tree-diagram',
      'circular-permutation',
      'octagon',
      'shortest-path',
      'parallelogram-lines',
    ])
    for (const figure of figures) {
      expect(existsSync(join(mathRoot, figure.src))).toBe(true)
    }
  })

  it('does not expose private answers in public textbook payloads', () => {
    const math = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-1a-counting-permutation')!
    const publicPayload = publicTextbookUnit(math.unit, math.answerBook)
    const serialized = JSON.stringify(publicPayload)
    expect(serialized).not.toContain('"answer"')
    expect(serialized).not.toContain('"acceptedAnswers"')
    expect(publicPayload.sections[0].items[0].choices).toContain('5')
  })

  it('turns backend-owned assets into absolute API URLs when an API origin is provided', () => {
    const math = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-1a-counting-permutation')!
    const publicPayload = publicTextbookUnit(math.unit, math.answerBook, 'https://api.example.test')
    const figures = publicPayload.sections.flatMap((section) => section.figures)
    expect(figures[0].src).toBe('https://api.example.test/api/textbooks/math-1a-counting-permutation/assets/venn-diagram.png')
  })
})
