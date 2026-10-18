import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  TextbookAnswerBookSchema, TextbookReadingBlockSchema, TextbookUnitSchema,
  type TextbookAnswerBook, type TextbookReadingBlock, type TextbookUnit,
} from '../../../src/domain/textbookSchema'
import { mathSetUnit } from './set/setLesson'
import { mathPropositionReadingUnit } from './proposition/propositionReadingLesson'
import { mathQuantifierUnit } from './proposition/quantifierLesson'
import { mathPropositionProofUnit } from './proposition/propositionProofLesson'

// Source: the GOLDEN textbook factory validated revision 2127c3d4d35793546228ac2fe2a9d38e8a9f97be.
// Titles and subsection boundaries use existing headings / example blocks from that source.
// Teaching text, ordered exercises, figures, existing answer keys and stable item IDs stay unchanged.
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

type Cut = { sectionId:string; number:string; title:string; startsAt:string }
// Each startsAt is an existing source block ID, not an invented paragraph or
// rewritten heading. It is deliberately NOT every example/check marker: examples
// belonging to the same concept stay in their original guided learning sequence.
const subdivision:Record<string,readonly Cut[]> = {
  'math-sets': [
    {sectionId:'golden-set-01',number:'1.1',title:'集合と要素',startsAt:'heading-represent'},
    {sectionId:'golden-set-02',number:'1.2',title:'集合の表し方',startsAt:'marker-example-builder'},
    {sectionId:'golden-set-03',number:'1.3',title:'共通部分と和集合',startsAt:'heading-relations'},
    {sectionId:'golden-set-04',number:'1.4',title:'部分集合と空集合',startsAt:'marker-example-subset'},
    {sectionId:'golden-set-05',number:'1.5',title:'全体集合と補集合',startsAt:'heading-outside'},
    {sectionId:'golden-set-06',number:'1.6',title:'ド・モルガンの法則',startsAt:'marker-example-demorgan'},
    {sectionId:'golden-set-07',number:'1.7',title:'実数の集合と数直線',startsAt:'marker-example-real-line'},
  ],
  'math-propositions-reading': [
    {sectionId:'golden-prop-01',number:'2.1',title:'命題の真偽',startsAt:'heading-truth'},
    {sectionId:'golden-prop-02',number:'2.2',title:'必要条件と十分条件',startsAt:'heading-necessary-sufficient'},
    {sectionId:'golden-prop-03',number:'2.3',title:'同値条件',startsAt:'marker-example-equivalence'},
    {sectionId:'golden-prop-04',number:'2.4',title:'条件の否定',startsAt:'heading-negation'},
    {sectionId:'golden-prop-05',number:'2.5',title:'「かつ」「または」の否定',startsAt:'marker-example-compound-negation'},
  ],
  'math-quantifiers-all-exists': [
    {sectionId:'golden-quant-01',number:'2.6',title:'「ある」を考える',startsAt:'heading-quantifiers'},
    {sectionId:'golden-quant-02',number:'2.7',title:'「すべて」を考える',startsAt:'marker-example-all'},
  ],
  'math-propositions-proof': [
    {sectionId:'golden-proof-01',number:'3.1',title:'逆・裏・対偶',startsAt:'heading-reverse'},
    {sectionId:'golden-proof-02',number:'3.2',title:'対偶を用いた証明',startsAt:'heading-contrapositive-proof'},
    {sectionId:'golden-proof-03',number:'3.3',title:'背理法',startsAt:'heading-contradiction'},
  ],
}

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const originalUnits:RawUnit[] = [
  mathSetUnit, mathPropositionReadingUnit, mathQuantifierUnit, mathPropositionProofUnit,
] as unknown as RawUnit[]

function referencedItems(block:TextbookReadingBlock):string[] {
  if (block.type !== 'paragraph' && block.type !== 'formula') return []
  return block.parts.flatMap(part=>part.type === 'choice'
    ? [part.itemId] : part.type === 'math' ? (part.holeIds ?? []) : [])
}

