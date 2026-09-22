import { ArrowRight, Atom, BookOpenCheck, CheckCircle2, Clock3, Sigma, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildTextbookChapters, textbookLessonHref } from '../../domain/textbookCatalog'
import type { PublicTextbookUnit } from '../../domain/textbookPublic'
import { textbookRepository } from '../../repositories/textbookRepository'
import { getQuestionCatalog, useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'

const subjects = [
  { id: 'math-1a' as const, icon: Sigma },
  { id: 'physics' as const, icon: Atom },
]

function sameDay(timestamp: number, now: Date) {
  const date = new Date(timestamp)
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate()
}

export function AppHomePage() {
  const learningSessions = useAppStore((state) => state.learningSessions)
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const simulationAttempts = useAppStore((state) => state.simulationAttempts)
  const textbookProgress = useAppStore((state) => state.textbookProgress)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const displayName = useAppStore((state) => state.settings.displayName)
  const { language, text } = useI18n()
  const [units, setUnits] = useState<PublicTextbookUnit[]>([])

  useEffect(() => {
    textbookRepository.listPublished().then(setUnits).catch(() => setUnits([]))
  }, [])

  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])

  const resume = useMemo(() => {
    const candidates: Array<{ at: number; title: string; subtitle: string; href: string; progress?: number }> = []
    for (const session of Object.values(learningSessions)) {
      if (session.completedAt) continue
      const question = catalog.find((item) => item.questionId === session.questionId)
      const total = question ? Object.keys(question.learning.blanks).length : 0
      const done = Object.values(session.answers).filter((answer) => answer.resolved).length
      candidates.push({
        at: session.startedAt,
        title: question?.title ?? session.questionTitle,
        subtitle: text('問題練習', '题目练习'),
        href: `/learning/session/${session.sessionId}`,
        progress: total ? Math.round((done / total) * 100) : undefined,
      })
    }
    for (const progress of Object.values(textbookProgress)) {
      if (progress.completedAt) continue
      const unit = units.find((item) => item.unitId === progress.unitId)
      if (!unit) continue
      const total = unit.sections.flatMap((section) => section.items).length
      const done = Object.values(progress.answers).filter((answer) => answer.resolved).length
      candidates.push({
        at: progress.updatedAt,
        title: unit.title,
        subtitle: text('知識学習', '知识学习'),
        href: `/learning/textbook/${unit.unitId}`,
        progress: total ? Math.round((done / total) * 100) : undefined,
      })
    }
    return candidates.sort((a, b) => b.at - a.at)[0]
  }, [catalog, learningSessions, textbookProgress, text, units])

  const subjectCards = useMemo(() => subjects.map(({ id, icon }) => {
    const subjectUnits = units.filter((unit) => unit.subject === id)
    const total = subjectUnits.reduce((sum, unit) => sum + unit.sections.flatMap((section) => section.items).length, 0)
    const completed = subjectUnits.reduce((sum, unit) => {
      const progress = textbookProgress[unit.unitId]
      return sum + unit.sections.flatMap((section) => section.items).filter((item) => progress?.answers[item.id]?.resolved).length
    }, 0)
    const chapters = buildTextbookChapters(units, id)
    const firstLesson = chapters[0]?.lessons[0]
    return {
      id,
      icon,
      title: id === 'math-1a' ? text('数学 I・A', '数学 I・A') : text('物理', '物理'),
      subtitle: chapters[0]?.label ?? text('教材を読み込み中', '正在读取教材'),
      percent: total ? Math.round((completed / total) * 100) : 0,
      meta: total ? text(`${completed} / ${total} 項目`, `${completed} / ${total} 项`) : text('未開始', '未开始'),
      href: firstLesson ? textbookLessonHref(firstLesson) : '/learn',
    }
  }), [text, textbookProgress, units])

  const today = useMemo(() => {
    const now = new Date()
    const learningToday = learningAttempts.filter((attempt) => sameDay(attempt.completedAt, now))
    const simulationToday = simulationAttempts.filter((attempt) => sameDay(attempt.submittedAt, now))
    const studyMs = learningToday.reduce((sum, attempt) => sum + (attempt.completedAt - attempt.startedAt), 0)
      + simulationToday.reduce((sum, attempt) => sum + (attempt.submittedAt - attempt.startedAt), 0)
    let correct = 0
    let total = 0
    learningToday.forEach((attempt) => {
      const answers = Object.values(attempt.answers)
      correct += answers.filter((answer) => answer.isFirstCorrect).length
      total += answers.length
    })
    simulationToday.forEach((attempt) => {
      correct += attempt.result.items.filter((item) => item.isCorrect).length
      total += attempt.result.items.length
    })
    return {
      minutes: Math.round(studyMs / 60000),
      sessions: learningToday.length + simulationToday.length,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
    }
  }, [learningAttempts, simulationAttempts])

  return (
    <div className="v2-page v2-home">
      <section className="v2-welcome">
        <span>{text('今日も積み上げよう', '今天也继续积累')}</span>
        <h1>{displayName ? text(`${displayName}さん、こんばんは。`, `${displayName}，晚上好。`) : text('こんばんは。', '晚上好。')}</h1>
      </section>

      <section className="v2-resume-card">
        <div className="v2-resume-card__top">
          <div>
            <span className="v2-eyebrow">{resume ? text('CONTINUE', '继续学习') : text('START', '开始学习')}</span>
            <h2>{resume?.title ?? text('最初の学習を始める', '开始第一次学习')}</h2>
            <p>{resume?.subtitle ?? text('数学・物理から科目を選びましょう。', '从数学或物理中选择科目。')}</p>
          </div>
          <BookOpenCheck size={28} />
        </div>
        {resume?.progress !== undefined && (
          <div className="v2-progress-line"><span style={{ width: `${resume.progress}%` }} /></div>
        )}
        <Link className="v2-primary-action" to={resume?.href ?? '/learn'}>
          {resume ? text('続きから学習', '继续学习') : text('学習を始める', '开始学习')}
          <ArrowRight size={18} />
        </Link>
      </section>

      <section className="v2-section">
        <div className="v2-section-title">
          <div><span className="v2-eyebrow">SUBJECTS</span><h2>{text('科目から学ぶ', '按科目学习')}</h2></div>
          <Link to="/learn">{text('すべて見る', '查看全部')}</Link>
        </div>
        <div className="v2-subject-grid">
          {subjectCards.map((subject) => {
            const Icon = subject.icon
            return (
              <Link className={`v2-subject-tile v2-subject-tile--${subject.id === 'physics' ? 'physics' : 'math'}`} to={subject.href} key={subject.id}>
                <div className="v2-subject-tile__icon"><Icon size={22} /></div>
                <h3>{subject.title}</h3>
                <p>{subject.subtitle}</p>
                <div className="v2-progress-line v2-progress-line--small"><span style={{ width: `${subject.percent}%` }} /></div>
                <div className="v2-subject-tile__meta"><span>{subject.meta}</span><strong>{subject.percent}%</strong></div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="v2-section">
        <div className="v2-section-title"><div><span className="v2-eyebrow">TODAY</span><h2>{text('今日の学習', '今日学习')}</h2></div></div>
        <div className="v2-stat-grid">
          <article><Clock3 size={20} /><strong>{today.minutes}</strong><span>min</span><small>{text('学習時間', '学习时间')}</small></article>
          <article><Target size={20} /><strong>{today.sessions}</strong><span>{text('回', '次')}</span><small>{text('完了セッション', '完成次数')}</small></article>
          <article><CheckCircle2 size={20} /><strong>{today.accuracy}</strong><span>%</span><small>{text('正答率', '正确率')}</small></article>
        </div>
      </section>

      <section className="v2-quick-grid">
        <Link to="/mistakes"><span>{text('復習', '复习')}</span><strong>{text('間違えた問題をやり直す', '重做错题')}</strong><ArrowRight size={18} /></Link>
        <Link to="/simulation/setup"><span>{text('模擬', '模拟')}</span><strong>{text('実力をテストする', '测试当前水平')}</strong><ArrowRight size={18} /></Link>
      </section>
    </div>
  )
}
