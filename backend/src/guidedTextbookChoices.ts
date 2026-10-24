import { getTextbookChoices, isTextbookAnswerCorrect, normalizeTextbookAnswer } from '../../src/domain/textbook'
import type { TextbookAnswerBook, TextbookItem, TextbookUnit } from '../../src/domain/textbookSchema'

// The source workbook is authoritative about its correct answer. Distractors
// are generated only for presentation and are never saved as answer keys.
const opposite: Array<[string, string]> = [
  ['差の平方', '和の平方'], ['和の平方', '差の平方'],
  ['和と差の積', '和の平方'], ['同類項', '異類項'],
  ['降べき', '昇べき'], ['昇べき', '降べき'],
  ['偶数', '奇数'], ['奇数', '偶数'],
  ['増加', '減少'], ['減少', '増加'],
  ['以上', '以下'], ['以下', '以上'],
  ['正', '負'], ['負', '正'],
  ['反対', '同じ'], ['同じ', '反対'],
  ['成り立つ', '成り立たない'], ['成り立たない', '成り立つ'],
  ['含む', '含まない'], ['含まない', '含む'],
  ['有理数', '無理数'], ['無理数', '有理数'],
]

export function guidedChoiceCandidates(answer: string): string[] {
  const a = answer.trim()
  const out: string[] = []
  const add = (x: string) => { if (x !== a) out.push(x) }
  if (/^-?\d+$/.test(a)) {
    const n = Number(a)
    add(String(n + 1)); add(String(n - 1))
    add(String(n === 0 ? 2 : -n))
    add(String(n + (n >= 0 ? 2 : -2)))
  } else if (/^-?\d+(?:\.\d+)?$/.test(a)) {
    const n = Number(a)
    add(String(n + 1)); add(String(n - 1)); add(String(-n))
  }
  const fr = a.match(/^(-?)(\d+)\/(\d+)$/)
  if (fr) {
    const n = Number(fr[2]), d = Number(fr[3]), sign = fr[1]
    add(sign + (n + 1) + '/' + d)
    add(sign + n + '/' + (d + 1))
    add((sign ? '' : '-') + n + '/' + d)
    add(sign + d + '/' + n)
  }

  // A sign, coefficient, or exponent error is an appropriate distractor for
  // algebraic manipulation. Avoid changing every term at once.
  if (/[0-9a-zA-Z^²³⁴+\-−()＝=√]/.test(a)) {
    const changes: Array<[RegExp, string]> = [
      [/(^|[=(,])-(?=\d|[a-zA-Z])/, '$1+'],
      [/(^|[=(,])\+(?=\d|[a-zA-Z])/, '$1-'],
      [/\+(?=[0-9a-zA-Z(])/, '-'],
      [/[−-](?=[0-9a-zA-Z(])/, '+'],
      [/²/, '³'], [/³/, '²'], [/\^2(?!\d)/, '^3'], [/\^3(?!\d)/, '^2'],
      [/>=/, '<='], [/<=/, '>='], [/≥/, '≤'], [/≤/, '≥'],
      [/</, '>'], [/>/, '<'],
      [/\bx\b/, 'y'], [/\by\b/, 'x'],
    ]
    for (const [pattern,replacement] of changes) {
      if (pattern.test(a)) add(a.replace(pattern,replacement))
    }
    for (const match of [...a.matchAll(/\d+/g)].slice(0, 3)) {
      const start = match.index ?? 0
      const n = Number(match[0])
      if (Number.isFinite(n) && n < 10000) {
        add(a.slice(0,start) + (n+1) + a.slice(start+match[0].length))
        if(n>0) add(a.slice(0,start) + (n-1) + a.slice(start+match[0].length))
      }
    }
    if (a.includes(',')) {
      const m=a.match(/^\(([^(),]+),([^(),]+)\)$/)
      if(m) {
        add('(' + m[2].trim() + ', ' + m[1].trim() + ')')
        add('(' + m[1].trim() + ', ' + (Number(m[2].trim()) || 1) + ')')
      }
    }
  }
  for (const [from,to] of opposite) {
    if(a.includes(from)) add(a.replace(from,to))
  }
  if (/^[A-Za-z]$/.test(a)) {
    add(a.toUpperCase() === 'A' ? 'B' : 'A')
    add(a.toUpperCase() === 'C' ? 'B' : 'C')
  }
  return out
}

// Prefer source-authored options. If absent, use context-appropriate algebra
// slips, then similarly-shaped answers from the SAME source lesson.
export function getGuidedTextbookChoices(unit: TextbookUnit, item: TextbookItem, book: TextbookAnswerBook): string[] {
  const answer = book.answers[item.id]?.answer ?? item.answer
  if (!answer) throw new Error('missing answer for ' + item.id)

  const sourceChoices = item.choices?.length && item.choices.length >= 2
    ? getTextbookChoices(unit,item,book.answers)
    : []

  // The GOLDEN workbook has author-reviewed alternatives. Never pad a
  // two-answer membership/yes-no decision with unrelated generic options.
  if (sourceChoices.length >= 2) {
    const entry = book.answers[item.id]
    const distinct = [...new Map(sourceChoices.map(choice=>[normalizeTextbookAnswer(choice),choice])).values()]
    if (distinct.length >= 2 &&
        distinct.filter(choice => entry && isTextbookAnswerCorrect(entry,choice)).length === 1) {
      return distinct.slice(0,4)
    }
  }

  const seen = new Set<string>()
  const options: string[] = []
  const push = (candidate: string) => {
    const trimmed = candidate.trim()
    const normalized = normalizeTextbookAnswer(trimmed)
    if (!trimmed || !normalized || seen.has(normalized)) return
    seen.add(normalized)
    options.push(trimmed)
  }
  push(answer)
  // Some legacy source options contain two synonymous correct answers.
  // Show exactly ONE accepted answer; retain all verified wrong alternatives.
  const entry = book.answers[item.id]
  for (const candidate of sourceChoices) {
    if (!entry || !isTextbookAnswerCorrect(entry,candidate)) push(candidate)
  }

  const revised = unit.unitId === 'math-1a-numbers-expressions-revised'
  if (revised && options.length < 4) {
    guidedChoiceCandidates(answer).forEach(push)
    if (options.length < 4) {
      const section = unit.sections.find(x=>x.items.some(y=>y.id===item.id))
      const pool = section?.items.filter(x=>x.id!==item.id)
        .map(x=>book.answers[x.id]?.answer ?? x.answer)
        .filter((x):x is string=>Boolean(x))
        .filter(x=>Math.abs(x.length - answer.length) <= Math.max(4,answer.length*.3))
        ?? []
      pool.forEach(push)
    }
  } else if (options.length < 4) {
    getTextbookChoices(unit,item,book.answers)
      .filter(candidate => !entry || !isTextbookAnswerCorrect(entry,candidate))
      .forEach(push)
  }
  // Every answer should be selectable even when there is no author-provided
  // distractor. These final two meta choices are used only as a last resort.
  if (options.length < 3) {
    push('この条件だけでは決まらない')
    push('どの選択肢にも当てはまらない')
  }
  if (options.length < 2) throw new Error('cannot generate at least two options: '+item.id)

  // Stable pseudo-random ordering prevents always displaying the answer first,
  // while preserving progress across refreshes and deployments.
  const result = options.slice(0,4)
  let state = 2166136261
  for (const char of item.id) { state ^= char.charCodeAt(0); state = Math.imul(state,16777619) }
  for(let i=result.length-1;i>0;i--) {
    state=(Math.imul(state,1664525)+1013904223)>>>0
    const j=state%(i+1)
    ;[result[i],result[j]]=[result[j],result[i]]
  }
  return result
}
