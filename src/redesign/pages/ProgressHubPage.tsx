import { ArrowRight, BarChart3, CheckCircle2, Clock3, RefreshCcw, Target } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { buildAnalytics, buildMistakeRecords } from '../../domain/analytics'
import { getQuestionCatalog, useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'

export function ProgressHubPage() {
  const learningSessions = useAppStore((state) => state.learningSessions)
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const simulationAttempts = useAppStore((state) => state.simulationAttempts)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const analytics = useMemo(
    () => buildAnalytics(learningSessions, learningAttempts, simulationAttempts, catalog),
    [catalog, learningAttempts, learningSessions, simulationAttempts],
  )
  const mistakes = useMemo(
    () => buildMistakeRecords(learningAttempts, simulationAttempts, catalog),
    [catalog, learningAttempts, simulationAttempts],
  )

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">PROGRESS</span>
        <h1>{text('学習記録', '学习进度')}</h1>
        <p>{text('正答率、学習時間、弱点を一か所で確認します。', '在一个页面查看正确率、学习时间和薄弱点。')}</p>
      </header>

      <div className="v2-analytics-grid">
        <article><Target size={21} /><strong>{analytics.firstTryAccuracy}%</strong><small>{text('初回正解率', '首次正确率')}</small></article>
        <article><BarChart3 size={21} /><strong>{analytics.simulationAccuracy}%</strong><small>{text('模擬正解率', '模拟正确率')}</small></article>
        <article><Clock3 size={21} /><strong>{Math.round(analytics.totalStudySeconds / 60)}</strong><span>min</span><small>{text('累計学習', '累计学习')}</small></article>
        <article><CheckCircle2 size={21} /><strong>{analytics.totalSessions}</strong><small>{text('完了セッション', '完成次数')}</small></article>
      </div>

      <section className="v2-section">
        <div className="v2-section-title">
          <div><span className="v2-eyebrow">WEAK POINTS</span><h2>{text('優先して復習', '优先复习')}</h2></div>
          <Link to="/mistakes">{text('すべて見る', '查看全部')}</Link>
        </div>
        <div className="v2-weak-list">
          {mistakes.length ? mistakes.slice(0, 4).map((record) => (
            <Link to="/mistakes" key={record.questionId}>
              <span className="v2-weak-icon"><RefreshCcw size={17} /></span>
              <div>
                <strong>{record.questionTitle}</strong>
                <small>{text(`誤答 ${record.wrongCount} 回`, `答错 ${record.wrongCount} 次`)}</small>
              </div>
              <ArrowRight size={17} />
            </Link>
          )) : <div className="v2-empty-card">{text('現在、復習対象の問題はありません。', '目前没有需要复习的题目。')}</div>}
        </div>
      </section>

      <section className="v2-section">
        <div className="v2-section-title"><div><span className="v2-eyebrow">MASTERY</span><h2>{text('苦手な知識', '薄弱知识')}</h2></div></div>
        <div className="v2-mastery-list">
          {analytics.knowledgeMetrics.length ? analytics.knowledgeMetrics.slice(0, 5).map((metric) => (
            <Link key={metric.tag} to={`/analysis/knowledge/${encodeURIComponent(metric.tag)}`}>
              <div><strong>{metric.tag}</strong><small>{metric.attempts} {text('回回答', '次作答')}</small></div>
              <div className="v2-mastery-score">
                <span>{metric.mastery}%</span>
                <div className="v2-progress-line v2-progress-line--small"><i style={{ width: `${metric.mastery}%` }} /></div>
              </div>
              <ArrowRight size={17} />
            </Link>
          )) : <div className="v2-empty-card">{text('学習を完了すると、ここに弱点が表示されます。', '完成学习后，这里会显示薄弱点。')}</div>}
        </div>
      </section>

      <section className="v2-menu-list">
        <Link to="/analysis"><div><strong>{text('詳細分析', '详细分析')}</strong><small>{text('知識・解き方ごとの定着度', '按知识与解题方法查看掌握度')}</small></div><ArrowRight size={18} /></Link>
        <Link to="/history"><div><strong>{text('学習履歴', '学习记录')}</strong><small>{text('過去の学習と模擬テスト', '过去的学习和模拟测试')}</small></div><ArrowRight size={18} /></Link>
        <Link to="/mistakes"><div><strong>{text('復習リスト', '复习清单')}</strong><small>{text('誤答から自動作成', '根据错题自动生成')}</small></div><ArrowRight size={18} /></Link>
      </section>
    </div>
  )
}
