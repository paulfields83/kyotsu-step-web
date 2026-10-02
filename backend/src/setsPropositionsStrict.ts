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

function guidedLanguage(title:string){
  if (/集合と要素/.test(title)) return {
    focus:'集合を決める条件を満たすかどうかに着目する。',
    knowledge:'要素が集合に属するかを、条件に戻って ∈・∉ で判断する。',
    check:'要素と集合の関係に ∈・∉ を使っているかを確認する。',
  }
  if (/集合の表し方/.test(title)) return {
    focus:'要素を並べるのか、条件で表すのかを確認する。',
    knowledge:'要素を書き並べる方法と、条件を使って表す方法を使い分ける。',
    check:'文字の範囲や整数・自然数などの条件を落としていないかを確認する。',
  }
  if (/包含関係|相等/.test(title)) return {
    focus:'一方の集合のすべての要素が、もう一方にも含まれるかを見る。',
    knowledge:'部分集合は片方向、集合の相等は A⊂B と B⊂A の2方向を確認する。',
    check:'包含の向きを取り違えていないかを確認する。',
  }
  if (/共通部分|和集合/.test(title)) return {
    focus:'「両方」と「少なくとも一方」のどちらを求めるかに着目する。',
    knowledge:'共通部分は「かつ」、和集合は「または」に対応させて考える。',
    check:'端点や重複する要素の扱いを確認する。',
  }
  if (/空集合|部分集合|3つの集合/.test(title)) return {
    focus:'要素を何個選ぶか、または複数の集合すべてに入るかを整理する。',
    knowledge:'部分集合は選ぶ要素数で場合分けし、複数集合では ∩・∪ の意味に戻る。',
    check:'空集合と集合自身を含めたかを確認する。',
  }
  if (/補集合/.test(title)) return {
    focus:'最初に全体集合Uを固定し、その中で集合Aに入らない部分を見る。',
    knowledge:'補集合は「Uに属し、Aには属さない」要素の集合として求める。',
    check:'全体集合の外まで補集合に含めていないかを確認する。',
  }
  if (/ド・モルガン/.test(title)) return {
    focus:'補集合の線がどこまでかかっているかに着目する。',
    knowledge:'ド・モルガンの法則を、∩と∪を入れ替えながら用いる。',
    check:'補集合の範囲と ∩・∪ の入れ替えを確認する。',
  }
  if (/命題|仮定|結論/.test(title)) return {
    focus:'「ならば」の前後を分け、仮定と結論を明確にする。',
    knowledge:'命題を p⇒q の形に整理して真偽を考える。',
    check:'仮定と結論を逆に読んでいないかを確認する。',
  }
  if (/真偽|反例/.test(title)) return {
    focus:'命題がすべての場合に成り立つかを見る。',
    knowledge:'真なら根拠を示し、偽なら仮定を満たして結論を満たさない反例を1つ挙げる。',
    check:'反例が仮定を満たしているかを確認する。',
  }
  if (/必要|十分/.test(title)) return {
    focus:'p⇒q と q⇒p を別々に調べる。',
    knowledge:'どちらの向きが成り立つかによって必要条件・十分条件・必要十分条件を判断する。',
    check:'条件の向きを取り違えていないかを確認する。',
  }
  if (/否定/.test(title)) return {
    focus:'元の条件を満たさない範囲を、境界を含めて考える。',
    knowledge:'「かつ」の否定は「または」、「または」の否定は「かつ」に変える。',
    check:'不等号の向きと等号の有無を確認する。',
  }
  if (/逆|裏|対偶/.test(title)) return {
    focus:'仮定と結論、さらにそれぞれの否定を区別する。',
    knowledge:'逆・裏・対偶を p、q とその否定を使って正しく作る。',
    check:'元の命題と対偶の真偽が一致することを確認する。',
  }
  if (/対偶/.test(title)) return {
    focus:'元の命題を直接示すより、対偶の方が示しやすいかを見る。',
    knowledge:'p⇒q の代わりに ¬q⇒¬p を証明する。',
    check:'対偶を逆や裏と混同していないかを確認する。',
  }
  if (/背理法|無理数/.test(title)) return {
    focus:'結論の否定を仮定すると矛盾が導けるかを見る。',
    knowledge:'結論を否定して仮定し、既知の事実と矛盾することを示す。',
    check:'どの仮定からどの矛盾が生じたかを明確にする。',
  }
  return {
    focus:`「${title}」で与えられた条件に着目する。`,
    knowledge:`「${title}」で学んだ定義や性質を用いる。`,
    check:'得られた結果が元の条件を満たすかを確認する。',
  }
}

