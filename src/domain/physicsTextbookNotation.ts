/**
 * Render Physics Chapter-1 Unicode vector/subscript notation in KaTeX.
 * This changes presentation only; the source, option strings and grading
 * keys remain byte-for-byte unchanged.
 */
const subscriptSymbols: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  'ₓ': 'x', 'ᵧ': 'y', 'ₜ': 't',
}
const containsPhysicsSymbols = /[⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜΔθ√²³]/u

export function normalizePhysicsTextbookChoice(value: string): string | null {
  const original = value.trim()
  if (!original || !containsPhysicsSymbols.test(original)) return null
  if (/[ぁ-んァ-ヶ一-龯]/u.test(original)) return null

  const latex = original
    .replace(/v̄⃗/g, '\\vec{v}_{\\mathrm{avg}}')
    .replace(/([A-Za-z])̄⃗/g, (_, letter: string) => '\\bar{\\vec{' + letter + '}}')
    .replace(/Δ([A-Za-z])⃗/g, (_, letter: string) => '\\Delta \\vec{' + letter + '}')
    .replace(/([A-Za-z])⃗/g, (_, letter: string) => '\\vec{' + letter + '}')
    .replace(/([₀₁₂₃₄₅₆₇₈₉ₓᵧₜ]+)/g, (symbols: string) =>
      '_{' + [...symbols].map(symbol => subscriptSymbols[symbol] ?? symbol).join('') + '}')
    .replace(/√\(([^()]*)\)/g, (_, radicand: string) => '\\sqrt{' + radicand + '}')
    .replace(/√([0-9]+)/g, (_, radicand: string) => '\\sqrt{' + radicand + '}')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/θ/g, '\\theta ')
    .replace(/Δ/g, '\\Delta ')
    .replace(/°/g, '^{\\circ}')
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '\\times ')
    .replace(/·/g, '\\cdot ')
    .replace(/(sin|cos|tan)(?=\\theta)/g, (_, fn: string) => '\\' + fn + ' ')

  if (/[⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜ√θΔ]/u.test(latex)) return null
  return latex
}
