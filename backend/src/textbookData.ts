import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { builtInTextbookUnits } from '../../src/data/textbookUnits'
import { TextbookAnswerBookSchema, TextbookUnitSchema, type TextbookAnswerBook, type TextbookUnit } from '../../src/domain/textbookSchema'

export type LoadedTextbookUnit = {
  unit: TextbookUnit
  answerBook: TextbookAnswerBook
}

const here = dirname(fileURLToPath(import.meta.url))
const dataRoot = join(here, '..', 'data', 'textbooks')

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

function loadJsonTextbooks(): LoadedTextbookUnit[] {
  return jsonFiles(dataRoot).map((unitPath) => {
    const unit = TextbookUnitSchema.parse(JSON.parse(readFileSync(unitPath, 'utf8')))
    const answerPath = join(dirname(unitPath), 'answers.json')
    const answerBook = TextbookAnswerBookSchema.parse(JSON.parse(readFileSync(answerPath, 'utf8')))
    if (answerBook.unitId !== unit.unitId) throw new Error(`answer unitId mismatch: ${unit.unitId}`)
    return { unit, answerBook }
  })
}

const legacyTextbooks = builtInTextbookUnits.map((unit) => ({ unit, answerBook: legacyAnswerBook(unit) }))

export const loadedTextbookUnits: LoadedTextbookUnit[] = [...legacyTextbooks, ...loadJsonTextbooks()]

export function findLoadedTextbook(unitId: string) {
  return loadedTextbookUnits.find(({ unit }) => unit.unitId === unitId && unit.status === 'published')
}

export function textbookDataRoot() {
  return dataRoot
}
