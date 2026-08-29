import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentRenderer } from '../components/question/ContentRenderer'
import { LearningFlowRenderer } from '../components/learning/LearningFlowRenderer'
import { BottomSheet, ErrorState, ProgressBar, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { activeBlankIds, isLearningAnswerResolved } from '../domain/learning'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { taxonomyLabel } from '../i18n/labels'

type CommonTestScreen = 'original' | 'guide' | 'final'

const flowTypeLabel = {
  'math-narrative': ['会話・資料型', '对话・资料型'],
  'phenomenon-analysis': ['現象分析型', '现象分析型'],
  'calculation-derivation': ['計算導出型', '计算推导型'],
  'relation-analysis': ['関係式分析型', '关系式分析型'],
} as const

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
  const [screen, setScreen] = useState<CommonTestScreen>('original')

  const isCommonTest = question?.learning.presentation === 'common-test'
  const finalBlankId = question?.learning.finalBlankId
  const enabledBlankIds = question && session ? activeBlankIds(question, session.variant) : []
  const guideBlankIds = finalBlankId ? enabledBlankIds.filter((id) => id !== finalBlankId) : enabledBlankIds
  const guideCompletedCount = guideBlankIds.filter((id) => isLearningAnswerResolved(session?.answers[id])).length
  const guideComplete = guideBlankIds.length > 0 && guideCompletedCount === guideBlankIds.length

  useEffect(() => {
    if (session?.completedAt) navigate(`/learning/result/${sessionId}`, { replace: true })
  }, [navigate, session?.completedAt, sessionId])

  useEffect(() => {
    if (!isCommonTest || !session) return
    const answeredGuide = guideBlankIds.some((id) => Boolean(session.answers[id]))
    setScreen(guideComplete ? 'final' : answeredGuide ? 'guide' : 'original')
  // Resume the correct screen only when opening a different saved session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, isCommonTest])

  if (!session || !question) return <ErrorState title={text('学習セッションが見つかりません', '找不到学习记录')} body={text('保存されたセッションがないか、問題の版が利用できません。', '记录不存在，或该题目的版本已无法使用。')} action={<RaisedButton onClick={() => navigate('/learning/setup')}>{text('設定へ戻る', '返回设置')}</RaisedButton>} />

  const activeBlank = session.activeBlankId ? question.learning.blanks[session.activeBlankId] : undefined
  const completedCount = enabledBlankIds.filter((id) => isLearningAnswerResolved(session.answers[id])).length
  const finalBlank = finalBlankId ? question.learning.blanks[finalBlankId] : undefined
  const finalAnswer = finalBlankId ? session.answers[finalBlankId] : undefined
  const finalWrongSelection = finalAnswer && !isLearningAnswerResolved(finalAnswer)
    ? (finalAnswer.lastSelectedOptionIds ?? finalAnswer.firstSelectedOptionIds)
    : []

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

    const submittedBlankId = session.activeBlankId
    answerLearning(sessionId, submittedBlankId, [optionId])
    const updated = useAppStore.getState().learningSessions[sessionId]
    const submitted = updated.answers[submittedBlankId]

    if (!isLearningAnswerResolved(submitted)) {
      setChoiceOpen(false)
      return
    }
    if (updated.completedAt) {
      setChoiceOpen(false)
      navigate(`/learning/result/${sessionId}`)
      return
    }
    if (isCommonTest && updated.activeBlankId === finalBlankId) {
      setChoiceOpen(false)
      setMultiSelection([])
      return
    }

    setMultiSelection([])
    setChoiceOpen(true)
  }

  const submitMultiple = () => {
    if (!session.activeBlankId || !multiSelection.length) return
    const submittedBlankId = session.activeBlankId
    answerLearning(sessionId, submittedBlankId, multiSelection)
    const updated = useAppStore.getState().learningSessions[sessionId]
    const submitted = updated.answers[submittedBlankId]

    if (!isLearningAnswerResolved(submitted)) {
      setChoiceOpen(false)
      setMultiSelection([])
      return
    }
    if (updated.completedAt) navigate(`/learning/result/${sessionId}`)
    else if (isCommonTest && updated.activeBlankId === finalBlankId) setChoiceOpen(false)
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
  const selectedWrongOption = explanationBlank?.options.find((option) => {
    const selected = explanationAnswer?.lastSelectedOptionIds ?? explanationAnswer?.firstSelectedOptionIds ?? []
    return selected.includes(option.id)
  })

  const typeLabel = question.learning.flowType ? flowTypeLabel[question.learning.flowType] : undefined

  return (
    <div className="page-stack learning-page">
      <header className="session-header">
        <div>
          <p className="eyebrow">LEARNING / {session.variant}</p>
          <h1>{question.title}</h1>
        </div>
        <div className="tag-row">
          {typeLabel && <StatusBadge tone="muted">{text(typeLabel[0], typeLabel[1])}</StatusBadge>}
          <StatusBadge>{text(`第 ${question.revision} 版`, `第 ${question.revision} 版`)}</StatusBadge>
        </div>
      </header>

      {isCommonTest && finalBlank ? (
        <>
          <div className="common-test-stepper" aria-label={text('学習ステップ', '学习步骤')}>
            {([
              ['original', '1', text('元の問題', '原题')],
              ['guide', '2', text('推論ガイド', '推理引导')],
              ['final', '3', text('元の選択肢', '原选项')],
            ] as const).map(([key, number, label]) => (
              <div key={key} className={`common-test-step${screen === key ? ' common-test-step--active' : ''}`}>
                <span>{number}</span><small>{label}</small>
              </div>
            ))}
          </div>

          {screen === 'original' && (
            <section className="common-test-screen" data-testid="common-test-original">
              <div className="screen-kicker">{text('STEP 1｜元の問題', 'STEP 1｜原题')}</div>
              <article className="question-paper"><ContentRenderer blocks={question.stem} assets={question.assets} /></article>
              <div className="original-choice-preview">
                <h2>{finalBlank.prompt}</h2>
                {finalBlank.options.map((option, index) => (
                  <div key={option.id} className="original-choice"><span>{index + 1}</span><ContentRenderer blocks={option.content} assets={question.assets} /></div>
                ))}
              </div>
              <RaisedButton className="primary-button" data-testid="open-guide" onClick={() => setScreen('guide')}>{text('推論ガイドへ', '进入推理引导')}</RaisedButton>
            </section>
          )}

          {screen === 'guide' && (
            <section className="common-test-screen" data-testid="common-test-guide">
              <div className="screen-kicker">{text('STEP 2｜推論ガイド', 'STEP 2｜推理引导')}</div>
              <ProgressBar label={text('ガイドの進み具合', '引导进度')} value={guideCompletedCount} max={guideBlankIds.length} />
              <LearningFlowRenderer question={question} session={session} onActivate={activate} onExplain={showExplanation} onRevisit={revisitLearning.bind(null, sessionId)} />
              <RaisedButton className="primary-button" data-testid="open-final-choice" disabled={!guideComplete} onClick={() => setScreen('final')}>{text('元の選択肢へ戻る', '回到原选项')}</RaisedButton>
            </section>
          )}

          {screen === 'final' && (
            <section className="common-test-screen" data-testid="common-test-final">
              <div className="screen-kicker">{text('STEP 3｜元の選択肢で解答', 'STEP 3｜用原选项作答')}</div>
              <article className="question-paper question-paper--compact"><ContentRenderer blocks={question.stem} assets={question.assets} /></article>
              <div className="final-choice-list" role="group" aria-label={finalBlank.prompt}>
                <h2>{finalBlank.prompt}</h2>
                {finalBlank.options.map((option, index) => {
                  const wrongSelected = finalWrongSelection.includes(option.id)
                  return (
                    <button
                      type="button"
                      key={option.id}
                      data-testid={`final-option-${option.id}`}
                      className={`final-choice${wrongSelected ? ' final-choice--wrong' : ''}`}
                      onClick={() => submitOption(option.id)}
                    >
                      <span>{index + 1}</span><ContentRenderer blocks={option.content} assets={question.assets} />
                    </button>
                  )
                })}
                {finalAnswer && !isLearningAnswerResolved(finalAnswer) && (
                  <div className="final-retry">
                    <p>{text('不正解です。ガイドを見直すか、もう一度選んでください。', '答错了。可以回看引导，也可以重新选择。')}</p>
                    <div className="button-row">
                      <RaisedButton onClick={() => setScreen('guide')}>{text('ガイドを見直す', '回看引导')}</RaisedButton>
                      <RaisedButton onClick={() => showExplanation(finalBlank.id)}>{text('ヒントを見る', '查看提示')}</RaisedButton>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          <ProgressBar label={text('空欄の進み具合', '填空进度')} value={completedCount} max={enabledBlankIds.length} />
          <article className="question-paper"><ContentRenderer blocks={question.stem} assets={question.assets} /></article>
          <section><h2 className="solution-heading">{text('連続解答', '连续解答')}</h2><LearningFlowRenderer question={question} session={session} onActivate={activate} onExplain={showExplanation} onRevisit={revisitLearning.bind(null, sessionId)} /></section>
        </>
      )}

      <BottomSheet open={(!isCommonTest || screen === 'guide') && choiceOpen && Boolean(activeBlank)} title={activeBlank?.prompt ?? text('回答を選ぶ', '选择答案')} onClose={() => setChoiceOpen(false)}>
        <div className="option-list">
          {activeBlank?.options.map((option) => <button type="button" key={option.id} data-testid={`option-${option.id}`} aria-pressed={multiSelection.includes(option.id)} className="option-button" onClick={() => submitOption(option.id)}><ContentRenderer blocks={option.content} assets={question.assets} /></button>)}
          {activeBlank?.answerType === 'multi-choice' && <RaisedButton className="primary-button" disabled={!multiSelection.length} onClick={submitMultiple}>{text('選択を確定', '确认选择')}</RaisedButton>}
        </div>
      </BottomSheet>

      <BottomSheet open={Boolean(explanationBlank)} title={text('この手順の解き方', '这一步的解题方法')} onClose={hideExplanation}>
        {explanationBlank && <div className="explanation-stack">
          <section><h3>{text('なぜこの答えになるか', '为什么是这个答案')}</h3><ContentRenderer blocks={explanationBlank.explanation} assets={question.assets} /></section>
          <section><h3>{text('選んだ答えを見直す', '检查刚才的选择')}</h3>{selectedWrongOption?.wrongReason.length ? <ContentRenderer blocks={selectedWrongOption.wrongReason} assets={question.assets} /> : <p>{text('この選択肢には個別の誤答理由がありません。', '这个选项没有单独的错误原因说明。')}</p>}</section>
          <section><h3>{text('この手順の知識', '这一步涉及的知识')}</h3><div className="tag-row">{explanationBlank.knowledgeTags.map((tag) => <StatusBadge key={tag}>{taxonomyLabel(tag, language)}</StatusBadge>)}<StatusBadge tone="muted">{taxonomyLabel(explanationBlank.skillTag, language)}</StatusBadge></div></section>
          <section><h3>{text('次の練習', '下一步练习')}</h3><p>{explanationBlank.shortPracticeQuestionId ? text('同じ考え方を使う問題を、完了後に提案します。', '完成后会推荐一道使用相同思路的题目。') : text('関連する練習は準備中です。', '相关练习正在准备中。')}</p></section>
        </div>}
      </BottomSheet>
    </div>
  )
}
