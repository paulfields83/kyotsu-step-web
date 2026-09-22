import { InlineMath } from 'react-katex'
import { Check, LockKeyhole, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { textbookRepository } from '../repositories/textbookRepository'
import { textbookSectionProgress, textbookUnitProgress, type TextbookAnswerRecord, type TextbookUnitProgress } from '../domain/textbook'
import { findTextbookLessonTarget, physicsTopicPrefix, type TextbookLessonTarget } from '../domain/textbookCatalog'
import type { TextbookReadingBlock, TextbookReadingPart } from '../domain/textbookSchema'
import type { PublicTextbookItem, PublicTextbookSection, PublicTextbookUnit, TextbookAnswerResult } from '../domain/textbookPublic'
import { useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'

function conciseTextbookTitle(unit: PublicTextbookUnit) {
  return unit.subject === 'math-1a'
    ? unit.title.replace(/^数学[ⅠⅡⅢIVXIA・\s]+\s*/u, '')
    : unit.title
}

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
      value: result.correct ? selectedValue : result.correctAnswer ?? selectedValue,
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
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const groups = useMemo(() => groupReadingFlow(section.readingFlow), [section.readingFlow])
  const hasTopicNavigation = groups.some((group) => group[0]?.type === 'topic')

  useEffect(() => {
    setSelectedGroupIndex(0)
    setActiveItemId(null)
    setSubmitError('')
  }, [section.id])

  const activeItem = activeItemId ? section.items.find((item) => item.id === activeItemId) : undefined
  const activeRecord = activeItem ? progress?.answers[activeItem.id] : undefined
  const activeChoices = activeItem?.choices ?? []
  const activeWrongResult = Boolean(activeRecord?.resolved && !activeRecord.isFirstCorrect)
  const selectChoice = async (choice: string) => {
    if (!activeItem || activeRecord?.resolved || submittingItemId) return
    setSubmitError('')
    setSubmittingItemId(activeItem.id)
    try {
      const result = await textbookRepository.submitAnswer(unit.unitId, activeItem.id, choice)
      recordServerAnswer(unit, activeItem.id, choice, result)
      if (result.correct) setActiveItemId(null)
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
            const selectedWrong = Boolean(activeWrongResult && (activeRecord?.firstValue ?? activeRecord?.value) === choice)
            const revealedCorrect = Boolean(activeWrongResult && activeRecord?.value === choice)
            return (
              <button
                type="button"
                key={choice}
                data-testid={`textbook-choice-${activeItem.id}-${index}`}
                className={`reading-choice-option${selectedWrong ? ' reading-choice-option--wrong' : ''}${revealedCorrect ? ' textbook-choice--correct' : ''}`}
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
        {activeWrongResult && (
          <p className="reading-inline-choice-error" data-testid={`answer-reveal-${activeItem.id}`}>
            {text(`不正解です。正解は「${activeRecord?.value ?? ''}」です。`, `回答错误。正确答案是「${activeRecord?.value ?? ''}」。`)}
          </p>
        )}
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

  const firstIncompleteGroupIndex = groups.findIndex((group) => {
    const itemIds = readingGroupItemIds(group)
    return itemIds.length > 0 && itemIds.some((itemId) => !progress?.answers[itemId]?.resolved)
  })
  const unlockedGroupIndex = firstIncompleteGroupIndex === -1 ? Math.max(groups.length - 1, 0) : firstIncompleteGroupIndex
  const visibleGroupCount = firstIncompleteGroupIndex === -1 ? groups.length : firstIncompleteGroupIndex + 1
  const displayedGroups = hasTopicNavigation
    ? groups.filter((_, index) => index === Math.min(selectedGroupIndex, Math.max(groups.length - 1, 0)))
    : groups.slice(0, visibleGroupCount)

  const topicLabel = (group: TextbookReadingBlock[], index: number) => {
    const topic = group[0]
    const raw = topic?.type === 'topic' ? topic.text : String(index + 1)
    const match = raw.match(/^(\d+(?:\.\d+)?)\s+(.+)$/)
    return match ? { number: match[1], title: match[2] } : { number: String(index + 1), title: raw }
  }

  return (
    <article className="textbook-reading-flow" data-testid="textbook-reading-flow">
      {hasTopicNavigation && (
        <nav className="reading-topic-nav" aria-label={text('知識項目', '知识点')}>
          {groups.map((group, groupIndex) => {
            const label = topicLabel(group, groupIndex)
            const itemIds = readingGroupItemIds(group)
            const completedCount = itemIds.filter((itemId) => progress?.answers[itemId]?.resolved).length
            const allowed = firstIncompleteGroupIndex === -1 || groupIndex <= unlockedGroupIndex
            return (
              <button
                type="button"
                key={group[0]?.id ?? groupIndex}
                disabled={!allowed}
                aria-pressed={selectedGroupIndex === groupIndex}
                onClick={() => {
                  if (!allowed) return
                  setSelectedGroupIndex(groupIndex)
                  setActiveItemId(null)
                  setSubmitError('')
                }}
              >
                <span>{label.number}</span>
                <strong>{label.title}</strong>
                <small>{completedCount}/{itemIds.length}</small>
              </button>
            )
          })}
        </nav>
      )}

      {displayedGroups.map((group) => {
        const groupIndex = groups.indexOf(group)
        const groupItemIds = readingGroupItemIds(group)
        const completed = groupItemIds.length > 0 && groupItemIds.every((itemId) => progress?.answers[itemId]?.resolved)
        return (
          <section className={`reading-subsection${group[0]?.type === 'topic' ? ' reading-topic-card' : ''}`} data-testid={`reading-subsection-${groupIndex}`} key={group[0]?.id ?? groupIndex}>
            {group.map(renderBlock)}
            {completed && groupIndex < groups.length - 1 && (
              <div className="reading-subsection-complete">
                <Check size={16} aria-hidden="true" />
                <span>{text('この小節を完了しました。次の項目へ進めます。', '本知识点已完成，可以继续下一知识点。')}</span>
              </div>
            )}
          </section>
        )
      })}
    </article>
  )
}

function groupedLessonSection(unit: PublicTextbookUnit, lesson: TextbookLessonTarget): PublicTextbookSection | undefined {
  if (lesson.kind !== 'section-group') return undefined
  const sectionIds = new Set(lesson.sectionIds ?? [])
  const sourceSections = unit.sections.filter((section) => sectionIds.has(section.id))
  if (!sourceSections.length) return undefined

  const figures = new Map(sourceSections.flatMap((section) => section.figures).map((figure) => [figure.id, figure]))
  const prefix = lesson.topicPrefix ?? '1'
  const readingFlow: TextbookReadingBlock[] = sourceSections.flatMap((section, index) => {
    const title = section.title.replace(/^第\\d+節[　\\s]*/u, '')
    return [
      { id: `group-topic-${lesson.key}-${section.id}`, type: 'topic' as const, text: `${prefix}.${index + 1} ${title}` },
      ...section.readingFlow,
    ]
  })

  return {
    id: `group-${lesson.key}`,
    number: prefix,
    title: lesson.label,
    description: '',
    figures: [...figures.values()],
    readingFlow,
    items: sourceSections.flatMap((section) => section.items),
  }
}

function progressForSection(section: PublicTextbookSection, progress: TextbookUnitProgress | undefined) {
  const completed = section.items.filter((item) => progress?.answers[item.id]?.resolved).length
  return { completed, total: section.items.length }
}

export function TextbookUnitPage() {
  const { unitId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const targetKey = searchParams.get('target')
  const requestedSectionId = searchParams.get('section')
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
    if (!unit) {
      setSelectedSectionIndex(0)
      return
    }
    const target = targetKey ? findTextbookLessonTarget([unit], targetKey)?.lesson : undefined
    const sectionId = target?.kind === 'section' ? target.sectionId : requestedSectionId
    const requestedIndex = sectionId
      ? unit.sections.findIndex((section) => section.id === sectionId)
      : -1
    setSelectedSectionIndex(requestedIndex >= 0 ? requestedIndex : 0)
  }, [requestedSectionId, targetKey, unit, unitId])

  if (unit === undefined) return <div className="state-panel"><span className="state-panel__mark">…</span><h2>{text('教材を読み込んでいます', '正在加载教材')}</h2></div>
  if (!unit) return <ErrorState title={text('教材を読み込めません', '无法加载教材')} body={text('バックエンド API が起動しているか、VITE_API_BASE_URL を確認してください。', '请确认后端 API 已启动，并检查 VITE_API_BASE_URL。')} action={<Link className="raised-link" to="/courses">{text('コースへ戻る', '返回课程')}</Link>} />

  const targetMatch = targetKey ? findTextbookLessonTarget([unit], targetKey) : undefined
  const lessonTarget = targetMatch?.lesson
  const groupedSection = lessonTarget ? groupedLessonSection(unit, lessonTarget) : undefined
  const targetedSection = lessonTarget?.kind === 'section'
    ? unit.sections.find((section) => section.id === lessonTarget.sectionId)
    : undefined
  const legacySection = requestedSectionId
    ? unit.sections.find((section) => section.id === requestedSectionId)
    : undefined
  const currentSection = groupedSection ?? targetedSection ?? legacySection ?? unit.sections[selectedSectionIndex]
  const summary = textbookUnitProgress(unit, progress)
  const sectionSummary = groupedSection
    ? progressForSection(groupedSection, progress)
    : textbookSectionProgress(unit, progress, currentSection.id)
  const focusedSection = Boolean(groupedSection || targetedSection || legacySection)
  const targetSelected = Boolean(lessonTarget)
  const targetSummary = lessonTarget?.kind === 'unit' ? summary : sectionSummary
  const targetComplete = targetSummary.completed === targetSummary.total
  const sectionComplete = sectionSummary.completed === sectionSummary.total
  const unitComplete = summary.completed === summary.total
  const firstIncompleteSectionIndex = unit.sections.findIndex((section) =>
    textbookSectionProgress(unit, progress, section.id).completed < section.items.length,
  )
  const unlockedSectionIndex = firstIncompleteSectionIndex === -1 ? unit.sections.length - 1 : firstIncompleteSectionIndex
  const canOpenSection = (index: number) => unitComplete || index <= unlockedSectionIndex
  const physicsPrefix = lessonTarget?.kind === 'unit' && unit.subject === 'physics' ? physicsTopicPrefix(unit) : undefined
  const goNext = () => {
    setSelectedSectionIndex((index) => Math.min(unit.sections.length - 1, index + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-stack textbook-page">
      <header className="session-header">
        <div>
          <p className="eyebrow">{unit.subject === 'math-1a' ? 'TEXTBOOK / MATH I・A' : 'TEXTBOOK / PHYSICS'}</p>
          <h1>{targetMatch ? `${targetMatch.chapter.label}：${targetMatch.lesson.label}` : focusedSection ? `${conciseTextbookTitle(unit)}：${currentSection.title}` : unit.title}</h1>
          {!targetSelected && !focusedSection && unit.subtitle && <p>{unit.subtitle}</p>}
        </div>
        <StatusBadge>{text(`第 ${unit.revision} 版`, `第 ${unit.revision} 版`)}</StatusBadge>
      </header>

      <ProgressBar
        label={targetSelected ? text('この学習項目の進み具合', '本学习部分进度') : focusedSection ? text('この学習項目の進み具合', '本学习部分进度') : text('単元の進み具合', '单元进度')}
        value={targetSelected ? targetSummary.completed : focusedSection ? sectionSummary.completed : summary.completed}
        max={targetSelected ? targetSummary.total : focusedSection ? sectionSummary.total : summary.total}
      />

      {!targetSelected && !focusedSection && (
        <section className="textbook-objectives">
          <strong>{text('この単元で確認すること', '本单元确认内容')}</strong>
          <ol>{unit.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol>
        </section>
      )}

      {!focusedSection && (
        <nav className="textbook-section-nav" aria-label={text('知識項目', '知识点')}>
          {unit.sections.map((section, index) => {
            const sectionProgress = textbookSectionProgress(unit, progress, section.id)
            const complete = sectionProgress.completed === sectionProgress.total
            const allowed = canOpenSection(index)
            return (
              <button
                type="button"
                key={section.id}
                disabled={!allowed}
                aria-pressed={selectedSectionIndex === index}
                onClick={() => allowed && setSelectedSectionIndex(index)}
              >
                <span>{complete ? <Check size={16} aria-hidden="true" /> : allowed ? (physicsPrefix ? `${physicsPrefix}.${index + 1}` : section.number) : <LockKeyhole size={15} aria-hidden="true" />}</span>
                <strong>{section.title}</strong>
                <small>{sectionProgress.completed}/{sectionProgress.total}</small>
              </button>
            )
          })}
        </nav>
      )}

      <section className="textbook-section">
        <header className="textbook-section-heading">
          <div><span>{physicsPrefix && !focusedSection ? `${physicsPrefix}.${selectedSectionIndex + 1}` : currentSection.number}</span><div><h2>{currentSection.title}</h2>{currentSection.description && <p>{currentSection.description}</p>}</div></div>
          <strong>{sectionSummary.completed}/{sectionSummary.total}</strong>
        </header>

        {currentSection.readingFlow.length > 0
          ? <TextbookReadingFlow unit={unit} section={currentSection} progress={progress} />
          : null}

        {!targetSelected && !focusedSection && sectionComplete && !unitComplete && selectedSectionIndex < unit.sections.length - 1 && (
          <div className="textbook-next-panel">
            <Check size={22} aria-hidden="true" />
            <div><strong>{text('この章は完了しました', '本章已完成')}</strong><small>{text('次の章へ進めます。', '可以继续下一章。')}</small></div>
            <RaisedButton data-testid="textbook-next-section" onClick={goNext}>{text('次へ', '下一章')}</RaisedButton>
          </div>
        )}

        {(targetSelected ? targetComplete : unitComplete) && (
          <div className="textbook-complete-panel" data-testid="textbook-unit-complete">
            <Check size={28} aria-hidden="true" />
            <div>
              <h2>{targetSelected ? text('学習項目完了', '学习部分完成') : text('単元完了', '单元完成')}</h2>
              <p>{targetSelected
                ? text(`${targetMatch?.lesson.label ?? currentSection.title} の ${targetSummary.total} 個の確認項目をすべて完了しました。`, `已完成 ${targetMatch?.lesson.label ?? currentSection.title} 的全部 ${targetSummary.total} 个确认项目。`)
                : text(`${unit.title} の ${summary.total} 個の確認項目をすべて完了しました。`, `已完成 ${unit.title} 的全部 ${summary.total} 个确认项目。`)}</p>
            </div>
            <Link className="raised-link" to="/practice">{text('練習へ進む', '进入练习')}</Link>
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