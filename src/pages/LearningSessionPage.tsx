import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentRenderer } from '../components/question/ContentRenderer'
import { LearningFlowRenderer } from '../components/learning/LearningFlowRenderer'
import { BottomSheet, ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { activeBlankIds } from '../domain/learning'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { taxonomyLabel } from '../i18n/labels'

export function LearningSessionPage() {
  const { sessionId = '' } = useParams()
  const navigate = useNavigate()
  const session = useAppStore((state) => state.learningSessions[sessionId])
  const customQuestions = useAppStore((state) => state.customQuestions)
  const answerLearning = useAppStore((state) => state.answerLearning)
  const activateLearning = useAppStore((state) => state.activateLearning)
  const openExplanation = useAppStore((state) => state.openLearningExplanation)
  const closeExplanation = useAppStore((state) => state.closeLearningExplanation)
  const revisitLearning = useAppStore((state) => state.revisitLearning)
  const { language, text } = useI18n()
  const question = useMemo(() => getQuestionCatalog(customQuestions, language).find((item) => item.questionId === session?.questionId), [customQuestions, language, session?.questionId])
  const [choiceOpen, setChoiceOpen] = useState(false)
  const [explanationBlankId, setExplanationBlankId] = useState<string | null>(null)
  const [explanationStartedAt, setExplanationStartedAt] = useState(0)
  const [multiSelection, setMultiSelection] = useState<string[]>([])

  useEffect(() => {
    if (session?.completedAt) navigate(`/learning/result/${sessionId}`, { replace: true })
  }, [navigate, session?.completedAt, sessionId])

  if (!session || !question) return <ErrorState title={text('学習セッションが見つかりません', '找不到学习记录')} body={text('保存されたセッションがないか、問題の版が利用できません。', '记录不存在，或该题目的版本已无法使用。')} action={<RaisedButton onClick={() => navigate('/learning/setup')}>{text('設定へ戻る', '返回设置')}</RaisedButton>} />

  const enabledBlankIds = activeBlankIds(question, session.variant)
  const activeBlank = session.activeBlankId ? question.learning.blanks[session.activeBlankId] : undefined
  const completedCount = enabledBlankIds.filter((id) => session.answers[id]).length

  const activate = (blankId: string) => {
    activateLearning(sessionId, blankId)
    setMultiSelection([])
    setChoiceOpen(true)
  }
  const submitOption = (optionId: string) => {
    if (!activeBlank || !session.activeBlankId) return
    if (activeBlank.answerType === 'multi-choice') {
      setMultiSelection((selected) => selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId])
      return
    }
    answerLearning(sessionId, session.activeBlankId, [optionId])
    const updated = useAppStore.getState().learningSessions[sessionId]
    if (updated.completedAt) {
      setChoiceOpen(false)
      navigate(`/learning/result/${sessionId}`)
    } else {
      setMultiSelection([])
      setChoiceOpen(true)
    }
  }
  const submitMultiple = () => {
    if (!session.activeBlankId || !multiSelection.length) return
    answerLearning(sessionId, session.activeBlankId, multiSelection)
    const updated = useAppStore.getState().learningSessions[sessionId]
    if (updated.completedAt) navigate(`/learning/result/${sessionId}`)
    setMultiSelection([])
  }
  const showExplanation = (blankId: string) => {
    setChoiceOpen(false)
    openExplanation(sessionId, blankId)
    setExplanationBlankId(blankId)
    setExplanationStartedAt(Date.now())
  }
  const hideExplanation = () => {
    if (explanationBlankId) closeExplanation(sessionId, explanationBlankId, Date.now() - explanationStartedAt)
    setExplanationBlankId(null)
  }
  const explanationBlank = explanationBlankId ? question.learning.blanks[explanationBlankId] : undefined
  const explanationAnswer = explanationBlankId ? session.answers[explanationBlankId] : undefined
  const selectedWrongOption = explanationBlank?.options.find((option) => explanationAnswer?.firstSelectedOptionIds.includes(option.id))

  return (
    <div className="page-stack learning-page">
      <header className="session-header"><div><p className="eyebrow">LEARNING / {session.variant}</p><h1>{question.title}</h1></div><StatusBadge>{text(`第 ${question.revision} 版`, `第 ${question.revision} 版`)}</StatusBadge></header>
      <ProgressBar label={text('空欄の進み具合', '填空进度')} value={completedCount} max={enabledBlankIds.length} />
      <article className="question-paper"><ContentRenderer blocks={question.stem} assets={question.assets} /></article>
      <section><h2 className="solution-heading">{text('連続解答', '连续解答')}</h2><LearningFlowRenderer question={question} session={session} onActivate={activate} onExplain={showExplanation} onRevisit={revisitLearning.bind(null, sessionId)} /></section>

      <BottomSheet open={choiceOpen && Boolean(activeBlank)} title={activeBlank?.prompt ?? text('回答を選ぶ', '选择答案')} onClose={() => setChoiceOpen(false)}>
        <div className="option-list">
          {activeBlank?.options.map((option) => <button type="button" key={option.id} data-testid={`option-${option.id}`} aria-pressed={multiSelection.includes(option.id)} className="option-button" onClick={() => submitOption(option.id)}><ContentRenderer blocks={option.content} assets={question.assets} /></button>)}
          {activeBlank?.answerType === 'multi-choice' && <RaisedButton className="primary-button" disabled={!multiSelection.length} onClick={submitMultiple}>{text('選択を確定', '确认选择')}</RaisedButton>}
        </div>
      </BottomSheet>

      <BottomSheet open={Boolean(explanationBlank)} title={text('この手順の解き方', '这一步的解题方法')} onClose={hideExplanation}>
        {explanationBlank && <div className="explanation-stack">
          <section><h3>{text('なぜこの答えになるか', '为什么是这个答案')}</h3><ContentRenderer blocks={explanationBlank.explanation} assets={question.assets} /></section>
          <section><h3>{text('最初の答えが違う理由', '第一次选择为什么不对')}</h3>{selectedWrongOption?.wrongReason.length ? <ContentRenderer blocks={selectedWrongOption.wrongReason} assets={question.assets} /> : <p>{text('この選択肢には個別の誤答理由がありません。', '这个选项没有单独的错误原因说明。')}</p>}</section>
          <section><h3>{text('この手順の知識', '这一步涉及的知识')}</h3><div className="tag-row">{explanationBlank.knowledgeTags.map((tag) => <StatusBadge key={tag}>{taxonomyLabel(tag, language)}</StatusBadge>)}<StatusBadge tone="muted">{taxonomyLabel(explanationBlank.skillTag, language)}</StatusBadge></div></section>
          <section><h3>{text('次の練習', '下一步练习')}</h3><p>{explanationBlank.shortPracticeQuestionId ? text('同じ考え方を使う問題を、完了後に提案します。', '完成后会推荐一道使用相同思路的题目。') : text('関連する練習は準備中です。', '相关练习正在准备中。')}</p></section>
        </div>}
      </BottomSheet>
    </div>
  )
}
