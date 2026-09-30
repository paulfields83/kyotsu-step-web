import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  PracticeCatalogSchema,
  PracticeQuestionSetSchema,
  type PracticeCatalog,
  type PracticeQuestion,
} from './practiceSchema'

export type LoadedPracticeUnit = {
  catalog: PracticeCatalog
  questions: PracticeQuestion[]
  dataDir: string
}

const here = dirname(fileURLToPath(import.meta.url))
const dataRoot = join(here, '..', 'data', 'practice')

function catalogFiles(root: string): string[] {
  if (!existsSync(root)) return []
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const next = join(root, entry.name)
    if (entry.isDirectory()) return catalogFiles(next)
    return entry.name === 'catalog.json' ? [next] : []
  })
}

function validateHierarchy(catalog: PracticeCatalog, questions: PracticeQuestion[]) {
  const subcategories = new Map(catalog.subcategories.map((item) => [item.id, item]))
  const questionIds = new Set<string>()

  for (const question of questions) {
    if (questionIds.has(question.questionId)) throw new Error(`duplicate practice questionId: ${question.questionId}`)
    questionIds.add(question.questionId)

    if (question.subject !== catalog.subject) throw new Error(`practice subject mismatch: ${question.questionId}`)
    if (question.course !== catalog.course) throw new Error(`practice course mismatch: ${question.questionId}`)
    if (question.majorUnit !== catalog.majorUnit.id) throw new Error(`practice majorUnit mismatch: ${question.questionId}`)

    const subcategory = subcategories.get(question.subcategory)
    if (!subcategory) throw new Error(`unknown practice subcategory ${question.subcategory}: ${question.questionId}`)
    if (!subcategory.problemTypes.some((type) => type.id === question.problemType)) {
      throw new Error(`unknown practice problemType ${question.problemType}: ${question.questionId}`)
    }

    const stepIds = new Set(question.solutionSteps.map((step) => step.id))
    const blankIds = new Set(question.blanks.map((blank) => blank.id))

    for (const step of question.solutionSteps) {
      for (const dependency of step.dependsOn) {
        if (!stepIds.has(dependency)) throw new Error(`unknown step dependency ${dependency}: ${question.questionId}/${step.id}`)
      }
      for (const blankId of step.blankIds) {
        if (!blankIds.has(blankId)) throw new Error(`unknown blank reference ${blankId}: ${question.questionId}/${step.id}`)
      }
    }

    for (const blank of question.blanks) {
      if (!stepIds.has(blank.stepId)) throw new Error(`unknown stepId ${blank.stepId}: ${question.questionId}/${blank.id}`)
      const optionIds = new Set(blank.options.map((option) => option.id))
      for (const correctId of blank.correctOptionIds) {
        if (!optionIds.has(correctId)) throw new Error(`unknown correct option ${correctId}: ${question.questionId}/${blank.id}`)
      }
    }
  }
}

function loadPracticeUnits(): LoadedPracticeUnit[] {
  return catalogFiles(dataRoot).map((catalogPath) => {
    const dataDir = dirname(catalogPath)
    const catalog = PracticeCatalogSchema.parse(JSON.parse(readFileSync(catalogPath, 'utf8')))
    const questionsPath = join(dataDir, 'questions.json')
    if (!existsSync(questionsPath)) throw new Error(`missing questions.json beside ${catalogPath}`)
    const questionSet = PracticeQuestionSetSchema.parse(JSON.parse(readFileSync(questionsPath, 'utf8')))
    validateHierarchy(catalog, questionSet.questions)
    return { catalog, questions: questionSet.questions, dataDir }
  })
}

export const loadedPracticeUnits = loadPracticeUnits()

export function findPracticeQuestion(questionId: string) {
  for (const unit of loadedPracticeUnits) {
    const question = unit.questions.find((candidate) => candidate.questionId === questionId && candidate.status === 'published')
    if (question) return { unit, question }
  }
  return undefined
}

export function practiceDataRoot() {
  return dataRoot
}
