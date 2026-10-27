import { describe, expect, it } from 'vitest'
import type { TextbookReadingBlock } from './textbookSchema'
import type { PublicTextbookSection, PublicTextbookUnit } from './textbookPublic'
import { builtInPracticeSymbolNotes, textbookSymbolNotes } from './practiceSymbolNotes'

const unit = (subject: 'math-1a' | 'physics', unitId: string) =>
  ({ subject, unitId, title: '', sections: [] }) as unknown as PublicTextbookUnit
const section = {} as PublicTextbookSection

describe('meaningful and local symbol notes', () => {
  it('does not annotate ordinary math unknowns and generic set operators', () => {
    const blocks = [{ id: 'block', type: 'paragraph', parts: [
      { type: 'text', text: 'x²-5x+6=0 を解く。A∩B を求めよ。' },
    ] }] as TextbookReadingBlock[]
    expect(textbookSymbolNotes(unit('math-1a', 'math-sets'), section, blocks)).toEqual([])
    expect(builtInPracticeSymbolNotes['math-statistics-01']).toEqual([])
  })

  it('keeps a defined, reused math set only within its own example', () => {
    const blocks = [{ id: 'definition', type: 'paragraph', parts: [
      { type: 'math', latex: 'A=\\{1,2,3\\}' },
      { type: 'text', text: '集合 A に属するものを調べる。' },
    ] }] as TextbookReadingBlock[]
    const notes = textbookSymbolNotes(unit('math-1a', 'math-sets'), section, blocks)
    expect(notes.map((note) => note.symbol)).toEqual(['A'])
    expect(notes[0].ja).toContain('1,2,3')
  })

  it('suppresses ambiguous definitions reused for another math question', () => {
    const blocks = [
      { id: 'one', type: 'formula', parts: [{ type: 'math', latex: 'A=\\{1,2,3\\}' }] },
      { id: 'two', type: 'formula', parts: [{ type: 'math', latex: 'A=\\{4,5,6\\}' }] },
    ] as TextbookReadingBlock[]
    expect(textbookSymbolNotes(unit('math-1a', 'math-sets'), section, blocks)).toEqual([])
  })

  it('distinguishes physical speed and vector, and x/y components', () => {
    const displacement = textbookSymbolNotes(unit('physics', 'physics-a-displacement-velocity-revised'), section)
    expect(displacement.find((note) => note.symbol === 'v')?.ja).toContain('速さ')
    expect(displacement.find((note) => note.symbol === 'vecv')?.ja).toContain('速度ベクトル')
    expect(displacement.find((note) => note.symbol === 'Δt')?.ja).toContain('t₂')
    const projection = textbookSymbolNotes(unit('physics', 'physics-1f-oblique-projectile-revised'), section)
    expect(projection.find((note) => note.symbol === 'v0x')?.ja).toContain('水平')
    expect(projection.find((note) => note.symbol === 'v0y')?.ja).toContain('鉛直')
    expect(projection.find((note) => note.symbol === 'θ')?.ja).toContain('投射角')
  })
})
