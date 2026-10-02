import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadedPracticeUnits } from './practiceData'
import { PracticeSourceBankSchema, type PracticeSourceItem } from './practiceSourceSchema'

export type LoadedPracticeSourceItem = PracticeSourceItem & {
  subject: 'math-1a'
  course: 'math-i'
  sourceLabel: string
}

function sourceFiles(root: string) {
  if (!existsSync(root)) return []
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => join(root, entry.name))
}

function loadPracticeSourceItems(): LoadedPracticeSourceItem[] {
  const loaded: LoadedPracticeSourceItem[] = []
  const ids = new Set<string>()
  const hashes = new Set<string>()

  for (const unit of loadedPracticeUnits) {
    const sourceDir = join(unit.dataDir, 'source')
    const subcategories = new Map(unit.catalog.subcategories.map((subcategory) => [subcategory.id, subcategory]))

    for (const path of sourceFiles(sourceDir)) {
      const bank = PracticeSourceBankSchema.parse(JSON.parse(readFileSync(path, 'utf8')))

      if (bank.subject !== unit.catalog.subject) throw new Error(`practice source subject mismatch: ${path}`)
      if (bank.course !== unit.catalog.course) throw new Error(`practice source course mismatch: ${path}`)
      if (bank.majorUnit !== unit.catalog.majorUnit.id) throw new Error(`practice source majorUnit mismatch: ${path}`)

      const subcategory = subcategories.get(bank.subcategory)
      if (!subcategory) throw new Error(`unknown practice source subcategory ${bank.subcategory}: ${path}`)

      for (const item of bank.items) {
        if (item.majorUnit !== bank.majorUnit) throw new Error(`source item majorUnit mismatch: ${item.sourceQuestionId}`)
        if (item.subcategory !== bank.subcategory) throw new Error(`source item subcategory mismatch: ${item.sourceQuestionId}`)
        if (!subcategory.problemTypes.some((problemType) => problemType.id === item.problemType)) {
          throw new Error(`unknown source problemType ${item.problemType}: ${item.sourceQuestionId}`)
        }
        if (ids.has(item.sourceQuestionId)) throw new Error(`duplicate sourceQuestionId: ${item.sourceQuestionId}`)
        if (hashes.has(item.contentHash)) throw new Error(`duplicate source contentHash: ${item.contentHash}`)
        ids.add(item.sourceQuestionId)
        hashes.add(item.contentHash)

        loaded.push({
          ...item,
          subject: bank.subject,
          course: bank.course,
          sourceLabel: bank.source.label,
        })
      }
    }
  }

  return loaded.sort((a, b) => {
    if (a.sourcePage !== b.sourcePage) return a.sourcePage - b.sourcePage
    return a.sourceQuestionId.localeCompare(b.sourceQuestionId)
  })
}

export const loadedPracticeSourceItems = loadPracticeSourceItems()
