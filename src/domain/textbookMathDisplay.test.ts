import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { textbookMathLatex } from './textbookMathDisplay'

describe('unified textbook mathematical answer display', () => {
  it('turns raw LaTeX membership and De Morgan operators into KaTeX', () => {
    for (const value of ['\\in','\\notin','\\overline{A}\\cap\\overline{B}','\\overline{A}\\cup\\overline{B}']) {
      const math = textbookMathLatex(value)
      expect(math).toBeTruthy()
      expect(() => katex.renderToString(math!,{throwOnError:true})).not.toThrow()
    }
  })

  it('does not make raw set braces disappear in an enumerated answer', () => {
    const math = textbookMathLatex('{1,2}, {1,3}, {2,3}')
    expect(math).toContain('\\{1,2\\}')
    expect(math).toContain('\\{1,3\\}')
    expect(math).toContain('\\{2,3\\}')
    const html = katex.renderToString(math!,{throwOnError:true})
    expect(html).toContain('1')
    expect(html).toContain('2')
  })

  it('preserves set comprehension notation and superscript brackets',()=>{
    const math=textbookMathLatex('\\{x\\mid x<-1,\\ 5<x\\}')
    expect(math).toBeTruthy()
    const html=katex.renderToString(math!,{throwOnError:true})
    expect(html).toContain('x')
    expect(html).not.toContain('katex-error')
    expect(textbookMathLatex('5x³')).toContain('^{3}')
  })

  it('leaves Japanese prose unmodified',()=>{
    expect(textbookMathLatex('入っていない')).toBeNull()
    expect(textbookMathLatex('この条件だけでは決まらない')).toBeNull()
  })
})
