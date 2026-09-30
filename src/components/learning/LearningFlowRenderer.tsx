import { useState, type ReactNode } from 'react'
import { Check, Circle, RotateCcw, X } from 'lucide-react'
import { InlineMath } from 'react-katex'
import { ContentRenderer } from '../question/ContentRenderer'
import type { LearningSession } from '../../domain/attempts'
import { isLearningAnswerResolved } from '../../domain/learning'
import type { LearningBlank, Question } from '../../domain/questionSchema'
import { useI18n } from '../../i18n/runtime'

function optionContent(question: Question, blankId: string, optionIds: string[]) {
  const blank = question.learning.blanks[blankId]
  return blank.options.filter((option) => optionIds.includes(option.id)).flatMap((option) => option.content)
}

function correctOptionContent(question: Question, blankId: string) {
  const blank = question.learning.blanks[blankId]
  return optionContent(question, blankId, blank.correctOptionIds)
}

function inlineOptionValue(blank: LearningBlank, optionId: string, assets: Question['assets']): ReactNode {
  const option = blank.options.find((candidate) => candidate.id === optionId)
  if (!option) return null
  if (option.content.length === 1) {
    const block = option.content[0]
    if (block.type === 'text') return block.text
    if (block.type === 'latex') return <InlineMath math={block.latex} />
  }
  return <span className="practice-inline-render"><ContentRenderer blocks={option.content} assets={assets} /></span>
}

function splitBlankPrompt(prompt: string) {
  const match = prompt.match(/【[^】]+】/)
  if (!match || match.index === undefined) return { before: prompt, marker: '□', after: '' }
  return {
    before: prompt.slice(0, match.index),
    marker: match[0].slice(1, -1),
    after: prompt.slice(match.index + match[0].length),
  }
}

