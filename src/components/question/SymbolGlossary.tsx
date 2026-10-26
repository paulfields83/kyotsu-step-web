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
  active: { anchor: string; symbol: string } | null
  toggle: (anchor: string, symbol: string) => void
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null)

export function SymbolGlossaryProvider({ notes, children }: { notes: SymbolNote[]; children: ReactNode }) {
  const [active, setActive] = useState<{ anchor: string; symbol: string } | null>(null)
  const noteMap = useMemo(() => new Map(notes.map((note) => [note.symbol, note])), [notes])
  const toggle = (anchor: string, symbol: string) => {
    setActive((previous) =>
      previous?.anchor === anchor && previous.symbol === symbol ? null : { anchor, symbol },
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
  showSymbols = false,
}: {
  math: string
  display?: boolean
  interactive?: boolean
  showSymbols?: boolean
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
    for (const note of sortedNotes) {
      const key = condensed(note.symbol)
      for (const element of candidates) {
        if (element.closest('[data-glossary-symbol]')) continue
        if (condensed(element.textContent ?? '') !== key) continue
        // Avoid instrumenting invisible accessibility markup and command-generated labels.
        element.dataset.glossarySymbol = note.symbol
        element.classList.add('symbol-glossary-math-token')
        element.setAttribute('role', 'button')
        element.setAttribute('tabindex', '0')
        element.setAttribute('aria-label', note.label ?? note.symbol)
        marked += 1
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
    ctx.toggle(anchor, matched.dataset.glossarySymbol ?? '')
    return true
  }

  const showChoices = Boolean(interactive && showSymbols && relevant.length)
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
    {showChoices && <span className="symbol-glossary-math-options"
      aria-label="この式の記号" data-testid="formula-symbols">
      <small>記号：</small>
      {relevant.map((note) => {
        const open = selected === note.symbol
        return <button type="button" key={note.symbol} className="symbol-glossary-option"
          data-testid={'formula-symbol-' + note.symbol}
          aria-expanded={open}
          onClick={() => ctx?.toggle(anchor, note.symbol)}>{note.label ?? note.symbol}</button>
      })}
    </span>}
    {interactive && (hasClickable || showChoices) && selected && <VisibleNote symbol={selected} />}
  </span>
}
