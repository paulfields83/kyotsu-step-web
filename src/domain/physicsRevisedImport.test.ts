import {describe,expect,it} from 'vitest'
import {existsSync,statSync} from 'node:fs'
import {join} from 'node:path'
import {revisedPhysicsTextbooks} from '../../backend/src/zipPhysics/importRevisedPhysics'
import {loadedTextbookUnits} from '../../backend/src/textbookData'
import {publicTextbookUnit} from '../../backend/src/publicTextbook'
import {buildTextbookChapters} from './textbookCatalog'

describe('Chapter 1 physical textbook authoritative revised ZIP',()=>{
  it('preserves 7 units, exactly 100 authored guided blanks and 18 canonical/approved figures',()=>{
    expect(revisedPhysicsTextbooks).toHaveLength(7)
    expect(revisedPhysicsTextbooks.map(({unit})=>unit.title)).toEqual([
      '1A 変位と速度','1B 速度の合成と分解','1C 相対速度',
      '1D 加速度','1E 水平投射','1F 斜方投射',
      '1G 重力加速度・空気抵抗・終端速度',
    ])
    expect(revisedPhysicsTextbooks.reduce((sum,{unit})=>
      sum+unit.sections.reduce((n,section)=>n+section.items.length,0),0)).toBe(100)
    expect(revisedPhysicsTextbooks.reduce((sum,{unit})=>
      sum+unit.sections.reduce((n,section)=>n+section.figures.length,0),0)).toBe(18)
    for(const {unit,answerBook,dataDir} of revisedPhysicsTextbooks){
      expect(unit.unitId.endsWith('-revised')).toBe(true)
      expect(unit.status).toBe('published')
      expect(unit.sections).toHaveLength(1)
      for(const section of unit.sections){
        for(const item of section.items){
          const entry=answerBook.answers[item.id]
          expect(entry,unit.unitId+' '+item.id).toBeTruthy()
          expect(item.choices,unit.unitId+' '+item.id).toContain(entry.answer)
          expect(item.hints?.length,unit.unitId+' '+item.id).toBe(2)
        }
        for(const figure of section.figures){
          const file=join(dataDir,'assets',figure.src.replace(/^assets\//,''))
          expect(existsSync(file),file).toBe(true)
          expect(statSync(file).size,file).toBeGreaterThan(2500)
        }
      }
      const publicData=publicTextbookUnit(unit,answerBook,'https://api.example')
      expect(JSON.stringify(publicData)).not.toContain('"answer":')
    }
  })
  it('hides duplicate original Chapter 1 sources in the student navigation while retaining archive storage',()=>{
    expect(loadedTextbookUnits.some(({unit})=>unit.unitId==='physics-a-displacement-velocity')).toBe(true)
    const ids=loadedTextbookUnits.map(({unit,answerBook})=>publicTextbookUnit(unit,answerBook))
    const chapters=buildTextbookChapters(ids,'physics')
    expect(chapters[0].label).toBe('物体の運動（改訂版）')
    expect(chapters[0].lessons.map(x=>x.label))
      .toEqual(['第1節　運動を表す','第2節　速度の変化','第3節　力と運動'])
    expect(chapters[0].lessons.flatMap(x=>x.topics??[]).map(x=>x.unitId))
      .toEqual(revisedPhysicsTextbooks.map(x=>x.unit.unitId))
  })
})
