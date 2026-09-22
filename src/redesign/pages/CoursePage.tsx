import { ArrowRight, Atom, Check, Sigma } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { buildTextbookChapters, textbookLessonHref, textbookLessonItemIds } from '../../domain/textbookCatalog'
import type { PublicTextbookUnit } from '../../domain/textbookPublic'
import type { Question } from '../../domain/questionSchema'
import { textbookRepository } from '../../repositories/textbookRepository'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'

const isSubject = (value: string | null): value is Question['subject'] => value === 'math-1a' || value === 'physics'

export function CoursePage() {
  const defaultSubject = useAppStore((state) => state.settings.defaultSubject)
  const textbookProgress = useAppStore((state) => state.textbookProgress)
  const { text } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const [units, setUnits] = useState<PublicTextbookUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const subject = isSubject(searchParams.get('subject')) ? searchParams.get('subject') as Question['subject'] : defaultSubject

  useEffect(() => {
    textbookRepository.listPublished()
      .then((value) => {
        setUnits(value)
        setLoadError(false)
      })
      .catch(() => {
        setUnits([])
        setLoadError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const chapters = useMemo(() => buildTextbookChapters(units, subject), [subject, units])

  const changeSubject = (next: Question['subject']) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('subject', next)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">COURSES</span>
        <h1>{text('コース', '课程')}</h1>
        <p>{text('知識体系から直接、学びたい項目へ進みます。', '从知识体系直接进入要学习的知识点。')}</p>
      </header>

      <div className="v2-subject-switch" role="group" aria-label={text('科目', '科目')}>
        <button type="button" aria-pressed={subject === 'math-1a'} onClick={() => changeSubject('math-1a')}>
          <Sigma size={18} />数学 I・A
        </button>
        <button type="button" aria-pressed={subject === 'physics'} onClick={() => changeSubject('physics')}>
          <Atom size={18} />{text('物理', '物理')}
        </button>
      </div>

      <section className="v2-course-list">
        {loading && <div className="v2-empty-card">{text('教材を読み込んでいます…', '正在读取教材…')}</div>}
        {!loading && loadError && (
          <div className="v2-empty-card v2-empty-card--error">
            {text('教材サーバーに接続できません。しばらく待って再読み込みしてください。', '无法连接教材服务器，请稍后刷新重试。')}
          </div>
        )}
        {!loading && !loadError && !chapters.length && (
          <div className="v2-empty-card">{text('この科目の教材はまだありません。', '该科目暂时没有教材。')}</div>
        )}

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
                      <span className={`v2-lesson-status${complete ? ' is-complete' : ''}`}>
                        {complete ? <Check size={15} /> : lessonIndex + 1}
                      </span>
                      <div>
                        <strong>{lesson.label}</strong>
                        <small>{text(`${done}/${ids.length} 完了`, `${done}/${ids.length} 完成`)}</small>
                      </div>
                      <ArrowRight size={17} />
                    </Link>
                  )
                })}
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
