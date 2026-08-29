import { Check, LockKeyhole, RotateCcw, X } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { textbookRepository } from '../repositories/textbookRepository'
import { textbookSectionProgress, textbookUnitProgress } from '../domain/textbook'
import type { TextbookItem, TextbookUnit } from '../domain/textbookSchema'
import { useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'

function resolveAssetSrc(src: string) {
  if (/^(?:https?:|data:|blob:)/i.test(src)) return src
  const viteBase = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  const base = viteBase.endsWith('/') ? viteBase : `${viteBase}/`
  if (src.startsWith(base)) return src
  return `${base}${src.replace(/^\.?\/+/, '')}`
}

function TextbookCheckItem({ unit, item }: { unit: TextbookUnit; item: TextbookItem }) {
  const record = useAppStore((state) => state.textbookProgress[unit.unitId]?.answers[item.id])
  const answerTextbook = useAppStore((state) => state.answerTextbook)
  const { text } = useI18n()
  const [value, setValue] = useState(record?.resolved ? record.value : '')

  useEffect(() => {
    if (record?.resolved) setValue(record.value)
  }, [record?.resolved, record?.value])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || record?.resolved) return
    answerTextbook(unit, item.id, trimmed)
  }

  const wrong = Boolean(record && !record.resolved)
  return (
    <form className={`textbook-check-item${record?.resolved ? ' textbook-check-item--correct' : wrong ? ' textbook-check-item--wrong' : ''}`} onSubmit={submit} data-testid={`textbook-item-${item.id}`}>
      <header>
        <span>{item.label}</span>
        {record?.resolved && <small><Check size={15} aria-hidden="true" />{record.isFirstCorrect ? text('初回正解', '首次答对') : text('再回答で正解', '重答正确')}</small>}
        {wrong && <small><X size={15} aria-hidden="true" />{text('もう一度', '再试一次')}</small>}
      </header>
      <p>{item.prompt}</p>
      <div className="textbook-answer-row">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={record?.resolved}
          inputMode={item.answerType === 'number' ? 'decimal' : undefined}
          aria-label={`${item.label} ${text('解答', '答案')}`}
          placeholder={item.answerType === 'formula' ? text('式を入力', '输入公式') : item.answerType === 'number' ? text('数値を入力', '输入数值') : text('答えを入力', '输入答案')}
        />
        {item.unit && <span className="textbook-unit-label">{item.unit}</span>}
        {!record?.resolved && <RaisedButton type="submit" disabled={!value.trim()}>{text('判定', '判定')}</RaisedButton>}
      </div>
      {wrong && <p className="textbook-feedback textbook-feedback--wrong">{text('答えを固定せず、前後の説明を読み直してもう一度入力してください。', '先不要看最终答案，重新阅读前后说明后再输入一次。')}</p>}
      {record?.resolved && <p className="textbook-feedback textbook-feedback--correct">{text('正解。次の知識点へ進みます。', '正确，继续下一个知识点。')}</p>}
    </form>
  )
}

