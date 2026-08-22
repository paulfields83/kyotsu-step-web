import { ArrowRight, BrainCircuit, Clock3, Lightbulb, Target } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, NumberedSection, ProgressBar, StatusBadge } from '../components/ui/Primitives'
import { buildAnalytics, type TagMetric } from '../domain/analytics'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { taxonomyLabel } from '../i18n/labels'

function MetricList({ metrics, emptyText }: { metrics: TagMetric[]; emptyText: string }) {
  const { language, text } = useI18n()
  if (!metrics.length) return <EmptyState title={text('まだ測定できません', '暂时无法测量')} body={emptyText} />
  return <div className="metric-list">{metrics.map((metric) => <Link key={`${metric.dimension}-${metric.tag}`} to={`/analysis/${metric.dimension}/${encodeURIComponent(metric.tag)}`}><div><strong>{taxonomyLabel(metric.tag, language)}</strong><small>{metric.attempts} {text('回', '次')}・{text('反復誤答', '重复答错')} {metric.repeatErrors} {text('回', '次')}</small></div><ProgressBar label={text('定着度', '掌握度')} value={metric.mastery} max={100} /><ArrowRight aria-hidden="true" /></Link>)}</div>
}

export function AnalysisPage() {
  const learningSessions = useAppStore((state) => state.learningSessions)
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const simulationAttempts = useAppStore((state) => state.simulationAttempts)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const analytics = useMemo(() => buildAnalytics(learningSessions, learningAttempts, simulationAttempts, catalog), [catalog, learningAttempts, learningSessions, simulationAttempts])

  if (!analytics.totalSessions) return <div className="page-stack"><header className="page-hero"><p className="eyebrow">ANALYSIS</p><h1>{text('分析', '分析')}</h1><p>{text('知識と解き方を分け、保存された学習結果から更新します。', '把知识掌握与解题方法分开，根据已保存的学习结果持续更新。')}</p></header><EmptyState title={text('分析できる記録がありません', '还没有可分析的记录')} body={text('学習を 1 回完了するか、模擬テストを提出すると、ここに実測値が表示されます。', '完成一次学习或提交一次模拟测试后，这里会显示实际数据。')} action={<Link className="raised-link" to="/learning/setup">{text('学習を始める', '开始学习')}</Link>} /></div>

  return (
    <div className="page-stack">
      <header className="page-hero"><p className="eyebrow">ANALYSIS</p><h1>{text('分析', '分析')}</h1><p>{text('知識の定着と解き方の行動を、最初の回答から見ます。', '从首次作答出发，观察知识掌握和解题行为。')}</p></header>
      <div className="analytics-grid">
        <article><Target aria-hidden="true" /><strong>{analytics.firstTryAccuracy}%</strong><small>{text('学習・初回正解率', '学习・首次正确率')}</small></article>
        <article><BrainCircuit aria-hidden="true" /><strong>{analytics.simulationAccuracy}%</strong><small>{text('模擬・正解率', '模拟・正确率')}</small></article>
        <article><Clock3 aria-hidden="true" /><strong>{Math.round(analytics.averageResponseMs / 100) / 10}s</strong><small>{text('平均回答時間', '平均作答时间')}</small></article>
        <article><Lightbulb aria-hidden="true" /><strong>{analytics.explanationRate}%</strong><small>{text('解析利用率', '解析查看率')}</small></article>
      </div>
      <div className="tag-row"><StatusBadge tone="success">{text('完了', '已完成')} {analytics.totalSessions} {text('セッション', '次')}</StatusBadge><StatusBadge>{text('学習完了率', '学习完成率')} {analytics.learningCompletionRate}%</StatusBadge><StatusBadge>{analytics.totalStudySeconds}s {text('記録', '已记录')}</StatusBadge></div>
      <NumberedSection number="01" title={text('知識', '知识')} description={text('公式・概念・単元の理解', '公式、概念与单元理解')}><MetricList metrics={analytics.knowledgeMetrics} emptyText={text('知識タグを含む回答がまだありません。', '还没有包含知识标签的作答。')} /></NumberedSection>
      <NumberedSection number="02" title={text('解き方', '解题方法')} description={text('立式・計算・読み取り・結論', '列式、计算、读取与结论')}><MetricList metrics={analytics.skillMetrics} emptyText={text('解き方タグを含む回答がまだありません。', '还没有包含解题方法标签的作答。')} /></NumberedSection>
      <div className="result-actions"><Link className="raised-link" to="/mistakes">{text('復習リストを見る', '查看复习清单')}</Link><Link className="raised-link" to="/history">{text('学習履歴を見る', '查看学习记录')}</Link></div>
    </div>
  )
}
