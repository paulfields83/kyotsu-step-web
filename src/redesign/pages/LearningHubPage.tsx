import { ArrowRight, Atom, BookOpen, Check, ListChecks, Sigma } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { buildTextbookChapters, textbookLessonHref, textbookLessonItemIds } from '../../domain/textbookCatalog'
import type { PublicTextbookUnit } from '../../domain/textbookPublic'
import type { PracticeCatalog, PracticeQuestionSummary } from '../../domain/practice'
import type { Question } from '../../domain/questionSchema'
import { practiceRepository } from '../../repositories/practiceRepository'
import { textbookRepository } from '../../repositories/textbookRepository'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'
import { difficultyLabel } from '../../i18n/labels'

type Mode = 'knowledge' | 'practice'
type PracticeMode = 'practice' | 'simulation'

export function LearningHubPage() {
  const navigate = useNavigate()
  const defaultSubject = useAppStore((state) => state.settings.defaultSubject)
  const textbookProgress = useAppStore((state) => state.textbookProgress)
  const { language, text } = useI18n()
  const [units, setUnits] = useState<PublicTextbookUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState<Question['subject']>(defaultSubject)
  const [mode, setMode] = useState<Mode>('knowledge')
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('practice')
  const [practiceCatalogs, setPracticeCatalogs] = useState<PracticeCatalog[]>([])
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestionSummary[]>([])
  const [practiceLoading, setPracticeLoading] = useState(false)
  const [practiceError, setPracticeError] = useState(false)
  const [majorUnitId, setMajorUnitId] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')

  useEffect(() => {
    textbookRepository.listPublished()
      .then((value) => setUnits(value))
      .catch(() => setUnits([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (mode !== 'practice' || practiceMode !== 'practice') return
    setPracticeLoading(true)
    setPracticeError(false)
    practiceRepository.listCatalog({ subject })
      .then((catalogs) => {
        setPracticeCatalogs(catalogs)
        const selectedMajor = catalogs.find((catalog) => catalog.majorUnit.id === majorUnitId) ?? catalogs[0]
        const nextMajorId = selectedMajor?.majorUnit.id ?? ''
        setMajorUnitId(nextMajorId)
        const preferredSubcategory = selectedMajor?.subcategories.find((subcategory) => subcategory.id === subcategoryId)
          ?? selectedMajor?.subcategories.find((subcategory) => subcategory.questionCount > 0)
          ?? selectedMajor?.subcategories[0]
        setSubcategoryId(preferredSubcategory?.id ?? '')
      })
      .catch(() => {
        setPracticeCatalogs([])
        setPracticeQuestions([])
        setPracticeError(true)
      })
      .finally(() => setPracticeLoading(false))
  }, [majorUnitId, mode, practiceMode, subcategoryId, subject])

  useEffect(() => {
    if (mode !== 'practice' || practiceMode !== 'practice' || !majorUnitId || !subcategoryId) {
      setPracticeQuestions([])
      return
    }
    setPracticeLoading(true)
    setPracticeError(false)
    practiceRepository.listQuestions({ subject, majorUnit: majorUnitId, subcategory: subcategoryId })
      .then(setPracticeQuestions)
      .catch(() => {
        setPracticeQuestions([])
        setPracticeError(true)
      })
      .finally(() => setPracticeLoading(false))
  }, [majorUnitId, mode, practiceMode, subcategoryId, subject])

  const chapters = useMemo(() => buildTextbookChapters(units, subject), [subject, units])
  const selectedPracticeCatalog = practiceCatalogs.find((catalog) => catalog.majorUnit.id === majorUnitId) ?? practiceCatalogs[0]
  const selectedSubcategory = selectedPracticeCatalog?.subcategories.find((subcategory) => subcategory.id === subcategoryId)
  const problemTypeLabels = useMemo(() => new Map(
    selectedSubcategory?.problemTypes.map((problemType) => [problemType.id, problemType.label]) ?? [],
  ), [selectedSubcategory])

  const changeMajorUnit = (nextMajorUnitId: string) => {
    const catalog = practiceCatalogs.find((candidate) => candidate.majorUnit.id === nextMajorUnitId)
    setMajorUnitId(nextMajorUnitId)
    const nextSubcategory = catalog?.subcategories.find((subcategory) => subcategory.questionCount > 0) ?? catalog?.subcategories[0]
    setSubcategoryId(nextSubcategory?.id ?? '')
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
          <div className="v2-mode-switch" role="group" aria-label={text('問題練習の種類', '题目练习类型')}>
            <button type="button" aria-pressed={practiceMode === 'practice'} onClick={() => setPracticeMode('practice')}>
              <ListChecks size={17} />{text('練習', '练习')}
            </button>
            <button type="button" aria-pressed={practiceMode === 'simulation'} onClick={() => setPracticeMode('simulation')}>
              {text('模擬テスト', '模拟测试')}
            </button>
          </div>

          {practiceMode === 'practice' ? (
            <>
              <div className="v2-practice-intro">
                <div>
                  <span className="v2-eyebrow">PRACTICE / BACKEND</span>
                  <h2>{text('単元と小分類を選ぶ', '选择大类与小类别')}</h2>
                </div>
              </div>

              {practiceError && <div className="v2-empty-card">{text('問題練習 API に接続できません。', '无法连接题目练习后端。')}</div>}
              {practiceLoading && !practiceCatalogs.length && <div className="v2-empty-card">{text('問題分類を読み込んでいます…', '正在读取题目分类…')}</div>}
              {!practiceLoading && !practiceError && !practiceCatalogs.length && <div className="v2-empty-card">{text('この科目の普通練習はまだありません。', '该科目暂时没有普通练习。')}</div>}

              {practiceCatalogs.length > 0 && (
                <div className="practice-taxonomy-controls">
                  <label className="field-label" htmlFor="practice-major-unit">{text('大分類', '大类')}</label>
                  <select id="practice-major-unit" className="select-control" value={majorUnitId} onChange={(event) => changeMajorUnit(event.target.value)}>
                    {practiceCatalogs.map((catalog) => <option key={catalog.majorUnit.id} value={catalog.majorUnit.id}>{catalog.majorUnit.label}</option>)}
                  </select>

                  <label className="field-label" htmlFor="practice-subcategory">{text('小分類', '小类别')}</label>
                  <select id="practice-subcategory" className="select-control" value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)}>
                    {selectedPracticeCatalog?.subcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>{subcategory.label} ({subcategory.questionCount})</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedSubcategory && (
                <div className="v2-practice-intro">
                  <div><span className="v2-eyebrow">{selectedPracticeCatalog?.majorUnit.label}</span><h2>{selectedSubcategory.label}</h2></div>
                </div>
              )}

              {!practiceLoading && selectedSubcategory && !practiceQuestions.length && (
                <div className="v2-empty-card">{text('この小分類の問題はまだ量産前です。', '这个小类别的题目还未开始量产。')}</div>
              )}

              {practiceQuestions.map((question) => (
                <article className="v2-practice-card" key={question.questionId}>
                  <div className="v2-practice-card__body">
                    <div className="v2-tag-row">
                      <span>{difficultyLabel(question.difficulty, language)}</span>
                      <span>{problemTypeLabels.get(question.problemType) ?? question.problemType}</span>
                      <span>rev.{question.revision}</span>
                    </div>
                    <h3>{question.title}</h3>
                    <p>{question.source.label}</p>
                  </div>
                  <div className="v2-practice-actions">
                    <button type="button" onClick={() => navigate(`/practice/session/${question.questionId}`)}>
                      <strong>{text('問題を解く', '开始练习')}</strong>
                      <small>{text('後端の引導データで進む', '读取后端引导数据作答')}</small>
                    </button>
                  </div>
                </article>
              ))}
            </>
          ) : (
            <div className="v2-empty-card">
              <p>{text('模擬テストでは、回答中に正解や解析を表示しません。', '模拟测试中，作答时不显示答案和解析。')}</p>
              <Link className="v2-primary-action" to="/simulation/setup">
                {text('模擬テストを設定', '设置模拟测试')} <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
