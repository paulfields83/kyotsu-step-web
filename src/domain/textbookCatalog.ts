import type { Question } from './questionSchema'
import type { PublicTextbookUnit } from './textbookPublic'

export type TextbookLessonTarget = {
  key: string
  label: string
  unitId: string
  kind: 'unit' | 'section' | 'section-group'
  sectionId?: string
  sectionIds?: string[]
  topicPrefix?: string
}

export type TextbookChapter = {
  key: string
  label: string
  order: number
  lessons: TextbookLessonTarget[]
}

const physicsChapterMeta: Record<string, { label: string; order: number }> = {
  '1': { label: '運動の表し方', order: 10 },
  '2': { label: '剛体にはたらく力', order: 20 },
  '3': { label: '運動量と衝突', order: 30 },
  '4': { label: '円運動と単振動', order: 40 },
  '5': { label: '万有引力と天体運動', order: 50 },
}

function conciseMathTitle(title: string) {
  return title.replace(/^数学[ⅠⅡⅢIVXIA・\s]+\s*/u, '')
}

function physicsUnitCode(unit: PublicTextbookUnit) {
  if (unit.unitId === 'physics-a-displacement-velocity') return '1A'
  const idMatch = unit.unitId.match(/^physics-(\d)([a-z])-/i)
  if (idMatch) return `${idMatch[1]}${idMatch[2].toUpperCase()}`
  const titleMatch = unit.title.match(/^(\d+[A-Z])/)
  return titleMatch?.[1]
}

function physicsUnitLabel(unit: PublicTextbookUnit) {
  const code = physicsUnitCode(unit)
  if (!code) return unit.title
  return unit.title.match(/^\d+[A-Z]\s/)
    ? unit.title
    : `${code} ${unit.title.replace(/^[A-Z]\s+/, '')}`
}

function physicsChapterNumber(unit: PublicTextbookUnit) {
  const code = physicsUnitCode(unit)
  return code?.match(/^\d+/)?.[0]
}

function mathChapters(units: PublicTextbookUnit[]): TextbookChapter[] {
  const chapters: TextbookChapter[] = []

  const hasGoldenSetChapter = units.some((unit) => unit.unitId === 'math-sets')
  const hasStrictSetsPropositions = units.some((unit) => unit.unitId === 'math-1a-sets-propositions')
  const hasRevisedNumbersExpressions = units.some((unit) => unit.unitId === 'math-1a-numbers-expressions-revised')
  for (const unit of units) {
    // Hide the old numbers-and-expressions text only when the backend offers the revised source.
    if (hasRevisedNumbersExpressions && unit.unitId === 'math-1a-numbers-expressions') continue
    if (hasStrictSetsPropositions && unit.unitId === 'math-1a-sets-propositions-trial') continue
    // Use the validated textbook factory sources for the entire chapter.
    // Other content is visible for QA but remains explicitly review-only.
    if (hasGoldenSetChapter && ['math-1a-sets-propositions','math-1a-sets-propositions-trial'].includes(unit.unitId)) continue
    if (unit.unitId === 'math-sets') {
      const goldenLessons = [
        { id: 'math-sets', label: '集合（完成版）' },
        { id: 'math-propositions-reading', label: '命題（レビュー中）' },
        { id: 'math-quantifiers-all-exists', label: '「すべて」と「ある」（レビュー中）' },
        { id: 'math-propositions-proof', label: '命題の証明（レビュー中）' },
      ]
      chapters.push({
        key: 'math-golden-sets-propositions',
        label: '集合と命題',
        order: 30,
        lessons: goldenLessons.filter(lesson => units.some(candidate => candidate.unitId === lesson.id))
          .map(lesson => ({
            key: 'math-golden-' + lesson.id,
            label: lesson.label,
            unitId: lesson.id,
            kind: 'unit' as const,
          })),
      })
      continue
    }
    if (['math-propositions-reading','math-quantifiers-all-exists','math-propositions-proof'].includes(unit.unitId)) continue

    if (unit.unitId === 'math-1a-sets-propositions') {
      chapters.push({
        key: 'math-sets-propositions',
        label: '集合と命題（改訂版）',
        order: 30,
        lessons: unit.sections.map((section) => ({
          key: `math-sets-propositions-${section.id}`,
          label: section.title,
          unitId: unit.unitId,
          kind: 'section' as const,
          sectionId: section.id,
        })),
      })
      continue
    }

    if (unit.unitId === 'math-1a-numbers-expressions-revised') {
      // Group the sixteen existing revised lessons under the three textbook headings.
      // The original N01–N14/NE01–NE02 identifiers and their reading order stay intact.
      const revisedGroups = [
        { key: 'polynomials', label: '第1節　多項式', codes: ['n01','n02','n03','n04','n05','n06'] },
        { key: 'real-numbers', label: '第2節　実数', codes: ['n07','n08','n09','n10'] },
        { key: 'inequalities', label: '第3節　1次不等式・参考発展', codes: ['n11','n12','n13','n14','ne01','ne02'] },
      ]
      chapters.push({
        key: 'math-revised-numbers-expressions',
        label: '数と式（改訂版）',
        order: 10,
        lessons: revisedGroups.map((group, index) => ({
          key: 'math-revised-numbers-expressions-' + group.key,
          label: group.label,
          unitId: unit.unitId,
          kind: 'section-group' as const,
          sectionIds: group.codes.map((code) => 'revised-' + code),
          topicPrefix: String(index + 1),
        })),
      })
      continue
    }

    if (unit.unitId === 'math-1a-counting-permutation') {
      chapters.push({
        key: 'math-counting-probability',
        label: '場合の数と確率',
        order: 60,
        lessons: [
          {
            key: 'math-counting-probability-counting',
            label: '場合の数',
            unitId: unit.unitId,
            kind: 'section-group',
            sectionIds: ['s1-sets', 's1-counting', 's1-sum-rule', 's1-product-rule', 's1-review'],
            topicPrefix: '1',
          },
          {
            key: 'math-counting-probability-permutation',
            label: '順列と組合せ',
            unitId: unit.unitId,
            kind: 'section-group',
            sectionIds: ['s2-permutation', 's2-circular-repetition', 's2-combination', 's2-duplicate-permutation'],
            topicPrefix: '2',
          },
        ],
      })
      continue
    }

    chapters.push({
      key: `math-${unit.unitId}`,
      label: conciseMathTitle(unit.title),
      order: unit.unitId === 'math-1a-numbers-expressions-revised' ? 10 : 900,
      lessons: unit.sections.length > 1
        ? unit.sections.map((section) => ({
          key: `math-${unit.unitId}-${section.id}`,
          label: section.title,
          unitId: unit.unitId,
          kind: 'section' as const,
          sectionId: section.id,
        }))
        : [{ key: `math-${unit.unitId}`, label: conciseMathTitle(unit.title), unitId: unit.unitId, kind: 'unit' as const }],
    })
  }

  return chapters
}

