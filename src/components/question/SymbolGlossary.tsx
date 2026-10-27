import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import { useI18n } from '../../i18n/runtime'

export type SymbolNote = {
  symbol: string
  ja: string
  zh: string
  // An optional label / mathematical expression shown in formula helpers.
  label?: string
}

type GlossaryContextValue = {
  notes: Map<string, SymbolNote>
  active: { anchor: string; symbol: string; scope?: string } | null
  toggle: (anchor: string, symbol: string, scope?: string) => void
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null)

export function SymbolGlossaryProvider({ notes, children }: { notes: SymbolNote[]; children: ReactNode }) {
  const [active, setActive] = useState<{ anchor: string; symbol: string; scope?: string } | null>(null)
  const noteMap = useMemo(() => new Map(notes.map((note) => [note.symbol, note])), [notes])
  const toggle = (anchor: string, symbol: string, scope?: string) => {
    setActive((previous) =>
      previous?.anchor === anchor && previous.symbol === symbol ? null : { anchor, symbol, scope },
    )
  }
  return <GlossaryContext.Provider value={{ notes: noteMap, active, toggle }}>{children}</GlossaryContext.Provider>
}

function VisibleNote({ symbol }: { symbol: string }) {
  const context = useContext(GlossaryContext)
  const { text } = useI18n()
  const note = context?.notes.get(symbol)
  if (!note) return null
  return <span className="symbol-glossary-note" role="note" data-testid="symbol-note">
    <strong>{note.label ?? symbol}</strong>：{text(note.ja, note.zh)}
  </span>
}

// A formula is kept as an uninterrupted mathematical expression. A clicked
// variable's note is displayed AFTER the complete formula line, never between
// terms or inside an interactive answer button.
export function GlossaryFormulaNote({ scope }: { scope: string }) {
  const context = useContext(GlossaryContext)
  const active = context?.active
  if (!active || active.scope !== scope) return null
  return <div className="symbol-glossary-formula-note"><VisibleNote symbol={active.symbol} /></div>
}

const textSymbols = /[A-Za-zπΔθ∈∉∩∪⇒]/gu

export function GlossaryText({ value }: { value: string }) {
  const ctx = useContext(GlossaryContext)
  const anchor = useId()
  if (!ctx?.notes.size) return <>{value}</>
  const parts: ReactNode[] = []
  let cursor = 0
  for (const found of value.matchAll(textSymbols)) {
    const index = found.index ?? 0
    const symbol = found[0]
    const prev = value[index - 1] ?? ''
    const next = value[index + symbol.length] ?? ''
    if (!ctx.notes.has(symbol)
        || (/[A-Za-z]/.test(symbol) && (/[A-Za-z]/.test(prev) || /[A-Za-z]/.test(next)))) continue
    if (index > cursor) parts.push(value.slice(cursor, index))
    const open = ctx.active?.anchor === anchor && ctx.active.symbol === symbol
    parts.push(
      <span key={index} className="symbol-glossary-inline">
        <button type="button" className="symbol-glossary-trigger"
          data-testid={'symbol-trigger-' + symbol}
          aria-expanded={open}
          aria-label={symbol + ' ' + (open ? '閉じる' : '説明を見る')}
          onClick={() => ctx.toggle(anchor, symbol)}>{symbol}</button>
        {open && <VisibleNote symbol={symbol} />}
      </span>,
    )
    cursor = index + symbol.length
  }
  if (!parts.length) return <>{value}</>
  if (cursor < value.length) parts.push(value.slice(cursor))
  return <>{parts}</>
}

// Match full notation rather than treating v_avg, v_1 and v_2 as the same v.
// Normalize only for symbol detection. Never modify the source displayed by KaTeX.
function condensed(value: string) {
  return value
    .normalize('NFKC')
    .replace(/[⃗̄→←⇀⇁⇃⇂\u200b-\u200d\s{}_\\^()[\]]/gu, '')
    .replace(/[^A-Za-z0-9πΔθ∈∉∩∪⇒]/gu, '')
    .toLowerCase()
}

function formulaSearchText(math: string) {
  return condensed(math
    .replace(/\\(?:Delta)(?![A-Za-z])/g, 'Δ')
    .replace(/\\(?:theta)(?![A-Za-z])/g, 'θ')
    .replace(/\\(?:pi)(?![A-Za-z])/g, 'π')
    .replace(/\\(?:cap)(?![A-Za-z])/g, '∩')
    .replace(/\\(?:cup)(?![A-Za-z])/g, '∪')
    .replace(/\\(?:vec|bar|overline|mathbf|boldsymbol|mathrm|mathit|text|operatorname|left|right|frac|dfrac|tfrac|sqrt)(?![A-Za-z])/g, '')
    .replace(/\\[A-Za-z]+/g, ''),
  )
}

