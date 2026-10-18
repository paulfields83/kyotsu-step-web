import katex from 'katex'

/**
 * Educational math must not appear as raw TeX in answer choices or inline
 * results. This is presentation-only; source answers and grading are unchanged.
 */
export function textbookMathLatex(value: string): string | null {
  if (!value.trim() || /[ぁ-んァ-ン一-龯]/u.test(value)) return null
  const hasCommand = /\\(?:[A-Za-z]+|[{}])/.test(value)
  const hasMath = hasCommand || /[∈∉∅∩∪⊂⊆∀∃¬⇒⇔≤≥^²³⁴√=<>0-9{}]/.test(value)
  if (!hasMath) return null

  let formula = value.trim()
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

  // A list of sets written as {1,2}, {1,3} is not KaTeX grouping syntax:
  // the braces themselves must be visible as mathematical set delimiters.
  // Preserve genuine TeX argument braces in \overline{A}, \frac{...}, etc.
  if (!hasCommand) {
    formula = formula.replace(/\{/g,'\\{').replace(/\}/g,'\\}')
  }

  try {
    katex.renderToString(formula,{throwOnError:true,strict:'ignore'})
    return formula
  } catch {
    return null
  }
}
