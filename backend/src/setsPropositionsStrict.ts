import { TextbookAnswerBookSchema, TextbookUnitSchema, type TextbookAnswerBook, type TextbookItem, type TextbookReadingBlock, type TextbookSection, type TextbookUnit } from '../../src/domain/textbookSchema'
import { defs1 } from './setsPropositionsDefs1'
import { defs2 } from './setsPropositionsDefs2'
import { defs3 } from './setsPropositionsDefs3'
import { defs4 } from './setsPropositionsDefs4'
import { defs5 } from './setsPropositionsDefs5'
import { defs6 } from './setsPropositionsDefs6'
import type { SectionDef } from './setsPropositionsTypes'

const svgData = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
const figures: Record<string,{src:string;alt:string;caption:string}> = {
  venn:{src:svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="360" viewBox="0 0 760 360"><rect width="100%" height="100%" fill="white"/><circle cx="315" cy="180" r="120" fill="none" stroke="#222" stroke-width="4"/><circle cx="445" cy="180" r="120" fill="none" stroke="#222" stroke-width="4"/><text x="245" y="80" font-size="34">A</text><text x="500" y="80" font-size="34">B</text><text x="380" y="190" text-anchor="middle" font-size="28">A∩B</text></svg>`),alt:'集合 A・B と共通部分 A∩B の模式図',caption:'共通部分 A∩B のイメージ'},
  numline:{src:svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="920" height="260" viewBox="0 0 920 260"><rect width="100%" height="100%" fill="white"/><line x1="70" y1="130" x2="850" y2="130" stroke="#222" stroke-width="3"/><line x1="150" y1="72" x2="650" y2="72" stroke="#3574b8" stroke-width="12"/><circle cx="150" cy="72" r="10" fill="white" stroke="#222" stroke-width="3"/><circle cx="650" cy="72" r="10" fill="white" stroke="#222" stroke-width="3"/><text x="400" y="48" text-anchor="middle" font-size="26">A : −3&lt;x&lt;4</text><line x1="250" y1="218" x2="750" y2="218" stroke="#d06b3c" stroke-width="12"/><circle cx="250" cy="218" r="10" fill="#222"/><circle cx="750" cy="218" r="10" fill="#222"/><text x="500" y="248" text-anchor="middle" font-size="26">B : −2≦x≦5</text></svg>`),alt:'区間 A と B を重ねた数直線',caption:'区間の共通部分・和集合を数直線で確認する'},
  'section1-q2-diagrams':{src:svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="520" viewBox="0 0 1000 520"><rect width="100%" height="100%" fill="white"/><text x="130" y="45" font-size="28">①</text><text x="380" y="45" font-size="28">②</text><text x="630" y="45" font-size="28">③</text><text x="880" y="45" font-size="28">④</text><g transform="translate(20,70)"><circle cx="65" cy="160" r="50" fill="none" stroke="#3574b8" stroke-width="4"/><circle cx="160" cy="160" r="50" fill="none" stroke="#d06b3c" stroke-width="4"/></g><g transform="translate(270,70)"><circle cx="90" cy="160" r="70" fill="none" stroke="#3574b8" stroke-width="4"/><circle cx="145" cy="160" r="70" fill="none" stroke="#d06b3c" stroke-width="4"/></g><g transform="translate(520,70)"><circle cx="110" cy="160" r="95" fill="none" stroke="#3574b8" stroke-width="4"/><circle cx="110" cy="160" r="48" fill="none" stroke="#d06b3c" stroke-width="4"/></g><g transform="translate(770,70)"><circle cx="110" cy="160" r="95" fill="none" stroke="#d06b3c" stroke-width="4"/><circle cx="110" cy="160" r="48" fill="none" stroke="#3574b8" stroke-width="4"/></g></svg>`),alt:'包含関係を選ぶ4つの模式図',caption:'第1節節末2の選択図'},
  'q14-counterexample':{src:svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="620" height="460" viewBox="0 0 620 460"><rect width="100%" height="100%" fill="white"/><polygon points="145,90 455,135 520,345 80,300" fill="none" stroke="#222" stroke-width="5"/><line x1="145" y1="90" x2="520" y2="345" stroke="#3574b8" stroke-width="4"/><line x1="455" y1="135" x2="80" y2="300" stroke="#d06b3c" stroke-width="4"/><text x="310" y="420" text-anchor="middle" font-size="26">AC = BD でも、長方形とは限らない</text></svg>`),alt:'AC=BD でも長方形ではない反例図',caption:'問14の反例図'},
}
const defs: SectionDef[] = [...defs1,...defs2,...defs3,...defs4,...defs5,...defs6]

function answerType(answer:string): TextbookItem['answerType'] {
  if (/^-?\d+(?:\.\d+)?$/.test(answer)) return 'number'
  if (/[{}≦≧<>⇒⇔⊂⊃∩∪=²√∅∉∈｜]/.test(answer)) return 'formula'
  return 'text'
}

function validator(answer:string): 'normalized-text'|'number'|'math-equivalent' {
  const type=answerType(answer)
  return type==='number'?'number':type==='formula'?'math-equivalent':'normalized-text'
}

