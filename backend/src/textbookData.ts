import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { builtInTextbookUnits } from '../../src/data/textbookUnits'
import { TextbookAnswerBookSchema, TextbookUnitSchema, type TextbookAnswerBook, type TextbookUnit } from '../../src/domain/textbookSchema'
import { strictSetsPropositionsAnswers, strictSetsPropositionsUnit } from './setsPropositionsStrict'
import { loadMathDocxTextbooks } from './mathDocxImporter'

export type LoadedTextbookUnit = {
  unit: TextbookUnit
  answerBook: TextbookAnswerBook
  dataDir?: string
  assetMap?: Map<string, Buffer>
}

const here = dirname(fileURLToPath(import.meta.url))
const dataRoot = join(here, '..', 'data', 'textbooks')
const mathSourceRoot = join(dataRoot, 'math-1a', 'source')

function legacyAnswerBook(unit: TextbookUnit): TextbookAnswerBook {
  const answers: TextbookAnswerBook['answers'] = {}
  for (const item of unit.sections.flatMap((section) => section.items)) {
    if (!item.answer) continue
    answers[item.id] = {
      validator: item.answerType === 'number' ? 'number' : 'normalized-text',
      answer: item.answer,
      acceptedAnswers: item.acceptedAnswers,
    }
  }
  return TextbookAnswerBookSchema.parse({ unitId: unit.unitId, answers })
}

function jsonFiles(root: string): string[] {
  if (!existsSync(root)) return []
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const next = join(root, entry.name)
    if (entry.isDirectory()) return jsonFiles(next)
    return entry.name === 'unit.json' ? [next] : []
  })
}

function applyContentCorrections(unit: TextbookUnit, answerBook: TextbookAnswerBook) {
  if (unit.unitId !== 'math-1a-counting-permutation') return { unit, answerBook }

  const targetSectionId = 's1-review'
  const oldAnswerItemId = 'math-a-s1-review-023'
  const newItems = [
    {
      id: 'math-a-s1-review-tv-union-max',
      label: '(1) 最大',
      prompt: 'テレビまたはスマートフォンを1時間以上利用する人数の最大値',
      answerType: 'number' as const,
      acceptedAnswers: [],
    },
    {
      id: 'math-a-s1-review-tv-union-min',
      label: '(1) 最小',
      prompt: 'テレビまたはスマートフォンを1時間以上利用する人数の最小値',
      answerType: 'number' as const,
      acceptedAnswers: [],
    },
    {
      id: 'math-a-s1-review-tv-both-max',
      label: '(2) 最大',
      prompt: 'テレビとスマートフォンの両方を1時間以上利用する人数の最大値',
      answerType: 'number' as const,
      acceptedAnswers: [],
    },
    {
      id: 'math-a-s1-review-tv-both-min',
      label: '(2) 最小',
      prompt: 'テレビとスマートフォンの両方を1時間以上利用する人数の最小値',
      answerType: 'number' as const,
      acceptedAnswers: [],
    },
  ]

  const correctedSections = unit.sections.map((section) => {
    if (section.id !== targetSectionId) return section

    const correctedFlow = section.readingFlow.map((block) => {
      if (block.id !== 's1-review-p-005') return block
      return {
        id: block.id,
        type: 'paragraph' as const,
        parts: [
          {
            type: 'text' as const,
            text: '40人中、毎日テレビ1時間以上16人、毎日スマートフォン1時間以上31人。(1) どちらかを1時間以上利用する人数の最大・最小、(2) 両方利用する人数の最大・最小を考える。集合の重なりを最小・最大にするとき、どちらの集合をもう一方へできるだけ',
          },
          { type: 'choice' as const, itemId: 'math-a-s1-review-021' },
          { type: 'text' as const, text: 'か、できるだけ' },
          { type: 'choice' as const, itemId: 'math-a-s1-review-022' },
          { type: 'text' as const, text: 'かを考える。その上で、(1) どちらかを1時間以上利用する人数は最大' },
          { type: 'choice' as const, itemId: 'math-a-s1-review-tv-union-max' },
          { type: 'text' as const, text: '人、最小' },
          { type: 'choice' as const, itemId: 'math-a-s1-review-tv-union-min' },
          { type: 'text' as const, text: '人。(2) 両方利用する人数は最大' },
          { type: 'choice' as const, itemId: 'math-a-s1-review-tv-both-max' },
          { type: 'text' as const, text: '人、最小' },
          { type: 'choice' as const, itemId: 'math-a-s1-review-tv-both-min' },
          { type: 'text' as const, text: '人。' },
        ],
      }
    })

    const correctedItems = section.items.flatMap((item) => {
      if (item.id === oldAnswerItemId) return newItems
      return [item]
    })

    return { ...section, readingFlow: correctedFlow, items: correctedItems }
  })

  const answers = { ...answerBook.answers }
  delete answers[oldAnswerItemId]
  answers['math-a-s1-review-tv-union-max'] = { validator: 'number', answer: '40', acceptedAnswers: [] }
  answers['math-a-s1-review-tv-union-min'] = { validator: 'number', answer: '31', acceptedAnswers: [] }
  answers['math-a-s1-review-tv-both-max'] = { validator: 'number', answer: '16', acceptedAnswers: [] }
  answers['math-a-s1-review-tv-both-min'] = { validator: 'number', answer: '7', acceptedAnswers: [] }

  return {
    unit: TextbookUnitSchema.parse({ ...unit, sections: correctedSections }),
    answerBook: TextbookAnswerBookSchema.parse({ ...answerBook, answers }),
  }
}

function loadJsonTextbooks(): LoadedTextbookUnit[] {
  return jsonFiles(dataRoot).map((unitPath) => {
    const dataDir = dirname(unitPath)
    const unit = TextbookUnitSchema.parse(JSON.parse(readFileSync(unitPath, 'utf8')))
    const answerPath = join(dataDir, 'answers.json')
    const answerBook = TextbookAnswerBookSchema.parse(JSON.parse(readFileSync(answerPath, 'utf8')))
    if (answerBook.unitId !== unit.unitId) throw new Error(`answer unitId mismatch: ${unit.unitId}`)
    return { ...applyContentCorrections(unit, answerBook), dataDir }
  })
}

const legacyTextbooks: LoadedTextbookUnit[] = builtInTextbookUnits.map((unit) => ({ unit, answerBook: legacyAnswerBook(unit) }))
const generatedTextbooks: LoadedTextbookUnit[] = [{ unit: strictSetsPropositionsUnit, answerBook: strictSetsPropositionsAnswers }]
const mathDocxImport = loadMathDocxTextbooks(mathSourceRoot)
const importedMathTextbooks: LoadedTextbookUnit[] = mathDocxImport.imported.map(({ unit, answerBook, assets }) => ({
  unit,
  answerBook,
  assetMap: assets,
}))

export const textbookImportDiagnostics = mathDocxImport.diagnostics
export const loadedTextbookUnits: LoadedTextbookUnit[] = [
  ...legacyTextbooks,
  ...generatedTextbooks,
  ...importedMathTextbooks,
  ...loadJsonTextbooks(),
]

export function findLoadedTextbook(unitId: string) {
  return loadedTextbookUnits.find(({ unit }) => unit.unitId === unitId && unit.status === 'published')
}

export function textbookDataRoot() {
  return dataRoot
}
