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

  it('pairs the definition condition and concept name in the photographed proposition lesson', () => {
    const line = '真か偽かを判断できる文を命題という。今のように、条件pを満たすとき必ず条件qも満たすなら真である。'
    const { container } = render(<p><KeyConceptText value={line} scope="math-sets-propositions" /></p>)
    const spans = [...container.querySelectorAll('.key-concept-emphasis')].map((el) => el.textContent)
    expect(spans).toEqual(['真か偽かを判断できる文', '命題'])
    expect(container.querySelector('p')?.textContent).toBe(line)
  })

  it('pairs the alternative authored strict-textbook proposition definition', () => {
    const source = '正しいか正しくないかがはっきり決まる文や式を命題という。'
    const spans = keyConceptRanges(source, 'math-sets-propositions')
    expect(spans.map((part) => part.phrase)).toEqual([
      '正しいか正しくないかがはっきり決まる文や式', '命題',
    ])
  })

  it('does not bold incidental concept mentions with no definition or reasoning role', () => {
    expect(keyConceptRanges('この後も命題について勉強する。', 'math-sets-propositions')).toHaveLength(0)
    expect(keyConceptRanges('次に加速度の練習問題を解いてみよう。', 'physics-1d')).toHaveLength(0)
  })

  it('identifies definition and term in the revised physics position-vector lesson', () => {
    const source = 'このように、原点から物体の位置へ向かうベクトルを位置ベクトルという。'
    expect(keyConceptRanges(source, 'physics-1a').map((part) => part.phrase)).toEqual([
      '原点から物体の位置へ向かうベクトル', '位置ベクトル',
    ])
  })

  it('never bolds blanks or changes the identity of a lesson phrase', () => {
    const source = '何を入れるかがはっきり決まる集まりを集合という。【1】を選ぶ。'
    const { container } = render(<p><KeyConceptText value={source} scope="math-sets-propositions" /></p>)
    expect(container.textContent).toBe(source)
    expect([...container.querySelectorAll('strong')].map((part) => part.textContent)).toEqual([
      '何を入れるかがはっきり決まる集まり', '集合',
    ])
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
