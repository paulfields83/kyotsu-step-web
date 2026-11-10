import {describe,expect,it} from 'vitest'
import {loadedTextbookUnits} from '../../backend/src/textbookData'
import {publicTextbookUnit} from '../../backend/src/publicTextbook'
import {getGuidedTextbookChoices} from '../../backend/src/guidedTextbookChoices'
import {isTextbookAnswerCorrect,normalizeTextbookAnswer} from './textbook'
import {textbookMathLatex} from './textbookMathDisplay'

const expected=[
  {unitId:'math-sets',sections:7,status:'published'},
  {unitId:'math-propositions-reading',sections:5,status:'review',itemCount:14},
  {unitId:'math-quantifiers-all-exists',sections:2,status:'review',itemCount:11},
  {unitId:'math-propositions-proof',sections:3,status:'review',itemCount:23},
] as const

describe('complete 集合と命題 ZIP integration',()=>{
  it('retains every source subsection, answer, interactive position and image',()=>{
    let total=0
    const hints:{unit:string,count:number}[]=[]
    for(const source of expected){
      const record=loadedTextbookUnits.find(x=>x.unit.unitId===source.unitId)
      expect(record,source.unitId).toBeDefined()
      const {unit,answerBook,assetMap}=record!
      expect(unit.status,source.unitId).toBe(source.status)
      expect(unit.sections,source.unitId).toHaveLength(source.sections)
      const items=unit.sections.flatMap(s=>s.items)
      if('itemCount' in source) expect(items,source.unitId).toHaveLength(source.itemCount)
      const ids=new Set(items.map(x=>x.id))
      expect(ids.size,source.unitId).toBe(items.length)
      expect(new Set(Object.keys(answerBook.answers))).toEqual(ids)
      const publicUnit=publicTextbookUnit(unit,answerBook)
      expect(publicUnit.sections.map(s=>s.id)).toEqual(unit.sections.map(s=>s.id))
      for(const section of unit.sections){
        const referenced=new Set(section.readingFlow.flatMap(block=>(block.type==='paragraph'||block.type==='formula')
          ? block.parts.flatMap(part=>part.type==='choice'?[part.itemId]:part.type==='math'?(part.holeIds??[]):[])
          : []))
        expect(referenced,section.id).toEqual(new Set(section.items.map(x=>x.id)))
        for(const figure of section.figures){
          expect(assetMap?.has(figure.src.slice('assets/'.length)),figure.id).toBe(true)
        }
        const published=publicUnit.sections.find(s=>s.id===section.id)!
        for(const item of section.items){
          total++
          const entry=answerBook.answers[item.id]
          const exportItem=published.items.find(x=>x.id===item.id)!
          const choices=getGuidedTextbookChoices(unit,item,answerBook)
          expect(exportItem.choices,item.id).toEqual(choices)
          expect(choices.length,item.id).toBeGreaterThanOrEqual(2)
          expect(choices.length,item.id).toBeLessThanOrEqual(4)
          expect(new Set(choices.map(normalizeTextbookAnswer)).size,item.id).toBe(choices.length)
          expect(choices.filter(x=>isTextbookAnswerCorrect(entry,x)),item.id).toHaveLength(1)
          expect(exportItem.hints,item.id).toEqual(item.hints)
          if (item.choices?.length && item.choices.length >= 2) {
            // Authored binary choices stay binary. No invented undecidable/
            // none-of-the-above filler in any GOLDEN source section.
            expect(choices.length,item.id).toBeLessThanOrEqual(item.choices.length)
            for (const choice of choices) expect(item.choices,item.id).toContain(choice)
            expect(choices.filter(choice =>
              choice === 'この条件だけでは決まらない'
              || choice === 'どの選択肢にも当てはまらない',
            ),item.id).toEqual(item.choices.filter(choice =>
              choice === 'この条件だけでは決まらない'
              || choice === 'どの選択肢にも当てはまらない',
            ))
          }
          for (const choice of choices) {
            if (/\\\\[A-Za-z]+/.test(choice) && !/[ぁ-んァ-ン一-龯]/u.test(choice)) {
              expect(textbookMathLatex(choice),item.id+' '+choice).not.toBeNull()
            }
          }
        }
      }
      hints.push({unit:source.unitId,count:items.filter(x=>Boolean(x.hints?.length)).length})
    }
    console.log('COMPLETE_SETS_PROPS_QA '+JSON.stringify({total,units:expected.length,sectionCount:expected.reduce((n,u)=>n+u.sections,0),hints}))
    expect(total).toBeGreaterThan(48)
    expect(hints.filter(x=>x.unit!=='math-sets').every(x=>x.count>0)).toBe(true)
  })
})
