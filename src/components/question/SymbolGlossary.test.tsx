// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GlossaryFormulaNote, GlossaryMath, GlossaryText, SymbolGlossaryProvider } from './SymbolGlossary'

describe('question-scoped tap-to-toggle symbol explanations', () => {
  it('shows and hides the local meaning when the same text symbol is clicked twice', () => {
    render(<SymbolGlossaryProvider notes={[{ symbol: 'A', ja: '素数の集合', zh: '素数集合' }]}>
      <div><GlossaryText value="A = {2,3,5}" /></div>
    </SymbolGlossaryProvider>)
    const symbol = screen.getByTestId('symbol-trigger-A')
    expect(screen.queryByTestId('symbol-note')).toBeNull()
    fireEvent.click(symbol)
    expect(screen.getByTestId('symbol-note').textContent).toContain('素数の集合')
    expect(symbol.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(symbol)
    expect(screen.queryByTestId('symbol-note')).toBeNull()
    expect(symbol.getAttribute('aria-expanded')).toBe('false')
  })

  it('makes original KaTeX tokens tappable without changing the LaTeX source', async () => {
    const { container } = render(<SymbolGlossaryProvider notes={[
      { symbol: 'v', ja: '速度', zh: '速度' },
      { symbol: 'a', ja: '加速度', zh: '加速度' },
    ]}>
      <GlossaryMath math="v=at" />
    </SymbolGlossaryProvider>)
    const token = await waitFor(() => {
      const found = container.querySelector<HTMLElement>('[data-glossary-symbol="v"]')
      expect(found).not.toBeNull()
      return found!
    })
    fireEvent.click(token)
    expect(screen.getByTestId('symbol-note').textContent).toContain('速度')
    fireEvent.click(token)
    expect(screen.queryByTestId('symbol-note')).toBeNull()
    expect(container.querySelector('.katex')).not.toBeNull()
  })

  it('keeps the complete 1A average-velocity equation visually intact without extra chips', () => {
    const { container } = render(
      <SymbolGlossaryProvider notes={[
        { symbol: 'vavg', label: 'v⃗_avg', ja: '平均速度ベクトル', zh: '平均速度矢量' },
        { symbol: 'Δr', label: 'Δr⃗', ja: '変位ベクトル', zh: '位移矢量' },
        { symbol: 'Δt', ja: '経過時間', zh: '经过时间' },
      ]}>
        <div className="reading-formula-line">
          <GlossaryMath math="\\vec{v}_{\\mathrm{avg}}=\\frac{\\Delta\\vec{r}}{\\Delta t}" scope="physics-1a" />
        </div>
        <GlossaryFormulaNote scope="physics-1a" />
      </SymbolGlossaryProvider>,
    )
    expect(container.querySelector('.katex')).not.toBeNull()
    expect(container.querySelector('[data-testid="formula-symbols"]')).toBeNull()
    expect(container.querySelectorAll('.symbol-glossary-option')).toHaveLength(0)
    expect(container.querySelectorAll('.reading-formula-line .symbol-glossary-note')).toHaveLength(0)
  })

  it('does not insert symbol buttons between formula fragments or resolved answers', async () => {
    const { container } = render(
      <SymbolGlossaryProvider notes={[{ symbol: 'v', ja: '速度', zh: '速度' }]}>
        <div className="reading-formula-line" data-testid="uninterrupted-formula">
          <GlossaryMath math="v" scope="formula-1a" />
          <span> + </span>
          <span className="reading-inline-answer">✓ 6.0</span>
          <span> = 8.0</span>
        </div>
        <GlossaryFormulaNote scope="formula-1a" />
      </SymbolGlossaryProvider>,
    )
    const formula = screen.getByTestId('uninterrupted-formula')
    expect(formula.querySelector('[data-testid="formula-symbols"]')).toBeNull()
    expect(formula.querySelectorAll('.reading-inline-answer')).toHaveLength(1)
    const token = await waitFor(() => {
      const found = formula.querySelector<HTMLElement>('[data-glossary-symbol="v"]')
      expect(found).not.toBeNull()
      return found!
    })
    fireEvent.click(token)
    const note = screen.getByTestId('symbol-note')
    expect(note.textContent).toContain('速度')
    expect(formula.contains(note)).toBe(false)
    fireEvent.click(token)
    expect(screen.queryByTestId('symbol-note')).toBeNull()
    expect(container.querySelectorAll('.reading-inline-answer')).toHaveLength(1)
  })

  it('does not make unknown symbols interactive', () => {
    const { container } = render(<SymbolGlossaryProvider notes={[]}>
      <GlossaryText value="x と A" />
      <GlossaryMath math="x=A" />
    </SymbolGlossaryProvider>)
    expect(container.querySelector('.symbol-glossary-trigger')).toBeNull()
    expect(container.querySelector('[data-glossary-symbol]')).toBeNull()
  })
})