function PracticeBlank({
  question,
  session,
  blank,
  blankNumber,
  onActivate,
  onExplain,
  onSubmit,
}: {
  question: Question
  session: LearningSession
  blank: LearningBlank
  blankNumber: number
  onActivate: (blankId: string) => void
  onExplain: (blankId: string) => void
  onSubmit: (blankId: string, selectedOptionIds: string[]) => void
}) {
  const { text } = useI18n()
  const [multiSelection, setMultiSelection] = useState<string[]>([])
  const answer = session.answers[blank.id]
  const resolved = isLearningAnswerResolved(answer)
  const isActive = session.activeBlankId === blank.id
  const prompt = splitBlankPrompt(blank.prompt)
  const selectedWrong = !resolved ? (answer?.lastSelectedOptionIds ?? answer?.firstSelectedOptionIds ?? []) : []
  const correctId = blank.correctOptionIds[0]

  const submitOption = (optionId: string) => {
    if (blank.answerType === 'multi-choice') {
      setMultiSelection((selected) => selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId])
      return
    }
    onSubmit(blank.id, [optionId])
  }

  const submitMultiple = () => {
    if (!multiSelection.length) return
    onSubmit(blank.id, multiSelection)
    setMultiSelection([])
  }

  return (
    <div className={`practice-blank-block${isActive ? ' practice-blank-block--active' : ''}`} data-testid={`practice-block-${blank.id}`}>
      <div className="practice-blank-line">
        {prompt.before && <span>{prompt.before}</span>}
        {resolved ? (
          <span className="reading-inline-answer" data-testid={`answer-${blank.id}`}>
            <Check size={14} aria-hidden="true" />
            <strong>{inlineOptionValue(blank, correctId, question.assets)}</strong>
          </span>
        ) : (
          <button
            type="button"
            data-testid={`blank-${blank.id}`}
            className={`reading-inline-blank${answer ? ' reading-inline-blank--wrong' : ''}`}
            onClick={() => onActivate(blank.id)}
            aria-expanded={isActive}
          >
            {answer ? <X size={14} aria-hidden="true" /> : <Circle size={13} aria-hidden="true" />}
            <span>{prompt.marker || blankNumber}</span>
            <strong>{answer ? inlineOptionValue(blank, selectedWrong[0], question.assets) : text('選択', '选择')}</strong>
          </button>
        )}
        {prompt.after && <span>{prompt.after}</span>}
      </div>

      {!resolved && isActive && (
        <div className="reading-inline-choice-panel" data-testid={`inline-choice-panel-${blank.id}`}>
          <div className="reading-inline-choice-panel__head">
            <strong>{text(`空欄 ${blankNumber}`, `填空 ${blankNumber}`)}</strong>
            <span>{blank.prompt}</span>
          </div>
          <div className="reading-choice-options" role="group" aria-label={blank.prompt}>
            {blank.options.map((option, index) => {
              const selected = blank.answerType === 'multi-choice' ? multiSelection.includes(option.id) : selectedWrong.includes(option.id)
              return (
                <button
                  type="button"
                  key={option.id}
                  data-testid={`option-${option.id}`}
                  aria-pressed={selected}
                  className={`reading-choice-option${selectedWrong.includes(option.id) ? ' reading-choice-option--wrong' : ''}`}
                  onClick={() => submitOption(option.id)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  <strong><ContentRenderer blocks={option.content} assets={question.assets} /></strong>
                </button>
              )
            })}
          </div>
          {blank.answerType === 'multi-choice' && (
            <button type="button" className="practice-inline-confirm" disabled={!multiSelection.length} onClick={submitMultiple}>
              {text('選択を確定', '确认选择')}
            </button>
          )}
          {answer && !resolved && (
            <div className="practice-inline-error">
              <p>{text('不正解です。問題文と直前の手順を確認して、もう一度選んでください。', '答错了。请结合题目和上一步，再选择一次。')}</p>
              <button type="button" className="analysis-link" data-testid={`explain-${blank.id}`} onClick={() => onExplain(blank.id)}>
                {text('ヒントを見る', '查看提示')} →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function LearningFlowRenderer({ question, session, onActivate, onExplain, onRevisit, inlineChoices = false, onSubmitInline }: {
  question: Question
  session: LearningSession
  onActivate: (blankId: string) => void
  onExplain: (blankId: string) => void
  onRevisit: (blankId: string) => void
  inlineChoices?: boolean
  onSubmitInline?: (blankId: string, selectedOptionIds: string[]) => void
}) {
  const { text } = useI18n()
  const interactive = new Set(question.learning.variants[session.variant])
  let blankNumber = 0

  const firstUnresolvedBlankId = question.learning.solutionFlow.find((block) =>
    block.type === 'blank'
    && interactive.has(block.blankId)
    && !isLearningAnswerResolved(session.answers[block.blankId]),
  )
  const cutoffIndex = inlineChoices && firstUnresolvedBlankId
    ? question.learning.solutionFlow.findIndex((block) => block.type === 'blank' && block.blankId === firstUnresolvedBlankId.blankId)
    : question.learning.solutionFlow.length - 1

  return (
    <div className={`learning-flow${inlineChoices ? ' learning-flow--practice' : ''}`} aria-label={text('連続解答', '连续解答')}>
      {question.learning.solutionFlow.map((block, blockIndex) => {
        if (blockIndex > cutoffIndex) return null
        if (block.type === 'content') return <ContentRenderer key={block.id} blocks={block.content} assets={question.assets} />

        const blank = question.learning.blanks[block.blankId]
        const answer = session.answers[block.blankId]
        const isInteractive = interactive.has(block.blankId)
        if (isInteractive) blankNumber += 1

        if (!isInteractive) {
          return <div key={block.id} className="filled-blank filled-blank--guided"><span className="blank-state-label">{text('提示済み', '已给出')}</span><ContentRenderer blocks={correctOptionContent(question, block.blankId)} assets={question.assets} /></div>
        }

        if (inlineChoices && onSubmitInline) {
          return (
            <PracticeBlank
              key={block.id}
              question={question}
              session={session}
              blank={blank}
              blankNumber={blankNumber}
              onActivate={onActivate}
              onExplain={onExplain}
              onSubmit={onSubmitInline}
            />
          )
        }

        if (!answer) {
          const isActive = session.activeBlankId === block.blankId
          return (
            <button key={block.id} type="button" data-testid={`blank-${block.blankId}`} className={`empty-blank${isActive ? ' empty-blank--active' : ''}`} onClick={() => onActivate(block.blankId)}>
              <Circle size={18} aria-hidden="true" /><span>{text('空欄', '填空')} {blankNumber}</span><small>{blank.prompt}</small>
            </button>
          )
        }

        const resolved = isLearningAnswerResolved(answer)
        if (!resolved) {
          const selected = answer.lastSelectedOptionIds ?? answer.firstSelectedOptionIds
          return (
            <div key={block.id} data-testid={`answer-${block.blankId}`} className="filled-blank filled-blank--wrong">
              <span className="blank-state-label"><X size={16} aria-hidden="true" /> {text('不正解・もう一度', '答错・请重试')}</span>
              <ContentRenderer blocks={optionContent(question, block.blankId, selected)} assets={question.assets} />
              <div className="blank-actions">
                <button type="button" className="analysis-link" data-testid={`explain-${block.blankId}`} onClick={() => onExplain(block.blankId)}>{text('ヒントを見る', '查看提示')} →</button>
                <button type="button" className="revisit-link" data-testid={`retry-${block.blankId}`} onClick={() => onActivate(block.blankId)}><RotateCcw size={15} aria-hidden="true" /> {text('もう一度答える', '重新作答')}</button>
              </div>
            </div>
          )
        }

        return (
          <div key={block.id} data-testid={`answer-${block.blankId}`} className={`filled-blank ${answer.isFirstCorrect ? 'filled-blank--correct' : 'filled-blank--recovered'}`}>
            <span className="blank-state-label">{answer.isFirstCorrect ? <><Check size={16} aria-hidden="true" /> {text('初回正解', '首次答对')}</> : <><Check size={16} aria-hidden="true" /> {text('再回答で正解', '重答正确')}</>}</span>
            <ContentRenderer blocks={correctOptionContent(question, block.blankId)} assets={question.assets} />
            <div className="blank-actions">
              {!answer.isFirstCorrect && <button type="button" className="analysis-link" data-testid={`explain-${block.blankId}`} onClick={() => onExplain(block.blankId)}>{text('解き方を確認', '查看解题方法')} →</button>}
              <button type="button" className="revisit-link" onClick={() => onRevisit(block.blankId)}>{text('この空欄を見直す', '重新查看此空')}</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
