import { Check, Circle, RotateCcw, X } from 'lucide-react'
import { ContentRenderer } from '../question/ContentRenderer'
import type { LearningSession } from '../../domain/attempts'
import { isLearningAnswerResolved } from '../../domain/learning'
import type { Question } from '../../domain/questionSchema'
import { useI18n } from '../../i18n/runtime'

function optionContent(question: Question, blankId: string, optionIds: string[]) {
  const blank = question.learning.blanks[blankId]
  return blank.options.filter((option) => optionIds.includes(option.id)).flatMap((option) => option.content)
}

function correctOptionContent(question: Question, blankId: string) {
  const blank = question.learning.blanks[blankId]
  return optionContent(question, blankId, blank.correctOptionIds)
}

export function LearningFlowRenderer({ question, session, onActivate, onExplain, onRevisit }: {
  question: Question
  session: LearningSession
  onActivate: (blankId: string) => void
  onExplain: (blankId: string) => void
  onRevisit: (blankId: string) => void
}) {
  const { text } = useI18n()
  const interactive = new Set(question.learning.variants[session.variant])
  let blankNumber = 0

  return (
    <div className="learning-flow" aria-label={text('連続解答', '连续解答')}>
      {question.learning.solutionFlow.map((block) => {
        if (block.type === 'content') return <ContentRenderer key={block.id} blocks={block.content} assets={question.assets} />

        const blank = question.learning.blanks[block.blankId]
        const answer = session.answers[block.blankId]
        const isInteractive = interactive.has(block.blankId)
        if (isInteractive) blankNumber += 1

        if (!isInteractive) {
          return <div key={block.id} className="filled-blank filled-blank--guided"><span className="blank-state-label">{text('提示済み', '已给出')}</span><ContentRenderer blocks={correctOptionContent(question, block.blankId)} assets={question.assets} /></div>
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
