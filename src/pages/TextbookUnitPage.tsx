import { InlineMath } from 'react-katex'
import { Check, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { textbookRepository } from '../repositories/textbookRepository'
import { textbookSectionProgress, textbookUnitProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../domain/textbook'
import type { TextbookReadingBlock, TextbookReadingPart } from '../domain/textbookSchema'
import type { PublicTextbookItem, PublicTextbookSection, PublicTextbookUnit, TextbookAnswerResult } from '../domain/textbookPublic'
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
  const hasTopics = blocks.some((block) => block.type === 'topic')

  for (const block of blocks) {
    const startsNewGroup = hasTopics
      ? block.type === 'topic'
      : block.type === 'heading' && current.some((candidate) => candidate.type === 'heading')

    if (startsNewGroup && current.length) {
      groups.push(current)
      current = []
    }
    current.push(block)
  }
  if (current.length) groups.push(current)
  return groups
}

function recordServerAnswer(unit: PublicTextbookUnit, itemId: string, selectedValue: string, result: TextbookAnswerResult) {
  const now = Date.now()
  useAppStore.setState((state) => {
    const progress = state.textbookProgress[unit.unitId]
    const previous = progress?.answers[itemId]
    if (previous?.resolved) return state

    const nextRecord: TextbookAnswerRecord = {
      itemId,
      value: selectedValue,
      firstValue: previous?.firstValue ?? selectedValue,
      isFirstCorrect: previous?.isFirstCorrect ?? result.correct,
      resolved: result.resolved,
      attemptCount: (previous?.attemptCount ?? 0) + 1,
      firstAnsweredAt: previous?.firstAnsweredAt ?? now,
      lastAnsweredAt: now,
    }

    const answers = { ...(progress?.answers ?? {}), [itemId]: nextRecord }
    const allItemIds = unit.sections.flatMap((section) => section.items.map((item) => item.id))
    const completed = allItemIds.every((id) => answers[id]?.resolved)
    const nextProgress: TextbookUnitProgress = {
      unitId: unit.unitId,
      unitRevision: unit.revision,
      startedAt: progress?.startedAt ?? now,
      updatedAt: now,
      answers,
      ...(completed ? { completedAt: progress?.completedAt ?? now } : {}),
    }

    return { textbookProgress: { ...state.textbookProgress, [unit.unitId]: nextProgress } }
  })
}

function renderResolvedChoice(item: PublicTextbookItem, record: TextbookAnswerRecord) {
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
        <strong>{record.value}</strong>
      </span>
    </span>
  )
}

function renderActiveChoice(
  item: PublicTextbookItem,
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
  section: PublicTextbookSection,
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
  return renderActiveChoice(item, record?.firstValue, Boolean(record && !record.resolved), onOpen, text)
}

