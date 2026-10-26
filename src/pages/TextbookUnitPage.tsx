import { InlineMath } from 'react-katex'
import { textbookMathLatex } from '../domain/textbookMathDisplay'
import { Check, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { fillResolvedMathHoles } from '../domain/textbookFormulaFill'
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

function blockItemIds(block: TextbookReadingBlock): string[] {
  if (block.type !== 'paragraph' && block.type !== 'formula') return []
  return [...new Set(block.parts.flatMap((part) =>
    part.type === 'choice' ? [part.itemId] : part.type === 'math' ? (part.holeIds ?? []) : [],
  ))]
}

function readingGroupItemIds(blocks: TextbookReadingBlock[]) {
  return [...new Set(blocks.flatMap(blockItemIds))]
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

// Display mathematics as mathematics, while keeping Japanese reasoning choices
// in ordinary readable textbook language.
function GuidedChoiceValue({ value }: { value: string }) {
  const latex = textbookMathLatex(value)
  if (latex) return <InlineMath math={latex} />
  // The original physics distractor sometimes appends Japanese explanation
  // directly after a vector expression (e.g. |v⃗₂|−|v⃗₁|だけ).
  // Keep the suffix as prose, but typeset the vector expression.
  const mixed = value.match(/^(.+?)(だけ)$/u)
  const mathPrefix = mixed ? textbookMathLatex(mixed[1]) : null
  if (mixed && mathPrefix) return <><InlineMath math={mathPrefix} />{mixed[2]}</>
  return <>{value}</>
}

// Keep Japanese wording intact while replacing fragile combining math glyphs
// in ZIP-derived hints, notes, figure captions and leftover inline source text.
function PhysicsInlineText({ value }: { value: string }) {
  const glyphs = /[⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜΔθ√²³]/u
  if (!glyphs.test(value)) return <>{value}</>
  const tokens = value.split(/([A-Za-zΔ√θ][A-Za-z0-9Δθ√°⃗̄₀₁₂₃₄₅₆₇₈₉ₓᵧₜ²³_{}().,=+\-−×·\/<>|]*)/gu)
  return <>{tokens.map((token, index) => {
    const latex = glyphs.test(token) ? textbookMathLatex(token) : null
    return latex ? <InlineMath key={index} math={latex} /> : <span key={index}>{token}</span>
  })}</>
}

function renderResolvedChoice(item: PublicTextbookItem, record: TextbookAnswerRecord) {
  if (record.isFirstCorrect) {
    return (
      <span className="reading-inline-answer" data-testid={`resolved-${item.id}`}>
        <Check size={14} aria-hidden="true" />
        <strong><GuidedChoiceValue value={record.value} /></strong>
      </span>
    )
  }

  return (
    <span data-testid={`resolved-${item.id}`}>
      <span className="reading-inline-blank reading-inline-blank--wrong">
        <X size={14} aria-hidden="true" />
        <strong><GuidedChoiceValue value={record.firstValue ?? record.value} /></strong>
      </span>
      <span className="reading-inline-answer">
        <Check size={14} aria-hidden="true" />
        <strong><GuidedChoiceValue value={record.value} /></strong>
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
      aria-label={`${item.label} ${item.choices.length ? text('を選ぶ', '选择答案') : text('を入力', '输入答案')}`}
    >
      <span>{item.label}</span>
      <strong>{value || (item.choices.length ? text('選択', '选择') : text('入力', '输入'))}</strong>
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
  if (part.type === 'term') return <strong className="reading-term">{part.text}</strong>
  if (part.type === 'math') {
    const holeIds = part.holeIds ?? []
    if (!holeIds.length) return <InlineMath math={part.latex} />
    const latexWithAnswers = fillResolvedMathHoles(part.latex, holeIds, progress?.answers)
    const pendingId = holeIds.find((itemId) => !progress?.answers[itemId]?.resolved)
    if (!pendingId) {
      return (
        <span className="reading-math-answered" data-testid={`textbook-math-filled-${holeIds[0]}`}>
          <InlineMath math={latexWithAnswers} />
        </span>
      )
    }
    return (
      <button
        type="button"
        className="reading-math-blank-button"
        data-testid={`textbook-math-item-${pendingId}`}
        onClick={() => onOpen(pendingId)}
        aria-label={text('式の空欄を解答する', '回答公式中的空格')}
      >
        <InlineMath math={latexWithAnswers} />
        <span className="reading-math-blank-button__hint">{text('選択', '选择')}</span>
      </button>
    )
  }

  if (part.type !== 'choice') return null
  const item = section.items.find((candidate) => candidate.id === part.itemId)
  if (!item) return null
  const record = progress?.answers[item.id]
  if (record?.resolved) return renderResolvedChoice(item, record)
  return renderActiveChoice(item, record?.value, Boolean(record && !record.resolved), onOpen, text)
}

function TextbookReadingFlow({ unit, section, progress }: {
  unit: PublicTextbookUnit
  section: PublicTextbookSection
  progress: TextbookUnitProgress | undefined
}) {
  const { text } = useI18n()
  const revisedPhysics = unit.subject === 'physics' && unit.unitId.endsWith('-revised')
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [hintCounts, setHintCounts] = useState<Record<string, number>>({})
  const [submittingItemId, setSubmittingItemId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const groups = useMemo(() => groupReadingFlow(section.readingFlow), [section.readingFlow])
  const hasTopicNavigation = groups.some((group) => group[0]?.type === 'topic')

  useEffect(() => {
    setSelectedGroupIndex(0)
    setActiveItemId(null)
    setHintCounts({})
    setSubmitError('')
  }, [section.id])
  // Choices are always shown for every currently visible unanswered item.
  // Preserve the previously wrong choice without blocking the next item.
  const selectChoice = async (item: PublicTextbookItem, choice: string) => {
    if (progress?.answers[item.id]?.resolved || submittingItemId) return
    setSubmitError('')
    setActiveItemId(item.id)
    setSubmittingItemId(item.id)
    try {
      const result = await textbookRepository.submitAnswer(unit.unitId, item.id, choice)
      recordServerAnswer(unit, item.id, choice, result)
      setActiveItemId(result.correct ? null : item.id)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : text('回答を送信できませんでした。', '无法提交答案。'))
    } finally {
      setSubmittingItemId(null)
    }
  }

  const renderInlineChoicePanel = (visibleParts: TextbookReadingPart[]) => {
    const ids = [...new Set(visibleParts.flatMap((part) => {
      if (part.type === 'choice') return [part.itemId]
      if (part.type !== 'math') return []
      const holes = part.holeIds ?? []
      const next = holes.find((id) => !progress?.answers[id]?.resolved)
      const lastWrong = holes.filter((id) =>
        id === activeItemId && progress?.answers[id]?.resolved && !progress?.answers[id]?.isFirstCorrect)
      return [...lastWrong, ...(next ? [next] : [])]
    }))].filter((id) =>
      !progress?.answers[id]?.resolved ||
      (id === activeItemId && !progress?.answers[id]?.isFirstCorrect),
    )

    return ids.map((id) => {
      const item = section.items.find((candidate) => candidate.id === id)
      if (!item) return null
      const record = progress?.answers[id]
      const revealedWrong = Boolean(record?.resolved && !record.isFirstCorrect)
      const hintCount = hintCounts[id] ?? 0
      return (
        <div key={id} className="reading-inline-choice-panel" data-testid={`inline-choice-panel-${id}`}>
          <div className="reading-inline-choice-panel__head">
            <strong>{item.label}</strong><span>{item.prompt}</span>
          </div>
          {item.choices.length > 0 && <div className="reading-choice-options" role="group" aria-label={`${item.label} ${text('選択肢', '选项')}`}>
            {item.choices.map((choice, index) => {
              const selectedWrong = Boolean(revealedWrong && record?.firstValue === choice)
              const revealedCorrect = Boolean(revealedWrong && record?.value === choice)
              return (
                <button type="button" key={choice}
                  data-testid={`textbook-choice-${id}-${index}`}
                  data-choice-value={choice} aria-label={`${index + 1}. ${choice}`}
                  className={`reading-choice-option${selectedWrong ? ' reading-choice-option--wrong' : ''}${revealedCorrect ? ' textbook-choice--correct' : ''}`}
                  disabled={Boolean(record?.resolved) || submittingItemId !== null}
                  onClick={() => void selectChoice(item, choice)}>
                  <span>{index + 1}</span>
                  <strong><GuidedChoiceValue value={choice} /></strong>
                  {item.unit && <small>{item.unit}</small>}
                </button>
              )
            })}
          </div>}
          {Boolean(item.hints?.length) && !record?.resolved && (
            <div className="reading-staged-hints" data-testid={`textbook-hints-${id}`}>
              <button type="button" className="reading-hint-trigger"
                onClick={() => setHintCounts((current) => ({
                  ...current, [id]: Math.min((current[id] ?? 0) + 1, item.hints?.length ?? 0),
                }))}
                disabled={hintCount >= (item.hints?.length ?? 0)}>
                {text(`ヒントを見る ${hintCount}/${item.hints?.length ?? 0}`,
                  `查看提示 ${hintCount}/${item.hints?.length ?? 0}`)}
              </button>
              {hintCount > 0 && (
                <ol className="reading-hint-steps">
                  {item.hints?.slice(0, hintCount).map((hint, index) => <li key={index}>{revisedPhysics ? <PhysicsInlineText value={hint}/> : hint}</li>)}
                </ol>
              )}
            </div>
          )}
          {item.choices.length < 2 && <p className="reading-inline-choice-error" role="alert">
            {text('選択肢の読み込みに失敗しました。画面を更新してください。', '选项加载失败，请刷新页面。')}
          </p>}
          {revealedWrong && <p className="reading-inline-choice-error" data-testid={`answer-reveal-${id}`}>
            {text('不正解です。正解は「', '回答错误。正确答案是「')}<GuidedChoiceValue value={record?.value ?? ''} />{text('」です。', '」。')}
          </p>}
          {submitError && activeItemId === id && <p className="reading-inline-choice-error" role="alert">{submitError}</p>}
        </div>
      )
    })
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
    if (block.type === 'marker') return (
      <div className={`reading-role-marker reading-role-marker--${block.kind}`} key={block.id}>
        {block.text}
      </div>
    )
    if (block.type === 'dialogue') {
      const speaker = block.speaker === 'teacher' ? '先生' : block.speaker === 'hanako' ? '花子' : '太郎'
      return (
        <p className="reading-dialogue" key={block.id}>
          <strong>{speaker}：</strong><span>{block.text}</span>
        </p>
      )
    }

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
    if (block.type === 'note') return <aside className="reading-note" key={block.id}>{revisedPhysics ? <PhysicsInlineText value={block.text}/> : block.text}</aside>

    if (hasSolutionTrack && block.type === 'paragraph') {
      const plain = block.parts.map((part) => part.type === 'text' ? part.text : '').join('').trim()
      const researchMatch = plain.match(/^[0-9]+[　\s]*研究[　\s]*(.+)$/u)
      if (researchMatch) {
        return <h4 className="reading-subheading textbook-research-heading" key={block.id}>{`研究　${researchMatch[1]}`}</h4>
      }
      const metaMatch = plain.match(/^(コンピュータの活用|第[0-9]+節の自力確認|作図の記述)[　\s]*(.*)$/u)
      if (metaMatch) {
        return (
          <aside className="reading-note textbook-meta-note" key={block.id}>
            <strong>{metaMatch[1]}</strong>
            {metaMatch[2] && <span>{metaMatch[2]}</span>}
          </aside>
        )
      }
    }

    if (block.type === 'figure') {
      const figure = section.figures.find((candidate) => candidate.id === block.figureId)
      if (!figure) return null
      return (
        <figure className="reading-figure" key={block.id}>
          <img src={resolveAssetSrc(figure.src)} alt={figure.alt} />
          {figure.caption && <figcaption>{revisedPhysics ? <PhysicsInlineText value={figure.caption}/> : figure.caption}</figcaption>}
        </figure>
      )
    }

    if (block.type !== 'paragraph' && block.type !== 'formula') return null

    // Mathematics and revised Chapter-1 physics reveal the textbook one
    // reasoning decision at a time. Legacy physics reading is unaffected.
    const guidedReading = unit.subject === 'math-1a'
      || (unit.subject === 'physics' && unit.unitId.endsWith('-revised'))
    const firstUnansweredPart = guidedReading
      ? block.parts.findIndex((part) => (
          part.type === 'choice' ? !progress?.answers[part.itemId]?.resolved
            : part.type === 'math' && (part.holeIds ?? []).some((id) => !progress?.answers[id]?.resolved)
        ))
      : -1
    const visibleParts = firstUnansweredPart < 0 ? block.parts : block.parts.slice(0, firstUnansweredPart + 1)
    const linkedAnswerId = blockItemIds(block)[0]
    const renderVisiblePart = (part: TextbookReadingPart): ReactNode => {
      if (part.type === 'text' && !/【[^】]*】/.test(part.text) && revisedPhysics) {
        return <PhysicsInlineText value={part.text}/>
      }
      if (part.type !== 'text' || !/【[^】]*】/.test(part.text)) {
        return renderPart(part, section, progress, setActiveItemId, text)
      }
      // The source has several holes per question but only one reviewed
      // combined answer. Link the additional blanks to the same response.
      const segments = part.text.split(/(【[^】]*】)/g)
      return segments.map((segment, segmentIndex) => {
        if (!/^【[^】]*】$/.test(segment)) return segment
        if (!linkedAnswerId) {
          return <span key={segmentIndex} className="reading-inline-blank reading-ungraded-blank"
            title={text('この空欄には確認済みの解答がありません', '这个空栏暂未核对答案')}>
            {text('未採点', '未录入答案')}
          </span>
        }
        if (progress?.answers[linkedAnswerId]?.resolved) {
          return <span key={segmentIndex} className="reading-inline-answer">{text('回答済み', '已回答')}</span>
        }
        return <button key={segmentIndex} type="button" className="reading-inline-blank reading-linked-blank"
          aria-label={text('この問題の解答欄を開く', '打开本题的答题区')}
          onClick={() => setActiveItemId(linkedAnswerId)}>
          {text('解答欄', '答题区')}
        </button>
      })
    }
    const content = visibleParts.map((part, index) => (
      <span key={`${block.id}-part-${index}`}>
        {renderVisiblePart(part)}
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
            {renderInlineChoicePanel(visibleParts)}
          </div>
        </div>
      )
    }

    return (
      <div className="reading-block-with-choice" key={block.id}>
        {block.type === 'formula'
          ? <div className="reading-formula-line">{content}</div>
          : <p className="reading-paragraph">{content}</p>}
        {renderInlineChoicePanel(visibleParts)}
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
      while (cursor < blocks.length) {
        const nextBlock = blocks[cursor]
        if (
          nextBlock.type === 'topic'
          || (nextBlock.type === 'heading' && nextBlock.text.startsWith('教科書対応問'))
        ) break
        chunk.push(nextBlock)
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
      const plainBlockText = (candidate: TextbookReadingBlock) => {
        if (candidate.type === 'topic' || candidate.type === 'heading' || candidate.type === 'note') return candidate.text
        if (candidate.type !== 'paragraph') return ''
        return candidate.parts.map((part) => part.type === 'text' ? part.text : '').join('').trim()
      }
      const isExampleBoundary = (candidate: TextbookReadingBlock) => {
        const raw = plainBlockText(candidate).trim()
        if (!raw) return false
        if (candidate.type === 'heading') {
          return /^(?:研究|探究|発展|参考|注意)[　\s]/u.test(raw)
        }
        if (candidate.type !== 'paragraph') return false
        return /^[0-9]+[　\s]*研究(?:[　\s]|$)/u.test(raw)
          || /^(?:研究|探究|発展|参考|注意|コンピュータの活用|第[0-9]+節の自力確認|作図の記述)[　\s]?/u.test(raw)
      }

      const problemIndex = problem ? chunk.findIndex((candidate) => candidate.id === problem.id) : -1
      const checkIndex = check ? chunk.findIndex((candidate) => candidate.id === check.id) : -1
      let solutionEnd = chunk.length
      for (let candidateIndex = Math.max(problemIndex + 1, 0); candidateIndex < chunk.length; candidateIndex += 1) {
        if ((checkIndex >= 0 && candidateIndex === checkIndex) || isExampleBoundary(chunk[candidateIndex])) {
          solutionEnd = candidateIndex
          break
        }
      }
      const solutionBlocks = problemIndex >= 0
        ? chunk.slice(problemIndex + 1, solutionEnd).filter(
            (candidate) => candidate.type === 'paragraph' || candidate.type === 'formula',
          )
        : []
      const consumedIds = new Set(
        [block, problem, focus, knowledge, check, ...solutionBlocks]
          .filter(Boolean)
          .map((candidate) => candidate!.id),
      )
      const outsideBlocks = chunk.filter((candidate) => !consumedIds.has(candidate.id))

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
      outsideBlocks.forEach((candidate) => rendered.push(renderBlock(candidate)))

      index = cursor
    }

    return rendered
  }

  const guidedRevisedPhysics = revisedPhysics
  const firstPendingPhysicsBlock = guidedRevisedPhysics
    ? section.readingFlow.findIndex((block) =>
        blockItemIds(block).some((id) => !progress?.answers[id]?.resolved))
    : -1
  const visiblePhysicsBlockIds = guidedRevisedPhysics && firstPendingPhysicsBlock >= 0
    ? new Set(section.readingFlow.slice(0, firstPendingPhysicsBlock + 1).map((block) => block.id))
    : undefined
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
        // Unlock the next mathematics reasoning block only after the preceding
        // answer has been submitted. Independent chapters remain navigable.
        const unansweredBlock = unit.subject === 'math-1a'
          ? group.findIndex((block) => (block.type === 'paragraph' || block.type === 'formula')
            && blockItemIds(block).some((id) => !progress?.answers[id]?.resolved))
          : -1
        const mathVisibleGroup = unansweredBlock < 0 ? group : group.slice(0, unansweredBlock + 1)
        const visibleGroup = visiblePhysicsBlockIds
          ? mathVisibleGroup.filter((block) => visiblePhysicsBlockIds.has(block.id))
          : mathVisibleGroup
        if (!visibleGroup.length) return null
        const groupIndex = groups.indexOf(group)
        const groupItemIds = readingGroupItemIds(group)
        const completed = groupItemIds.length > 0 && groupItemIds.every((itemId) => progress?.answers[itemId]?.resolved)
        return (
          <section className={`reading-subsection${group[0]?.type === 'topic' ? ' reading-topic-card' : ''}`} data-testid={`reading-subsection-${groupIndex}`} key={group[0]?.id ?? groupIndex}>
            {renderExampleSequence(visibleGroup)}
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
    const number = lesson.key === 'math-golden-proposition-conditions' ? section.number : `${prefix}.${index + 1}`
    return [
      { id: `group-topic-${lesson.key}-${section.id}`, type: 'topic' as const, text: `${number} ${title}` },
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

/** Reuse the original 数と式 chapter page: progress bar, knowledge-point tile
 * navigation and reading cards. This is not a new layout or a new textbook.
 * ZIP item IDs, answer owners and the original reading sequence stay intact.
 */
function GoldenChapterGroupPage({
  chapterLabel,lesson,rootUnit,
}:{
  chapterLabel:string
  lesson:TextbookLessonTarget
  rootUnit:PublicTextbookUnit
}) {
  const {text} = useI18n()
  const allProgress=useAppStore(state=>state.textbookProgress)
  const resetTextbookUnit=useAppStore(state=>state.resetTextbookUnit)
  const [searchParams] = useSearchParams()
  const [otherUnits,setOtherUnits]=useState<Record<string,PublicTextbookUnit|null>>({})
  const topics=lesson.topics ?? []
  const otherIds=[...new Set(topics.flatMap(topic=>topic.kind==='cross-unit-group'
    ? (topic.sectionRefs ?? []).map(ref=>ref.unitId) : [topic.unitId]))]
    .filter(id=>id!==rootUnit.unitId)
  const [selectedIndex,setSelectedIndex]=useState(0)
  const selectedTopic=topics[Math.min(selectedIndex,Math.max(0,topics.length-1))]
  useEffect(()=>{
    let alive=true
    setOtherUnits({})
    void Promise.all(otherIds.map(async id=>{
      try{return {id,unit:await textbookRepository.getById(id)??null}}
      catch{return {id,unit:null}}
    })).then(rows=>{if(alive)setOtherUnits(Object.fromEntries(rows.map(row=>[row.id,row.unit])))})
    return ()=>{alive=false}
  },[rootUnit.unitId,lesson.key])

  useEffect(()=>{
    const requested=searchParams.get('topic')
    const next=topics.findIndex(topic=>topic.key===requested)
    setSelectedIndex(next>=0?next:0)
  },[lesson.key,searchParams])

  const sourceOf=(id:string):PublicTextbookUnit|undefined=>
    id===rootUnit.unitId ? rootUnit : otherUnits[id]??undefined

  const partsFor=(topic:TextbookLessonTarget)=>{
    const refs=topic.kind==='unit'
      ? (sourceOf(topic.unitId)?.sections ?? []).map(section=>({unitId:topic.unitId,sectionId:section.id}))
      : topic.kind==='cross-unit-group' ? topic.sectionRefs??[]
      : topic.kind==='section-group' ? (topic.sectionIds??[]).map(sectionId=>({unitId:topic.unitId,sectionId}))
      : topic.kind==='section' && topic.sectionId ? [{unitId:topic.unitId,sectionId:topic.sectionId}] : []
    return refs.flatMap(ref=>{
      const unit=sourceOf(ref.unitId)
      const section=unit?.sections.find(item=>item.id===ref.sectionId)
      return unit&&section ? [{unit,section,progress:allProgress[ref.unitId]}] : []
    })
  }
  const notLoaded=otherIds.some(id=>!(id in otherUnits))
  const loadError=otherIds.some(id=>id in otherUnits && otherUnits[id]===null)
  if (notLoaded) return <div className="state-panel"><span className="state-panel__mark">…</span>
    <h2>{text('教材を読み込んでいます','正在加载教材')}</h2></div>
  if(loadError) return <ErrorState title={text('教材を読み込めません','无法加载教材')}
    body={text('関連する教材データの取得に失敗しました。','无法读取相关教材数据。')}
    action={<Link className="raised-link" to="/learn">{text('学習へ戻る','返回学习')}</Link>} />

  const topicStats=(topic:TextbookLessonTarget)=>partsFor(topic)
    .reduce((sum,part)=>{
      const counts=progressForSection(part.section,part.progress)
      return {completed:sum.completed+counts.completed,total:sum.total+counts.total}
    },{completed:0,total:0})
  const totals=topics.reduce((sum,topic)=>{
    const counts=topicStats(topic)
    return {completed:sum.completed+counts.completed,total:sum.total+counts.total}
  },{completed:0,total:0})
  const activeParts=selectedTopic ? partsFor(selectedTopic) : []
  const activeStats=selectedTopic ? topicStats(selectedTopic) : {completed:0,total:0}
  const numberFor=(topic:TextbookLessonTarget,index:number)=>{
    if(topic.key==='math-golden-proposition-conditions')return '2.2～2.4'
    if(topic.key==='math-golden-proposition-negation-quantifiers')return '2.5～2.7'
    if(topic.kind==='unit'&&rootUnit.subject==='physics')
      return topic.label.match(/^\d+[A-G]/)?.[0] ?? String(index+1)
    if(topic.kind==='section'&&topic.sectionId)return sourceOf(topic.unitId)
      ?.sections.find(section=>section.id===topic.sectionId)?.number??String(index+1)
    return String(index+1)
  }
  const nameFor=(topic:TextbookLessonTarget)=>topic.label
    .replace(/^(?:\d+\.\d+(?:～\d+\.\d+)?|\d+[A-G])[　\s]*/u,'')
  const title=chapterLabel+'：'+lesson.label
  return (
    <div className="page-stack textbook-page">
      <header className="session-header">
        <div><p className="eyebrow">{rootUnit.subject==='physics'?'TEXTBOOK / PHYSICS':'TEXTBOOK / MATH I・A'}</p><h1>{title}</h1></div>
        <StatusBadge>{rootUnit.status==='review' ? text('レビュー中（未承認）','审核中（未批准）')
          : rootUnit.subject==='physics' ? text('改訂版','改订版')
            : text('GOLDEN 完成版','GOLDEN 完成版')}</StatusBadge>
      </header>
      <ProgressBar label={text('この学習項目の進み具合','本学习部分进度')}
        value={totals.completed} max={totals.total}/>
      <nav className="textbook-section-nav" aria-label={text('知識項目','知识点')}>
        {topics.map((topic,index)=>{
          const stats=topicStats(topic)
          const complete=stats.total>0&&stats.completed===stats.total
          return <button type="button" key={topic.key}
            data-testid={`golden-topic-${index+1}`}
            aria-pressed={selectedIndex===index} onClick={()=>{
              setSelectedIndex(index)
              window.scrollTo({top:0,behavior:'smooth'})
            }}>
            <span>{complete?<Check size={16} aria-hidden="true"/>:numberFor(topic,index)}</span>
            <strong>{nameFor(topic)}</strong>
            <small>{stats.completed}/{stats.total}</small>
          </button>
        })}
      </nav>
      <section className="textbook-section">
        <header className="textbook-section-heading">
          <div><span>{selectedTopic?numberFor(selectedTopic,selectedIndex):''}</span>
            <div><h2>{selectedTopic?nameFor(selectedTopic):''}</h2></div>
          </div>
          <strong>{activeStats.completed}/{activeStats.total}</strong>
        </header>
        {activeParts.map(part=><div key={part.unit.unitId+'-'+part.section.id}>
          {activeParts.length>1&&<h3 className="reading-topic-title">
            {part.section.number} {part.section.title}
          </h3>}
          <TextbookReadingFlow unit={part.unit} section={part.section} progress={part.progress}/>
        </div>)}
        {activeStats.total>0&&activeStats.completed===activeStats.total&&(
          <div className="textbook-complete-panel" data-testid="textbook-unit-complete">
            <Check size={28} aria-hidden="true"/>
            <div><h2>{text('学習項目完了','学习部分完成')}</h2>
              <p>{text('この学習項目をすべて完了しました。','本学习部分已完成。')}</p></div>
          </div>
        )}
      </section>
      <button type="button" className="text-button textbook-reset" onClick={()=>{
        if(window.confirm(text('この節の進捗を最初からやり直しますか？','确定清空本节进度吗？'))){
          for(const id of [rootUnit.unitId,...otherIds])resetTextbookUnit(id)
          setSelectedIndex(0)
        }
      }}><RotateCcw size={15} aria-hidden="true"/>{text('この単元を最初から','本单元重新开始')}</button>
    </div>
  )
}

export function TextbookUnitPage() {
  const { unitId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const targetKey = searchParams.get('target')
  const requestedSectionId = searchParams.get('section')
  const isRevisedPhysicsGroup = Boolean(targetKey?.startsWith('physics-revised-ch01-'))
  const [physicsChapterUnits, setPhysicsChapterUnits] = useState<PublicTextbookUnit[] | null | undefined>(undefined)
  const [unit, setUnit] = useState<PublicTextbookUnit | null | undefined>(undefined)
  const [companionUnit, setCompanionUnit] = useState<PublicTextbookUnit | null | undefined>(undefined)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0)
  const progress = useAppStore((state) => state.textbookProgress[unitId])
  const companionProgress = useAppStore((state) => state.textbookProgress['math-quantifiers-all-exists'])
  const isCrossUnitLesson = unitId === 'math-propositions-reading'
    && targetKey === 'math-golden-proposition-negation-quantifiers'
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

  // Chapter 1 spans seven separately owned units. A single unit cannot reconstruct
  // the three chapter-group navigation rows or their topic tiles by itself.
  useEffect(() => {
    if (!isRevisedPhysicsGroup) {
      setPhysicsChapterUnits(undefined)
      return
    }
    let active = true
    setPhysicsChapterUnits(undefined)
    textbookRepository.listPublished()
      .then(value => { if (active) setPhysicsChapterUnits(value) })
      .catch(() => { if (active) setPhysicsChapterUnits(null) })
    return () => { active = false }
  }, [isRevisedPhysicsGroup])

  // 2.5–2.7 spans two original ZIP units. Load both without migrating IDs
  // or progress records between their original owning units.
  useEffect(() => {
    if (!isCrossUnitLesson) {
      setCompanionUnit(undefined)
      return
    }
    let active = true
    setCompanionUnit(undefined)
    textbookRepository.getById('math-quantifiers-all-exists')
      .then(value => { if (active) setCompanionUnit(value ?? null) })
      .catch(() => { if (active) setCompanionUnit(null) })
    return () => { active = false }
  }, [isCrossUnitLesson])

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
  if (isCrossUnitLesson && companionUnit === undefined) return <div className="state-panel"><span className="state-panel__mark">…</span><h2>{text('教材を読み込んでいます', '正在加载教材')}</h2></div>
  if (isCrossUnitLesson && companionUnit === null) return <ErrorState title={text('教材を読み込めません', '无法加载教材')} body={text('量詞の教材データを読み込めませんでした。', '无法加载量词教材数据。')} action={<Link className="raised-link" to="/learn">{text('学習へ戻る', '返回学习')}</Link>} />
  if (isRevisedPhysicsGroup && physicsChapterUnits === undefined) return <div className="state-panel"><span className="state-panel__mark">…</span><h2>{text('教材を読み込んでいます', '正在加载教材')}</h2></div>
  if (isRevisedPhysicsGroup && physicsChapterUnits === null) return <ErrorState title={text('教材を読み込めません', '无法加载教材')} body={text('物理の章立てデータを取得できませんでした。', '无法获取物理章节目录。')} action={<Link className="raised-link" to="/learn">{text('学習へ戻る', '返回学习')}</Link>} />

  const targetMatch = targetKey ? findTextbookLessonTarget(isRevisedPhysicsGroup ? physicsChapterUnits ?? [unit] : [unit], targetKey) : undefined
  if (isRevisedPhysicsGroup && !targetMatch) return <ErrorState title={text('教材を読み込めません', '无法加载教材')} body={text('改訂版1A～1Gの目次が揃っていません。', '改订版1A～1G的目录数据不完整。')} action={<Link className="raised-link" to="/learn">{text('学習へ戻る', '返回学习')}</Link>} />
  const lessonTarget = targetMatch?.lesson
  const groupedSection = lessonTarget ? groupedLessonSection(unit, lessonTarget) : undefined
  const crossParts = lessonTarget?.kind === 'cross-unit-group'
    ? (lessonTarget.sectionRefs ?? []).flatMap(ref => {
        const owner = ref.unitId === unit.unitId ? unit : companionUnit
        const section = owner?.sections.find(candidate=>candidate.id===ref.sectionId)
        return owner && section
          ? [{unit:owner,section,progress:ref.unitId===unit.unitId ? progress : companionProgress}]
          : []
      })
    : null
  const crossSummary = crossParts?.reduce((sum,part)=>{
    const counts = progressForSection(part.section,part.progress)
    return {completed:sum.completed+counts.completed,total:sum.total+counts.total}
  }, {completed:0,total:0})
  const targetedSection = lessonTarget?.kind === 'section'
    ? unit.sections.find((section) => section.id === lessonTarget.sectionId)
    : undefined
  const legacySection = requestedSectionId
    ? unit.sections.find((section) => section.id === requestedSectionId)
    : undefined
  const currentSection = groupedSection ?? targetedSection ?? legacySection ?? unit.sections[selectedSectionIndex]
  const summary = textbookUnitProgress(unit, progress)
  const sectionSummary = crossSummary ?? (groupedSection
    ? progressForSection(groupedSection, progress)
    : textbookSectionProgress(unit, progress, currentSection.id))
  const focusedSection = Boolean(groupedSection || targetedSection || legacySection || crossParts)
  const targetSelected = Boolean(lessonTarget)
  const targetSummary = lessonTarget?.kind === 'unit' ? summary : sectionSummary
  const targetComplete = targetSummary.total > 0 && targetSummary.completed === targetSummary.total
  const sectionComplete = sectionSummary.total > 0 && sectionSummary.completed === sectionSummary.total
  const unitComplete = summary.total > 0 && summary.completed === summary.total
  const physicsPrefix = lessonTarget?.kind === 'unit' && unit.subject === 'physics' ? physicsTopicPrefix(unit) : undefined
  const goNext = () => {
    setSelectedSectionIndex((index) => Math.min(unit.sections.length - 1, index + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if(lessonTarget?.kind==='chapter-group'){
    return <GoldenChapterGroupPage key={lessonTarget.key}
      chapterLabel={targetMatch?.chapter.label ?? '集合と命題（改訂版）'}
      lesson={lessonTarget} rootUnit={unit}/>
  }
  return (
    <div className="page-stack textbook-page">
      <header className="session-header">
        <div>
          <p className="eyebrow">{unit.subject === 'math-1a' ? 'TEXTBOOK / MATH I・A' : 'TEXTBOOK / PHYSICS'}</p>
          <h1>{targetMatch ? `${targetMatch.chapter.label}：${targetMatch.lesson.label}` : focusedSection ? `${conciseTextbookTitle(unit)}：${currentSection.title}` : unit.title}</h1>
          {!targetSelected && !focusedSection && unit.subtitle && <p>{unit.subtitle}</p>}
        </div>
        <StatusBadge>
          {unit.status === 'review'
            ? text('レビュー中（未承認）', '审核中（未批准）')
            : unit.unitId === 'math-sets'
              ? text('GOLDEN 完成版', 'GOLDEN 完成版')
              : unit.unitId === 'math-1a-numbers-expressions-revised'
                ? text('教材', '教材')
                : text('改訂版', '改订版')}
          {' · '}{text(`第 ${unit.revision} 版`, `第 ${unit.revision} 版`)}
        </StatusBadge>
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
            const complete = sectionProgress.total > 0 && sectionProgress.completed === sectionProgress.total
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

      {crossParts && crossParts.map(part => {
        const counts = progressForSection(part.section,part.progress)
        return (
          <section className="textbook-section" key={part.unit.unitId+'-'+part.section.id}
            data-testid={`merged-part-${part.section.id}`}>
            <header className="textbook-section-heading">
              <div><span>{part.section.number}</span><div><h2>{part.section.title}</h2>
                {part.section.description && <p>{part.section.description}</p>}
              </div></div>
              <strong>{counts.completed}/{counts.total}</strong>
            </header>
            <TextbookReadingFlow unit={part.unit} section={part.section} progress={part.progress} />
          </section>
        )
      })}
      {!crossParts && (
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
      )}
      {crossParts && targetComplete && (
        <div className="textbook-complete-panel" data-testid="textbook-unit-complete">
          <Check size={28} aria-hidden="true" />
          <div><h2>{text('学習項目完了','学习部分完成')}</h2>
            <p>{text('この学習項目をすべて完了しました。','本学习部分已全部完成。')}</p></div>
        </div>
      )}

      <button type="button" className="text-button textbook-reset" onClick={() => {
        if (window.confirm(text('この単元の進捗を最初からやり直しますか？', '确定要清空本单元进度并重新开始吗？'))) {
          resetTextbookUnit(unit.unitId)
          setSelectedSectionIndex(0)
        }
      }}><RotateCcw size={15} aria-hidden="true" /> {text('この単元を最初から', '本单元重新开始')}</button>
    </div>
  )
}