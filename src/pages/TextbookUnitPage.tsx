import { InlineMath } from 'react-katex'
import { Check, RotateCcw, X } from 'lucide-react'
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

  const hasSolutionTrack = section.readingFlow.some(
    (block) => block.type === 'note' && block.text.startsWith('着眼点　'),
  )
  const exampleSolutionBlockIds = new Set<string>()
  const exampleFirstSolutionBlockIds = new Set<string>()
  if (hasSolutionTrack) {
    let insideExample = false
    let afterProblem = false
    let firstSolutionSeen = false
    for (const candidate of section.readingFlow) {
      if (candidate.type === 'heading' && candidate.text.startsWith('教科書対応問')) {
        insideExample = true
        afterProblem = false
        firstSolutionSeen = false
        continue
      }
      if (!insideExample) continue
      if (candidate.type === 'topic' || (candidate.type === 'heading' && candidate.text.startsWith('教科書対応問'))) {
        insideExample = false
        afterProblem = false
        firstSolutionSeen = false
        continue
      }
      if (candidate.type === 'heading' && candidate.text.startsWith('問題文')) {
        afterProblem = true
        continue
      }
      if (candidate.type === 'note' && candidate.text.startsWith('確認　')) {
        afterProblem = false
        continue
      }
      if (afterProblem && (candidate.type === 'paragraph' || candidate.type === 'formula')) {
        exampleSolutionBlockIds.add(candidate.id)
        if (!firstSolutionSeen) {
          exampleFirstSolutionBlockIds.add(candidate.id)
          firstSolutionSeen = true
        }
      }
    }
  }

  const renderBlock = (block: TextbookReadingBlock) => {
    if (block.type === 'topic') return <h3 className="reading-topic-title" key={block.id}>{block.text}</h3>

    if (hasSolutionTrack && block.type === 'heading' && block.text.startsWith('教科書対応問')) {
      return <h4 className="reading-subheading" key={block.id}>{block.text.replace(/^教科書対応問[　\s]*/u, '')}</h4>
    }

    if (hasSolutionTrack && block.type === 'heading' && block.text.startsWith('問題文')) {
      return <p className="reading-paragraph" key={block.id}>{block.text.replace(/^問題文[　\s]*/u, '')}</p>
    }

    if (hasSolutionTrack && block.type === 'note') {
      const noteKinds = [
        { prefix: '着眼点　', step: 'STEP 1', labelJa: '着眼点', labelZh: '着眼点' },
        { prefix: '使う知識　', step: 'STEP 2', labelJa: '使う知識', labelZh: '调用知识' },
      ] as const
      const kind = noteKinds.find((candidate) => block.text.startsWith(candidate.prefix))
      if (kind) {
        const metaLabel = kind.step === 'STEP 1'
          ? text('考えること', '思考重点')
          : text('使うもの', '调用知识')
        return (
          <div className="practice-step-block textbook-example-step" key={block.id}>
            <div className="practice-step-heading">
              <span>{kind.step}</span>
              <strong>{text(kind.labelJa, kind.labelZh)}</strong>
            </div>
            <div className="textbook-example-step-detail">
              <span>{metaLabel}</span>
              <p>{block.text.slice(kind.prefix.length)}</p>
            </div>
          </div>
        )
      }
      if (block.text.startsWith('確認　')) {
        return (
          <div className="textbook-example-check" key={block.id}>
            <span>CHECK</span>
            <p>{block.text.slice('確認　'.length)}</p>
          </div>
        )
      }
    }

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

    if (hasSolutionTrack && exampleSolutionBlockIds.has(block.id)) {
      return (
        <div className="practice-step-block textbook-example-step textbook-example-solve" key={block.id}>
          {exampleFirstSolutionBlockIds.has(block.id) && (
            <div className="practice-step-heading">
              <span>STEP 3</span>
              <strong>{text('解く', '解题')}</strong>
            </div>
          )}
          <div className="practice-blank-block">
            <div className="practice-blank-line">
              {content}
            </div>
            {renderInlineChoicePanel(block)}
          </div>
        </div>
      )
    }

    return (
      <div className="reading-block-with-choice" key={block.id}>
        {block.type === 'formula'
          ? <div className="reading-formula-line">{content}</div>
          : <p className="reading-paragraph">{content}</p>}
        {renderInlineChoicePanel(block)}
      </div>
    )
  }


  const renderExampleSequence = (blocks: TextbookReadingBlock[]) => {
    if (!hasSolutionTrack) return blocks.map(renderBlock)

    const rendered: ReactNode[] = []
    let index = 0
    let exampleNumber = 0

    while (index < blocks.length) {
      const block = blocks[index]
      if (!(block.type === 'heading' && block.text.startsWith('教科書対応問'))) {
        rendered.push(renderBlock(block))
        index += 1
        continue
      }

      const chunk: TextbookReadingBlock[] = [block]
      let cursor = index + 1
      while (
        cursor < blocks.length
        && !(blocks[cursor].type === 'heading' && blocks[cursor].text.startsWith('教科書対応問'))
        && blocks[cursor].type !== 'topic'
      ) {
        chunk.push(blocks[cursor])
        cursor += 1
      }

      exampleNumber += 1
      const title = block.text.replace(/^教科書対応問[　\s]*/u, '')
      const problem = chunk.find(
        (candidate) => candidate.type === 'heading' && candidate.text.startsWith('問題文'),
      )
      const focus = chunk.find(
        (candidate) => candidate.type === 'note' && candidate.text.startsWith('着眼点　'),
      )
      const knowledge = chunk.find(
        (candidate) => candidate.type === 'note' && candidate.text.startsWith('使う知識　'),
      )
      const check = chunk.find(
        (candidate) => candidate.type === 'note' && candidate.text.startsWith('確認　'),
      )
      const consumedIds = new Set(
        [block, problem, focus, knowledge, check].filter(Boolean).map((candidate) => candidate!.id),
      )
      const solutionBlocks = chunk.filter((candidate) => !consumedIds.has(candidate.id))

      rendered.push(
        <section className="textbook-guided-example" key={block.id}>
          <header className="textbook-guided-example__header">
            <span>GUIDED EXAMPLE {String(exampleNumber).padStart(2, '0')}</span>
            <h4>{title}</h4>
          </header>

          {problem && problem.type === 'heading' && (
            <article className="textbook-guided-example__problem">
              <strong>{text('問題', '题目')}</strong>
              <p>{problem.text.replace(/^問題文[　\s]*/u, '')}</p>
            </article>
          )}

          <div className="textbook-guided-example__guide">
            <h5>{text('引導ステップ', '引导步骤')}</h5>
            {focus ? renderBlock(focus) : null}
            {knowledge ? renderBlock(knowledge) : null}
            {solutionBlocks.map(renderBlock)}
            {check ? renderBlock(check) : null}
          </div>
        </section>,
      )

      index = cursor
    }

    return rendered
  }

  const displayedGroups = hasTopicNavigation
    ? groups.filter((_, index) => index === Math.min(selectedGroupIndex, Math.max(groups.length - 1, 0)))
    : groups

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
            return (
              <button
                type="button"
                key={group[0]?.id ?? groupIndex}
                aria-pressed={selectedGroupIndex === groupIndex}
                onClick={() => {
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
            {renderExampleSequence(group)}
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
  const [searchParams, setSearchParams] = useSearchParams()
  const sourceMode = searchParams.get('source') === 'original' ? 'original' : 'test'
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
  }, [sourceMode, unitId])

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
  if (!unit) return <ErrorState title={text('教材を読み込めません', '无法加载教材')} body={text('バックエンド API が起動しているか、VITE_API_BASE_URL を確認してください。', '请确认后端 API 已启动，并检查 VITE_API_BASE_URL。')} action={<Link className="raised-link" to="/learning/setup">{text('学習設定へ戻る', '返回学习设置')}</Link>} />

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
  const physicsPrefix = lessonTarget?.kind === 'unit' && unit.subject === 'physics' ? physicsTopicPrefix(unit) : undefined
  const goNext = () => {
    setSelectedSectionIndex((index) => Math.min(unit.sections.length - 1, index + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const switchSource = (source: 'original' | 'test') => {
    const next = new URLSearchParams(searchParams)
    if (source === 'original') next.set('source', 'original')
    else next.delete('source')
    setSearchParams(next, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const showGeometryComparison = unitId === 'math-1a-geometric-properties'

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

      {showGeometryComparison && (
        <section className="textbook-source-switch" data-testid="geometry-guidance-compare">
          <div className="textbook-source-switch__meta">
            <span className="status-badge">TEST</span>
            <div>
              <strong>{text('例題ガイド比較', '例题引导对比')}</strong>
              <small>{text('内容だけを切り替えて比較します。', '只切换内容进行对比。')}</small>
            </div>
          </div>
          <div className="segmented-control textbook-source-switch__control">
            <button type="button" aria-pressed={sourceMode === 'original'} onClick={() => switchSource('original')}>
              {text('原版', '原版')}
            </button>
            <button type="button" aria-pressed={sourceMode === 'test'} onClick={() => switchSource('test')}>
              {text('解題軌道', '解题轨道')}
            </button>
          </div>
        </section>
      )}

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
            return (
              <button
                type="button"
                key={section.id}
                aria-pressed={selectedSectionIndex === index}
                onClick={() => setSelectedSectionIndex(index)}
              >
                <span>{complete ? <Check size={16} aria-hidden="true" /> : (physicsPrefix ? `${physicsPrefix}.${index + 1}` : section.number)}</span>
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
            <Link className="raised-link" to="/learning/setup">{text('学習設定へ戻る', '返回学习设置')}</Link>
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