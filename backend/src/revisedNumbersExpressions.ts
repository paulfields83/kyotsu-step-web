import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { brotliDecompressSync, inflateSync } from 'node:zlib'
import { TextbookAnswerBookSchema, TextbookUnitSchema, type TextbookReadingPart, type TextbookReadingBlock, type TextbookItem } from '../../src/domain/textbookSchema'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'textbooks', 'math-1a', 'revised-numbers-expressions')
// Verified answer/reference ledger extracted without rewriting the user's
// 2026-10-11 制作記録/ANSWER_KEY.md. It covers 175 original questions.
const revisedAnswerLedger = JSON.parse(
  inflateSync(Buffer.from(readFileSync(join(dataDir, 'answer-ledger.b64'), 'utf8').trim(), 'base64')).toString('utf8'),
) as Record<string, string[]>

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

// Image order follows the 16 uploaded Word manuscripts, not alphabetical figure IDs.
// N13 intentionally has F02 before F01 in the original reading flow.
const figureOrder: Record<string, string[]> = {
  N03: ['N03-F01'],
  N04: ['N04-F01'],
  N05: ['N05-F01', 'N05-F02'],
  N08: ['N08-F01'],
  N09: ['N09-F01'],
  N11: ['N11-F01', 'N11-F02'],
  N12: ['N12-F01', 'N12-F02', 'N12-F03'],
  N13: ['N13-F02', 'N13-F01'],
  N14: ['N14-F01'],
}
const figureCaptions: Record<string, string> = {
  'N03-F01': '掛け合わせる項の対応。内側の積はまだ記入していない。',
  'N04-F01': '同じ二項の和を二つ掛ける。',
  'N05-F01': '二つの括弧の係数を並べた対応図。',
  'N05-F02': 'ここまでに選んだ組を、係数の対応図で確かめる。',
  'N08-F01': '点の位置と原点。矢印や距離の答えは加えていない。',
  'N09-F01': '負の小数の位置。区間の端を選ぶ前の数直線。',
  'N11-F01': '2 と 5、および符号を反対にした二つの数の位置。',
  'N11-F02': 'ここまでに解いた二つの不等式。○は端点を含まず、●は含む。',
  'N12-F01': 'それぞれの条件の範囲。二つを合わせた答えはまだ示していない。',
  'N12-F02': '二つの上限を比べる。',
  'N12-F03': '線は不等式の範囲、印を付けた整数は個数として残す値である。',
  'N13-F02': '答えた後に、左右の二点と原点からの距離を確かめる。',
  'N13-F01': '1 より右にある場合と、左にある場合。',
  'N14-F01': '直前に求めた二つの範囲の比較。',
}