export function TextbookUnitPage() {
  const { unitId = '' } = useParams()
  const [unit, setUnit] = useState<TextbookUnit | null | undefined>(undefined)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const progress = useAppStore((state) => state.textbookProgress[unitId])
  const resetTextbookUnit = useAppStore((state) => state.resetTextbookUnit)
  const { text } = useI18n()

  useEffect(() => {
    let active = true
    textbookRepository.getById(unitId).then((value) => {
      if (active) setUnit(value ?? null)
    })
    return () => { active = false }
  }, [unitId])

  const firstIncompleteIndex = useMemo(() => {
    if (!unit) return 0
    const index = unit.sections.findIndex((section) => textbookSectionProgress(unit, progress, section.id).completed < section.items.length)
    return index === -1 ? unit.sections.length - 1 : index
  }, [progress, unit])

  useEffect(() => {
    setSelectedSectionIndex(firstIncompleteIndex)
  }, [firstIncompleteIndex, unitId])

  if (unit === undefined) return <div className="state-panel"><span className="state-panel__mark">…</span><h2>{text('教材を読み込んでいます', '正在加载教材')}</h2></div>
  if (!unit) return <ErrorState title={text('教材が見つかりません', '找不到教材')} body={text('この教材は削除されたか、まだ公開されていません。', '该教材可能已被删除或尚未发布。')} action={<Link className="raised-link" to="/learning/setup">{text('学習設定へ戻る', '返回学习设置')}</Link>} />

  const summary = textbookUnitProgress(unit, progress)
  const currentSection = unit.sections[selectedSectionIndex]
  const sectionSummary = textbookSectionProgress(unit, progress, currentSection.id)
  const sectionComplete = sectionSummary.completed === sectionSummary.total
  const unitComplete = summary.completed === summary.total
  const canOpen = (index: number) => unitComplete || index <= firstIncompleteIndex
  const goNext = () => setSelectedSectionIndex((index) => Math.min(unit.sections.length - 1, index + 1))

  return (
    <div className="page-stack textbook-page">
      <header className="session-header">
        <div>
          <p className="eyebrow">TEXTBOOK / PHYSICS</p>
          <h1>{unit.title}</h1>
          {unit.subtitle && <p>{unit.subtitle}</p>}
        </div>
        <StatusBadge>{text(`第 ${unit.revision} 版`, `第 ${unit.revision} 版`)}</StatusBadge>
      </header>

      <ProgressBar label={text('単元の進み具合', '单元进度')} value={summary.completed} max={summary.total} />

      <section className="textbook-objectives">
        <strong>{text('この単元で確認すること', '本单元确认内容')}</strong>
        <ol>{unit.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol>
      </section>

      <nav className="textbook-section-nav" aria-label={text('教材の章', '教材章节')}>
        {unit.sections.map((section, index) => {
          const sectionProgress = textbookSectionProgress(unit, progress, section.id)
          const complete = sectionProgress.completed === sectionProgress.total
          const allowed = canOpen(index)
          return (
            <button
              type="button"
              key={section.id}
              disabled={!allowed}
              aria-pressed={selectedSectionIndex === index}
              onClick={() => allowed && setSelectedSectionIndex(index)}
            >
              <span>{complete ? <Check size={16} aria-hidden="true" /> : allowed ? section.number : <LockKeyhole size={15} aria-hidden="true" />}</span>
              <strong>{section.title}</strong>
              <small>{sectionProgress.completed}/{sectionProgress.total}</small>
            </button>
          )
        })}
      </nav>

      <section className="textbook-section">
        <header className="textbook-section-heading">
          <div><span>{currentSection.number}</span><div><h2>{currentSection.title}</h2>{currentSection.description && <p>{currentSection.description}</p>}</div></div>
          <strong>{sectionSummary.completed}/{sectionSummary.total}</strong>
        </header>

        {currentSection.figures.length > 0 && (
          <div className="textbook-figures">
            {currentSection.figures.map((figure) => (
              <figure key={figure.id}>
                <img src={resolveAssetSrc(figure.src)} alt={figure.alt} />
                {figure.caption && <figcaption>{figure.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}

        <div className="textbook-check-list">
          {currentSection.items.map((item) => <TextbookCheckItem key={item.id} unit={unit} item={item} />)}
        </div>

        {sectionComplete && !unitComplete && selectedSectionIndex < unit.sections.length - 1 && (
          <div className="textbook-next-panel">
            <Check size={22} aria-hidden="true" />
            <div><strong>{text('この章は完了しました', '本章已完成')}</strong><small>{text('次の章へ進めます。', '可以继续下一章。')}</small></div>
            <RaisedButton data-testid="textbook-next-section" onClick={goNext}>{text('次へ', '下一章')}</RaisedButton>
          </div>
        )}

        {unitComplete && (
          <div className="textbook-complete-panel" data-testid="textbook-unit-complete">
            <Check size={28} aria-hidden="true" />
            <div><h2>{text('単元完了', '单元完成')}</h2><p>{text('A 変位と速度の 78 個の確認項目をすべて完了しました。', '已完成 A 位移与速度的全部 78 个确认项目。')}</p></div>
            <Link className="raised-link" to="/learning/setup">{text('問題演習へ進む', '进入做题模式')}</Link>
          </div>
        )}
      </section>

      <button type="button" className="text-button textbook-reset" onClick={() => {
        if (window.confirm(text('この単元の進捗を最初からやり直しますか？', '确定要清空本单元进度并重新开始吗？'))) {
          resetTextbookUnit(unit.unitId)
          setSelectedSectionIndex(0)
        }
      }}><RotateCcw size={15} aria-hidden="true" /> {text('この単元を最初から', '本单元重新开始')}</button>
    </div>
  )
}
