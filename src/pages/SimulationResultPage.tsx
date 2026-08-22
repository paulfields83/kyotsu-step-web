import { AlertTriangle, CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState, ErrorState, NumberedSection, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { generateReinforcement } from '../domain/recommendation'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { taxonomyLabel } from '../i18n/labels'

export function SimulationResultPage() {
  const { sessionId = '' } = useParams()
  const navigate = useNavigate()
  const attempt = useAppStore((state) => state.simulationAttempts.find((item) => item.sessionId === sessionId))
  const customQuestions = useAppStore((state) => state.customQuestions)
  const startLearning = useAppStore((state) => state.startLearning)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const errorLabels: Record<string, string> = {
    'time-insufficient': text('時間不足', '时间不足'), unanswered: text('未回答', '未作答'), 'calculation-error': text('計算', '计算'), 'graph-reading-error': text('図表の読み取り', '图表读取'), 'method-error': text('方針・立式', '思路与列式'), 'knowledge-error': text('知識', '知识'),
  }
  if (!attempt) return <ErrorState title={text('模擬テスト結果が見つかりません', '找不到模拟测试结果')} body={text('提出済みのテストから開いてください。', '请从已提交的测试记录中打开。')} action={<Link className="raised-link" to="/simulation/setup">{text('設定へ', '返回设置')}</Link>} />
  const recommendations = generateReinforcement(attempt, catalog)
  const elapsedSeconds = Math.max(0, Math.round((attempt.submittedAt - attempt.startedAt) / 1000))
  const beginReinforcement = (questionId: string) => navigate(`/learning/session/${startLearning(questionId, 'selfCheck')}`)

  return (
    <div className="page-stack">
      <header className="page-hero"><p className="eyebrow">SIMULATION COMPLETE</p><h1>{text('模擬テスト結果', '模拟测试结果')}</h1><p>{attempt.timedOut ? text('時間切れで自動提出しました。', '时间到，系统已自动提交。') : text('提出した回答をまとめて判定しました。', '已统一批改提交的全部答案。')}</p></header>
      <div className="score-board"><span data-testid="simulation-score"><strong>{attempt.result.earnedScore}</strong><small>{text('得点', '得分')}</small></span><span><strong>{attempt.result.maxScore}</strong><small>{text('満点', '满分')}</small></span><span><strong>{elapsedSeconds}s</strong><small>{text('所要時間', '用时')}</small></span></div>
      <NumberedSection number="01" title={text('設問ごとの結果', '各小题结果')}>
        <div className="result-list">{attempt.result.items.map((item) => { const question = catalog.find((candidate) => candidate.questionId === item.questionId); const definition = question?.simulation.items.find((candidate) => candidate.id === item.itemId); return <article className={`result-row ${item.isCorrect ? 'result-row--correct' : 'result-row--wrong'}`} key={item.itemId}>{item.isCorrect ? <CheckCircle2 aria-hidden="true" /> : item.isUnanswered ? <AlertTriangle aria-hidden="true" /> : <XCircle aria-hidden="true" />}<div><h3>{question?.title} / {definition?.label}</h3><p>{item.isUnanswered ? text('未回答', '未作答') : item.isCorrect ? text('正解', '正确') : text('不正解', '错误')}｜{item.earnedScore}/{item.maxScore} {text('点', '分')}</p>{!item.isCorrect && definition && <p><strong>{text('確認する知識', '需要巩固的知识')}：{definition.knowledgeTags.map((tag) => taxonomyLabel(tag, language)).join('、')}</strong></p>}</div></article> })}</div>
      </NumberedSection>
      <NumberedSection number="02" title={text('失点の種類', '失分类型')}>
        {attempt.result.errorTypes.length ? <div className="tag-row">{attempt.result.errorTypes.map((type) => <StatusBadge tone="error" key={type}>{errorLabels[type] ?? type}</StatusBadge>)}</div> : <EmptyState title={text('失点はありません', '没有失分')} body={text('同じ条件か、より短い時間で再確認できます。', '可以在相同条件下，或缩短时间后再次检验。')} />}
      </NumberedSection>
      <NumberedSection number="03" title={text('補強練習', '巩固练习')}>
        {recommendations.length ? <div className="recommendation-list">{recommendations.map((recommendation) => { const question = catalog.find((candidate) => candidate.questionId === recommendation.questionId)!; return <article key={recommendation.questionId}><div><strong>{question.title}</strong><small>{text('誤答した知識・解き方に近い既存問題', '与本次答错的知识和方法相近')}</small></div><RaisedButton onClick={() => beginReinforcement(question.questionId)}>{text('自力確認へ', '开始自主检查')}</RaisedButton></article> })}</div> : <EmptyState title={text('今すぐの追加問題はありません', '暂时没有可追加的题目')} body={text('今回の問題と最近の問題を除くと、条件に合う既存問題がありません。', '排除本次和最近练习的题目后，当前题库中没有符合条件的题目。')} />}
      </NumberedSection>
      <div className="result-actions"><Link className="raised-link" to="/analysis">{text('分析を見る', '查看分析')}</Link><Link className="raised-link" to="/problems"><Clock3 aria-hidden="true" />{text('問題へ戻る', '返回题目')}</Link></div>
    </div>
  )
}
