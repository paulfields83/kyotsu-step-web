import { Check, Circle, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ContentRenderer } from '../components/question/ContentRenderer'
import { ProgressBar } from '../components/ui/Primitives'
import type { PracticeAnswerResult, PublicPracticeBlank, PublicPracticeQuestion } from '../domain/practice'
import { practiceRepository } from '../repositories/practiceRepository'
import { useI18n } from '../i18n/runtime'

type BlankState = PracticeAnswerResult & {
  selectedLabel: string
}

const circledMarkers = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳']

function promptParts(prompt: string) {
  return prompt.split(/(【[^】]+】)/g).filter(Boolean)
}

function markerValue(part: string) {
  const match = part.match(/^【([^】]+)】$/)
  return match?.[1]
}

function PracticeBlankLine({
  questionId,
  blank,
  answer,
  open,
  busy,
  onToggle,
  onAnswered,
  currentMarker,
  resolvedLabelsByMarker,
}: {
  questionId: string
  blank: PublicPracticeBlank
  answer?: BlankState
  open: boolean
  busy: boolean
  onToggle: () => void
  onAnswered: (blankId: string, state: BlankState) => void
  currentMarker: string
  resolvedLabelsByMarker: Record<string, string>
}) {
  const { text } = useI18n()
  const parts = promptParts(blank.prompt)
  const resolvedPrompt = parts.map((part) => {
    const marker = markerValue(part)
    if (!marker || marker === currentMarker) return part
    return resolvedLabelsByMarker[marker] ?? part
  }).join('')

  const choose = async (optionId: string) => {
    if (busy || answer?.resolved) return
    const selected = blank.options.find((option) => option.id === optionId)
    if (!selected) return
    const result = await practiceRepository.submitAnswer(questionId, blank.id, [optionId])
    onAnswered(blank.id, { ...result, selectedLabel: selected.label })
  }

  return (
    <div className={`practice-blank-block${open ? ' practice-blank-block--active' : ''}`}>
      <div className="practice-blank-line">
        {parts.map((part, index) => {
          const marker = markerValue(part)
          if (!marker) return <span key={`${blank.id}-text-${index}`}>{part}</span>
          if (marker !== currentMarker) {
            const substituted = resolvedLabelsByMarker[marker]
            return substituted
              ? <strong key={`${blank.id}-ref-${index}`} className="practice-substituted-value">{substituted}</strong>
              : <span key={`${blank.id}-ref-${index}`}>{part}</span>
          }
          return answer?.resolved ? (
            <span key={`${blank.id}-current-${index}`} className="reading-inline-answer">
              <Check size={14} aria-hidden="true" />
              <strong>{answer.selectedLabel}</strong>
            </span>
          ) : (
            <button
              type="button"
              key={`${blank.id}-current-${index}`}
              className={`reading-inline-blank${answer && !answer.correct ? ' reading-inline-blank--wrong' : ''}`}
              onClick={onToggle}
              aria-expanded={open}
            >
              {answer && !answer.correct ? <X size={14} aria-hidden="true" /> : <Circle size={13} aria-hidden="true" />}
              <span>{marker}</span>
              <strong>{answer && !answer.correct ? answer.selectedLabel : text('選択', '选择')}</strong>
            </button>
          )
        })}
      </div>

      {!answer?.resolved && open && (
        <div className="reading-inline-choice-panel">
          <div className="reading-inline-choice-panel__head">
            <strong>{resolvedPrompt}</strong>
          </div>
          <div className="reading-choice-options" role="group" aria-label={blank.prompt}>
            {blank.options.map((option, index) => {
              const selectedWrong = Boolean(answer && !answer.correct && answer.selectedOptionIds.includes(option.id))
              return (
                <button
                  type="button"
                  key={option.id}
                  className={`reading-choice-option${selectedWrong ? ' reading-choice-option--wrong' : ''}`}
                  disabled={busy}
                  onClick={() => void choose(option.id)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  <div className="practice-option-content"><p>{option.label}</p></div>
                </button>
              )
            })}
          </div>
          {answer && !answer.correct && (
            <div className="practice-inline-error">
              <p>{answer.wrongReason ?? text('不正解です。もう一度考えてください。', '答错了，请再想一次。')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function PracticeSessionPage() {
  const { questionId = '' } = useParams()
  const { text } = useI18n()
  const [question, setQuestion] = useState<PublicPracticeQuestion | undefined>()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [answers, setAnswers] = useState<Record<string, BlankState>>({})
  const [openBlankId, setOpenBlankId] = useState<string | null>(null)
  const [busyBlankId, setBusyBlankId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setLoadError(false)
    practiceRepository.getQuestion(questionId)
      .then((value) => {
        setQuestion(value)
        setOpenBlankId(null)
        setAnswers({})
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }, [questionId])

  const blankById = useMemo(() => new Map(question?.blanks.map((blank) => [blank.id, blank]) ?? []), [question])
  const orderedBlankIds = useMemo(() => question?.solutionSteps.flatMap((step) => step.blankIds) ?? [], [question])
  const firstUnresolvedIndex = orderedBlankIds.findIndex((blankId) => !answers[blankId]?.resolved)
  const completedCount = orderedBlankIds.filter((blankId) => answers[blankId]?.resolved).length
  const complete = orderedBlankIds.length > 0 && completedCount === orderedBlankIds.length
  const resolvedLabelsByMarker = Object.fromEntries(
    orderedBlankIds.flatMap((blankId, index) => {
      const marker = circledMarkers[index]
      const label = answers[blankId]?.resolved ? answers[blankId]?.selectedLabel : undefined
      return marker && label ? [[marker, label]] : []
    }),
  )

  if (loading) return <div className="page-stack"><div className="v2-empty-card">{text('問題を読み込んでいます…', '正在读取题目…')}</div></div>
  if (loadError || !question) return (
    <div className="page-stack">
      <div className="v2-empty-card">{text('後端から問題を読み込めませんでした。', '无法从后端读取题目。')}</div>
      <Link className="v2-primary-action" to="/learn">{text('学習へ戻る', '返回学习')}</Link>
    </div>
  )

  const handleAnswered = (blankId: string, state: BlankState) => {
    setAnswers((current) => ({ ...current, [blankId]: state }))
    setBusyBlankId(null)
    if (state.resolved) setOpenBlankId(null)
  }

  return (
    <div className="page-stack learning-page">
      <header className="session-header">
        <div>
          <p className="eyebrow">PRACTICE / BACKEND</p>
          <h1>{question.title}</h1>
        </div>
        <div className="tag-row">
          <span className="status-badge">{question.subcategory}</span>
          <span className="status-badge">rev.{question.revision}</span>
        </div>
      </header>

      <ProgressBar label={text('空欄の進み具合', '填空进度')} value={completedCount} max={orderedBlankIds.length} />

      <article className="question-paper">
        <ContentRenderer blocks={question.stem} assets={[]} />
      </article>

      <section>
        <h2 className="solution-heading">{text('連続解答', '连续解答')}</h2>
        <div className="learning-flow learning-flow--practice">
          {question.solutionSteps.map((step, stepIndex) => {
            const stepIndexes = step.blankIds.map((blankId) => orderedBlankIds.indexOf(blankId)).filter((index) => index >= 0)
            const firstStepIndex = Math.min(...stepIndexes)
            if (firstUnresolvedIndex >= 0 && firstStepIndex > firstUnresolvedIndex) return null

            return (
              <div key={step.id} className="practice-step-block">
                <div className="practice-step-heading">
                  <span>STEP {stepIndex + 1}</span>
                  <strong>{step.operation}</strong>
                </div>
                <ContentRenderer blocks={step.content} assets={[]} />
                {step.blankIds.map((blankId) => {
                  const blank = blankById.get(blankId)
                  if (!blank) return null
                  const blankIndex = orderedBlankIds.indexOf(blankId)
                  if (firstUnresolvedIndex >= 0 && blankIndex > firstUnresolvedIndex) return null
                  return (
                    <PracticeBlankLine
                      key={blankId}
                      questionId={question.questionId}
                      blank={blank}
                      answer={answers[blankId]}
                      open={openBlankId === blankId}
                      busy={busyBlankId === blankId}
                      onToggle={() => setOpenBlankId((current) => current === blankId ? null : blankId)}
                      currentMarker={circledMarkers[blankIndex] ?? String(blankIndex + 1)}
                      resolvedLabelsByMarker={resolvedLabelsByMarker}
                      onAnswered={(id, state) => {
                        setBusyBlankId(id)
                        handleAnswered(id, state)
                      }}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </section>

      {complete && (
        <div className="v2-empty-card">
          <strong>{text('この問題は完了しました。', '这道题已完成。')}</strong>
          <p>{text('後端の問題データと回答判定だけで最後まで進めました。', '本题已完全通过后端题目数据和后端判题完成。')}</p>
          <Link className="v2-primary-action" to="/learn">{text('問題一覧へ戻る', '返回题目列表')}</Link>
        </div>
      )}
    </div>
  )
}
