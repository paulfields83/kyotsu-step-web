import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { publicTextbookUnit } from '../../backend/src/publicTextbook'
import { loadedTextbookUnits } from '../../backend/src/textbookData'
import { buildTextbookChapters } from './textbookCatalog'

const mathRoot = join(process.cwd(), 'backend', 'data', 'textbooks', 'math-1a', 'counting-permutation')
const generatedFigureIdsByUnit: Record<string, string[]> = {
  'math-1a-numbers-expressions': [
    'tasuki-cross',
    'real-number-line',
    'simultaneous-inequalities',
    'absolute-value-distance',
    'absolute-value-cases',
  ],
  'math-1a-quadratic-functions': [
    'quadratic-domain-range',
    'quadratic-vertex-form',
    'quadratic-shift',
    'quadratic-max-min',
    'coordinate-quadrants',
    'quadratic-basic',
    'quadratic-discriminant',
    'parabola-line-intersection',
    'quadratic-inequality',
    'absolute-value-graph',
  ],
  'math-1a-geometry-measurement': [
    'trig-right-triangle',
    'trig-coordinate',
    'trig-special-angles',
    'sine-law',
    'cosine-law',
    'triangle-area',
    'heron-triangle',
    'height-distance',
    'quadrilateral-split',
    'spatial-measurement',
  ],
  'math-1a-data-analysis': [
    'data-transform',
    'histogram',
    'boxplot-quartiles',
    'scatter-correlation',
    'statistical-process',
    'outlier-boxplot',
    'hypothesis-test-flow',
  ],
  'math-1a-counting-probability': [
    'counting-tree',
    'circular-permutation',
    'combination-selection',
    'grid-shortest-path',
    'sample-space',
    'complement-event',
    'probability-tree',
  ],
  'math-1a-geometric-properties': [
    'parallel-similarity',
    'internal-external-division',
    'angle-bisector',
    'triangle-centroid',
    'triangle-centers',
    'five-centers-summary',
    'ceva',
    'menelaus',
    'ceva-reverse',
    'menelaus-reverse',
    'triangle-side-angle',
    'cyclic-angle',
    'cyclic-quadrilateral',
    'tangent-chord',
    'power-of-point',
    'two-circles',
    'basic-construction',
    'line-plane',
    'three-perpendicular',
    'polyhedra-euler',
  ],
  'math-1a-human-activities': [
    'place-value',
    'position-grid',
    'earth-measurement',
    'domino-invariant',
    'stone-game',
    'regular-tiling',
  ],
}
const staticMathUnitIds = [
  'math-1a-numbers-expressions',
  'math-1a-quadratic-functions',
  'math-1a-geometry-measurement',
  'math-1a-data-analysis',
  'math-1a-counting-probability',
  'math-1a-geometric-properties',
  'math-1a-human-activities',
]

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
    for (const id of ['math-sets','math-propositions-reading','math-quantifiers-all-exists','math-propositions-proof']) expect(ids).toContain(id)
    for (const unitId of staticMathUnitIds) expect(ids).toContain(unitId)
    for (const unitId of importedPhysicsUnitIds) expect(ids).toContain(unitId)
  })

  it('imports the validated GOLDEN 集合 mother with role and dialogue structure intact', () => {
    const loaded = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-sets')!
    expect(loaded?.unit.status).toBe('published')
    expect(loaded.unit.sections).toHaveLength(7)
    expect(loaded.unit.sections.map(section=>section.number)).toEqual(['1.1','1.2','1.3','1.4','1.5','1.6','1.7'])
    const flow = loaded.unit.sections.flatMap(section=>section.readingFlow)
    const allProse = flow.flatMap(block => (
      block.type === 'paragraph' ? block.parts.filter(part=>part.type==='text').map(part=>part.text) : []
    )).join('')
    expect(allProse).toContain('24の正の約数')
    expect(flow.filter(block=>block.type==='marker' && block.kind==='example')).toHaveLength(7)
    expect(flow.filter(block=>block.type==='dialogue')).toHaveLength(8)
    expect(flow.some(block => block.type==='paragraph' && block.parts.some(part=>part.type==='term' && part.text==='集合'))).toBe(true)
    expect(new Set(choiceRefs(loaded.unit))).toEqual(new Set(loaded.unit.sections.flatMap(section=>section.items.map(item=>item.id))))
    expect(new Set(Object.keys(loaded.answerBook.answers))).toEqual(new Set(loaded.unit.sections.flatMap(section=>section.items.map(item=>item.id))))
    for (const id of ['math-propositions-reading','math-quantifiers-all-exists','math-propositions-proof']) {
      expect(loadedTextbookUnits.find(x=>x.unit.unitId===id)?.unit.status).toBe('review')
    }
  })

  it('uses the existing 3-row chapter hierarchy and retains every GOLDEN learning item', () => {
    const ids=['math-sets','math-propositions-reading','math-quantifiers-all-exists','math-propositions-proof']
    const units=loadedTextbookUnits.filter(row=>ids.includes(row.unit.unitId))
      .map(row=>publicTextbookUnit(row.unit,row.answerBook))
    const chapter=buildTextbookChapters(units,'math-1a').find(row=>row.label==='集合と命題（改訂版）')!
    expect(chapter.lessons.map(lesson=>lesson.label)).toEqual([
      '第1節　集合','第2節　命題','第3節　証明',
    ])
    expect(chapter.lessons.every(lesson=>lesson.kind==='chapter-group')).toBe(true)
    expect(chapter.lessons.map(lesson=>lesson.topics?.length)).toEqual([7,3,3])
    const sub=chapter.lessons[1].topics!
    expect(sub[1].sectionIds).toEqual(['golden-prop-02','golden-prop-03','golden-prop-04'])
    expect(sub[2].sectionRefs).toEqual([
      {unitId:'math-propositions-reading',sectionId:'golden-prop-05'},
      {unitId:'math-quantifiers-all-exists',sectionId:'golden-quant-01'},
      {unitId:'math-quantifiers-all-exists',sectionId:'golden-quant-02'},
    ])
    const lessonItems=chapter.lessons.flatMap(lesson=>(lesson.topics??[]).flatMap(topic=>{
      const refs=topic.kind==='cross-unit-group' ? topic.sectionRefs??[]
        :topic.kind==='section-group' ? (topic.sectionIds??[]).map(sectionId=>({unitId:topic.unitId,sectionId}))
        :topic.sectionId ? [{unitId:topic.unitId,sectionId:topic.sectionId}] : []
      return refs.flatMap(ref=>units.find(unit=>unit.unitId===ref.unitId)
        ?.sections.find(section=>section.id===ref.sectionId)?.items.map(item=>item.id)??[])
    }))
    const sourceIds=units.flatMap(unit=>unit.sections.flatMap(section=>section.items.map(item=>item.id)))
    expect(lessonItems.length).toBe(sourceIds.length)
    expect(new Set(lessonItems)).toEqual(new Set(sourceIds))
  })

  it('builds the same unit -> learning item hierarchy for math and physics', () => {
    const publicUnits = loadedTextbookUnits
      .filter(({ unit }) => unit.status === 'published')
      .map(({ unit, answerBook }) => publicTextbookUnit(unit, answerBook))

    const mathChapters = buildTextbookChapters(publicUnits, 'math-1a')
    expect(mathChapters.map((chapter) => chapter.label)).toContain('集合と命題（改訂版）')
    expect(mathChapters.map((chapter) => chapter.label)).toContain('場合の数と確率')
    expect(mathChapters.find(chapter=>chapter.label==='集合と命題（改訂版）')?.lessons.map(lesson=>lesson.label))
      .toEqual(['第1節　集合'])
    expect(mathChapters.find((chapter) => chapter.label === '場合の数と確率')?.lessons.map((lesson) => lesson.label)).toEqual([
      '場合の数',
      '順列・組合せ',
      '確率と期待値',
      'いろいろな確率',
    ])
    for (const label of ['数と式', '2次関数', '図形と計量', 'データの分析', '図形の性質', '数学と人間の活動']) {
      expect(mathChapters.map((chapter) => chapter.label)).toContain(label)
    }

    const physicsChapters = buildTextbookChapters(publicUnits, 'physics')
    expect(physicsChapters.map((chapter) => chapter.label)).toEqual([
      '物体の運動（改訂版）',
      '剛体にはたらく力',
      '運動量と衝突',
      '円運動と単振動',
      '万有引力と天体運動',
    ])
    const physicsRevised=physicsChapters[0]
    expect(physicsRevised.lessons.map(lesson=>lesson.label))
      .toEqual(['第1節　運動を表す','第2節　速度の変化','第3節　力と運動'])
    expect(physicsRevised.lessons.map(lesson=>lesson.topics?.length)).toEqual([3,3,1])
    expect(physicsRevised.lessons.flatMap(lesson=>lesson.topics??[])
      .every(lesson=>lesson.unitId.endsWith('-revised'))).toBe(true)
    expect(physicsRevised.lessons[0].topics?.map(lesson=>lesson.label))
      .toEqual(['1A 変位と速度','1B 速度の合成と分解','1C 相対速度'])
  })

  it('keeps the standalone Math A 集合 source data hidden because it overlaps 集合と命題', () => {
    const duplicate = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-1a-math-a-sets')!
    expect(duplicate).toBeTruthy()
    expect(duplicate.unit.status).toBe('draft')
  })

  it('keeps every new static math unit in one-to-one sync with private answers', () => {
    for (const unitId of staticMathUnitIds) {
      const loaded = loadedTextbookUnits.find(({ unit }) => unit.unitId === unitId)!
      expect(loaded).toBeTruthy()
      expect(loaded.unit.status).toBe('published')
      const itemIds = loaded.unit.sections.flatMap((section) => section.items.map((item) => item.id))
      expect(itemIds.length).toBeGreaterThan(0)
      expect(new Set(itemIds).size).toBe(itemIds.length)
      expect(new Set(choiceRefs(loaded.unit))).toEqual(new Set(itemIds))
      expect(new Set(Object.keys(loaded.answerBook.answers))).toEqual(new Set(itemIds))
      expect(loaded.dataDir).toBeTruthy()
    }
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

  it('adds learning figures and serves the rebuilt figures as backend SVG assets', () => {
    const expectedUnits = [
      'math-1a-numbers-expressions',
      'math-1a-quadratic-functions',
      'math-1a-geometry-measurement',
      'math-1a-data-analysis',
      'math-1a-counting-probability',
      'math-1a-geometric-properties',
      'math-1a-human-activities',
    ]
    for (const unitId of expectedUnits) {
      const loaded = loadedTextbookUnits.find(({ unit }) => unit.unitId === unitId)!
      const figureBlocks = loaded.unit.sections.flatMap((section) => section.readingFlow).filter((block) => block.type === 'figure')
      expect(figureBlocks.length).toBeGreaterThan(0)
      const figures = loaded.unit.sections.flatMap((section) => section.figures)
      for (const figureId of generatedFigureIdsByUnit[unitId] ?? []) {
        const figure = figures.find(({ id }) => id === figureId)
        expect(figure, `${unitId}/${figureId}`).toBeTruthy()
        expect(figure!.src).toBe(`assets/${figureId}.svg`)
        expect(existsSync(join(loaded.dataDir!, figure!.src))).toBe(true)
      }
    }
  })

  it('serves GOLDEN 集合 figures from imported validated SVG assets', () => {
    const loaded = loadedTextbookUnits.find(({ unit }) => unit.unitId === 'math-sets')!
    const figures = loaded.unit.sections.flatMap(section=>section.figures)
    expect(figures.length).toBeGreaterThanOrEqual(10)
    expect(loaded.assetMap?.size).toBeGreaterThanOrEqual(10)
    for (const fig of figures) {
      expect(fig.src).toMatch(/^assets\/.*\.svg$/)
      expect(loaded.assetMap?.has(fig.src.slice('assets/'.length))).toBe(true)
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
