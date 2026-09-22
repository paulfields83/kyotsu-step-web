import { ArrowRight, BookOpenCheck, Clock3, TimerReset } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, NumberedSection, ProgressBar, StatusBadge } from '../components/ui/Primitives'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'

export function ProblemsPage() {
  const learningSessions = useAppStore((state) => state.learningSessions)
  const attempts = useAppStore((state) => state.learningAttempts)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const sessions = useMemo(() => Object.values(learningSessions), [learningSessions])
  const resumable = sessions.filter((session) => !session.completedAt).sort((a, b) => b.startedAt - a.startedAt)[0]
  const resumableTitle = catalog.find((question) => question.questionId === resumable?.questionId)?.title ?? resumable?.questionTitle

  return (
    <div className="page-stack">
      <header className="page-hero"><p className="eyebrow">TODAY / 共通 STEP</p><h1>{text('問題', '题目')}</h1><p>{text('解答の途中で考え、模擬テストで自力を確かめる。', '在连续解题中理清思路，再用模拟测试检验独立作答能力。')}</p></header>
      {resumable && <Link className="resume-strip" to={`/learning/session/${resumable.sessionId}`}><TimerReset aria-hidden="true" /><span><small>{text('途中から再開', '继续上次学习')}</small><strong>{resumableTitle}</strong></span><ArrowRight aria-hidden="true" /></Link>}
      <NumberedSection number="01" title={text('学習モード', '学习模式')} description={text('連続解答を空欄ごとに完成させます。', '沿着解题过程逐步完成每个填空。')}>
        <Link className="mode-card" to="/learning/setup"><BookOpenCheck aria-hidden="true" /><span><strong>{text('学習を始める', '开始学习')}</strong><small>{text('詳細・標準・自力確認', '详细引导・标准引导・自主检查')}</small></span><ArrowRight aria-hidden="true" /></Link>
      </NumberedSection>
      <NumberedSection number="02" title={text('模擬テスト', '模拟测试')} description={text('回答中は正解も解析も表示しません。', '作答过程中不显示答案或解析。')}>
        <Link className="mode-card" to="/simulation/setup"><Clock3 aria-hidden="true" /><span><strong>{text('テストを設定', '设置测试')}</strong><small>{text('範囲・難易度・時間', '范围・难度・时间')}</small></span><ArrowRight aria-hidden="true" /></Link>
      </NumberedSection>
      <NumberedSection number="03" title={text('この端末の記録', '本设备的记录')}>
        {attempts.length ? <><ProgressBar label={text('完了した学習', '已完成的学习')} value={attempts.length} max={Math.max(5, attempts.length)} /><StatusBadge tone="success">{attempts.length} {text('セッション保存済み', '次学习已保存')}</StatusBadge></> : <EmptyState title={text('記録はまだありません', '还没有学习记录')} body={text('最初の学習を終えると、ここに進み具合が表示されます。', '完成第一次学习后，这里会显示你的进度。')} />}
      </NumberedSection>
    </div>
  )
}
