import { ArrowRight, Atom, BookOpenCheck, CheckCircle2, Clock3, RefreshCcw, Sigma, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildTextbookChapters } from '../../domain/textbookCatalog'
import { buildMistakeRecords } from '../../domain/analytics'
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
  const hasLearningHistory = learningAttempts.length > 0
    || simulationAttempts.length > 0
    || Object.keys(textbookProgress).length > 0
    || Object.keys(learningSessions).length > 0

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
        subtitle: text('問題練習を続ける', '继续题目练习'),
        href: '/learning/session/' + session.sessionId,
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
        subtitle: text('知識学習を続ける', '继续知识学习'),
        href: '/learning/textbook/' + unit.unitId,
        progress: total ? Math.round((done / total) * 100) : undefined,
      })
    }

    if (!candidates.length && learningAttempts.length) {
      const latest = [...learningAttempts].sort((a, b) => b.completedAt - a.completedAt)[0]
      candidates.push({
        at: latest.completedAt,
        title: text('次の問題に進む', '继续下一道题'),
        subtitle: latest.questionTitle,
        href: '/practice',
      })
    }

    if (!candidates.length && Object.keys(textbookProgress).length) {
      const latest = Object.values(textbookProgress).sort((a, b) => b.updatedAt - a.updatedAt)[0]
      const unit = units.find((item) => item.unitId === latest.unitId)
      if (unit) {
        candidates.push({
          at: latest.updatedAt,
          title: text('次の知識項目に進む', '继续下一个知识点'),
          subtitle: unit.title,
          href: '/courses?subject=' + unit.subject,
        })
      }
    }

    return candidates.sort((a, b) => b.at - a.at)[0]
  }, [catalog, learningAttempts, learningSessions, textbookProgress, text, units])

  const startSubjects = useMemo(() => subjects.map(({ id, icon }) => {
    const chapters = buildTextbookChapters(units, id)
    return {
      id,
      icon,
      title: id === 'math-1a' ? '数学 I・A' : text('物理', '物理'),
      subtitle: chapters[0]?.label ?? text('基礎から始める', '从基础开始'),
      href: '/courses?subject=' + id,
    }
  }), [text, units])

  const mistakes = useMemo(
    () => buildMistakeRecords(learningAttempts, simulationAttempts, catalog),
    [catalog, learningAttempts, simulationAttempts],
  )

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
        <h1>{displayName ? text(displayName + 'さん、こんばんは。', displayName + '，晚上好。') : text('こんばんは。', '晚上好。')}</h1>
      </section>

      {hasLearningHistory ? (
        <section className="v2-resume-card">
          <div className="v2-resume-card__top">
            <div>
              <span className="v2-eyebrow">CONTINUE</span>
              <h2>{resume?.title ?? text('学習を続ける', '继续学习')}</h2>
              <p>{resume?.subtitle ?? text('コースまたは練習から次へ進みましょう。', '从课程或练习继续下一步。')}</p>
            </div>
            <BookOpenCheck size={28} />
          </div>
          {resume?.progress !== undefined && (
            <div className="v2-progress-line"><span style={{ width: String(resume.progress) + '%' }} /></div>
          )}
          <Link className="v2-primary-action" to={resume?.href ?? '/courses'}>
            {text('続きから', '继续学习')}<ArrowRight size={18} />
          </Link>
        </section>
      ) : (
        <section className="v2-section v2-section--first">
          <div className="v2-section-title">
            <div><span className="v2-eyebrow">START</span><h2>{text('最初の科目を選ぶ', '选择第一个科目')}</h2></div>
          </div>
          <div className="v2-start-grid">
            {startSubjects.map((subject) => {
              const Icon = subject.icon
              const iconClass = subject.id === 'physics' ? 'physics' : 'math'
              return (
                <Link to={subject.href} key={subject.id}>
                  <span className={'v2-start-grid__icon v2-start-grid__icon--' + iconClass}><Icon size={23} /></span>
                  <div><strong>{subject.title}</strong><small>{subject.subtitle}</small></div>
                  <ArrowRight size={18} />
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {hasLearningHistory && (
        <section className="v2-section">
          <div className="v2-section-title">
            <div><span className="v2-eyebrow">NEXT</span><h2>{text('今日のおすすめ', '今天推荐')}</h2></div>
          </div>
          <Link className="v2-recommend-card" to={mistakes.length ? '/mistakes' : '/practice'}>
            <span className="v2-recommend-card__icon">{mistakes.length ? <RefreshCcw size={20} /> : <Target size={20} />}</span>
            <div>
              <strong>{mistakes.length ? text('間違えた問題を復習', '复习做错的题目') : text('問題を1問解く', '做一道练习题')}</strong>
              <small>{mistakes.length ? text(String(mistakes.length) + ' 問が復習待ちです', '有 ' + String(mistakes.length) + ' 道题待复习') : text('Standard / Light から選べます', '可选择 Standard / Light')}</small>
            </div>
            <ArrowRight size={18} />
          </Link>
        </section>
      )}

      <section className="v2-section">
        <div className="v2-section-title"><div><span className="v2-eyebrow">TODAY</span><h2>{text('今日の学習', '今日学习')}</h2></div></div>
        <div className="v2-stat-grid">
          <article><Clock3 size={20} /><strong>{today.minutes}</strong><span>min</span><small>{text('学習時間', '学习时间')}</small></article>
          <article><Target size={20} /><strong>{today.sessions}</strong><span>{text('回', '次')}</span><small>{text('完了セッション', '完成次数')}</small></article>
          <article><CheckCircle2 size={20} /><strong>{today.accuracy}</strong><span>%</span><small>{text('正答率', '正确率')}</small></article>
        </div>
      </section>
    </div>
  )
}
