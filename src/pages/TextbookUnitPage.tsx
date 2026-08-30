import { InlineMath } from 'react-katex'
import { Check, LockKeyhole, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { textbookRepository } from '../repositories/textbookRepository'
import { getTextbookChoices, textbookSectionProgress, textbookUnitProgress, type TextbookUnitProgress } from '../domain/textbook'
import type { TextbookItem, TextbookReadingBlock, TextbookReadingPart, TextbookSection, TextbookUnit } from '../domain/textbookSchema'
import { useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'

function resolveAssetSrc(src: string) {
  if (/^(?:https?:|data:|blob:)/i.test(src)) return src
  const viteBase = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  const base = viteBase.endsWith('/') ? viteBase : `${viteBase}/`
  if (src.startsWith(base)) return src
  return `${base}${src.replace(/^\.?\/+/, '')}`
}

function TextbookChoicePanel({ unit, item, progress }: {
  unit: TextbookUnit
  item: TextbookItem
  progress: TextbookUnitProgress | undefined
}) {
  const answerTextbook = useAppStore((state) => state.answerTextbook)
  const { text } = useI18n()
  const record = progress?.answers[item.id]
  const choices = getTextbookChoices(unit, item)
  const wrong = Boolean(record && !record.resolved)

  return (
    <div className="reading-choice-panel" data-testid={`textbook-item-${item.id}`}>
      <div className="reading-choice-panel__head">
        <span>{item.label}</span>
        <strong>{text('ここを選ぶ', '在这里选择')}</strong>
        {wrong && <small><X size={14} aria-hidden="true" />{text('不正解・もう一度', '答错・再选一次')}</small>}
      </div>
      <div className="reading-choice-options" role="group" aria-label={`${item.label} ${text('選択肢', '选项')}`}>
        {choices.map((choice, index) => {
          const selectedWrong = wrong && record?.value === choice
          return (
            <button
              type="button"
              key={choice}
              data-testid={`textbook-choice-${item.id}-${index}`}
              className={`reading-choice-option${selectedWrong ? ' reading-choice-option--wrong' : ''}`}
              onClick={() => answerTextbook(unit, item.id, choice)}
            >
              <span>{index + 1}</span>
              <strong>{choice}</strong>
              {item.unit && <small>{item.unit}</small>}
            </button>
          )
        })}
      </div>
      {wrong && <p>{text('前後の文章を読み直して、別の選択肢を選んでください。', '重新阅读前后文，再选择其他选项。')}</p>}
    </div>
  )
}

function renderResolvedChoice(item: TextbookItem, value: string) {
  return (
    <span className="reading-inline-answer" data-testid={`resolved-${item.id}`}>
      <Check size={14} aria-hidden="true" />
      <strong>{value}</strong>
    </span>
  )
}

function renderActiveChoice(item: TextbookItem, value: string | undefined, isWrong: boolean, text: (ja: string, zh: string) => string) {
  return (
    <span className={`reading-inline-blank${isWrong ? ' reading-inline-blank--wrong' : ''}`}>
      <span>{item.label}</span>
      <strong>{value || text('選択', '选择')}</strong>
    </span>
  )
}

function renderPart(part: TextbookReadingPart, section: TextbookSection, progress: TextbookUnitProgress | undefined, text: (ja: string, zh: string) => string): { node: ReactNode; unresolved?: TextbookItem } {
  if (part.type === 'text') return { node: part.text }
  if (part.type === 'math') return { node: <InlineMath math={part.latex} /> }

  const item = section.items.find((candidate) => candidate.id === part.itemId)
  if (!item) return { node: null }
  const record = progress?.answers[item.id]
  if (record?.resolved) return { node: renderResolvedChoice(item, record.value) }

  return {
    node: renderActiveChoice(item, record?.value, Boolean(record && !record.resolved), text),
    unresolved: item,
  }
}

function TextbookReadingFlow({ unit, section, progress }: {
  unit: TextbookUnit
  section: TextbookSection
  progress: TextbookUnitProgress | undefined
}) {
  const { text } = useI18n()
  const nodes: ReactNode[] = []
  let stopped = false

  const renderParts = (block: Extract<TextbookReadingBlock, { type: 'paragraph' | 'formula' }>) => {
    const content: ReactNode[] = []
    let unresolved: TextbookItem | undefined

    for (let index = 0; index < block.parts.length; index += 1) {
      const part = block.parts[index]
      const rendered = renderPart(part, section, progress, text)
      content.push(<span key={`${block.id}-part-${index}`}>{rendered.node}</span>)
      if (rendered.unresolved) {
        unresolved = rendered.unresolved
        break
      }
    }

    if (block.type === 'formula') {
      nodes.push(
        <div className="reading-formula-line" key={block.id}>
          {content}
        </div>,
      )
    } else {
      nodes.push(
        <p className="reading-paragraph" key={block.id}>
          {content}
        </p>,
      )
    }

    if (unresolved) {
      nodes.push(<TextbookChoicePanel key={`${block.id}-choice`} unit={unit} item={unresolved} progress={progress} />)
      stopped = true
    }
  }

  for (const block of section.readingFlow) {
    if (stopped) break

    if (block.type === 'heading') {
      nodes.push(<h3 className="reading-subheading" key={block.id}>{block.text}</h3>)
      continue
    }

    if (block.type === 'note') {
      nodes.push(<aside className="reading-note" key={block.id}>{block.text}</aside>)
      continue
    }

    if (block.type === 'figure') {
      const figure = section.figures.find((candidate) => candidate.id === block.figureId)
      if (!figure) continue
      nodes.push(
        <figure className="reading-figure" key={block.id}>
          <img src={resolveAssetSrc(figure.src)} alt={figure.alt} />
          {figure.caption && <figcaption>{figure.caption}</figcaption>}
        </figure>,
      )
      continue
    }

    renderParts(block)
  }

  return <article className="textbook-reading-flow" data-testid="textbook-reading-flow">{nodes}</article>
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
  const goNext = () => {
    setSelectedSectionIndex((index) => Math.min(unit.sections.length - 1, index + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

        {currentSection.readingFlow.length > 0
          ? <TextbookReadingFlow unit={unit} section={currentSection} progress={progress} />
          : <div className="textbook-check-list">{currentSection.items.map((item) => <TextbookChoicePanel key={item.id} unit={unit} item={item} progress={progress} />)}</div>}

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
