// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContentRenderer } from '../question/ContentRenderer'
import {
  isReviewedConceptTerm, KeyConceptText,
  keyConceptRanges, textbookEmphasisScope,
} from './KeyConceptText'

const math = 'math-sets-propositions' as const

describe('reviewed textbook reading-block emphasis', () => {
  it('activates only for the four GOLDEN math units and revised physics 1A-1G', () => {
    for (const unit of ['math-sets','math-propositions-reading','math-quantifiers-all-exists','math-propositions-proof']) {
      expect(textbookEmphasisScope('math-1a',unit)).toBe(math)
    }
    expect(textbookEmphasisScope('math-1a','math-1a-numbers-expressions')).toBeUndefined()
    expect(textbookEmphasisScope('physics','physics-a-displacement-velocity-revised')).toBe('physics-1a')
    expect(textbookEmphasisScope('physics','physics-1g-gravity-drag-terminal-velocity-revised')).toBe('physics-1g')
    expect(textbookEmphasisScope('physics','physics-1g-gravity-drag-terminal-velocity')).toBeUndefined()
  })

  it('marks definition criteria in black and named concepts in blue, even when terms are separate atoms', () => {
    const source = 'Aのように有限個の要素からなる集合を'
    const marks = keyConceptRanges(source,math,'paragraph-finite-concept','math-sets')
    expect(marks.map(x=>[x.phrase,x.tone])).toEqual([['有限個の要素からなる','condition']])
    expect(isReviewedConceptTerm('有限集合',math,'paragraph-finite-concept','math-sets')).toBe(true)
    expect(isReviewedConceptTerm('無限集合',math,'paragraph-finite-concept','math-sets')).toBe(true)
    expect(isReviewedConceptTerm('有限集合',math,'paragraph-a01','math-sets')).toBe(false)
  })

  it('handles the photographed sets / elements definition across split text and term atoms', () => {
    const source='今並べた数は、どれも「24の正の約数である」という同じ条件を満たしている。このように、ある条件を満たすものをひとまとまりとして考えたものを'
    const {container} = render(<p><KeyConceptText scope={math} unitId="math-sets" blockId="paragraph-set-concept" value={source}/></p>)
    const matches=[...container.querySelectorAll('strong.key-concept-emphasis')]
    expect(matches.map(x=>x.textContent)).toEqual(['同じ条件','条件を満たすもの'])
    expect(matches.every(x=>x.classList.contains('key-concept-emphasis--condition'))).toBe(true)
    expect(isReviewedConceptTerm('集合',math,'paragraph-set-concept','math-sets')).toBe(true)
    expect(isReviewedConceptTerm('要素',math,'paragraph-set-concept','math-sets')).toBe(true)
    expect(container.textContent).toBe(source)
  })

  it('handles full-set and complement examples without modifying the original text', () => {
    const original='このように、考える対象全体を一つの集合として決める。その集合を'
    const {container}=render(<p><KeyConceptText scope={math} unitId="math-sets" blockId="paragraph-universal-concept" value={original}/></p>)
    expect(container.querySelector('strong')?.textContent).toBe('考える対象全体')
    expect(isReviewedConceptTerm('全体集合',math,'paragraph-universal-concept','math-sets')).toBe(true)
    expect(container.textContent).toBe(original)
    expect(keyConceptRanges('全体集合Uの中でAに属さない要素全体の集合をAの',math,'paragraph-complement-concept','math-sets')
      .map(m=>m.phrase)).toEqual(['全体集合Uの中でAに属さない要素全体'])
    expect(isReviewedConceptTerm('補集合',math,'paragraph-complement-concept','math-sets')).toBe(true)
  })

  it('annotates relevant propositions and proof blocks rather than incidental same-term mentions', () => {
    const original='真か偽かを判断できる文を'
    expect(keyConceptRanges(original,math,'paragraph-implication-concept','math-propositions-reading')
      .map(m=>m.phrase)).toEqual(['真か偽かを判断できる文'])
    expect(isReviewedConceptTerm('命題',math,'paragraph-implication-concept','math-propositions-reading')).toBe(true)
    expect(isReviewedConceptTerm('反例',math,'paragraph-counterexample-concept','math-propositions-reading')).toBe(true)
    expect(isReviewedConceptTerm('背理法',math,'paragraph-contradiction-concept','math-propositions-proof')).toBe(true)
    expect(keyConceptRanges('この後も命題について勉強する。',math,'paragraph-a01','math-sets')).toEqual([])
  })

  it('pairs meaningful physics teaching criteria and named concepts without styling formulas', () => {
    const source='このように、原点から物体の位置へ向かうベクトルを位置ベクトルという。'
    expect(keyConceptRanges(source,'physics-1a','paragraph-3')
      .map(m=>[m.phrase,m.tone])).toEqual([
        ['原点から物体の位置へ向かう','condition'],
        ['位置ベクトル','concept'],
      ])
    const finite='このように、ある観測者から見た別の物体の速度を、物理では**相対速度**という。'
    expect(keyConceptRanges(finite,'physics-1c','paragraph-3')
      .map(x=>x.phrase)).toEqual(['ある観測者から見た別の物体の速度','相対速度'])
    expect(keyConceptRanges('合力が0なら加速度も0で、速度は変化しない。','physics-1g','paragraph-4')
      .map(x=>x.phrase)).toContain('合力が0なら加速度も0')
  })

  it('does not change unselected textbook paragraphs or normal practice text', () => {
    const source='要素がこの先もずっと続く集合を考える。'
    const {container}=render(<p><KeyConceptText scope={math} blockId="paragraph-a07" unitId="math-sets" value={source}/></p>)
    expect(container.textContent).toBe(source)
    expect(container.querySelectorAll('.key-concept-emphasis')).toHaveLength(0)
    const practice=render(<ContentRenderer blocks={[
      { id: 'dialogue',type:'text',speaker:'先生',text:'真か偽かを判断できる文を命題という。' },
      { id: 'hint',type:'text',text:'集合の要素を比べる。' },
      { id:'math',type:'latex',latex:'A \\subseteq B',display:'inline' },
    ]}/>)
    expect(practice.container.querySelector('.key-concept-emphasis')).toBeNull()
    expect(practice.container.querySelector('.katex')).not.toBeNull()
  })
})
