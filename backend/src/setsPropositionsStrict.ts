import { TextbookAnswerBookSchema, TextbookUnitSchema, type TextbookAnswerBook, type TextbookItem, type TextbookReadingBlock, type TextbookSection, type TextbookUnit } from '../../src/domain/textbookSchema'
import { defs1 } from './setsPropositionsDefs1'
import { defs2 } from './setsPropositionsDefs2'
import { defs3 } from './setsPropositionsDefs3'
import { defs4 } from './setsPropositionsDefs4'
import { defs5 } from './setsPropositionsDefs5'
import { defs6 } from './setsPropositionsDefs6'
import type { SectionDef } from './setsPropositionsTypes'

const figures: Record<string,{src:string;alt:string;caption:string}> = {
  venn:{src:'assets/venn.svg',alt:'集合 A・B と共通部分 A∩B の模式図',caption:'共通部分 A∩B と和集合 A∪B の位置関係'},
  numline:{src:'assets/numline.svg',alt:'区間 A と B を上下に並べた数直線',caption:'区間の端点と包含を数直線で確認する'},
  'section1-q2-diagrams':{src:'assets/section1-q2-diagrams.svg',alt:'包含関係を選ぶ4つの模式図',caption:'包含関係を図に読み替える'},
  'q14-counterexample':{src:'assets/q14-counterexample.svg',alt:'対角線が等しいが長方形ではない二等辺台形',caption:'AC=BD でも長方形とは限らない反例'},
  'subset-relationship':{src:'assets/subset-relationship.svg',alt:'内側の集合が外側の集合に含まれる包含関係の模式図',caption:'部分集合は「内側の集合の全要素が外側にも入る」と読む'},
  'three-set-venn':{src:'assets/three-set-venn.svg',alt:'集合 A・B・C の3集合ベン図',caption:'3集合すべてに共通する領域を確認する'},
  'complement-region':{src:'assets/complement-region.svg',alt:'全体集合 U の中で集合 A の外側を示す模式図',caption:'補集合は全体集合 U の中で A に入らない部分'},
  demorgan:{src:'assets/demorgan.svg',alt:'ド・モルガンの2つの法則で左右の式が同じ領域になることを比較する図',caption:'2つのド・モルガンの法則を領域で確認する'},
  'condition-counterexample':{src:'assets/condition-counterexample.svg',alt:'命題が真の場合の集合関係と反例の位置を示す模式図',caption:'命題の真偽を「仮定の範囲」と「結論の範囲」で見る'},
  'negation-numberline':{src:'assets/negation-numberline.svg',alt:'x≦a とその否定 x>a を示す数直線',caption:'否定では境界 a の含み方も反転する'},
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
    readingFlow:groupTopics.flatMap((topic,topicIndex)=>topic.readingFlow.map((block)=>(
      block.type==='topic'
        ? { ...block, text:`${group.number}.${topicIndex+1} ${block.text}` }
        : block
    ))),
    items:groupTopics.flatMap((topic)=>topic.items),
  }
})

export const strictSetsPropositionsUnit:TextbookUnit=TextbookUnitSchema.parse({
  schemaVersion:'1.0',
  unitId:'math-1a-sets-propositions',
  revision:4,
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
