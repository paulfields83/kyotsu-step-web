import { Check, Circle, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ContentRenderer } from '../components/question/ContentRenderer'
import { ProgressBar } from '../components/ui/Primitives'
import type { PracticeResolvedAnswer, PublicPracticeBlank, PublicPracticeQuestion } from '../domain/practice'
import {
  dependencyResultLabels,
  isPracticeStepAvailable,
  practiceCompleted,
  resolvedPracticeStepIds,
  visiblePracticeBlankIds,
} from '../domain/practiceFlow'
import { practiceRepository } from '../repositories/practiceRepository'
import { useI18n } from '../i18n/runtime'

const circledMarkers = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳']

function promptParts(prompt: string) {
  return prompt.split(/(【[^】]+】)/g).filter(Boolean)
}

function markerValue(part: string) {
  return part.match(/^【([^】]+)】$/)?.[1]
}

function PracticeBlankLine({
  blank,
  answer,
  open,
  busy,
  currentMarker,
  resolvedLabelsByMarker,
  onToggle,
  onChoose,
}: {
  blank: PublicPracticeBlank
  answer?: PracticeResolvedAnswer
  open: boolean
  busy: boolean
  currentMarker: string
  resolvedLabelsByMarker: Record<string, string>
  onToggle: () => void
  onChoose: (optionId: string, label: string) => void
}) {
  const { text } = useI18n()
  const parts = promptParts(blank.prompt)
  const resolvedPrompt = parts.map((part) => {
    const marker = markerValue(part)
    if (!marker || marker === currentMarker) return part
    return resolvedLabelsByMarker[marker] ?? part
  }).join('')

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

          if (answer?.resolved) {
            return (
              <span key={`${blank.id}-resolved-${index}`} className="reading-inline-answer">
                <Check size={14} aria-hidden="true" />
                <strong>{answer.selectedLabel}</strong>
              </span>
            )
          }

          return (
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
                  onClick={() => onChoose(option.id, option.label)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  <div className="practice-option-content"><p>{option.label}</p></div>
                </button>
              )
            })}
          </div>
          {answer && !answer.correct && (
            <div className="practice-inline-error">
              <p>{answer.wrongReason ?? text('不正解です。条件をもう一度確認してください。', '答错了，请重新确认条件。')}</p>
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
  const [answers, setAnswers] = useState<Record<string, PracticeResolvedAnswer | undefined>>({})
  const [openBlankId, setOpenBlankId] = useState<string | null>(null)
  const [busyBlankId, setBusyBlankId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setLoadError(false)
    practiceRepository.getQuestion(questionId)
      .then((value) => {
        setQuestion(value)
        setAnswers({})
        setOpenBlankId(null)
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }, [questionId])

  const blankById = useMemo(
    () => new Map(question?.blanks.map((blank) => [blank.id, blank]) ?? []),
    [question],
  )
  const orderedBlankIds = useMemo(
    () => question?.solutionSteps.flatMap((step) => step.blankIds) ?? [],
    [question],
  )
  const resolvedSteps = useMemo(
    () => question ? resolvedPracticeStepIds(question, answers) : new Set<string>(),
    [answers, question],
  )
  const completedCount = orderedBlankIds.filter((blankId) => answers[blankId]?.resolved).length
  const complete = Boolean(question && practiceCompleted(question, answers))
  const resolvedLabelsByMarker = Object.fromEntries(
    orderedBlankIds.flatMap((blankId, index) => {
      const marker = circledMarkers[index]
      const label = answers[blankId]?.resolved ? answers[blankId]?.selectedLabel : undefined
      return marker && label ? [[marker, label]] : []
    }),
  )

  if (loading) {
    return <div className="page-stack"><div className="issue-box">{text('問題を読み込んでいます…', '正在读取题目…')}</div></div>
  }

  if (loadError || !question) {
    return (
      <div className="page-stack">
        <div className="issue-box">{text('後端から練習問題を読み込めませんでした。', '无法从后端读取练习题。')}</div>
        <Link className="raised-link" to="/learning/setup">{text('学習設定へ戻る', '返回学习设置')}</Link>
      </div>
    )
  }

  const choose = async (blank: PublicPracticeBlank, optionId: string, label: string) => {
    if (busyBlankId || answers[blank.id]?.resolved) return
    setBusyBlankId(blank.id)
    try {
      const result = await practiceRepository.submitAnswer(question.questionId, blank.id, [optionId])
      setAnswers((current) => ({
        ...current,
        [blank.id]: { ...result, selectedLabel: label },
      }))
      if (result.resolved) setOpenBlankId(null)
    } finally {
      setBusyBlankId(null)
    }
  }

  return (
    <div className="page-stack learning-page practice-page">
      <header className="session-header">
        <div>
          <p className="eyebrow">MATHEMATICS / PRACTICE</p>
          <h1>{question.title}</h1>
        </div>
        <div className="tag-row">
          <span className="status-badge">{question.subcategory}</span>
          <span className="status-badge">rev.{question.revision}</span>
        </div>
      </header>

      <ProgressBar
        label={text('空欄の進み具合', '填空进度')}
        value={completedCount}
        max={orderedBlankIds.length}
      />

      <article className="question-paper">
        <ContentRenderer blocks={question.stem} assets={[]} />
      </article>

      <section>
        <h2 className="solution-heading">{text('思考の流れ', '思考流程')}</h2>
        <div className="learning-flow learning-flow--practice">
          {question.solutionSteps.map((step, stepIndex) => {
            if (!isPracticeStepAvailable(step, resolvedSteps)) return null

            const visibleBlankIds = visiblePracticeBlankIds(step, answers)
            const priorResults = dependencyResultLabels(question, step, answers)

            return (
              <div key={step.id} className="practice-step-block">
                <div className="practice-step-heading">
                  <span>STEP {stepIndex + 1}</span>
                  <strong>{step.operation}</strong>
                </div>

                <div className="practice-guide">
                  <div>
                    <span>{text('何をする？', '做什么？')}</span>
                    <strong>{step.operation}</strong>
                  </div>
                  <div>
                    <span>{text('なぜ？', '为什么？')}</span>
                    <p>{step.purpose}</p>
                  </div>
                  <div>
                    <span>{text('使うもの', '使用什么')}</span>
                    <ul>{step.basis.map((basis) => <li key={basis}>{basis}</li>)}</ul>
                  </div>
                  {priorResults.length > 0 && (
                    <div className="practice-prior-results">
                      <span>{text('前の確定結果', '前一步已确定')}</span>
                      <p>{priorResults.join('　/　')}</p>
                    </div>
                  )}
                </div>

                <ContentRenderer blocks={step.content} assets={[]} />

                {visibleBlankIds.map((blankId) => {
                  const blank = blankById.get(blankId)
                  if (!blank) return null
                  const blankIndex = orderedBlankIds.indexOf(blankId)
                  return (
                    <PracticeBlankLine
                      key={blankId}
                      blank={blank}
                      answer={answers[blankId]}
                      open={openBlankId === blankId}
                      busy={busyBlankId === blankId}
                      currentMarker={circledMarkers[blankIndex] ?? String(blankIndex + 1)}
                      resolvedLabelsByMarker={resolvedLabelsByMarker}
                      onToggle={() => setOpenBlankId((current) => current === blankId ? null : blankId)}
                      onChoose={(optionId, label) => void choose(blank, optionId, label)}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </section>

      {complete && (
        <div className="practice-complete">
          <strong>{text('この問題の思考ノードを最後まで通過しました。', '已完成这道题的全部思考节点。')}</strong>
          <p>{text('答えだけでなく、途中の「なぜ・何を使う」を確認して完了です。', '不仅得到答案，也确认了每一步为什么做、使用什么。')}</p>
          <Link className="raised-link" to="/learning/setup">{text('学習設定へ戻る', '返回学习设置')}</Link>
        </div>
      )}
    </div>
  )
}
