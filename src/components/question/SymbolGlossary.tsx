import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import { useI18n } from '../../i18n/runtime'

export type SymbolNote = { symbol: string; ja: string; zh: string }

type GlossaryContextValue = {
  notes: Map<string, SymbolNote>
  active: { anchor: string; symbol: string } | null
  toggle: (anchor: string, symbol: string) => void
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null)

// Only question-specific, reviewed notes become clickable. Unknown symbols
// remain ordinary text, rather than being guessed by a generic dictionary.
export function SymbolGlossaryProvider({ notes, children }: { notes: SymbolNote[]; children: ReactNode }) {
  const [active, setActive] = useState<{ anchor: string; symbol: string } | null>(null)
  const noteMap = useMemo(() => new Map(notes.map((note) => [note.symbol, note])), [notes])
  const toggle = (anchor: string, symbol: string) => {
    setActive((previous) => previous?.anchor === anchor && previous.symbol === symbol ? null : { anchor, symbol })
  }
  return <GlossaryContext.Provider value={{ notes: noteMap, active, toggle }}>{children}</GlossaryContext.Provider>
}

function VisibleNote({ symbol }: { symbol: string }) {
  const context = useContext(GlossaryContext)
  const { text } = useI18n()
  const note = context?.notes.get(symbol)
  if (!note) return null
  return <span className="symbol-glossary-note" role="note" data-testid="symbol-note">
    <strong>{symbol}</strong>：{text(note.ja, note.zh)}
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
    // Avoid making individual letters clickable inside English words.
    if (!ctx.notes.has(symbol) || (/[A-Za-z]/.test(symbol) && (/[A-Za-z]/.test(prev) || /[A-Za-z]/.test(next)))) continue
    if (index > cursor) parts.push(value.slice(cursor, index))
    const open = ctx.active?.anchor === anchor && ctx.active.symbol === symbol
    parts.push(
      <span key={index} className="symbol-glossary-inline">
        <button type="button" className="symbol-glossary-trigger" data-testid={'symbol-trigger-' + symbol}
          aria-expanded={open} aria-label={symbol + ' ' + (open ? '閉じる' : '説明を見る')}
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

// Do not rewrite mathematical LaTeX: KaTeX creates individual symbol spans.
// Mark only rendered, leaf-level tokens matching question-scoped notes.
// This preserves fractions, accents, \text, and all existing math formatting.
export function GlossaryMath({ math, display = false }: { math: string; display?: boolean }) {
  const ctx = useContext(GlossaryContext)
  const anchor = useId()
  const container = useRef<HTMLSpanElement>(null)
  const [hasClickable, setHasClickable] = useState(false)
  useEffect(() => {
    let count = 0
    const root = container.current
    if (!root || !ctx?.notes.size) { setHasClickable(false); return }
    for (const element of root.querySelectorAll<HTMLElement>('.katex .mord, .katex .mbin, .katex .mrel')) {
      if (element.children.length !== 0) continue
      const symbol = (element.textContent ?? '').trim()
      const note = ctx.notes.get(symbol)
      if (!note) continue
      element.dataset.glossarySymbol = symbol
      element.classList.add('symbol-glossary-math-token')
      element.setAttribute('role', 'button')
      element.setAttribute('tabindex', '0')
      element.setAttribute('aria-label', symbol + '：' + note.ja)
      count += 1
    }
    setHasClickable(count > 0)
  }, [math, ctx?.notes])
  const activate = (target: EventTarget | null) => {
    if (!(target instanceof Element) || !container.current || !ctx) return false
    const matched = target.closest<HTMLElement>('[data-glossary-symbol]')
    if (!matched || !container.current.contains(matched)) return false
    ctx.toggle(anchor, matched.dataset.glossarySymbol ?? '')
    return true
  }
  const selected = hasClickable && ctx?.active?.anchor === anchor ? ctx.active.symbol : null
  return <span className="symbol-glossary-math">
    <span ref={container}
      onClick={(event) => { if (activate(event.target)) { event.preventDefault(); event.stopPropagation() } }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        if (activate(event.target)) { event.preventDefault(); event.stopPropagation() }
      }}>
      {display ? <BlockMath math={math} /> : <InlineMath math={math} />}
    </span>
    {selected && <VisibleNote symbol={selected} />}
  </span>
}
