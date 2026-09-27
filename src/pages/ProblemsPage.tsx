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
      <header className="page-hero"><p className="eyebrow">TODAY / 共通 STEP</p><h1>{text('問題', '题目')}</h1><p>{text('問題練習で解法を身につけ、共通テスト模擬で自力を確かめる。', '通过题目练习掌握解法，再用共通测试模拟检验独立作答能力。')}</p></header>
      {resumable && <Link className="resume-strip" to={`/learning/session/${resumable.sessionId}`}><TimerReset aria-hidden="true" /><span><small>{text('途中から再開', '继续上次学习')}</small><strong>{resumableTitle}</strong></span><ArrowRight aria-hidden="true" /></Link>}
      <NumberedSection number="01" title={text('問題練習モード', '题目练习模式')} description={text('解法に沿って、途中式と空欄を順番に解きます。', '沿着解题过程，逐步完成中间步骤与填空。')}>
        <Link className="mode-card" to="/learning/setup"><BookOpenCheck aria-hidden="true" /><span><strong>{text('問題練習を始める', '开始题目练习')}</strong><small>{text('科目・問題を選択', '选择科目与题目')}</small></span><ArrowRight aria-hidden="true" /></Link>
      </NumberedSection>
      <NumberedSection number="02" title={text('共通テスト模擬', '共通测试模拟')} description={text('本番形式で解き、回答中は誘導・正解・解析を表示しません。', '按正式考试形式作答，过程中不显示引导、答案或解析。')}>
        <Link className="mode-card" to="/simulation/setup"><Clock3 aria-hidden="true" /><span><strong>{text('模擬試験を始める', '开始模拟考试')}</strong><small>{text('範囲・難易度・時間を設定', '设置范围・难度・时间')}</small></span><ArrowRight aria-hidden="true" /></Link>
      </NumberedSection>
      <NumberedSection number="03" title={text('この端末の記録', '本设备的记录')}>
        {attempts.length ? <><ProgressBar label={text('完了した学習', '已完成的学习')} value={attempts.length} max={Math.max(5, attempts.length)} /><StatusBadge tone="success">{attempts.length} {text('セッション保存済み', '次学习已保存')}</StatusBadge></> : <EmptyState title={text('記録はまだありません', '还没有学习记录')} body={text('最初の学習を終えると、ここに進み具合が表示されます。', '完成第一次学习后，这里会显示你的进度。')} />}
      </NumberedSection>
    </div>
  )
}