function problemLanguage(label:string){
  const exact:Record<string,string>={
    '素数全体の集合 A に属するか':'Aを素数全体の集合とする。3，15，1がそれぞれAに属するかどうかを答えよ。',
    '条件から要素を書き並べる':'次の集合の要素を書き並べよ。',
    '並んだ要素から条件を作る':'次の集合を，要素が満たす条件を用いて表せ。',
    '要素を比べて包含関係を決める':'次の2つの集合の包含関係を，⊂，⊃，=を用いて表せ。',
    '有限集合と数直線で共通部分・和集合を求める':'次の2つの集合について，A∩B，A∪Bを求めよ。',
    'A={1,2,3} の部分集合をすべて挙げる':'A={1,2,3} の部分集合をすべて挙げ，その個数を求めよ。',
    '3つの集合に広げる':'3つの集合A，B，Cについて，A∩B∩C，A∪B∪Cを求めよ。',
    'U={1,2,…,12}, A={2,4,6,8,10,12}, B={3,6,9,12}':'U={1,2,…,12}を全体集合とし，A={2,4,6,8,10,12}，B={3,6,9,12}とする。指定された補集合・共通部分・和集合を求めよ。',
    '数直線上で補集合を求める':'実数の区間で表された集合について，指定された補集合を数直線を用いて求めよ。',
    '図で overline(A∩B)=Ā∪B̄ を確かめる':'overline(A∩B)=Ā∪B̄ が成り立つことを，ベン図を用いて確かめよ。',
    '法則を使って集合を求める':'ド・モルガンの法則を用いて，指定された集合を求めよ。',
    '仮定と結論を分ける':'次の命題の仮定と結論をそれぞれ答え，命題の真偽を判定せよ。',
    '真なら理由、偽なら反例':'次の命題の真偽を判定せよ。真なら理由を示し，偽なら反例を1つ挙げよ。',
    '2方向を1つずつ確認する':'次の2つの条件について，必要条件・十分条件・必要十分条件のいずれであるかを答えよ。',
    '境界を落とさず否定する':'次の条件の否定を答えよ。',
    '複合条件の否定':'次の複合条件の否定を答えよ。',
    '式を作って真偽まで調べる':'次の命題について，逆・裏・対偶を作り，それぞれの真偽を判定せよ。',
    'n² が奇数なら n は奇数':'「n²が奇数ならばnは奇数である」を，対偶を用いて証明せよ。',
    '√2 の無理性に矛盾させる':'(1+√2)/2 が無理数であることを，背理法を用いて証明せよ。',
    '√3 が無理数であることを証明する':'√3 が無理数であることを，背理法を用いて証明せよ。',
  }
  return exact[label] ?? label
}

function normalizeGuidedBlocks(def:SectionDef){
  const out:SectionDef['blocks']=[]
  const guide=guidedLanguage(def.title)
  let exampleOpen=false

  const closeExample=()=>{
    if(!exampleOpen) return
    out.push(['n',`確認　${guide.check}`])
    exampleOpen=false
  }

  for(const [kind,text] of def.blocks){
    if(kind==='h' && /^教科書 問\d+/.test(text)){
      closeExample()
      const label=text.replace(/^教科書 問\d+[　\s]*/u,'').trim()
      out.push(['h',`教科書対応問　${label}`])
      out.push(['n',`着眼点　${guide.focus}`])
      out.push(['n',`使う知識　${guide.knowledge}`])
      out.push(['h',`問題文　${problemLanguage(label)}`])
      exampleOpen=true
      continue
    }
    if(kind==='h' && exampleOpen){
      closeExample()
    }
    if(kind==='n' && exampleOpen && /^(?:ここで確認|注意|数直線の読み方)/.test(text)){
      closeExample()
      out.push([kind,text])
      continue
    }
    out.push([kind,text])
  }
  closeExample()
  return out
}

function buildTopic(def:SectionDef){
  const used=new Set<string>()
  const readingFlow:TextbookReadingBlock[]=[
    {id:`topic-${def.key}`,type:'topic',text:def.title},
    ...normalizeGuidedBlocks(def).flatMap(([kind,text],index):TextbookReadingBlock[]=>{
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
  revision:5,
  status:'published',
  subject:'math-1a',
  title:'数学I 集合と命題',
  subtitle:'集合 ／ 命題 ／ 証明｜解題軌道・厳格誘導',
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
