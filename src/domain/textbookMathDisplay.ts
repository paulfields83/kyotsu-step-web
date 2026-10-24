import katex from 'katex'
import { normalizePhysicsTextbookChoice } from './physicsTextbookNotation'

/**
 * Educational math must not appear as raw TeX in answer choices or inline
 * results. This is presentation-only; source answers and grading are unchanged.
 */
export function textbookMathLatex(value: string): string | null {
  // Physics ZIP uses combining vector arrows and Unicode subscripts. Render
  // those with KaTeX before the generic GOLDEN math formatting path.
  const physicsFormula = normalizePhysicsTextbookChoice(value)
  if (physicsFormula) {
    try {
      katex.renderToString(physicsFormula, { throwOnError: true, strict: 'ignore' })
      return physicsFormula
    } catch {
      return null
    }
  }
  if (!value.trim() || /[ぁ-んァ-ン一-龯]/u.test(value)) return null
  const hasCommand = /\\(?:[A-Za-z]+|[{}])/.test(value)
  const hasMath = hasCommand || /[∈∉∅∩∪⊂⊆∀∃¬⇒⇔≤≥^²³⁴√=<>0-9{}]/.test(value)
  if (!hasMath) return null

  let formula = value.trim()
  // Escape ORIGINAL literal set braces before superscript conversion inserts
  // TeX grouping braces such as ^{3}, which must remain unescaped.
  if (!hasCommand) {
    formula = formula.replace(/\{/g,'\\{').replace(/\}/g,'\\}')
  }
  formula = formula
    .replace(/^\\\(([\s\S]*)\\\)$/,'$1')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, digits => {
      const superscripts: Record<string,string> = {
        '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4',
        '⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9',
      }
      return '^{' + [...digits].map(x=>superscripts[x]).join('') + '}'
    })
    .replace(/√(\d+)/g,'\\sqrt{$1}')
    .replace(/×/g,'\\times ')
    .replace(/÷/g,'\\div ')
    .replace(/[−–—]/g,'-')
    .replace(/∅/g,'\\varnothing ')


  try {
    katex.renderToString(formula,{throwOnError:true,strict:'ignore'})
    return formula
  } catch {
    return null
  }
}
