import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { normalizePhysicsTextbookChoice } from './physicsTextbookNotation'
import { textbookMathLatex } from './textbookMathDisplay'

describe('revised physics ZIP math typography', () => {
  it('renders vectors, indexed velocity and formulas without detached Unicode glyphs', () => {
    for (const expression of [
      'r⃗₁ + Δr⃗',
      'v⃗_{rain} − v⃗_{bicycle}',
      'v₀ᵧ+aᵧt',
      '√(vₓ²+vᵧ²)',
      'v₀cosθ·t',
      'F⃗_{net}',
      '√((−10)²+(−10)²)',
    ]) {
      const rendered = normalizePhysicsTextbookChoice(expression)
      expect(rendered, expression).not.toBeNull()
      expect(rendered, expression).not.toMatch(/[⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜθΔ√]/u)
      expect(() => katex.renderToString(rendered!, { throwOnError: true, strict: 'ignore' })).not.toThrow()
    }
  })
  it('leaves reviewed GOLDEN answer formatting and Japanese words unchanged', () => {
    expect(textbookMathLatex('5x³')).toContain('^{3}')
    expect(normalizePhysicsTextbookChoice('位置の変化')).toBeNull()
    expect(normalizePhysicsTextbookChoice('v⃗₂だけ')).toBeNull()
  })
})
