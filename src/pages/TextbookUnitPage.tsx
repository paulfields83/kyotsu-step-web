import { InlineMath } from 'react-katex'
import { Check, LockKeyhole, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { textbookRepository } from '../repositories/textbookRepository'
import { getTextbookChoices, isTextbookAnswerCorrect, textbookSectionProgress, textbookUnitProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../domain/textbook'
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

function readingGroupItemIds(blocks: TextbookReadingBlock[]) {
  return blocks.flatMap((block) =>
    block.type === 'paragraph' || block.type === 'formula'
      ? block.parts.filter((part) => part.type === 'choice').map((part) => part.itemId)
      : [],
  )
}

function groupReadingFlow(blocks: TextbookReadingBlock[]) {
  const groups: TextbookReadingBlock[][] = []
  let current: TextbookReadingBlock[] = []

  for (const block of blocks) {
    if (block.type === 'heading' && current.some((candidate) => candidate.type === 'heading')) {
      groups.push(current)
      current = []
    }
    current.push(block)
  }
  if (current.length) groups.push(current)
  return groups
}

function renderResolvedChoice(item: TextbookItem, record: TextbookAnswerRecord) {
  if (record.isFirstCorrect) {
    return (
      <span className="reading-inline-answer" data-testid={`resolved-${item.id}`}>
        <Check size={14} aria-hidden="true" />
        <strong>{record.value}</strong>
      </span>
    )
  }

  return (
    <span data-testid={`resolved-${item.id}`}>
      <span className="reading-inline-blank reading-inline-blank--wrong">
        <X size={14} aria-hidden="true" />
        <strong>{record.firstValue ?? record.value}</strong>
      </span>
      <span className="reading-inline-answer">
        <Check size={14} aria-hidden="true" />
        <strong>{item.answer}</strong>
      </span>
    </span>
  )
}

function renderActiveChoice(
  item: TextbookItem,
  value: string | undefined,
  isWrong: boolean,
  onOpen: (itemId: string) => void,
  text: (ja: string, zh: string) => string,
) {
  return (
    <button
      type="button"
      data-testid={`textbook-item-${item.id}`}
      className={`reading-inline-blank${isWrong ? ' reading-inline-blank--wrong' : ''}`}
      onClick={() => onOpen(item.id)}
      aria-label={`${item.label} ${text('を選ぶ', '选择答案')}`}
    >
      <span>{item.label}</span>
      <strong>{value || text('選択', '选择')}</strong>
    </button>
  )
}

function renderPart(
  part: TextbookReadingPart,
  section: TextbookSection,
  progress: TextbookUnitProgress | undefined,
  onOpen: (itemId: string) => void,
  text: (ja: string, zh: string) => string,
): ReactNode {
  if (part.type === 'text') return part.text
  if (part.type === 'math') return <InlineMath math={part.latex} />

  const item = section.items.find((candidate) => candidate.id === part.itemId)
  if (!item) return null
  const record = progress?.answers[item.id]
  if (record?.resolved) return renderResolvedChoice(item, record)
  return renderActiveChoice(item, record?.value, Boolean(record && !record.resolved), onOpen, text)
}

function TextbookReadingFlow({ unit, section, progress }: {
  unit: TextbookUnit
  section: TextbookSection
  progress: TextbookUnitProgress | undefined
}) {
  const { text } = useI18n()
  const answerTextbook = useAppStore((state) => state.answerTextbook)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const groups = useMemo(() => groupReadingFlow(section.readingFlow), [section.readingFlow])

  const firstIncompleteGroup = groups.findIndex((group) => {
    const itemIds = readingGroupItemIds(group)
    return itemIds.length > 0 && itemIds.some((itemId) => !progress?.answers[itemId]?.resolved)
  })
  const visibleGroupCount = firstIncompleteGroup === -1 ? groups.length : firstIncompleteGroup + 1
  const visibleGroups = groups.slice(0, visibleGroupCount)

  const activeItem = activeItemId ? section.items.find((item) => item.id === activeItemId) : undefined
  const activeRecord = activeItem ? progress?.answers[activeItem.id] : undefined
  const activeChoices = activeItem ? getTextbookChoices(unit, activeItem) : []
  const activeWrongResult = Boolean(activeRecord?.resolved && !activeRecord.isFirstCorrect)

  const selectChoice = (choice: string) => {
    if (!activeItem || activeRecord?.resolved) return
    const correct = isTextbookAnswerCorrect(activeItem, choice)
    answerTextbook(unit, activeItem.id, choice)
    if (correct) setActiveItemId(null)
  }

  const blockContainsActiveItem = (block: TextbookReadingBlock) =>
    Boolean(
      activeItemId
      && (block.type === 'paragraph' || block.type === 'formula')
      && block.parts.some((part) => part.type === 'choice' && part.itemId === activeItemId),
    )

  const renderInlineChoicePanel = (block: TextbookReadingBlock) => {
    if (!activeItem || !blockContainsActiveItem(block)) return null
    return (
      <div className="reading-inline-choice-panel" data-testid={`inline-choice-panel-${activeItem.id}`}>
        <div className="reading-inline-choice-panel__head">
          <strong>{activeItem.label}</strong>
          <span>{activeItem.prompt}</span>
        </div>
        <div className="reading-choice-options" role="group" aria-label={`${activeItem.label} ${text('選択肢', '选项')}`}>
          {activeChoices.map((choice, index) => {
            const selectedWrong = Boolean(activeWrongResult && (activeRecord?.firstValue ?? activeRecord?.value) === choice)
            const revealedCorrect = Boolean(activeWrongResult && isTextbookAnswerCorrect(activeItem, choice))
            return (
              <button
                type="button"
                key={choice}
                data-testid={`textbook-choice-${activeItem.id}-${index}`}
                className={`reading-choice-option${selectedWrong ? ' reading-choice-option--wrong' : ''}${revealedCorrect ? ' textbook-choice--correct' : ''}`}
                disabled={Boolean(activeRecord?.resolved)}
                onClick={() => selectChoice(choice)}
              >
                <span>{index + 1}</span>
                <strong>{choice}</strong>
                {activeItem.unit && <small>{activeItem.unit}</small>}
              </button>
            )
          })}
        </div>
        {activeWrongResult && (
          <p className="reading-inline-choice-error" data-testid={`answer-reveal-${activeItem.id}`}>
            {text(`不正解です。正解は「${activeItem.answer}」です。`, `回答错误。正确答案是「${activeItem.answer}」。`)}
          </p>
        )}
      </div>
    )
  }

  const renderBlock = (block: TextbookReadingBlock) => {
    if (block.type === 'heading') return <h3 className="reading-subheading" key={block.id}>{block.text}</h3>
    if (block.type === 'note') return <aside className="reading-note" key={block.id}>{block.text}</aside>

    if (block.type === 'figure') {
      const figure = section.figures.find((candidate) => candidate.id === block.figureId)
      if (!figure) return null
      return (
        <figure className="reading-figure" key={block.id}>
          <img src={resolveAssetSrc(figure.src)} alt={figure.alt} />
          {figure.caption && <figcaption>{figure.caption}</figcaption>}
        </figure>
      )
    }

    const content = block.parts.map((part, index) => (
      <span key={`${block.id}-part-${index}`}>
        {renderPart(part, section, progress, setActiveItemId, text)}
      </span>
    ))

    return (
      <div className="reading-block-with-choice" key={block.id}>
        {block.type === 'formula'
          ? <div className="reading-formula-line">{content}</div>
          : <p className="reading-paragraph">{content}</p>}
        {renderInlineChoicePanel(block)}
      </div>
    )
  }

  return (
    <article className="textbook-reading-flow" data-testid="textbook-reading-flow">
      {visibleGroups.map((group, groupIndex) => {
        const groupItemIds = readingGroupItemIds(group)
        const completed = groupItemIds.length > 0 && groupItemIds.every((itemId) => progress?.answers[itemId]?.resolved)
        return (
          <section className="reading-subsection" data-testid={`reading-subsection-${groupIndex}`} key={group[0]?.id ?? groupIndex}>
            {group.map(renderBlock)}
            {completed && groupIndex < groups.length - 1 && (
              <div className="reading-subsection-complete">
                <Check size={16} aria-hidden="true" />
                <span>{text('この小節を完了しました。次の小節へ進めます。', '本小节已完成，可以继续下一小节。')}</span>
              </div>
            )}
          </section>
        )
      })}
    </article>
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
          : null}

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