// The three pilot chapters use reviewed thinking-hole ledgers (20 + 25 + 17),
// not the original exercise numbers. Keep this order: it is the reading order.
const pilotHoleAnswers: Record<string, string[]> = {
  N04: ['4','40','ab','ba','2ab','−2','0','差の平方','20','9x²−4',
    'ad+bc','7','−c','−2ac−2bc','(T+x)(T−x)','和と差の積',
    'x⁴+x²+1','5','10','x⁴+10x³+35x²+50x+24'],
  N05: ['y+5','x−3','(x−3)(y+5)','−1','x−y','4x','24','(4x+3y)^2',
    '−6','−16','反対','−8,2','7','8','7','13','B','(x+1)(4x+3)',
    '−2','反対','−1,3','(x−1)(5x+3)','3b','和と差の積','3b(a−2b)(a+2b)'],
  N06: ['x+2y','6','−3,2','(x+2y−3)(x+2y+2)','x²',
    '(x−1)(x+1)(x−2)(x+2)','3','1','y','x²+x−2','x+y',
    '(x+y)(x+2)(x−1)','3y−1','1','2','3y−1','(x+2y+1)(x+y−2)'],
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
const tokenPattern = /(\$\$[\s\S]*?\$\$|\$[^$]+\$|【[^】]*】)/g
const normaliseMarkdown = (s:string) => s.replace(/\*\*/g,'').replace(/^\*(.*)\*$/s,'$1').trim()
const textPart = (s:string):TextbookReadingPart => ({type:'text',text:s})
// Convert source markers into real answer controls IN PLACE. A single reviewed
// question can have several blanks; these share one answer unless the original
// workbook provides independently reviewed subanswers.
const textHolePattern = /【[^】]*】|\\underline\{[^}]*\}|\\square\b|▫/g
const mathHolePattern = /\\square\b|\\underline\{[^}]*\}/g
function bindManuscriptHoles(parts:TextbookReadingPart[], ids:string[], perHole:boolean):TextbookReadingPart[] {
  let consumed = 0
  const nextId = () => {
    const id = ids[perHole ? consumed : 0]
    if (!id) throw new Error('reviewed answer list is shorter than manuscript blanks')
    consumed++
    return id
  }
  const rendered = parts.flatMap((part):TextbookReadingPart[] => {
    if (part.type === 'choice') return [part]
    if (part.type === 'math') {
      const holes = [...part.latex.matchAll(mathHolePattern)]
      return holes.length ? [{ ...part, holeIds: holes.map(nextId) }] : [part]
    }
    const pieces:TextbookReadingPart[] = []
    let offset = 0
    for (const match of part.text.matchAll(textHolePattern)) {
      const from = match.index ?? 0
      if (from > offset) pieces.push(textPart(part.text.slice(offset,from)))
      pieces.push({type:'choice',itemId:nextId()})
      offset = from + match[0].length
    }
    if (!pieces.length) return [part]
    if (offset < part.text.length) pieces.push(textPart(part.text.slice(offset)))
    return pieces
  })
  if (!consumed || (perHole && consumed !== ids.length)) {
    throw new Error('blank-to-answer mismatch: expected ' + ids.length + ' keys, bound ' + consumed)
  }
  return rendered
}
const n01AdditionalAnswers:Record<number,string> = {
  1:'-1',
  3:'5y',
  6:'(3-5)x^2,(-5+2)x,(6-3)',
  7:'-2x^2-3x+3',
  9:'-2x^2+4x-1',
  10:'x^3項が打ち消し合う',
}
const mathPart = (s:string):TextbookReadingPart => ({type:'math',latex:s.replace(/▫/g,'\\square').replace(/\\mspace\{6mu\}/g,'\\;')})
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
      parts.push(mathPart(token.startsWith('$$') ? token.slice(2, -2) : token.slice(1, -1)))
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
  const corpus = Array.from({length: 7}, (_, i) => readFileSync(join(dataDir, 'chunks', String(i + 1).padStart(2, '0') + '.txt'), 'utf8').trim()).join('')
  const original = JSON.parse(brotliDecompressSync(Buffer.from(corpus, 'base64')).toString('utf8')) as Record<string,string>
  const answers:Record<string,{validator:'normalized-text';answer:string;acceptedAnswers:string[]}> = {}
  const sections = order.map((name,idx) => {
    const items:TextbookItem[] = []
    const blocks:TextbookReadingBlock[] = []
    const figures: Array<{id:string;src:string;alt:string;caption:string}> = []
    let pictureIndex = 0
    let answerIndex = 0
    let pilotHoleIndex = 0
    let n01QuestionIndex = 0
    const pilotSlots = pilotHoleAnswers[name] ?? []
    const sourceAnswers = revisedAnswerLedger[name] ?? []
    const paragraphs = original[name].split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean)
    paragraphs.forEach((paragraph,pi) => {
      if (pi === 0 || paragraph.startsWith('*数学Ⅰ「数と式」｜')) return
      const id = 'revised-' + name.toLowerCase() + '-' + String(pi).padStart(3,'0')
      const stripped = normaliseMarkdown(paragraph)
      if (name === 'N01' && /【[^】]*】|\\square|▫/.test(paragraph)) n01QuestionIndex++
      if (/<img\b/i.test(paragraph) || /^!\[.*?\]\(.*?\)/s.test(paragraph)) {
        const code = (figureOrder[name] ?? [])[pictureIndex++]
        if (!code) throw new Error(`unexpected image in revised lesson ${name}, paragraph ${pi}`)
        figures.push({id:code.toLowerCase(),src:`assets/${code}.webp`,alt:figureCaptions[code],caption:`${code}  ${figureCaptions[code]}`})
        blocks.push({id,type:'figure',figureId:code.toLowerCase()})
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
      } else if (/^\$\$[\s\S]+\$\$$/.test(stripped) || /^\$[^$]+\$$/.test(stripped)) {
        blocks.push({id,type:'formula',parts:bodyParts(paragraph,name,pi,items,answers)})
      } else {
        blocks.push({id,type:'paragraph',parts:bodyParts(paragraph,name,pi,items,answers)})
      }
      if (name === 'N01') {
        // The source contains ten original questions; the earlier importer only
        // made the 10 multiple-choice subblanks clickable, skipping six questions.
        // Their answers below come directly from 制作記録/ANSWER_KEY.md.
        const lastBlock = blocks[blocks.length - 1]
        if (lastBlock.type === 'paragraph' || lastBlock.type === 'formula') {
          const remainingText = lastBlock.parts.some(part =>
            part.type === 'text' && /【[^】]*】|\\square|▫/.test(part.text))
          const remainingMath = lastBlock.parts.some(part =>
            part.type === 'math' && /\\square/.test(part.latex) && !(part.holeIds?.length))
          if (remainingText || remainingMath) {
            const answer = n01AdditionalAnswers[n01QuestionIndex]
            if (!answer) throw new Error('N01 unexpected unbound answer at source question ' + n01QuestionIndex)
            const itemId = 'math-revised-n01-question-' + String(n01QuestionIndex).padStart(2,'0')
            items.push({id:itemId,label:'問 ' + n01QuestionIndex,
              prompt:'式または文章中の空欄に入るものを選んでください。',answerType:'text',acceptedAnswers:[]})
            answers[itemId] = {validator:'normalized-text',answer,acceptedAnswers:[]}
            lastBlock.parts = bindManuscriptHoles(lastBlock.parts,[itemId],false)
          }
        }
      }
      // One reviewed ledger entry corresponds to one original question paragraph.
      // A paragraph may contain multiple inline holes: do not misinterpret it as
      // multiple answer keys or fabricate unverified multiple-choice distractors.
      if (name !== 'N01' && sourceAnswers.length &&
          (paragraph.includes('【') || paragraph.includes('square') || paragraph.includes('▫'))) {
        const rawAnswer = sourceAnswers[answerIndex]
        if (!rawAnswer) throw new Error(`answer ledger underflow: ${name} question ${answerIndex + 1}`)
        answerIndex += 1
        const itemId = `math-revised-${name.toLowerCase()}-answer-${String(answerIndex).padStart(2, '0')}`
        items.push({
          id: itemId, label: `問 ${answerIndex}`,
          prompt: `${name} 問${answerIndex}：この設問の空欄に合う答えを選んでください（複数の空欄は一つの選択肢で答えます）。`,
          answerType: 'text', acceptedAnswers: [],
        })
        answers[itemId] = {
          validator: 'normalized-text',
          answer: rawAnswer.replace(/[$*\x60]/g, '').trim(),
          acceptedAnswers: [],
        }
        const lastBlock = blocks[blocks.length - 1]
        if (lastBlock.type !== 'paragraph' && lastBlock.type !== 'formula') {
          throw new Error(`cannot attach answer to ${name} paragraph ${pi}`)
        }
        lastBlock.parts = bindManuscriptHoles(lastBlock.parts,[itemId],false)
      }
      if (pilotSlots.length) {
        const holes = paragraph.match(/【[^】]*】|\\underline\{[^}]*\}|\\square|▫/g) ?? []
        const lastBlock = blocks[blocks.length - 1]
        if (holes.length && lastBlock.type !== 'paragraph' && lastBlock.type !== 'formula') {
          throw new Error('pilot hole is outside a paragraph: ' + name)
        }
        const pilotIds: string[] = []
        for (const marker of holes) {
          const rawAnswer = pilotSlots[pilotHoleIndex]
          if (!rawAnswer) throw new Error('pilot answer ledger underflow: ' + name)
          pilotHoleIndex += 1
          const itemId = 'math-revised-' + name.toLowerCase() + '-hole-' + String(pilotHoleIndex).padStart(2, '0')
          const sourceOptions = marker.startsWith('【') ? marker.slice(1, -1).split('／').map(x => x.trim()) : []
          const publishedOptions = sourceOptions.length >= 2 && sourceOptions.length <= 4
            && sourceOptions.includes(rawAnswer) ? sourceOptions : undefined
          items.push({
            id: itemId, label: '空欄 ' + pilotHoleIndex,
            prompt: name + ' の空欄 ' + pilotHoleIndex + ' に入る式・語句を選んでください。',
            answerType: 'text', acceptedAnswers: [],
            ...(publishedOptions ? { choices: publishedOptions } : {}),
          })
          answers[itemId] = { validator: 'normalized-text', answer: rawAnswer, acceptedAnswers: [] }
          pilotIds.push(itemId)
        }
        if (pilotIds.length && (lastBlock.type === 'paragraph' || lastBlock.type === 'formula')) {
          lastBlock.parts = bindManuscriptHoles(lastBlock.parts,pilotIds,true)
        }
      }
    })
    if (name === 'N01' && n01QuestionIndex !== 10) {
      throw new Error('N01 must preserve all ten source questions; found ' + n01QuestionIndex)
    }
    if (pilotSlots.length && pilotHoleIndex !== pilotSlots.length) {
      throw new Error('pilot hole mismatch: ' + name + ' expected ' + pilotSlots.length + ' got ' + pilotHoleIndex)
    }
    if (name !== 'N01' && sourceAnswers.length && answerIndex !== sourceAnswers.length) {
      throw new Error(`answer ledger mismatch: ${name} has ${sourceAnswers.length} answers but ${answerIndex} prompts`)
    }
    if (pictureIndex !== (figureOrder[name]?.length ?? 0)) {
      throw new Error(`figure count mismatch: ${name}, expected ${figureOrder[name]?.length ?? 0}, actual ${pictureIndex}`)
    }
    return {id:'revised-'+name.toLowerCase(),number:String(idx+1),title:name+' '+titles[name],
      description:name.startsWith('NE')?'参考・発展':'教科書学習',
      readingFlow:blocks,items,figures}
  })
  const unit = TextbookUnitSchema.parse({
    schemaVersion:'1.0',unitId:'math-1a-numbers-expressions-revised',revision:4,
    status:'published',subject:'math-1a',title:'数学I 数と式',
    subtitle:'N01–N14 / NE01–NE02',
    source:{type:'original',label:'ユーザー提供の改訂版Word原稿 N01–N14 / NE01–NE02',
      rightsNote:'ユーザー提供の改訂原稿と解答台帳を対応付け。複数空欄の個別分解およびN04〜N06の解答変換は追加QA対象。'},
    objectives:['数と式の16講を改訂原稿の順序で学ぶ。','数学式をKaTeXで表示し、確認済みの空欄はバックエンドで採点する。'],
    sections,
  })
  const answerBook = TextbookAnswerBookSchema.parse({unitId:unit.unitId,answers})
  return {unit,answerBook,dataDir}
}
