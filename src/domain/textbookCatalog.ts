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

  for (const unit of units) {
    if (unit.unitId === 'math-1a-sets-propositions') {
      chapters.push({
        key: 'math-sets-propositions',
        label: '集合と命題',
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
      order: 900,
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