function splitSourceSection(raw:RawUnit, original:RawUnit['sections'][number], figures:TextbookUnit['sections'][number]['figures']):TextbookUnit['sections'] {
  const cuts = subdivision[raw.unitId]
  if (!cuts || raw.sections.length !== 1) throw new Error('Unexpected GOLDEN structure: '+raw.unitId)
  const flow = original.readingFlow.map(block=>TextbookReadingBlockSchema.parse(block))
  const boundaries = cuts.map(({startsAt}) => {
    const index = flow.findIndex(block=>block.id === startsAt)
    if (index < 0) throw new Error('Missing original GOLDEN heading: '+raw.unitId+'/'+startsAt)
    return index
  })
  if (boundaries[0] !== 0 || boundaries.some((at,i)=>i>0 && at<=boundaries[i-1])) {
    throw new Error('GOLDEN knowledge cuts are not in reading order: '+raw.unitId)
  }
  const originalById = new Map(original.items.map(item=>[item.id,item]))
  const allUsed = new Set<string>()
  const allFigureIds = new Set<string>()
  const result = cuts.map((cut,i) => {
    const readingFlow = flow.slice(boundaries[i], boundaries[i+1] ?? flow.length)
    const ids = new Set(readingFlow.flatMap(referencedItems))
    for(const id of ids) {
      if (!originalById.has(id)) throw new Error('Missing GOLDEN source answer item: '+raw.unitId+'/'+id)
      if (allUsed.has(id)) throw new Error('Duplicate GOLDEN answer after split: '+raw.unitId+'/'+id)
      allUsed.add(id)
    }
    const figureIds = new Set(readingFlow.flatMap(block=>block.type === 'figure' ? [block.figureId] : []))
    for(const id of figureIds) allFigureIds.add(id)
    const items = original.items.filter(item=>ids.has(item.id)).map(item=>({
      id:item.id, label:item.label, prompt:item.prompt,
      answerType:item.answerType??'text' as const, acceptedAnswers:[...item.acceptedAnswers],
      ...(item.choices ? {choices:[...item.choices]} : {}),
    }))
    const localFigures = figures.filter(fig=>figureIds.has(fig.id))
    if(localFigures.length !== figureIds.size) throw new Error('Lost GOLDEN figure at '+raw.unitId+'/'+cut.sectionId)
    if(!readingFlow.length || !items.length) throw new Error('Empty GOLDEN knowledge point: '+raw.unitId+'/'+cut.sectionId)
    return {
      id:cut.sectionId, number:cut.number, title:cut.title,
      description:original.description,
      figures:localFigures, readingFlow, items,
    }
  })
  const allOriginalItems = new Set(original.items.map(item=>item.id))
  if(allUsed.size !== allOriginalItems.size || [...allOriginalItems].some(id=>!allUsed.has(id))) {
    throw new Error('Lost GOLDEN answer while splitting: '+raw.unitId)
  }
  const originalFigureIds = new Set(figures.map(fig=>fig.id))
  if(allFigureIds.size !== originalFigureIds.size || [...allFigureIds].some(id=>!originalFigureIds.has(id))) {
    throw new Error('Lost GOLDEN diagram while splitting: '+raw.unitId)
  }
  if (result.flatMap(sec=>sec.readingFlow.map(block=>block.id)).join('|') !== flow.map(block=>block.id).join('|')) {
    throw new Error('GOLDEN teaching order changed: '+raw.unitId)
  }
  return result
}

export function loadGoldenMathTextbooks(): {
  unit:TextbookUnit;answerBook:TextbookAnswerBook;assetMap:Map<string,Buffer>
}[] {
  return originalUnits.map(original => {
    const assetMap = new Map<string,Buffer>()
    const sections = original.sections.flatMap(section => {
      const figures = section.figures.map(fig => {
        const path = join(repoRoot,'public',fig.src.replace(/^\//,''))
        if (!existsSync(path)) throw new Error('Golden textbook original diagram missing: '+fig.src)
        const key = basename(path)
        assetMap.set(key,readFileSync(path))
        return {id:fig.id,src:'assets/'+key,alt:fig.alt,caption:fig.caption}
      })
      return splitSourceSection(original,section,figures)
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
