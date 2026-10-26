// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GlossaryMath, GlossaryText, SymbolGlossaryProvider } from './SymbolGlossary'

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

  it('shows full quantities for the 1A average-velocity equation and toggles their meanings', () => {
    render(
      <SymbolGlossaryProvider notes={[
        { symbol: 'vavg', label: 'v⃗_avg', ja: '平均速度ベクトル', zh: '平均速度矢量' },
        { symbol: 'Δr', label: 'Δr⃗', ja: '変位ベクトル', zh: '位移矢量' },
        { symbol: 'Δt', ja: '経過時間', zh: '经过时间' },
      ]}>
        <GlossaryMath
          math="\vec{v}_{\mathrm{avg}}=\frac{\Delta\vec{r}}{\Delta t}"
          showSymbols
        />
      </SymbolGlossaryProvider>,
    )
    expect(screen.getByTestId('formula-symbol-vavg')).toBeTruthy()
    const displacement = screen.getByTestId('formula-symbol-Δr')
    expect(displacement).toBeTruthy()
    expect(screen.getByTestId('formula-symbol-Δt')).toBeTruthy()
    expect(screen.queryByTestId('symbol-note')).toBeNull()
    fireEvent.click(displacement)
    expect(screen.getByTestId('symbol-note').textContent).toContain('変位ベクトル')
    fireEvent.click(displacement)
    expect(screen.queryByTestId('symbol-note')).toBeNull()
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
