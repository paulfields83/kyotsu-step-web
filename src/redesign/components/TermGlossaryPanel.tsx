import { useEffect, useRef, useState } from 'react'
import { BookOpenText, X } from 'lucide-react'
import { InlineMath } from 'react-katex'
import { useI18n } from '../../i18n/runtime'
import { termGlossary, type TermGlossarySubject } from '../../domain/termGlossary'

export function TermGlossaryPanel({
  initialSubject,
  onClose,
}: {
  initialSubject: TermGlossarySubject
  onClose: () => void
}) {
  const [subject, setSubject] = useState<TermGlossarySubject>(initialSubject)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { text } = useI18n()

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const groups = termGlossary[subject]
  return (
    <div className="v2-terms-overlay" data-testid="term-glossary-overlay"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="v2-terms-panel" role="dialog" aria-modal="true"
        aria-label={text('用語・記号一覧', '术语与符号表')} data-testid="term-glossary-panel">
        <header className="v2-terms-panel__header">
          <div className="v2-terms-panel__title">
            <BookOpenText size={21} aria-hidden="true" />
            <div>
              <strong>{text('用語・記号', '术语与符号')}</strong>
              <small>{text('教科書で広く使う記号を確認', '查看教科书常用记号')}</small>
            </div>
          </div>
          <button ref={closeRef} type="button" className="v2-terms-panel__close"
            onClick={onClose} aria-label={text('閉じる', '关闭')}>
            <X size={20} />
          </button>
        </header>
        <div className="v2-terms-subjects" role="group" aria-label={text('科目', '科目')}>
          <button type="button" aria-pressed={subject === 'math-1a'} onClick={() => setSubject('math-1a')}>
            {text('数学', '数学')}
          </button>
          <button type="button" aria-pressed={subject === 'physics'} onClick={() => setSubject('physics')}>
            {text('物理', '物理')}
          </button>
        </div>
        <p className="v2-terms-panel__disclaimer">
          {text('問題の中で別の定義がある場合は、問題文の定義を優先してください。',
            '若题目另行定义了记号，应以题目给出的定义为准。')}
        </p>
        <div className="v2-terms-panel__body">
          {groups.map((group) => (
            <section className="v2-terms-group" key={group.id}>
              <h3>{text(group.ja, group.zh)}</h3>
              <div className="v2-terms-list">
                {group.terms.map((entry, index) => (
                  <div className="v2-terms-entry" key={group.id + index}>
                    <span className="v2-terms-entry__math"><InlineMath math={entry.latex} /></span>
                    <div className="v2-terms-entry__definition">
                      <span>{text(entry.ja, entry.zh)}</span>
                      {entry.unit && <small>{entry.unit}</small>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
