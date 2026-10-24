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
const containsPhysicsSymbols = /[⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜΔθ√]/u

// Supports nested formulas such as √((−10)²+(−10)²) in authored hints.
function convertRadicals(input: string): string {
  let output = ''
  for (let i = 0; i < input.length;) {
    if (input[i] !== '√') {
      output += input[i++]
      continue
    }
    if (input[i + 1] === '(') {
      let depth = 0
      let close = -1
      for (let j = i + 1; j < input.length; j++) {
        if (input[j] === '(') depth++
        if (input[j] === ')' && --depth === 0) {
          close = j
          break
        }
      }
      if (close >= 0) {
        output += '\\sqrt{' + convertRadicals(input.slice(i + 2, close)) + '}'
        i = close + 1
        continue
      }
    }
    const digits = input.slice(i + 1).match(/^[0-9]+/)
    if (digits) {
      output += '\\sqrt{' + digits[0] + '}'
      i += digits[0].length + 1
      continue
    }
    output += input[i++]
  }
  return output
}

export function normalizePhysicsTextbookChoice(value: string): string | null {
  const original = value.trim()
  if (!original || !containsPhysicsSymbols.test(original)) return null
  if (/[ぁ-んァ-ヶ一-龯]/u.test(original)) return null

  const latex = convertRadicals(original)
    .replace(/v̄⃗/g, '\\vec{v}_{\\mathrm{avg}}')
    .replace(/([A-Za-z])̄⃗/g, (_, letter: string) => '\\bar{\\vec{' + letter + '}}')
    .replace(/Δ([A-Za-z])⃗/g, (_, letter: string) => '\\Delta \\vec{' + letter + '}')
    .replace(/([A-Za-z])⃗/g, (_, letter: string) => '\\vec{' + letter + '}')
    .replace(/([₀₁₂₃₄₅₆₇₈₉ₓᵧₜ]+)/g, (symbols: string) =>
      '_{' + [...symbols].map(symbol => subscriptSymbols[symbol] ?? symbol).join('') + '}')
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
