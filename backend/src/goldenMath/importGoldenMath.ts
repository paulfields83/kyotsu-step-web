import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TextbookAnswerBookSchema, TextbookUnitSchema, type TextbookAnswerBook, type TextbookUnit } from '../../../src/domain/textbookSchema'
import { mathSetUnit } from './set/setLesson'
import { mathPropositionReadingUnit } from './proposition/propositionReadingLesson'
import { mathQuantifierUnit } from './proposition/quantifierLesson'
import { mathPropositionProofUnit } from './proposition/propositionProofLesson'

// Source: validated 2127c3d4d35793546228ac2fe2a9d38e8a9f97be,
// rrikunagasige-dot/kyotsu-step-web, documented in the uploaded AI handoff.
// No learning prose, answer or distractor is rewritten here.
type RawUnit = {
  unitId:string;revision:number;status:'published'|'review'|'draft';subject:'math-1a'
  title:string;subtitle?:string;source:{type:'reference'|'original'|'licensed';label:string;rightsNote?:string}
  objectives:readonly string[]
  sections:readonly {
    id:string;number:string;title:string;description?:string
    figures: readonly {id:string;src:string;alt:string;caption?:string}[]
    readingFlow:readonly unknown[]
    items:readonly {id:string;label:string;prompt:string;answer:string;acceptedAnswers:readonly string[];
      answerType?:'text'|'number'|'formula';choices?:readonly string[];hints?:readonly string[]}[]
  }[]
}
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const originalUnits:RawUnit[] = [
  mathSetUnit,mathPropositionReadingUnit,mathQuantifierUnit,mathPropositionProofUnit,
] as unknown as RawUnit[]

export function loadGoldenMathTextbooks(): {
  unit:TextbookUnit;answerBook:TextbookAnswerBook;assetMap:Map<string,Buffer>
}[] {
  return originalUnits.map(original => {
    const assetMap = new Map<string,Buffer>()
    const sections = original.sections.map(section => {
      const figures = section.figures.map(fig => {
        const path = join(repoRoot,'public',fig.src.replace(/^\//,''))
        if (!existsSync(path)) throw new Error('Golden textbook original diagram missing: '+fig.src)
        const key = basename(path)
        assetMap.set(key,readFileSync(path))
        return {id:fig.id,src:'assets/'+key,alt:fig.alt,caption:fig.caption}
      })
      return {
        id:section.id,number:section.number,title:section.title,description:section.description,
        figures,readingFlow:section.readingFlow,
        items:section.items.map(item => ({
          id:item.id,label:item.label,prompt:item.prompt,answerType:item.answerType??'text',
          acceptedAnswers:[...item.acceptedAnswers],
          ...(item.choices ? {choices:[...item.choices]} : {}),
        })),
      }
    })
    const unit = TextbookUnitSchema.parse({
      schemaVersion:'1.0',unitId:original.unitId,revision:original.revision,
      status:original.status,subject:original.subject,title:original.title,subtitle:original.subtitle,
      source:{
        ...original.source,
        rightsNote:(original.source.rightsNote??'')+' / ZIP AI_FACTORY_HANDOFF 2026-10-04, validated source 2127c3d4.',
      },
      objectives:original.objectives,sections,
    })
    const answers:TextbookAnswerBook['answers'] = {}
    for (const section of original.sections) for (const item of section.items) {
      answers[item.id] = {
        validator:item.answerType==='number'?'number':'normalized-text',
        answer:item.answer,acceptedAnswers:[...item.acceptedAnswers],
      }
    }
    const answerBook = TextbookAnswerBookSchema.parse({unitId:unit.unitId,answers})
    return {unit,answerBook,assetMap}
  })
}
