import { useEffect, useRef, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useI18n } from '../../i18n/runtime'

export function NumberedSection({ number, title, children, description }: { number: string; title: string; children: ReactNode; description?: string }) {
  return (
    <section className="numbered-section">
      <header className="section-heading"><span>{number}</span><div><h2>{title}</h2>{description && <p>{description}</p>}</div></header>
      <div className="section-body">{children}</div>
    </section>
  )
}

export function RaisedButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`raised-button ${className}`} {...props} />
}

function useModalFocus(open: boolean, onEscape: () => void) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const frame = window.requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>('button, input, select, textarea, [href]')?.focus())
    return () => { window.cancelAnimationFrame(frame); previous?.focus() }
  }, [open])
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') { event.preventDefault(); onEscape(); return }
    if (event.key !== 'Tab' || !ref.current) return
    const focusable = [...ref.current.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [href]')]
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable.at(-1)!
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }
  return { ref, onKeyDown }
}

export function StatusBadge({ tone = 'info', children }: { tone?: 'info' | 'success' | 'error' | 'muted'; children: ReactNode }) {
  const Icon = tone === 'success' ? CheckCircle2 : tone === 'error' ? AlertTriangle : Info
  return <span className={`status-badge status-badge--${tone}`}><Icon size={15} aria-hidden="true" />{children}</span>
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const safeMax = Math.max(max, 1)
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100))
  return (
    <div className="progress-block">
      <div className="progress-label"><span>{label}</span><span>{value}/{max}</span></div>
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}><span style={{ width: `${percent}%` }} /></div>
    </div>
  )
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="state-panel"><span className="state-panel__mark">—</span><h2>{title}</h2><p>{body}</p>{action}</div>
}

export function ErrorState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="state-panel state-panel--error"><AlertTriangle aria-hidden="true" /><h2>{title}</h2><p>{body}</p>{action}</div>
}

export function BottomSheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const { text } = useI18n()
  const modal = useModalFocus(open, onClose)
  if (!open) return null
  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={modal.ref} onKeyDown={modal.onKeyDown} className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <header><h2 id="sheet-title">{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label={text('閉じる', '关闭')}><X aria-hidden="true" /></button></header>
        <div className="bottom-sheet__body">{children}</div>
      </section>
    </div>
  )
}

export function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel }: { open: boolean; title: string; body: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  const { text } = useI18n()
  const modal = useModalFocus(open, onCancel)
  if (!open) return null
  return (
    <div className="dialog-backdrop">
      <section ref={modal.ref} onKeyDown={modal.onKeyDown} className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-body">
        <h2 id="confirm-title">{title}</h2><p id="confirm-body">{body}</p>
        <div className="button-row"><button type="button" className="text-button" onClick={onCancel}>{text('キャンセル', '取消')}</button><RaisedButton onClick={onConfirm}>{confirmLabel}</RaisedButton></div>
      </section>
    </div>
  )
}
