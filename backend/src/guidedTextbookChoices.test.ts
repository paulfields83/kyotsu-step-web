import { describe, expect, it } from 'vitest'
import { loadedTextbookUnits } from './textbookData'
import { getGuidedTextbookChoices } from './guidedTextbookChoices'
import { publicTextbookUnit } from './publicTextbook'
import { isTextbookAnswerCorrect, normalizeTextbookAnswer } from '../../src/domain/textbook'

describe('guided multiple-choice textbook export', () => {
  it('provides 2–4 distinct clickable answers for every published math and physics item', () => {
    let count = 0, originallyAuthored = 0, generated = 0, fallback = 0
    const report: Record<string, number> = {}
    for (const { unit, answerBook } of loadedTextbookUnits) {
      if (unit.status !== 'published') continue
      const publicUnit = publicTextbookUnit(unit, answerBook)
      for (const section of publicUnit.sections) {
        for (const item of section.items) {
          count++
          const sourceItem = unit.sections.find(s => s.id === section.id)?.items.find(i => i.id === item.id)
          expect(sourceItem).toBeDefined()
          const answer = answerBook.answers[item.id]
          expect(answer).toBeDefined()
          const choices = item.choices
          expect(choices.length, item.id).toBeGreaterThanOrEqual(2)
          expect(choices.length, item.id).toBeLessThanOrEqual(4)
          expect(new Set(choices.map(normalizeTextbookAnswer)).size, item.id).toBe(choices.length)
          expect(choices.filter(choice => isTextbookAnswerCorrect(answer, choice)), item.id).toHaveLength(1)
          expect(getGuidedTextbookChoices(unit, sourceItem!, answerBook)).toEqual(choices)
          if (sourceItem?.choices?.length) originallyAuthored++
          else generated++
          if (choices.includes('この条件だけでは決まらない') ||
              choices.includes('どの選択肢にも当てはまらない')) {
            fallback++
            report[section.id] = (report[section.id] ?? 0) + 1
          }
        }
      }
    }
    console.log('GUIDED_CHOICE_QA '+JSON.stringify({items:count,originallyAuthored,generated,metaFallbackItems:fallback,fallbackBySection:report}))
    expect(count).toBeGreaterThan(1500)
  })

  it('uses actual answer-key values for sample guided formula choices', () => {
    const loaded = loadedTextbookUnits.find(x=>x.unit.unitId==='math-1a-numbers-expressions-revised')!
    for(const [id,answer] of [
      ['math-revised-n01-question-01','-1'],
      ['math-revised-n01-question-03','5y'],
      ['math-revised-n04-hole-01','4'],
    ]) {
      const item = loaded.unit.sections.flatMap(s=>s.items).find(i=>i.id===id)!
      const options = getGuidedTextbookChoices(loaded.unit,item,loaded.answerBook)
      expect(options).toContain(answer)
      expect(options.length).toBeGreaterThanOrEqual(3)
    }
  })
})
