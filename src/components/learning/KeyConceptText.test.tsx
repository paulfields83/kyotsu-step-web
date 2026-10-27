// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContentRenderer } from '../question/ContentRenderer'
import { KeyConceptText, keyConceptRanges, textbookEmphasisScope } from './KeyConceptText'

describe('selective emphasis in targeted lessons', () => {
  it('limits emphasis to math sets-propositions and revised physics 1A–1G', () => {
    expect(textbookEmphasisScope('math-1a', 'math-1a-sets-propositions')).toBe('math-sets-propositions')
    expect(textbookEmphasisScope('math-1a', 'math-sets')).toBe('math-sets-propositions')
    expect(textbookEmphasisScope('math-1a', 'math-1a-numbers-expressions')).toBeUndefined()
    expect(textbookEmphasisScope('physics', 'physics-a-displacement-velocity-revised')).toBe('physics-1a')
    expect(textbookEmphasisScope('physics', 'physics-1g-gravity-drag-terminal-velocity-revised')).toBe('physics-1g')
    expect(textbookEmphasisScope('physics', 'physics-1b-velocity-composition')).toBeUndefined()
  })

  it('preserves all original Japanese characters and selects a few relevant phrases', () => {
    const source = '集合 B のすべての要素が集合 A に含まれるとき、B は A の部分集合であるという。'
    const { container } = render(<p><KeyConceptText value={source} scope="math-sets-propositions" /></p>)
    expect(container.querySelector('p')?.textContent).toBe(source)
    const marked = [...container.querySelectorAll('strong.key-concept-emphasis')].map((element) => element.textContent)
    expect(marked).toContain('すべての要素')
    expect(marked).toContain('部分集合')
    expect(marked.length).toBeLessThanOrEqual(2)
  })

  it('emphasizes physics concepts but never rewrites formulas or unselected chapters', () => {
    const text = '変位ベクトルは最初の位置から後の位置までの位置の変化を表す。'
    const { container, rerender } = render(
      <p><KeyConceptText value={text} scope="physics-1a" /></p>,
    )
    expect(container.textContent).toBe(text)
    expect(container.querySelectorAll('.key-concept-emphasis').length).toBeGreaterThan(0)
    rerender(<p><KeyConceptText value={text} /></p>)
    expect(container.querySelectorAll('.key-concept-emphasis')).toHaveLength(0)
    expect(container.textContent).toBe(text)
  })

  it('never turns a whole paragraph into bold text', () => {
    const value = '反例を1つ探すことで命題が成り立たないことを調べる。仮定と結論を混同しないようにする。'
    const matches = keyConceptRanges(value, 'math-sets-propositions')
    expect(matches.length).toBeLessThanOrEqual(2)
    expect(matches.reduce((total, match) => total + match.phrase.length, 0)).toBeLessThan(value.length / 2)
  })

  it('keeps plain question stems and mathematical expressions unchanged by default', () => {
    const { container } = render(<ContentRenderer blocks={[
      { id: 'stem', type: 'text', text: '部分集合はどれか。' },
      { id: 'formula', type: 'latex', latex: 'A \\subseteq B', display: 'inline' },
    ]} />)
    expect(container.querySelectorAll('.key-concept-emphasis')).toHaveLength(0)
    expect(container.querySelector('.katex')).not.toBeNull()
    expect(screen.getByText(/部分集合はどれか/)).toBeTruthy()
  })

  it('emphasizes practice reasoning only on explicit opt-in', () => {
    const { container } = render(<ContentRenderer emphasisScope="math-sets-propositions" blocks={[
      { id: 'reasoning', type: 'text', text: '集合 B のすべての要素が集合 A に含まれるかを調べる。' },
    ]} />)
    expect(container.querySelector('p')?.textContent).toContain('すべての要素')
    expect(container.querySelectorAll('strong.key-concept-emphasis')).toHaveLength(1)
  })
})
