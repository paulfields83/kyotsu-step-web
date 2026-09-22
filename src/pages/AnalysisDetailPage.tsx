import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState, ErrorState, NumberedSection, ProgressBar, StatusBadge } from '../components/ui/Primitives'
import { buildAnalytics } from '../domain/analytics'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { subjectLabel, taxonomyLabel } from '../i18n/labels'

export function AnalysisDetailPage() {
  const { dimension = '', tagId = '' } = useParams()
  const tag = decodeURIComponent(tagId)
  const learningSessions = useAppStore((state) => state.learningSessions)
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const simulationAttempts = useAppStore((state) => state.simulationAttempts)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const analytics = useMemo(() => buildAnalytics(learningSessions, learningAttempts, simulationAttempts, catalog), [catalog, learningAttempts, learningSessions, simulationAttempts])
  const metrics = dimension === 'knowledge' ? analytics.knowledgeMetrics : dimension === 'skill' ? analytics.skillMetrics : []
  const metric = metrics.find((item) => item.tag === tag)
  if (!metric) return <ErrorState title={text('分析項目が見つかりません', '找不到分析项目')} body={text('履歴が消去されたか、URL が正しくありません。', '记录可能已被清除，或网址不正确。')} action={<Link className="raised-link" to="/analysis">{text('分析へ戻る', '返回分析')}</Link>} />
  const related = catalog.filter((question) => dimension === 'knowledge' ? question.taxonomy.knowledgeTags.includes(tag) : question.taxonomy.skillTags.includes(tag))
  return <div className="page-stack"><header className="page-hero"><p className="eyebrow">{dimension === 'knowledge' ? 'KNOWLEDGE' : 'SKILL'}</p><h1>{taxonomyLabel(tag, language)}</h1><p>{text('保存された初回回答と模擬結果を合算した詳細です。', '这里汇总了已保存的首次作答和模拟测试结果。')}</p></header><div className="score-board"><span><strong>{metric.accuracy}%</strong><small>{text('正解率', '正确率')}</small></span><span><strong>{metric.attempts}</strong><small>{text('回答数', '作答数')}</small></span><span><strong>{metric.repeatErrors}</strong><small>{text('反復誤答', '重复答错')}</small></span></div><NumberedSection number="01" title={text('定着度', '掌握度')}><ProgressBar label={text('定着度', '掌握度')} value={metric.mastery} max={100} /><div className="tag-row"><StatusBadge>{text('平均', '平均')} {Math.round(metric.averageResponseMs / 100) / 10}s</StatusBadge>{dimension === 'knowledge' && <StatusBadge>{text('解析利用', '查看解析')} {metric.explanationRate}%</StatusBadge>}</div></NumberedSection><NumberedSection number="02" title={text('関連問題', '相关题目')}>{related.length ? <div className="selected-question-list">{related.map((question) => <div key={question.questionId}><span><strong>{question.title}</strong><small>{subjectLabel(question.subject, language)} / rev.{question.revision}</small></span><Link className="inline-link" to={`/learning/setup?question=${question.questionId}`}>{text('練習', '练习')}</Link></div>)}</div> : <EmptyState title={text('関連問題がありません', '暂无相关题目')} body={text('現在の題庫では、このタグを持つ別の問題がありません。', '当前题库中没有其他带有此标签的题目。')} />}</NumberedSection><Link className="inline-link" to="/analysis">← {text('分析へ戻る', '返回分析')}</Link></div>
}