function TextbookReadingFlow({ unit, section, progress }: {
  unit: PublicTextbookUnit
  section: PublicTextbookSection
  progress: TextbookUnitProgress | undefined
}) {
  const { text } = useI18n()
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [submittingItemId, setSubmittingItemId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState('')
  const groups = useMemo(() => groupReadingFlow(section.readingFlow), [section.readingFlow])

  const activeItem = activeItemId ? section.items.find((item) => item.id === activeItemId) : undefined
  const activeRecord = activeItem ? progress?.answers[activeItem.id] : undefined
  const activeChoices = activeItem?.choices ?? []
  const activeWrongAttempt = Boolean(activeRecord && !activeRecord.resolved && activeRecord.attemptCount > 0)
  const selectChoice = async (choice: string) => {
    if (!activeItem || activeRecord?.resolved || submittingItemId) return
    setSubmitError('')
    setSubmittingItemId(activeItem.id)
    try {
      const result = await textbookRepository.submitAnswer(unit.unitId, activeItem.id, choice)
      recordServerAnswer(unit, activeItem.id, choice, result)
      if (result.correct) {
        setActiveItemId(null)
      } else {
        setSubmitError(text('不正解です。もう一度答えてください。', '回答错误，请重新作答。'))
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : text('回答を送信できませんでした。', '无法提交答案。'))
    } finally {
      setSubmittingItemId(null)
    }
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
            const selectedWrong = Boolean(activeWrongAttempt && activeRecord?.value === choice)
            return (
              <button
                type="button"
                key={choice}
                data-testid={`textbook-choice-${activeItem.id}-${index}`}
                className={`reading-choice-option${selectedWrong ? ' reading-choice-option--wrong' : ''}`}
                disabled={Boolean(activeRecord?.resolved) || submittingItemId === activeItem.id}
                onClick={() => void selectChoice(choice)}
              >
                <span>{index + 1}</span>
                <strong>{choice}</strong>
                {activeItem.unit && <small>{activeItem.unit}</small>}
              </button>
            )
          })}
        </div>
        {submitError && <p className="reading-inline-choice-error" role="alert">{submitError}</p>}
      </div>
    )
  }

  const renderBlock = (block: TextbookReadingBlock) => {
    if (block.type === 'topic') return <h3 className="reading-topic-title" key={block.id}>{block.text}</h3>
    if (block.type === 'heading') return <h4 className="reading-subheading" key={block.id}>{block.text}</h4>
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
      {groups.map((group, groupIndex) => {
        const groupItemIds = readingGroupItemIds(group)
        const completed = groupItemIds.length > 0 && groupItemIds.every((itemId) => progress?.answers[itemId]?.resolved)
        return (
          <section className={`reading-subsection${group[0]?.type === 'topic' ? ' reading-topic-card' : ''}`} data-testid={`reading-subsection-${groupIndex}`} key={group[0]?.id ?? groupIndex}>
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
  const [unit, setUnit] = useState<PublicTextbookUnit | null | undefined>(undefined)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const progress = useAppStore((state) => state.textbookProgress[unitId])
  const resetTextbookUnit = useAppStore((state) => state.resetTextbookUnit)
  const { text } = useI18n()

  useEffect(() => {
    let active = true
    textbookRepository.getById(unitId).then((value) => {
      if (active) setUnit(value ?? null)
    }).catch(() => {
      if (active) setUnit(null)
    })
    return () => { active = false }
  }, [unitId])

  useEffect(() => {
    setSelectedSectionIndex(0)
  }, [unitId])

  if (unit === undefined) return <div className="state-panel"><span className="state-panel__mark">…</span><h2>{text('教材を読み込んでいます', '正在加载教材')}</h2></div>
  if (!unit) return <ErrorState title={text('教材を読み込めません', '无法加载教材')} body={text('バックエンド API が起動しているか、VITE_API_BASE_URL を確認してください。', '请确认后端 API 已启动，并检查 VITE_API_BASE_URL。')} action={<Link className="raised-link" to="/learning/setup">{text('学習設定へ戻る', '返回学习设置')}</Link>} />

  const summary = textbookUnitProgress(unit, progress)
  const currentSection = unit.sections[selectedSectionIndex]
  const sectionSummary = textbookSectionProgress(unit, progress, currentSection.id)
  const sectionComplete = sectionSummary.completed === sectionSummary.total
  const unitComplete = summary.completed === summary.total
  const goNext = () => {
    setSelectedSectionIndex((index) => Math.min(unit.sections.length - 1, index + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-stack textbook-page">
      <header className="session-header">
        <div>
          <p className="eyebrow">{unit.subject === 'math-1a' ? 'TEXTBOOK / MATH I・A' : 'TEXTBOOK / PHYSICS'}</p>
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
          return (
            <button
              type="button"
              key={section.id}
              aria-pressed={selectedSectionIndex === index}
              onClick={() => setSelectedSectionIndex(index)}
            >
              <span>{complete ? <Check size={16} aria-hidden="true" /> : section.number}</span>
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
            <div><h2>{text('単元完了', '单元完成')}</h2><p>{text(`${unit.title} の ${summary.total} 個の確認項目をすべて完了しました。`, `已完成 ${unit.title} 的全部 ${summary.total} 个确认项目。`)}</p></div>
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