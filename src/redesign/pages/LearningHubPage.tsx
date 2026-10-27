import { ArrowLeft, ArrowRight, Atom, BookOpen, Check, ListChecks, Sigma } from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildTextbookChapters, textbookLessonHref, textbookLessonItemIds, type TextbookLessonTarget } from '../../domain/textbookCatalog'
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
  const [selectedPracticeCategory, setSelectedPracticeCategory] = useState<string | null>(null)

  useEffect(() => {
    textbookRepository.listPublished()
      .then((value) => setUnits(value))
      .catch(() => setUnits([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (mode !== 'practice' || practiceMode !== 'practice') return
    let cancelled = false
    setPracticeLoading(true)
    setPracticeError(false)
    setPracticeCatalogs([])
    setPracticeQuestions([])
    // Load all available categories and questions. Choosing a subject is the
    // only filter: learners no longer need major/minor dropdowns to see topics.
    Promise.all([
      practiceRepository.listCatalog({ subject }),
      practiceRepository.listQuestions({ subject }),
    ]).then(([catalogs, questions]) => {
      if (cancelled) return
      setPracticeCatalogs(catalogs)
      setPracticeQuestions(questions)
    }).catch(() => {
      if (cancelled) return
      setPracticeCatalogs([])
      setPracticeQuestions([])
      setPracticeError(true)
    }).finally(() => {
      if (!cancelled) setPracticeLoading(false)
    })
    return () => { cancelled = true }
  }, [mode, practiceMode, subject])

  const chapters = useMemo(() => buildTextbookChapters(units, subject), [subject, units])
  const sortedPracticeCatalogs = useMemo(() => [...practiceCatalogs]
    .sort((a, b) => a.majorUnit.order - b.majorUnit.order), [practiceCatalogs])
  const practiceQuestionGroups = useMemo(() => {
    const grouped = new Map<string, PracticeQuestionSummary[]>()
    for (const question of practiceQuestions) {
      const key = `${question.majorUnit}/${question.subcategory}`
      grouped.set(key, [...(grouped.get(key) ?? []), question])
    }
    return grouped
  }, [practiceQuestions])
  // Keep only the THREE (or however many are actually returned by the API)
  // category titles in the outer list. Questions render only inside a chosen
  // category as topic tiles, matching the textbook navigation.
  const practiceCategories = useMemo(() => sortedPracticeCatalogs.flatMap((catalog) =>
    [...catalog.subcategories].sort((a, b) => a.order - b.order).map((subcategory) => {
      const key = `${catalog.majorUnit.id}/${subcategory.id}`
      return {
        key,
        majorLabel: catalog.majorUnit.label,
        title: subcategory.label,
        questions: practiceQuestionGroups.get(key) ?? [],
      }
    }),
  ), [sortedPracticeCatalogs, practiceQuestionGroups])
  const selectedCategory = practiceCategories.find((category) => category.key === selectedPracticeCategory)

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">LEARN</span>
        <h1>{text('学習', '学习')}</h1>
        <p>{text('知識を読むか、問題を解くか。必要な場所へ直接進めます。', '读知识点或直接做题，一步进入需要的内容。')}</p>
      </header>

      <div className="v2-subject-switch">
        <button type="button" aria-pressed={subject === 'math-1a'} onClick={() => { setSubject('math-1a'); setSelectedPracticeCategory(null) }}><Sigma size={18} />数学 I・A</button>
        <button type="button" aria-pressed={subject === 'physics'} onClick={() => { setSubject('physics'); setSelectedPracticeCategory(null) }}><Atom size={18} />{text('物理', '物理')}</button>
      </div>

      <div className="v2-mode-switch">
        <button type="button" aria-pressed={mode === 'knowledge'} onClick={() => { setMode('knowledge'); setSelectedPracticeCategory(null) }}><BookOpen size={17} />{text('知識学習', '知识学习')}</button>
        <button type="button" aria-pressed={mode === 'practice'} onClick={() => { setMode('practice'); setSelectedPracticeCategory(null) }}><ListChecks size={17} />{text('問題練習', '题目练习')}</button>
      </div>

      {mode === 'knowledge' ? (
        <section className="v2-course-list">
          {loading && <div className="v2-empty-card">{text('教材を読み込んでいます…', '正在读取教材…')}</div>}
          {!loading && !chapters.length && <div className="v2-empty-card">{text('この科目の教材はまだありません。', '该科目暂时没有教材。')}</div>}
          {chapters.map((chapter, chapterIndex) => {
            const lessonStats = (lesson:TextbookLessonTarget):{total:number;done:number} => {
              if (lesson.kind === 'chapter-group') {
                return (lesson.topics ?? []).reduce((total,topic) => {
                  const next=lessonStats(topic)
                  return {total:total.total+next.total,done:total.done+next.done}
                }, {total:0,done:0})
              }
              const sources = lesson.kind === 'cross-unit-group'
                ? (lesson.sectionRefs ?? []).map(ref=>{
                    const unit = units.find(candidate=>candidate.unitId===ref.unitId)
                    return {ids:unit?.sections.find(sec=>sec.id===ref.sectionId)?.items.map(item=>item.id) ?? [],
                      progress:textbookProgress[ref.unitId]}
                  })
                : [{ids:textbookLessonItemIds(units.find(candidate=>candidate.unitId===lesson.unitId),lesson),
                    progress:textbookProgress[lesson.unitId]}]
              return {total:sources.reduce((n,source)=>n+source.ids.length,0),
                done:sources.reduce((n,source)=>n+source.ids.filter(id=>source.progress?.answers[id]?.resolved).length,0)}
            }
            const totalItems = chapter.lessons.reduce((n,lesson)=>n+lessonStats(lesson).total,0)
            const completed = chapter.lessons.reduce((n,lesson)=>n+lessonStats(lesson).done,0)
            const percent = totalItems ? Math.round((completed / totalItems) * 100) : 0
            return (
              <article className="v2-course-card" key={chapter.key}>
                <header>
                  <div className="v2-course-card__number">{String(chapterIndex + 1).padStart(2, '0')}</div>
                  <div>
                    <h2>{chapter.label}</h2>
                    <p>{text(`${completed} / ${totalItems} 項目完了`, `已完成 ${completed} / ${totalItems} 项`)}</p>
                  </div>
                  <strong>{percent}%</strong>
                </header>
                <div className="v2-progress-line v2-progress-line--small"><span style={{ width: `${percent}%` }} /></div>
                <div className="v2-lesson-list">
                  {chapter.lessons.map((lesson, lessonIndex) => {
                    const stats = lessonStats(lesson)
                    const complete = stats.total > 0 && stats.done === stats.total
                    return (
                      <Fragment key={lesson.key}>
                        {lesson.group && lesson.kind !== 'chapter-group' && (lessonIndex === 0 || chapter.lessons[lessonIndex - 1]?.group !== lesson.group) && (
                          <h3 className="reading-topic-title">{lesson.group}</h3>
                        )}
                        <Link to={textbookLessonHref(lesson)}>
                        <span className={`v2-lesson-status${complete ? ' is-complete' : ''}`}>{complete ? <Check size={15} /> : lessonIndex + 1}</span>
                        <div><strong>{lesson.label}</strong><small>{stats.done}/{stats.total}</small></div>
                          <ArrowRight size={17} />
                        </Link>
                      </Fragment>
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
            <button type="button" aria-pressed={practiceMode === 'practice'} onClick={() => { setPracticeMode('practice'); setSelectedPracticeCategory(null) }}>
              <ListChecks size={17} />{text('練習', '练习')}
            </button>
            <button type="button" aria-pressed={practiceMode === 'simulation'} onClick={() => { setPracticeMode('simulation'); setSelectedPracticeCategory(null) }}>
              {text('模擬テスト', '模拟测试')}
            </button>
          </div>

          {practiceMode === 'practice' ? (
            <section className="v2-course-list v2-practice-courses" data-testid="practice-category-navigation">
              {practiceError && <div className="v2-empty-card">
                {text('問題練習 API に接続できません。', '无法连接题目练习后端。')}
              </div>}
              {practiceLoading && <div className="v2-empty-card">
                {text('問題一覧を読み込んでいます…', '正在读取练习题列表…')}
              </div>}
              {!practiceLoading && !practiceError && practiceCategories.length === 0 && (
                <div className="v2-empty-card">
                  {text('この科目の練習問題はまだ登録されていません。', '该科目的练习题目前尚未导入。')}
                </div>
              )}
              {!practiceLoading && !practiceError && !selectedCategory && sortedPracticeCatalogs.map((catalog, chapterIndex) => {
                const categories = practiceCategories.filter((category) =>
                  category.key.startsWith(`${catalog.majorUnit.id}/`))
                return (
                  <article className="v2-course-card v2-practice-course-card" key={catalog.majorUnit.id}>
                    <header>
                      <div className="v2-course-card__number">{String(chapterIndex + 1).padStart(2, '0')}</div>
                      <div>
                        <h2>{catalog.majorUnit.label}</h2>
                        <p>{text('練習する項目を選ぶ', '选择要练习的章节')}</p>
                      </div>
                    </header>
                    <div className="v2-practice-category-list" data-testid="practice-category-list">
                      {categories.map((category, index) => (
                        <button type="button" key={category.key}
                          className="v2-practice-category-row"
                          data-testid={`practice-category-${index + 1}`}
                          onClick={() => setSelectedPracticeCategory(category.key)}>
                          <span className="v2-lesson-status">{index + 1}</span>
                          <span className="v2-practice-category-label">
                            <strong>{category.title}</strong>
                            <small>{text(`${category.questions.length} 問題`, `${category.questions.length} 道题`)}</small>
                          </span>
                          <ArrowRight size={17} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </article>
                )
              })}
              {!practiceLoading && !practiceError && selectedCategory && (
                <section className="v2-practice-topic-page" data-testid="practice-topic-page">
                  <button type="button" className="v2-practice-topic-back"
                    onClick={() => setSelectedPracticeCategory(null)}>
                    <ArrowLeft size={17} />
                    {text('分野一覧へ戻る', '返回分类列表')}
                  </button>
                  <div className="v2-practice-topic-heading">
                    <small>{selectedCategory.majorLabel}</small>
                    <h2>{selectedCategory.title}</h2>
                    <p>{text(`${selectedCategory.questions.length} 問題`, `共 ${selectedCategory.questions.length} 道题`)}</p>
                  </div>
                  {selectedCategory.questions.length ? (
                    <div className="v2-practice-topic-grid" data-testid="practice-question-tiles">
                      {selectedCategory.questions.map((question, index) => (
                        <Link key={question.questionId}
                          to={`/practice/session/${question.questionId}`}
                          className="v2-practice-topic-tile">
                          <span className="v2-practice-topic-index">{index + 1}</span>
                          <strong>{question.title}</strong>
                          <small>{difficultyLabel(question.difficulty, language)}</small>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="v2-empty-card">
                      {text('この分類の問題はまだ準備中です。', '这一分类的题目尚未准备好。')}
                    </div>
                  )}
                </section>
              )}
            </section>
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
