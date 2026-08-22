import { CheckCircle2, XCircle } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContentRenderer } from '../components/question/ContentRenderer'
import { EmptyState, ErrorState, NumberedSection, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { activeBlankIds } from '../domain/learning'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { taxonomyLabel } from '../i18n/labels'

function optionLabel(blocks: { type: string; text?: string }[], fallback: string) {
  return blocks.find((block) => block.type === 'text')?.text ?? fallback
}

export function LearningResultPage() {
  const { sessionId = '' } = useParams()
  const navigate = useNavigate()
  const session = useAppStore((state) => state.learningSessions[sessionId])
  const customQuestions = useAppStore((state) => state.customQuestions)
  const startLearning = useAppStore((state) => state.startLearning)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const question = catalog.find((item) => item.questionId === session?.questionId)
  if (!session || !session.completedAt || !question) return <ErrorState title={text('学習結果が見つかりません', '找不到学习结果')} body={text('完了した学習セッションから開いてください。', '请从已完成的学习记录中打开。')} action={<Link className="raised-link" to="/problems">{text('問題へ', '返回题目')}</Link>} />

  const blankIds = activeBlankIds(question, session.variant)
  const answers = blankIds.map((id) => session.answers[id]).filter(Boolean)
  const wrongAnswers = answers.filter((answer) => !answer.isFirstCorrect)
  const correctCount = answers.length - wrongAnswers.length
  const weakKnowledge = [...new Set(wrongAnswers.flatMap((answer) => question.learning.blanks[answer.blankId].knowledgeTags))]
  const weakSkills = [...new Set(wrongAnswers.map((answer) => question.learning.blanks[answer.blankId].skillTag))]
  const relatedId = question.relatedQuestions.reinforcement[0]
  const related = catalog.find((item) => item.questionId === relatedId)
  const startRelated = () => related && navigate(`/learning/session/${startLearning(related.questionId, 'selfCheck')}`)

  return (
    <div className="page-stack">
      <header className="page-hero"><p className="eyebrow">LEARNING COMPLETE</p><h1>{text('学習結果', '学习结果')}</h1><p>{question.title}</p></header>
      <div className="score-board"><span data-testid="correct-count"><strong>{correctCount}</strong><small>{text('初回正解', '首次答对')}</small></span><span><strong>{answers.length}</strong><small>{text('回答空欄', '已答填空')}</small></span><span><strong>{Math.round((correctCount / Math.max(1, answers.length)) * 100)}%</strong><small>{text('初回正解率', '首次正确率')}</small></span></div>
      <NumberedSection number="01" title={text('空欄ごとの記録', '每个填空的记录')}>
        <div className="result-list">{answers.map((answer) => {
          const blank = question.learning.blanks[answer.blankId]
          const fallback = text('数式・図の選択肢', '公式或图像选项')
          const selected = blank.options.filter((option) => answer.firstSelectedOptionIds.includes(option.id)).map((option) => optionLabel(option.content, fallback)).join('、')
          const correct = blank.options.filter((option) => blank.correctOptionIds.includes(option.id)).map((option) => optionLabel(option.content, fallback)).join('、')
          return <article key={answer.blankId} className={`result-row ${answer.isFirstCorrect ? 'result-row--correct' : 'result-row--wrong'}`}>{answer.isFirstCorrect ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}<div><h3>{blank.prompt}</h3><p>{text('最初', '首次回答')}：{selected}</p>{!answer.isFirstCorrect && <p><strong>{text('正解', '正确答案')}：{correct}</strong></p>}</div></article>
        })}</div>
      </NumberedSection>
      <NumberedSection number="02" title={text('今回の弱点', '本次薄弱点')}>
        {wrongAnswers.length ? <><h3>{text('知識', '知识')}</h3><div className="tag-row">{weakKnowledge.map((tag) => <StatusBadge tone="error" key={tag}>{taxonomyLabel(tag, language)}</StatusBadge>)}</div><h3>{text('解き方', '解题方法')}</h3><div className="tag-row">{weakSkills.map((tag) => <StatusBadge tone="error" key={tag}>{taxonomyLabel(tag, language)}</StatusBadge>)}</div></> : <EmptyState title={text('初回誤答はありません', '没有首次答错的步骤')} body={text('次は空欄を減らすか、模擬テストで独力を確認しましょう。', '下一步可以减少引导，或通过模拟测试检验独立作答。')} />}
      </NumberedSection>
      <NumberedSection number="03" title={text('全体の解説', '完整解析')}><ContentRenderer blocks={question.fullExplanation} assets={question.assets} /></NumberedSection>
      <div className="result-actions">{related ? <RaisedButton className="primary-button" onClick={startRelated}>{text('同類問題', '同类题')}「{related.title}」</RaisedButton> : <EmptyState title={text('関連問題はありません', '暂无相关题目')} body={text('別の問題を選んで学習を続けられます。', '可以选择其他题目继续学习。')} />}<Link className="raised-link" to="/problems">{text('問題ページへ戻る', '返回题目页')}</Link></div>
    </div>
  )
}
