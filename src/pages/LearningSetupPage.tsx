import { BookOpenCheck, ListChecks } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NumberedSection, RaisedButton } from '../components/ui/Primitives'
import type { LearningVariant, Question } from '../domain/questionSchema'
import { buildTextbookChapters, textbookLessonHref, textbookLessonItemIds } from '../domain/textbookCatalog'
import type { PublicTextbookUnit } from '../domain/textbookPublic'
import { textbookRepository } from '../repositories/textbookRepository'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { subjectLabel } from '../i18n/labels'

type LearningMode = 'textbook' | 'practice'
const SHOW_GUIDANCE_LEVEL = false
const FIXED_PRACTICE_VARIANT: LearningVariant = 'detailed'
const SUBJECTS: Question['subject'][] = ['math-1a', 'physics']

export function LearningSetupPage() {
  const navigate = useNavigate()
  const customQuestions = useAppStore((state) => state.customQuestions)
  const textbookProgress = useAppStore((state) => state.textbookProgress)
  const defaultSubject = useAppStore((state) => state.settings.defaultSubject)
  const startLearning = useAppStore((state) => state.startLearning)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const [textbookUnits, setTextbookUnits] = useState<PublicTextbookUnit[]>([])
  const [textbookLoadError, setTextbookLoadError] = useState(false)
  const [mode, setMode] = useState<LearningMode>('textbook')
  const [subject, setSubject] = useState<Question['subject']>('physics')
  const [variant, setVariant] = useState<LearningVariant>('detailed')
  const [chapterKey, setChapterKey] = useState('')
  const [lessonKey, setLessonKey] = useState('')
  const subjectQuestions = catalog.filter((q) => q.subject === subject && q.status === 'published')
  const textbookChapters = useMemo(() => buildTextbookChapters(textbookUnits, subject), [textbookUnits, subject])
  const selectedChapter = textbookChapters.find((chapter) => chapter.key === chapterKey) ?? textbookChapters[0]
  const selectedLesson = selectedChapter?.lessons.find((lesson) => lesson.key === lessonKey) ?? selectedChapter?.lessons[0]
  const selectedUnit = selectedLesson ? textbookUnits.find((unit) => unit.unitId === selectedLesson.unitId) : undefined
  const selectedUnitProgress = selectedUnit ? textbookProgress[selectedUnit.unitId] : undefined
  const selectedItemIds = textbookLessonItemIds(selectedUnit, selectedLesson)
  const selectedCompleted = selectedItemIds.filter((itemId) => selectedUnitProgress?.answers[itemId]?.resolved).length
  const selectedStarted = selectedItemIds.some((itemId) => selectedUnitProgress?.answers[itemId])
  const [questionId, setQuestionId] = useState(subjectQuestions[0]?.questionId ?? catalog[0]?.questionId ?? '')

  useEffect(() => {
    textbookRepository.listPublished().then((units) => {
      setTextbookLoadError(false)
      setTextbookUnits(units)
    }).catch(() => {
      setTextbookLoadError(true)
      setTextbookUnits([])
    })
  }, [])

  useEffect(() => {
    if (!textbookChapters.length) {
      setChapterKey('')
      setLessonKey('')
      return
    }
    const nextChapter = textbookChapters.find((chapter) => chapter.key === chapterKey) ?? textbookChapters[0]
    const nextLesson = nextChapter.lessons.find((lesson) => lesson.key === lessonKey) ?? nextChapter.lessons[0]
    if (nextChapter.key !== chapterKey) setChapterKey(nextChapter.key)
    if ((nextLesson?.key ?? '') !== lessonKey) setLessonKey(nextLesson?.key ?? '')
  }, [chapterKey, lessonKey, textbookChapters])

  const variants = [
    { value: 'detailed' as LearningVariant, label: text('詳細穴埋め', '详细引导'), description: text('手順を細かく確認', '逐步确认完整过程') },
    { value: 'standard' as LearningVariant, label: text('標準穴埋め', '标准引导'), description: text('要点だけ回答', '只回答关键步骤') },
    { value: 'selfCheck' as LearningVariant, label: text('自力確認', '自主检查'), description: text('最小限の空欄', '仅保留必要填空') },
  ]

  const changeSubject = (next: Question['subject']) => {
    setSubject(next)
    setQuestionId(catalog.find((q) => q.subject === next)?.questionId ?? '')
    setChapterKey('')
    setLessonKey('')
  }

  const changeMode = (next: LearningMode) => {
    setMode(next)
    if (next === 'practice' && !subjectQuestions.length) changeSubject(defaultSubject)
  }

  const changeChapter = (nextChapterKey: string) => {
    const chapter = textbookChapters.find((candidate) => candidate.key === nextChapterKey)
    setChapterKey(nextChapterKey)
    setLessonKey(chapter?.lessons[0]?.key ?? '')
  }

  const begin = () => {
    if (mode === 'textbook') {
      if (selectedLesson) navigate(textbookLessonHref(selectedLesson))
    } else if (questionId) {
      navigate(`/learning/session/${startLearning(questionId, FIXED_PRACTICE_VARIANT)}`)
    }
  }

  return <div className="page-stack learning-setup-page">
    <header className="page-hero">
      <p className="eyebrow">LEARNING SETUP</p>
      <h1>{text('学習設定', '学习设置')}</h1>
      <p>{text('基礎知識を順番に学ぶか、問題を解きながら考え方を身につけるかを選びます。', '选择顺序学习知识点，或通过做题掌握解题过程。')}</p>
    </header>

    <NumberedSection number="01" title={text('学習方法', '学习方式')}>
      <div className="learning-mode-grid" role="radiogroup" aria-label={text('学習方法', '学习方式')}>
        <button type="button" role="radio" aria-checked={mode === 'textbook'} onClick={() => changeMode('textbook')}>
          <BookOpenCheck aria-hidden="true" /><strong>{text('知識を学ぶ', '学习知识点')}</strong><small>{text('教科書モード・難易度なしで順番に進む', '教科书模式・不分难度，按顺序学习')}</small>
        </button>
        <button type="button" role="radio" aria-checked={mode === 'practice'} onClick={() => changeMode('practice')}>
          <ListChecks aria-hidden="true" /><strong>{text('問題を解く', '做题')}</strong><small>{text('現在の共通テスト型学習をそのまま使用', '继续使用现有共通测试式做题模式')}</small>
        </button>
      </div>
    </NumberedSection>

    <NumberedSection number="02" title={text('科目', '科目')}>
      <div className="segmented-control" role="group" aria-label={text('科目', '科目')}>
        {SUBJECTS.map((value) => <button type="button" key={value} aria-pressed={subject === value} onClick={() => changeSubject(value)}>{subjectLabel(value, language)}</button>)}
      </div>
      {mode === 'textbook' && <p className="field-help">{text('数学 I・A と物理を分けて学習範囲を選択できます。', '数学 I・A 和物理分开选择学习范围。')}</p>}
    </NumberedSection>

    {mode === 'textbook' ? <>
      <NumberedSection number="03" title={text('単元', '单元')}>
        {textbookLoadError ? <div className="issue-box" role="alert">{text('教材 API に接続できません。バックエンドを起動し、VITE_API_BASE_URL を確認してください。', '无法连接教材 API。请启动后端并检查 VITE_API_BASE_URL。')}</div>
          : textbookChapters.length === 0 ? <div className="issue-box">{text('この科目の教材はまだありません。', '该科目暂时没有教材。')}</div>
          : <>
            <label className="field-label" htmlFor="textbook-chapter">{text('学習する単元', '选择单元')}</label>
            <select id="textbook-chapter" className="select-control" value={selectedChapter?.key ?? ''} onChange={(event) => changeChapter(event.target.value)}>
              {textbookChapters.map((chapter) => <option key={chapter.key} value={chapter.key}>{chapter.label}</option>)}
            </select>
          </>}
      </NumberedSection>

      <NumberedSection number="04" title={text('学習項目', '学习部分')}>
        {!selectedChapter ? <div className="issue-box">{text('先に単元を選んでください。', '请先选择单元。')}</div>
          : <>
            <label className="field-label" htmlFor="textbook-lesson">{text('学習する項目', '选择学习部分')}</label>
            <select id="textbook-lesson" className="select-control" value={selectedLesson?.key ?? ''} onChange={(event) => setLessonKey(event.target.value)}>
              {selectedChapter.lessons.map((lesson) => <option key={lesson.key} value={lesson.key}>{lesson.label}</option>)}
            </select>
            {selectedLesson && <div className="setup-progress-note"><span>{selectedStarted ? text('続きから再開できます', '可以从上次进度继续') : text('最初から開始', '从头开始')}</span><small>{text(`${selectedCompleted}/${selectedItemIds.length} の確認項目を完了`, `已完成 ${selectedCompleted}/${selectedItemIds.length} 个确认项目`)}</small></div>}
          </>}
      </NumberedSection>
    </> : <>
      <NumberedSection number="03" title={text('問題', '题目')}>
        <label className="field-label" htmlFor="learning-question">{text('学習する問題', '选择学习题目')}</label>
        <select id="learning-question" className="select-control" value={questionId} onChange={(event) => setQuestionId(event.target.value)}>
          {subjectQuestions.map((question) => <option key={question.questionId} value={question.questionId}>{question.title}</option>)}
        </select>
      </NumberedSection>
      {SHOW_GUIDANCE_LEVEL && <NumberedSection number="04" title={text('誘導レベル', '引导强度')}><div className="choice-grid" role="radiogroup" aria-label={text('誘導レベル', '引导强度')}>{variants.map((item) => <button type="button" role="radio" aria-checked={variant === item.value} key={item.value} onClick={() => setVariant(item.value)}><strong>{item.label}</strong><small>{item.description}</small></button>)}</div></NumberedSection>}
    </>}

    <RaisedButton type="button" className="primary-button" data-testid="start-learning" disabled={mode === 'textbook' ? !selectedLesson : !questionId} onClick={begin}>
      {mode === 'textbook' ? text(selectedStarted ? '続きから学ぶ' : '教科書モードを始める', selectedStarted ? '继续学习' : '开始教科书模式') : text('この設定で問題を解く', '按此设置开始做题')}
    </RaisedButton>
  </div>
}
