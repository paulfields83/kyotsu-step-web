import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inflateSync } from 'node:zlib'
import { TextbookAnswerBookSchema, TextbookUnitSchema, type TextbookReadingPart, type TextbookReadingBlock, type TextbookItem } from '../../src/domain/textbookSchema'

const dataFile = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'textbooks', 'math-1a', 'revised-numbers-expressions', 'source.deflate.b64')
const order = ['N01','N02','N03','N04','N05','N06','N07','N08','N09','N10','N11','N12','N13','N14','NE01','NE02'] as const
const titles: Record<string,string> = {
  N01:'式をほどいて、係数と次数を読む',
  N02:'整理する文字を決めて、式を足し引きする',
  N03:'積をほどいて、指数法則と展開をつくる',
  N04:'展開の形を見つける',
  N05:'展開を逆に読む',
  N06:'式のまとまりを見つける',
  N07:'分数と小数で、同じ数を表す',
  N08:'向きと距離を分けて、絶対値を読む',
  N09:'平方根の符号と、数直線上の位置を確かめる',
  N10:'平方根の計算を、定義と既習の公式につなぐ',
  N11:'大小関係を保つ変形を選ぶ',
  N12:'二つの条件を同時に満たす範囲を残す',
  N13:'距離の条件を、二つの位置へ戻す',
  N14:'距離の上限と下限から、残す範囲を決める',
  NE01:'3次の展開と因数分解（発展）',
  NE02:'二重根号を、平方の形から外す（発展）',
}
type Slot = { answer:string; choices:string[] }
// These ten reviewed N01 slots are answerable; other source blanks remain literal
// so that the server never fabricates an answer key.
const n01Slots: Record<number, (Slot | null)[]> = {
  8: [
    {answer:'(-2, 1)',choices:['(-2, 1)','(2, 1)','(-2, 2)']},
    {answer:'(1, 2)',choices:['(1, 2)','(2, 1)','(0, 2)']},
    {answer:'(-1, 4)',choices:['(-1, 4)','(1, 4)','(-1, 2)']},
  ],
  14: [
    {answer:'(5y, 3)',choices:['(5y, 3)','(5x³, 1)','(5, 4)']},
    {answer:'(5x³, 1)',choices:['(5x³, 1)','(5y, 3)','(5x, 3)']},
  ],
  17: [
    {answer:'ay',choices:['ay','ax','a']},
    {answer:'ax',choices:['ax','ay','a']},
  ],
  28: [
    {answer:'2',choices:['2','3','1']},
    {answer:'3',choices:['3','6','-3']},
  ],
  33: [{answer:'2',choices:['2','3','1']},null],
}
const inlineMath = /\$([^$]+)\$/g
const placeholder = /【[^】]*】/g
const tokenPattern = /(\$[^$]+\$|【[^】]*】)/g
const normaliseMarkdown = (s:string) => s.replace(/\*\*/g,'').replace(/^\*(.*)\*$/s,'$1').trim()
const textPart = (s:string):TextbookReadingPart => ({type:'text',text:s})
const mathPart = (s:string):TextbookReadingPart => ({type:'math',latex:s.replace(/▫/g,'\\square')})
function bodyParts(source:string, lesson:string, paragraphIndex:number, items:TextbookItem[], answers:Record<string,{validator:'normalized-text'; answer:string; acceptedAnswers:string[]}>):TextbookReadingPart[] {
  const s = normaliseMarkdown(source)
  const parts:TextbookReadingPart[] = []
  let cursor = 0
  let slotIndex = 0
  for (const match of s.matchAll(tokenPattern)) {
    const index = match.index ?? 0
    if (index > cursor) parts.push(textPart(s.slice(cursor,index)))
    const token = match[0]
    if (token.startsWith('$')) {
      parts.push(mathPart(token.slice(1,-1)))
    } else {
      const slot = lesson === 'N01' ? n01Slots[paragraphIndex]?.[slotIndex] : undefined
      if (slot) {
        const itemId = 'math-revised-' + lesson.toLowerCase() + '-p' + paragraphIndex + '-b' + (slotIndex+1)
        items.push({id:itemId,label:'空欄 '+(slotIndex+1),prompt:'本文の空欄に入るものを選びなさい。',answerType:'text',choices:slot.choices,acceptedAnswers:[]})
        answers[itemId] = {validator:'normalized-text',answer:slot.answer,acceptedAnswers:[]}
        parts.push({type:'choice',itemId})
      } else parts.push(textPart(token))
      slotIndex += 1
    }
    cursor = index + token.length
  }
  if (cursor < s.length) parts.push(textPart(s.slice(cursor)))
  return parts.length ? parts.filter(p=>p.type!=='text'||p.text.length>0) : [textPart(' ')]
}
export function loadRevisedNumbersExpressions() {
  const original = JSON.parse(inflateSync(Buffer.from(readFileSync(dataFile, 'utf8').trim(), 'base64')).toString('utf8')) as Record<string,string>
  const answers:Record<string,{validator:'normalized-text';answer:string;acceptedAnswers:string[]}> = {}
  const sections = order.map((name,idx) => {
    const items:TextbookItem[] = []
    const blocks:TextbookReadingBlock[] = []
    const paragraphs = original[name].split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean)
    paragraphs.forEach((paragraph,pi) => {
      if (pi === 0 || paragraph.startsWith('*数学Ⅰ「数と式」｜')) return
      const id = 'revised-' + name.toLowerCase() + '-' + String(pi).padStart(3,'0')
      const stripped = normaliseMarkdown(paragraph)
      if (/^!\[.*?\]\(.*?\)/s.test(paragraph)) {
        blocks.push({id,type:'note',text:'【図版あり】元のWordに含まれる図版。図の位置は確保していますが、画像アセットの検証が必要です。'})
      } else if (/^\*\*(例題|導出|証明|性質|確認|まとめ|先生|花子|太郎)/.test(paragraph)) {
        if (/^\*\*(例題|導出|証明|性質|確認|まとめ)\*\*$/.test(paragraph)) {
          blocks.push({id,type:'heading',text:stripped})
        } else {
          blocks.push({id,type:'paragraph',parts:bodyParts(paragraph,name,pi,items,answers)})
        }
      } else if (/^#{1,6}\s/.test(paragraph)) {
        blocks.push({id,type:'heading',text:stripped.replace(/^#+\s*/,'')})
      } else if (/^(第[123]節|同じ種類の項を集める|式全体を引く)$/.test(stripped)) {
        blocks.push({id,type:'heading',text:stripped})
      } else if (/^\$[^$]+\$$/.test(stripped)) {
        blocks.push({id,type:'formula',parts:bodyParts(paragraph,name,pi,items,answers)})
      } else {
        blocks.push({id,type:'paragraph',parts:bodyParts(paragraph,name,pi,items,answers)})
      }
    })
    return {id:'revised-'+name.toLowerCase(),number:String(idx+1),title:name+' '+titles[name],
      description:name.startsWith('NE')?'参考・発展':'改訂版 教科書学習',
      readingFlow:blocks,items,figures:[]}
  })
  const unit = TextbookUnitSchema.parse({
    schemaVersion:'1.0',unitId:'math-1a-numbers-expressions-revised',revision:1,
    status:'published',subject:'math-1a',title:'数学I 数と式（改訂版）',
    subtitle:'N01–N14 / NE01–NE02',
    source:{type:'original',label:'ユーザー提供の改訂版Word原稿 N01–N14 / NE01–NE02',
      rightsNote:'Word → pandoc Markdown を原稿として保持。採点可能な空欄は確認済みのN01 10箇所だけ。'},
    objectives:['数と式の16講を改訂原稿の順序で学ぶ。','数学式をKaTeXで表示し、確認済みの空欄はバックエンドで採点する。'],
    sections,
  })
  const answerBook = TextbookAnswerBookSchema.parse({unitId:unit.unitId,answers})
  return {unit,answerBook}
}