function physicsChapters(units: PublicTextbookUnit[]): TextbookChapter[] {
  const grouped = new Map<string, TextbookChapter>()

  for (const unit of units) {
    const chapterNumber = physicsChapterNumber(unit)
    const meta = chapterNumber ? physicsChapterMeta[chapterNumber] : undefined
    const key = chapterNumber ? `physics-${chapterNumber}` : `physics-${unit.unitId}`
    const current = grouped.get(key) ?? {
      key,
      label: meta?.label ?? unit.subtitle ?? unit.title,
      order: meta?.order ?? 900,
      lessons: [],
    }
    current.lessons.push({
      key: unit.unitId,
      label: physicsUnitLabel(unit),
      unitId: unit.unitId,
      kind: 'unit',
    })
    grouped.set(key, current)
  }

  return [...grouped.values()].map((chapter) => ({
    ...chapter,
    lessons: [...chapter.lessons].sort((a, b) => a.label.localeCompare(b.label, 'ja')),
  }))
}

export function buildTextbookChapters(units: PublicTextbookUnit[], subject: Question['subject']) {
  const subjectUnits = units.filter((unit) => unit.subject === subject && unit.status === 'published')
  const chapters = subject === 'physics' ? physicsChapters(subjectUnits) : mathChapters(subjectUnits)
  return chapters.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'ja'))
}

export function findTextbookLessonTarget(units: PublicTextbookUnit[], key: string | null | undefined) {
  if (!key) return undefined
  for (const subject of ['math-1a', 'physics'] as const) {
    for (const chapter of buildTextbookChapters(units, subject)) {
      const lesson = chapter.lessons.find((candidate) => candidate.key === key)
      if (lesson) return { chapter, lesson }
    }
  }
  return undefined
}

export function physicsTopicPrefix(unit: PublicTextbookUnit) {
  return physicsUnitCode(unit)
}


export function textbookLessonHref(lesson: TextbookLessonTarget) {
  return `/learning/textbook/${lesson.unitId}?target=${encodeURIComponent(lesson.key)}`
}

export function textbookLessonItemIds(unit: PublicTextbookUnit | undefined, lesson: TextbookLessonTarget | undefined) {
  if (!unit || !lesson) return []
  if (lesson.kind === 'unit') return unit.sections.flatMap((section) => section.items.map((item) => item.id))
  if (lesson.kind === 'section') {
    return unit.sections.find((section) => section.id === lesson.sectionId)?.items.map((item) => item.id) ?? []
  }
  const sectionIds = new Set(lesson.sectionIds ?? [])
  return unit.sections
    .filter((section) => sectionIds.has(section.id))
    .flatMap((section) => section.items.map((item) => item.id))
}