function itemId(key:string,n:number){
  return `m1-${key}-${String(n).padStart(3,'0')}`
}

function parts(text:string,key:string){
  const out:Array<{type:'text';text:string}|{type:'choice';itemId:string}>=[]
  let cursor=0
  for(const match of text.matchAll(/【(\d+)】/g)){
    const index=match.index??0
    if(index>cursor) out.push({type:'text',text:text.slice(cursor,index)})
    out.push({type:'choice',itemId:itemId(key,Number(match[1]))})
    cursor=index+match[0].length
  }
  if(cursor<text.length) out.push({type:'text',text:text.slice(cursor)})
  return out
}

function redundantHeading(text:string, def:SectionDef){
  const compact=text.replace(/\s+/g,'')
  const title=def.title.replace(/\s+/g,'')
  return /^第[12]節/.test(text) || compact.includes(title)
}

function buildTopic(def:SectionDef){
  const used=new Set<string>()
  const readingFlow:TextbookReadingBlock[]=[
    {id:`topic-${def.key}`,type:'topic',text:def.title},
    ...def.blocks.flatMap(([kind,text],index):TextbookReadingBlock[]=>{
      const id=`sec-${def.key}-${kind}-${String(index+1).padStart(3,'0')}`
      if(kind==='h'){
        if(redundantHeading(text,def)) return []
        return [{id,type:'heading',text}]
      }
      if(kind==='n') return [{id,type:'note',text}]
      if(kind==='f'){
        used.add(text)
        return [{id,type:'figure',figureId:text}]
      }
      return [{id,type:'paragraph',parts:parts(text,def.key)}]
    }),
  ]

  const items:TextbookItem[]=def.answers.map((answer,index)=>({
    id:itemId(def.key,index+1),
    label:String(index+1),
    prompt:`${def.title} 【${index+1}】`,
    answerType:answerType(answer),
    acceptedAnswers:[],
  }))

  const answers:TextbookAnswerBook['answers']={}
  def.answers.forEach((answer,index)=>{
    answers[itemId(def.key,index+1)]={validator:validator(answer),answer,acceptedAnswers:[]}
  })

  return {
    key:def.key,
    readingFlow,
    items,
    figures:[...used].map(id=>({id,...figures[id]})),
    answers,
  }
}

const topics=new Map(defs.map((def)=>[def.key,buildTopic(def)]))

const sectionGroups=[
  {
    id:'sets',
    number:'1',
    title:'集合',
    description:'集合・要素から補集合、ド・モルガンまでを、教科書の問と一緒に連続して学ぶ。',
    keys:['s11','s12','s13','s14','s15','s16','s17','s18'],
  },
  {
    id:'propositions',
    number:'2',
    title:'命題',
    description:'真偽・反例・必要十分・否定・逆裏対偶を、条件の向きから一つずつ判断する。',
    keys:['s21','s22','s23','s24','s25'],
  },
  {
    id:'proof',
    number:'3',
    title:'証明',
    description:'対偶と背理法を中心に、節末・研究・章末問題まで証明の流れを崩さず進める。',
    keys:['s26','s27','s28','s29','ch'],
  },
] as const

const sections:TextbookSection[]=sectionGroups.map((group)=>{
  const groupTopics=group.keys.map((key)=>{
    const topic=topics.get(key)
    if(!topic) throw new Error(`missing topic: ${key}`)
    return topic
  })
  const figureMap=new Map(groupTopics.flatMap((topic)=>topic.figures).map((figure)=>[figure.id,figure]))
  return {
    id:`sec-${group.id}`,
    number:group.number,
    title:group.title,
    description:group.description,
    figures:[...figureMap.values()],
    readingFlow:groupTopics.flatMap((topic)=>topic.readingFlow),
    items:groupTopics.flatMap((topic)=>topic.items),
  }
})

export const strictSetsPropositionsUnit:TextbookUnit=TextbookUnitSchema.parse({
  schemaVersion:'1.0',
  unitId:'math-1a-sets-propositions',
  revision:2,
  status:'published',
  subject:'math-1a',
  title:'数学I 集合と命題',
  subtitle:'集合 ／ 命題 ／ 証明｜厳格誘導 Standard',
  source:{
    type:'reference',
    label:'啓林館版 α数学I 第3章「集合と命題」＋教科書学習モード完全版・厳格誘導版',
    rightsNote:'ユーザー提供教材とユーザー確認済みWord母本から構造化。公開データには正答を含めない。',
  },
  objectives:[
    '集合・要素・包含関係・共通部分・和集合・補集合を条件の意味から判断する。',
    '命題の真偽を集合・反例・必要条件／十分条件・否定・逆裏対偶へつなげて理解する。',
    '対偶と背理法を、方法を選ぶ理由から矛盾・結論まで一段ずつたどって証明する。',
  ],
  sections,
})

const answerEntries=Object.assign({},...defs.map((def)=>topics.get(def.key)!.answers))
export const strictSetsPropositionsAnswers:TextbookAnswerBook=TextbookAnswerBookSchema.parse({
  unitId:strictSetsPropositionsUnit.unitId,
  answers:answerEntries,
})
