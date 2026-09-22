import { ArrowRight, Atom, BookOpen, Check, ListChecks, Sigma } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { buildTextbookChapters, textbookLessonHref, textbookLessonItemIds } from '../../domain/textbookCatalog'
import type { PublicTextbookUnit } from '../../domain/textbookPublic'
import type { Question } from '../../domain/questionSchema'
import { textbookRepository } from '../../repositories/textbookRepository'
import { getQuestionCatalog, useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'
import { difficultyLabel } from '../../i18n/labels'

type Mode = 'knowledge' | 'practice'

export function LearningHubPage() {
  const navigate = useNavigate()
  const defaultSubject = useAppStore((state) => state.settings.defaultSubject)
  const textbookProgress = useAppStore((state) => state.textbookProgress)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const startLearning = useAppStore((state) => state.startLearning)
  const { language, text } = useI18n()
  const [units, setUnits] = useState<PublicTextbookUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState<Question['subject']>(defaultSubject)
  const [mode, setMode] = useState<Mode>('knowledge')

  useEffect(() => {
    textbookRepository.listPublished()
      .then((value) => setUnits(value))
      .catch(() => setUnits([]))
      .finally(() => setLoading(false))
  }, [])

  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const chapters = useMemo(() => buildTextbookChapters(units, subject), [subject, units])
  const questions = useMemo(() => catalog.filter((question) => question.subject === subject && question.status === 'published'), [catalog, subject])

  const startPractice = (questionId: string, light = false) => {
    navigate(`/learning/session/${startLearning(questionId, light ? 'selfCheck' : 'standard')}`)
  }

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">LEARN</span>
        <h1>{text('学習', '学习')}</h1>
        <p>{text('知識を読むか、問題を解くか。必要な場所へ直接進めます。', '读知识点或直接做题，一步进入需要的内容。')}</p>
      </header>

      <div className="v2-subject-switch">
        <button type="button" aria-pressed={subject === 'math-1a'} onClick={() => setSubject('math-1a')}><Sigma size={18} />数学 I・A</button>
        <button type="button" aria-pressed={subject === 'physics'} onClick={() => setSubject('physics')}><Atom size={18} />{text('物理', '物理')}</button>
      </div>

      <div className="v2-mode-switch">
        <button type="button" aria-pressed={mode === 'knowledge'} onClick={() => setMode('knowledge')}><BookOpen size={17} />{text('知識学習', '知识学习')}</button>
        <button type="button" aria-pressed={mode === 'practice'} onClick={() => setMode('practice')}><ListChecks size={17} />{text('問題練習', '题目练习')}</button>
      </div>

      {mode === 'knowledge' ? (
        <section className="v2-course-list">
          {loading && <div className="v2-empty-card">{text('教材を読み込んでいます…', '正在读取教材…')}</div>}
          {!loading && !chapters.length && <div className="v2-empty-card">{text('この科目の教材はまだありません。', '该科目暂时没有教材。')}</div>}
          {chapters.map((chapter, chapterIndex) => {
            const allIds = chapter.lessons.flatMap((lesson) => {
              const unit = units.find((item) => item.unitId === lesson.unitId)
              return textbookLessonItemIds(unit, lesson)
            })
            const completed = chapter.lessons.reduce((sum, lesson) => {
              const unit = units.find((item) => item.unitId === lesson.unitId)
              const progress = textbookProgress[lesson.unitId]
              return sum + textbookLessonItemIds(unit, lesson).filter((id) => progress?.answers[id]?.resolved).length
            }, 0)
            const percent = allIds.length ? Math.round((completed / allIds.length) * 100) : 0
            return (
              <article className="v2-course-card" key={chapter.key}>
                <header>
                  <div className="v2-course-card__number">{String(chapterIndex + 1).padStart(2, '0')}</div>
                  <div>
                    <h2>{chapter.label}</h2>
                    <p>{text(`${completed} / ${allIds.length} 項目完了`, `已完成 ${completed} / ${allIds.length} 项`)}</p>
                  </div>
                  <strong>{percent}%</strong>
                </header>
                <div className="v2-progress-line v2-progress-line--small"><span style={{ width: `${percent}%` }} /></div>
                <div className="v2-lesson-list">
                  {chapter.lessons.map((lesson, lessonIndex) => {
                    const unit = units.find((item) => item.unitId === lesson.unitId)
                    const ids = textbookLessonItemIds(unit, lesson)
                    const progress = textbookProgress[lesson.unitId]
                    const done = ids.filter((id) => progress?.answers[id]?.resolved).length
                    const complete = ids.length > 0 && done === ids.length
                    return (
                      <Link to={textbookLessonHref(lesson)} key={lesson.key}>
                        <span className={`v2-lesson-status${complete ? ' is-complete' : ''}`}>{complete ? <Check size={15} /> : lessonIndex + 1}</span>
                        <div><strong>{lesson.label}</strong><small>{done}/{ids.length}</small></div>
                        <ArrowRight size={17} />
                      </Link>
                    )
                  })}
                </div>
              </article>
            )
          })}
        </section>
      ) : (
        <section className="v2-practice-list">
          <div className="v2-practice-intro">
            <div><span className="v2-eyebrow">PRACTICE</span><h2>{text('問題を選ぶ', '选择题目')}</h2></div>
            <Link to="/simulation/setup">{text('模擬テストへ', '进入模拟测试')} <ArrowRight size={16} /></Link>
          </div>
          {!questions.length && <div className="v2-empty-card">{text('公開中の問題はまだありません。', '暂时没有已发布题目。')}</div>}
          {questions.map((question) => (
            <article className="v2-practice-card" key={question.questionId}>
              <div className="v2-practice-card__body">
                <div className="v2-tag-row">
                  <span>{difficultyLabel(question.difficulty, language)}</span>
                  <span>rev.{question.revision}</span>
                </div>
                <h3>{question.title}</h3>
                <p>{question.taxonomy.knowledgeTags.slice(0, 3).join(' ・ ')}</p>
              </div>
              <div className="v2-practice-actions">
                <button type="button" onClick={() => startPractice(question.questionId, false)}>
                  <strong>Standard</strong><small>{text('引導つき', '正常引导')}</small>
                </button>
                <button type="button" onClick={() => startPractice(question.questionId, true)}>
                  <strong>Light</strong><small>{text('必要時だけヒント', '按需查看提示')}</small>
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