export function GlossaryMath({
  math,
  display = false,
  interactive = true,
  scope,
}: {
  math: string
  display?: boolean
  interactive?: boolean
  scope?: string
}) {
  const ctx = useContext(GlossaryContext)
  const anchor = useId()
  const container = useRef<HTMLSpanElement>(null)
  const search = formulaSearchText(math)
  const relevant = ctx ? [...ctx.notes.values()]
    .filter((note) => condensed(note.symbol) !== '' && search.includes(condensed(note.symbol)))
    .sort((a, b) => condensed(b.symbol).length - condensed(a.symbol).length)
    : []
  const [hasClickable, setHasClickable] = useState(false)

  useEffect(() => {
    const root = container.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-glossary-symbol]').forEach((element) => {
      delete element.dataset.glossarySymbol
      element.classList.remove('symbol-glossary-math-token')
      element.removeAttribute('role')
      element.removeAttribute('tabindex')
      element.removeAttribute('aria-label')
    })
    if (!ctx || !interactive || !relevant.length) {
      setHasClickable(false)
      return
    }
    const candidates = [...root.querySelectorAll<HTMLElement>(
      '.katex-html .mord, .katex-html .mrel, .katex-html .mbin, .katex-html .mop',
    )]
    // Prioritize entire accents/subscript groups, then individual math atoms.
    // A note named "v_avg" must win over the generic "v" for that expression.
    const sortedNotes = [...relevant].sort((a, b) => condensed(b.symbol).length - condensed(a.symbol).length)
    let marked = 0
    const mark = (element: HTMLElement, note: SymbolNote) => {
      if (element.closest('[data-glossary-symbol]')) return false
      element.dataset.glossarySymbol = note.symbol
      element.classList.add('symbol-glossary-math-token')
      element.setAttribute('role', 'button')
      element.setAttribute('tabindex', '0')
      element.setAttribute('aria-label', note.label ?? note.symbol)
      marked += 1
      return true
    }
    // Prefer complete KaTeX atoms (including their subscript or accent), so
    // v_avg and r_1 do not accidentally receive the generic v/r explanation.
    for (const note of sortedNotes) {
      const key = condensed(note.symbol)
      for (const element of candidates) {
        if (condensed(element.textContent ?? '') !== key) continue
        mark(element, note)
      }
    }
    // KaTeX renders Delta and an accented variable as neighboring visual
    // atoms rather than a single node. Allow tapping EITHER original atom.
    // No extra DOM elements, buttons, text, or layout boxes are inserted.
    for (const note of sortedNotes) {
      const key = condensed(note.symbol)
      if (!key.startsWith('δ') || key.length < 2) continue
      for (const element of candidates) {
        if (condensed(element.textContent ?? '') !== 'δ') continue
        let neighbor = element.nextElementSibling as HTMLElement | null
        while (neighbor && !/\b(?:mord|mop|mrel|mbin)\b/.test(neighbor.className)) {
          neighbor = neighbor.nextElementSibling as HTMLElement | null
        }
        if (!neighbor || !condensed(neighbor.textContent ?? '').startsWith(key.slice(1))) continue
        mark(element, note)
        mark(neighbor, note)
      }
    }
    setHasClickable(marked > 0)
  }, [math, interactive, ctx?.notes])

  const selected = ctx?.active?.anchor === anchor ? ctx.active.symbol : null
  const activate = (target: EventTarget | null) => {
    const root = container.current
    if (!(target instanceof Element) || !ctx || !root || !interactive) return false
    const matched = target.closest<HTMLElement>('[data-glossary-symbol]')
    if (!matched || !root.contains(matched)) return false
    ctx.toggle(anchor, matched.dataset.glossarySymbol ?? '', scope)
    return true
  }

  return <span className={'symbol-glossary-math' + (display ? ' symbol-glossary-math--display' : '')}>
    <span ref={container}
      onClick={(event) => {
        if (activate(event.target)) { event.stopPropagation(); event.preventDefault() }
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        if (activate(event.target)) { event.preventDefault(); event.stopPropagation() }
      }}>
      {display ? <BlockMath math={math} /> : <InlineMath math={math} />}
    </span>

    {interactive && !scope && hasClickable && selected && <VisibleNote symbol={selected} />}
  </span>
}
