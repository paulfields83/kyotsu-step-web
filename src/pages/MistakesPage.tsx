import { CheckCircle2, CircleDotDashed, RefreshCcw } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState, NumberedSection, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { buildMistakeRecords, type MistakeStatus } from '../domain/analytics'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { subjectLabel, taxonomyLabel } from '../i18n/labels'

const statusIcon = { reviewing: RefreshCcw, 'similar-passed': CircleDotDashed, mastered: CheckCircle2 }

export function MistakesPage() {
  const navigate = useNavigate()
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const simulationAttempts = useAppStore((state) => state.simulationAttempts)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const startLearning = useAppStore((state) => state.startLearning)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const statusLabel: Record<MistakeStatus, string> = { reviewing: text('復習中', '复习中'), 'similar-passed': text('類題 1 回合格', '同类题已答对 1 次'), mastered: text('定着', '已掌握') }
  const records = useMemo(() => buildMistakeRecords(learningAttempts, simulationAttempts, catalog), [catalog, learningAttempts, simulationAttempts])
  const practice = (questionId: string) => navigate(`/learning/session/${startLearning(questionId, 'selfCheck')}`)
  return <div className="page-stack"><header className="page-hero"><p className="eyebrow">REVIEW</p><h1>{text('復習リスト', '复习清单')}</h1><p>{text('手動で「完了」にはできません。後の正答実績だけで状態が進みます。', '状态不能手动标记为完成，只会根据后续正确作答自动推进。')}</p></header>{records.length ? <NumberedSection number="01" title={`${records.length} ${text('問の記録', '道题的记录')}`}><div className="mistake-list">{records.map((record) => { const Icon = statusIcon[record.status]; const question = catalog.find((candidate) => candidate.questionId === record.questionId); return <article key={record.questionId}><header><Icon aria-hidden="true" /><div><strong>{question?.title ?? record.questionTitle}</strong><small>{question ? subjectLabel(question.subject, language) : record.subject}・{text('誤答', '答错')} {record.wrongCount} {text('回', '次')}</small></div><StatusBadge tone={record.status === 'mastered' ? 'success' : record.status === 'reviewing' ? 'error' : 'info'}>{statusLabel[record.status]}</StatusBadge></header><div className="tag-row">{record.weakTags.map((tag) => <span className="plain-tag" key={tag}>{taxonomyLabel(tag, language)}</span>)}</div>{question && <RaisedButton onClick={() => practice(record.questionId)}>{text('自力確認する', '自主检查')}</RaisedButton>}</article> })}</div></NumberedSection> : <EmptyState title={text('復習する誤答はありません', '没有需要复习的错题')} body={text('学習の初回誤答または模擬テストの失点が記録されると、自動で追加されます。', '学习中首次答错或模拟测试失分后，题目会自动加入这里。')} action={<Link className="raised-link" to="/learning/setup">{text('学習を始める', '开始学习')}</Link>} />}</div>
}
