import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { loadedTextbookUnits } from '../../backend/src/textbookData'
import { publicTextbookUnit } from '../../backend/src/publicTextbook'

describe('all published math and physics textbook rendering', () => {
  it('counts unresolved KaTeX errors, damaged characters and noninteractive source markers', () => {
    const brokenMath: Array<{unitId: string; blockId: string; latex: string; error: string}> = []
    const damagedText: Array<{unitId: string; blockId: string; value: string}> = []
    const unlinkedBoxes: Array<{unitId:string; blockId:string; type:string; value:string}> = []
    let equations = 0
    let figures = 0
    let blanks = 0
    for (const {unit, answerBook} of loadedTextbookUnits) {
      if (unit.status !== 'published') continue
      const publicUnit = publicTextbookUnit(unit, answerBook)
      for (const section of publicUnit.sections) {
        figures += section.figures.length
        blanks += section.items.length
        for (const block of section.readingFlow) {
          if (block.type !== 'paragraph' && block.type !== 'formula') continue
          for (const part of block.parts) {
            if (part.type === 'math' && /\\square/.test(part.latex) && !(part.holeIds?.length)) {
              unlinkedBoxes.push({unitId:unit.unitId,blockId:block.id,type:'formula',value:part.latex.slice(0,100)})
            }
            if (part.type === 'text' && /【[^】]*】|▫/.test(part.text)) {
              unlinkedBoxes.push({unitId:unit.unitId,blockId:block.id,type:'text',value:part.text.slice(0,100)})
            }
            if (part.type === 'math') {
              equations += 1
              try { katex.renderToString(part.latex, {throwOnError:true,strict:'ignore'}) }
              catch(e) { brokenMath.push({unitId:unit.unitId,blockId:block.id,latex:part.latex.slice(0,130),error:String(e).slice(0,120)}) }
            }
            if (part.type === 'text' && /\uFFFD|\u25A1|\u0000/.test(part.text)) {
              damagedText.push({unitId:unit.unitId,blockId:block.id,value:part.text.slice(0,120)})
            }
          }
        }
      }
    }
    const mathGroups = Object.fromEntries([...new Set(brokenMath.map(x=>x.unitId))].map(id=>[id,brokenMath.filter(x=>x.unitId===id).length]))
    console.log('ALL_TEXTBOOK_RENDER_AUDIT ' + JSON.stringify({publishedUnits:loadedTextbookUnits.filter(x=>x.unit.status==='published').length,equations,figures,blanks,latexErrors:brokenMath.length,mathGroups,mathSamples:brokenMath.slice(0,30),damagedCharacters:damagedText.length,textSamples:damagedText.slice(0,20),unlinkedBoxCount:unlinkedBoxes.length,unlinkedBoxExamples:unlinkedBoxes.slice(0,30)}))
    expect(equations).toBeGreaterThan(100)
    expect(unlinkedBoxes.filter(x => x.unitId === 'math-1a-numbers-expressions-revised')).toEqual([])
    expect(brokenMath).toEqual([])
    expect(damagedText).toEqual([])
  })
})
