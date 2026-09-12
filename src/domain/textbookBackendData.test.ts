import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { publicTextbookUnit } from '../../backend/src/publicTextbook'
import { loadedTextbookUnits } from '../../backend/src/textbookData'

const mathRoot = join(process.cwd(), 'backend', 'data', 'textbooks', 'math-1a', 'counting-permutation')
const importedPhysicsUnitIds = [
  'physics-1b-velocity-composition-decomposition',
  'physics-1c-relative-velocity',
  'physics-1d-acceleration',
  'physics-1e-horizontal-projection',
  'physics-1f-projectile-motion',
  'physics-1g-gravity-drag-terminal-velocity',
  'physics-2a-rigid-body-force-action',
  'physics-2b-moment-of-force',
  'physics-2c-rigid-body-equilibrium',
  'physics-2d-force-composition-couple',
  'physics-2e-center-of-mass',
  'physics-2f-stability-tipping-condition',
  'physics-3a-momentum',
  'physics-3b-impulse-momentum-change',
  'physics-3c-momentum-conservation',
  'physics-3d-restitution-collision-energy',
  'physics-3e-oblique-collision-friction',
  'physics-4a-circular-motion-kinematics',
  'physics-4b-circular-motion-acceleration',
  'physics-4c-centripetal-force',
  'physics-4d-inertial-force-noninertial-frame',
  'physics-4e-centrifugal-force',
  'physics-4f-simple-harmonic-motion-kinematics',
  'physics-4g-spring-oscillator',
  'physics-4h-simple-pendulum-energy',
  'physics-5a-kepler-laws',
  'physics-5b-universal-gravitation',
  'physics-5c-gravity',
  'physics-5d-artificial-satellite',
  'physics-5e-gravitational-potential-energy',
  'physics-5f-orbits-space-velocities',
]

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
    const ids = loadedTextbookUnits.map(({ unit }) => unit.unitId)
    expect(ids).toContain('physics-a-displacement-velocity')
    expect(ids).toContain('math-1a-counting-permutation')
    for (const unitId of importedPhysicsUnitIds) expect(ids).toContain(unitId)
  })

  it('keeps math item IDs unique while preserving per-section display labels', () => {
    const math = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-1a-counting-permutation')!
    const items = math.unit.sections.flatMap((section) => section.items)
    expect(items.length).toBeGreaterThan(0)
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

  it('keeps imported physics blanks, answers, IDs, and figure assets in sync', () => {
    for (const unitId of importedPhysicsUnitIds) {
      const loaded = loadedTextbookUnits.find(({ unit }) => unit.unitId === unitId)!
      expect(loaded).toBeTruthy()
      const itemIds = loaded.unit.sections.flatMap((section) => section.items.map((item) => item.id))
      expect(itemIds.length).toBeGreaterThan(0)
      expect(new Set(itemIds).size).toBe(itemIds.length)
      expect(new Set(choiceRefs(loaded.unit))).toEqual(new Set(itemIds))
      expect(new Set(Object.keys(loaded.answerBook.answers))).toEqual(new Set(itemIds))
      expect(loaded.dataDir).toBeTruthy()
      for (const figure of loaded.unit.sections.flatMap((section) => section.figures)) {
        expect(existsSync(join(loaded.dataDir!, figure.src))).toBe(true)
      }
    }
  })

  it('does not expose private answers in public textbook payloads', () => {
    for (const loaded of loadedTextbookUnits.filter(({ unit }) => unit.status === 'published')) {
      const publicPayload = publicTextbookUnit(loaded.unit, loaded.answerBook)
      const serialized = JSON.stringify(publicPayload)
      expect(serialized).not.toContain('"answer"')
      expect(serialized).not.toContain('"acceptedAnswers"')
      expect(serialized).not.toContain('"validator"')
    }
    const math = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-1a-counting-permutation')!
    expect(publicTextbookUnit(math.unit, math.answerBook).sections[0].items[0].choices).toContain('5')
  })

  it('turns backend-owned assets into absolute API URLs when an API origin is provided', () => {
    const math = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-1a-counting-permutation')!
    const publicPayload = publicTextbookUnit(math.unit, math.answerBook, 'https://api.example.test')
    const figures = publicPayload.sections.flatMap((section) => section.figures)
    expect(figures[0].src).toBe('https://api.example.test/api/textbooks/math-1a-counting-permutation/assets/venn-diagram.png')
  })
})
