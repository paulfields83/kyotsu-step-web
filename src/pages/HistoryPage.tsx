import { BookOpenCheck, Clock3 } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, NumberedSection, StatusBadge } from '../components/ui/Primitives'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'

export function HistoryPage() {
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const simulationAttempts = useAppStore((state) => state.simulationAttempts)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const { language, locale, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const formatter = useMemo(() => new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Tokyo', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), [locale])
  const entries = useMemo(() => [
    ...learningAttempts.map((attempt) => ({ type: 'learning' as const, id: attempt.sessionId, at: attempt.completedAt, title: catalog.find((question) => question.questionId === attempt.questionId)?.title ?? attempt.questionTitle, revision: `rev.${attempt.questionRevision}`, detail: `${Object.values(attempt.answers).filter((answer) => answer.isFirstCorrect).length}/${Object.keys(attempt.answers).length} ${text('初回正解', '首次答对')}`, href: `/learning/result/${attempt.sessionId}` })),
    ...simulationAttempts.map((attempt) => ({ type: 'simulation' as const, id: attempt.sessionId, at: attempt.submittedAt, title: Object.keys(attempt.questionTitles).map((id) => catalog.find((question) => question.questionId === id)?.title ?? attempt.questionTitles[id]).join('、'), revision: Object.entries(attempt.questionRevisions).map(([id, revision]) => `${id} rev.${revision}`).join(' / '), detail: `${attempt.result.earnedScore}/${attempt.result.maxScore} ${text('点', '分')}・${text('未回答', '未作答')} ${attempt.result.unansweredCount}`, href: `/simulation/result/${attempt.sessionId}` })),
  ].sort((left, right) => right.at - left.at), [catalog, learningAttempts, simulationAttempts, text])
  return <div className="page-stack"><header className="page-hero"><p className="eyebrow">HISTORY</p><h1>{text('学習履歴', '学习记录')}</h1><p>{text('当時の問題名、revision、初回回答と得点を session 単位で保存します。', '按每次学习或测试保存当时的题目、版本、首次作答和得分。')}</p></header>{entries.length ? <NumberedSection number="01" title={`${entries.length} ${text('セッション', '条记录')}`}><div className="history-list">{entries.map((entry) => { const Icon = entry.type === 'learning' ? BookOpenCheck : Clock3; return <Link key={entry.id} to={entry.href}><Icon aria-hidden="true" /><div><span className="history-meta"><StatusBadge>{entry.type === 'learning' ? text('学習', '学习') : text('模擬', '模拟')}</StatusBadge><time dateTime={new Date(entry.at).toISOString()}>{formatter.format(entry.at)}</time></span><strong>{entry.title}</strong><small>{entry.revision}</small><p>{entry.detail}</p></div></Link> })}</div></NumberedSection> : <EmptyState title={text('履歴はまだありません', '还没有学习记录')} body={text('完了した学習と提出した模擬テストだけが履歴に残ります。途中の session は問題ページから再開できます。', '只有已完成的学习和已提交的模拟测试会保存在这里；未完成的学习可以从题目页继续。')} action={<Link className="raised-link" to="/problems">{text('問題へ', '返回题目')}</Link>} />}</div>
}
