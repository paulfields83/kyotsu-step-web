import { Bookmark, ChevronLeft, ChevronRight, Send, Timer } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentRenderer } from '../components/question/ContentRenderer'
import { ConfirmDialog, ErrorState, ProgressBar, RaisedButton } from '../components/ui/Primitives'
import { remainingSimulationSeconds } from '../domain/scoring'
import type { SimulationItem } from '../domain/questionSchema'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'

function formatClock(seconds: number | null, unlimited: string) {
  if (seconds === null) return unlimited
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const rest = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${rest}`
}

export function SimulationSessionPage() {
  const { sessionId = '' } = useParams()
  const navigate = useNavigate()
  const session = useAppStore((state) => state.simulationSessions[sessionId])
  const customQuestions = useAppStore((state) => state.customQuestions)
  const answerSimulation = useAppStore((state) => state.answerSimulation)
  const toggleReview = useAppStore((state) => state.toggleSimulationReview)
  const goToQuestion = useAppStore((state) => state.goToSimulationQuestion)
  const submitSimulation = useAppStore((state) => state.submitSimulation)
  const showTimer = useAppStore((state) => state.settings.showTimer)
  const { language, text } = useI18n()
  const [now, setNow] = useState(Date.now())
  const [confirmOpen, setConfirmOpen] = useState(false)
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const questions = session?.questionIds.map((id) => catalog.find((question) => question.questionId === id)).filter((question): question is NonNullable<typeof question> => Boolean(question)) ?? []
  const remaining = session ? remainingSimulationSeconds(session, now) : null

  useEffect(() => {
    if (!session || session.submittedAt || session.durationSeconds === null) return
    const timer = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(timer)
  }, [session])

  useEffect(() => {
    if (!session || session.submittedAt || remaining !== 0) return
    submitSimulation(sessionId, true)
    navigate(`/simulation/result/${sessionId}`, { replace: true })
  }, [navigate, remaining, session, sessionId, submitSimulation])

  useEffect(() => {
    if (session?.submittedAt) navigate(`/simulation/result/${sessionId}`, { replace: true })
  }, [navigate, session?.submittedAt, sessionId])

  if (!session || questions.length !== session.questionIds.length) return <ErrorState title={text('模擬テストが見つかりません', '找不到模拟测试')} body={text('保存されたテストがないか、問題の版が利用できません。', '记录不存在，或题目版本已无法使用。')} action={<RaisedButton onClick={() => navigate('/simulation/setup')}>{text('設定へ戻る', '返回设置')}</RaisedButton>} />
  if (session.submittedAt) return null

  const currentQuestion = questions[session.currentQuestionIndex]
  const allItems = questions.flatMap((question) => question.simulation.items)
  const answeredCount = allItems.filter((item) => {
    const answer = session.answers[item.id]
    return item.answerType === 'number' ? answer?.numericValue !== undefined : Boolean(answer?.selectedOptionIds.length)
  }).length
  const unansweredCount = allItems.length - answeredCount

  const chooseOption = (item: SimulationItem, optionId: string) => {
    const previous = session.answers[item.id]?.selectedOptionIds ?? []
    const next = item.answerType === 'multi-choice'
      ? previous.includes(optionId) ? previous.filter((id) => id !== optionId) : [...previous, optionId]
      : [optionId]
    answerSimulation(sessionId, item.id, next)
  }
  const submit = () => {
    submitSimulation(sessionId, false)
    navigate(`/simulation/result/${sessionId}`)
  }

  return (
    <div className="page-stack simulation-page">
      <header className="simulation-header"><div><p className="eyebrow">SIMULATION</p><h1>{currentQuestion.title}</h1></div>{showTimer && <div className={`timer-box${remaining !== null && remaining <= 30 ? ' timer-box--urgent' : ''}`} aria-label={text('残り時間', '剩余时间')}><Timer aria-hidden="true" /><strong>{formatClock(remaining, text('制限なし', '不限时'))}</strong></div>}</header>
      <ProgressBar label={text('回答状況', '作答进度')} value={answeredCount} max={allItems.length} />
      <nav className="question-navigator" aria-label={text('問題番号', '题目编号')}>
        {questions.map((question, index) => {
          const items = question.simulation.items
          const isAnswered = items.every((item) => item.answerType === 'number' ? session.answers[item.id]?.numericValue !== undefined : Boolean(session.answers[item.id]?.selectedOptionIds.length))
          const isMarked = items.some((item) => session.answers[item.id]?.markedForReview)
          return <button type="button" key={question.questionId} aria-current={index === session.currentQuestionIndex ? 'step' : undefined} data-state={`${isAnswered ? 'answered' : 'unanswered'}${isMarked ? '-marked' : ''}`} onClick={() => goToQuestion(sessionId, index)}>Q{index + 1}<small>{isMarked ? '★' : isAnswered ? text('済', '已答') : text('未', '未答')}</small></button>
        })}
      </nav>
      <article className="question-paper"><ContentRenderer blocks={[...currentQuestion.stem, ...currentQuestion.simulation.material]} assets={currentQuestion.assets} /></article>
      <div className="simulation-items">
        {currentQuestion.simulation.items.map((item) => {
          const answer = session.answers[item.id]
          return <section className="simulation-item" key={item.id} data-testid={`simulation-item-${item.id}`}><header><h2>{item.label}</h2><button type="button" data-testid={`review-${item.id}`} className={`review-button${answer?.markedForReview ? ' review-button--active' : ''}`} aria-pressed={answer?.markedForReview ?? false} onClick={() => toggleReview(sessionId, item.id)}><Bookmark aria-hidden="true" size={17} />{text('あとで見直す', '稍后检查')}</button></header><ContentRenderer blocks={item.prompt} assets={currentQuestion.assets} />
            {item.answerType === 'number' ? <label className="number-answer">{text('数値を入力', '输入数值')}<input data-testid={`number-${item.id}`} className="text-control" type="number" inputMode="decimal" value={answer?.numericValue ?? ''} onChange={(event) => answerSimulation(sessionId, item.id, [], event.target.value === '' ? undefined : Number(event.target.value))} /></label> : <div className="simulation-options" role={item.answerType === 'single-choice' ? 'radiogroup' : 'group'} aria-label={`${item.label} ${text('の選択肢', '的选项')}`}>{item.options?.map((option) => { const selected = answer?.selectedOptionIds.includes(option.id) ?? false; return <button type="button" key={option.id} data-testid={`sim-option-${option.id}`} role={item.answerType === 'single-choice' ? 'radio' : 'checkbox'} aria-checked={selected} onClick={() => chooseOption(item, option.id)}><span className="selection-mark">{selected ? '●' : '○'}</span><ContentRenderer blocks={option.content} assets={currentQuestion.assets} /></button> })}</div>}
          </section>
        })}
      </div>
      <div className="session-controls"><RaisedButton disabled={session.currentQuestionIndex === 0} onClick={() => goToQuestion(sessionId, session.currentQuestionIndex - 1)}><ChevronLeft aria-hidden="true" />{text('前の問題', '上一题')}</RaisedButton><RaisedButton disabled={session.currentQuestionIndex === questions.length - 1} onClick={() => goToQuestion(sessionId, session.currentQuestionIndex + 1)}>{text('次の問題', '下一题')}<ChevronRight aria-hidden="true" /></RaisedButton></div>
      <RaisedButton className="submit-button" data-testid="open-submit" onClick={() => setConfirmOpen(true)}><Send aria-hidden="true" />{text('提出する', '提交')}</RaisedButton>
      <ConfirmDialog open={confirmOpen} title={text('提出しますか？', '确认提交吗？')} body={text(`未回答は ${unansweredCount} 個です。提出後は回答を変更できません。`, `还有 ${unansweredCount} 个小题未作答。提交后不能修改答案。`)} confirmLabel={text('提出を確定', '确认提交')} onCancel={() => setConfirmOpen(false)} onConfirm={submit} />
    </div>
  )
}
