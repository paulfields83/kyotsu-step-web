import { BookOpenCheck, ListChecks } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NumberedSection, RaisedButton } from '../components/ui/Primitives'
import type { LearningVariant, Question } from '../domain/questionSchema'
import type { TextbookUnit } from '../domain/textbookSchema'
import { textbookRepository } from '../repositories/textbookRepository'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { subjectLabel } from '../i18n/labels'

type LearningMode = 'textbook' | 'practice'

const SHOW_GUIDANCE_LEVEL = false
const FIXED_PRACTICE_VARIANT: LearningVariant = 'detailed'

export function LearningSetupPage() {
  const navigate = useNavigate()
  const customQuestions = useAppStore((state) => state.customQuestions)
  const textbookProgress = useAppStore((state) => state.textbookProgress)
  const defaultSubject = useAppStore((state) => state.settings.defaultSubject)
  const startLearning = useAppStore((state) => state.startLearning)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const [textbookUnits, setTextbookUnits] = useState<TextbookUnit[]>([])
  const [mode, setMode] = useState<LearningMode>('textbook')
  const [subject, setSubject] = useState<Question['subject']>('physics')
  const [variant, setVariant] = useState<LearningVariant>('detailed')
  const [unitId, setUnitId] = useState('')
  const subjectQuestions = catalog.filter((question) => question.subject === subject && question.status === 'published')
  const [questionId, setQuestionId] = useState(subjectQuestions[0]?.questionId ?? catalog[0]?.questionId ?? '')

  useEffect(() => {
    textbookRepository.listPublished().then((units) => {
      setTextbookUnits(units)
      setUnitId((current) => current || units[0]?.unitId || '')
    })
  }, [])

  const variants: { value: LearningVariant; label: string; description: string }[] = [
    { value: 'detailed', label: text('詳細穴埋め', '详细引导'), description: text('手順を細かく確認', '逐步确认完整过程') },
    { value: 'standard', label: text('標準穴埋め', '标准引导'), description: text('要点だけ回答', '只回答关键步骤') },
    { value: 'selfCheck', label: text('自力確認', '自主检查'), description: text('最小限の空欄', '仅保留必要填空') },
  ]

  const changeSubject = (next: Question['subject']) => {
    setSubject(next)
    setQuestionId(catalog.find((question) => question.subject === next)?.questionId ?? '')
  }

  const changeMode = (next: LearningMode) => {
    setMode(next)
    if (next === 'textbook') setSubject('physics')
    else if (!subjectQuestions.length) changeSubject(defaultSubject)
  }

  const selectedUnitProgress = unitId ? textbookProgress[unitId] : undefined

  const begin = () => {
    if (mode === 'textbook') {
      if (unitId) navigate(`/learning/textbook/${unitId}`)
      return
    }
    if (questionId) navigate(`/learning/session/${startLearning(questionId, FIXED_PRACTICE_VARIANT)}`)
  }

  return (
    <div className="page-stack">
      <header className="page-hero">
        <p className="eyebrow">LEARNING SETUP</p>
        <h1>{text('学習設定', '学习设置')}</h1>
        <p>{text('基礎知識を順番に学ぶか、問題を解きながら考え方を身につけるかを選びます。', '选择顺序学习知识点，或通过做题掌握解题过程。')}</p>
      </header>

      <NumberedSection number="01" title={text('学習方法', '学习方式')}>
        <div className="learning-mode-grid" role="radiogroup" aria-label={text('学習方法', '学习方式')}>
          <button type="button" role="radio" aria-checked={mode === 'textbook'} onClick={() => changeMode('textbook')}>
            <BookOpenCheck aria-hidden="true" />
            <strong>{text('知識を学ぶ', '学习知识点')}</strong>
            <small>{text('教科書モード・難易度なしで順番に進む', '教科书模式・不分难度，按顺序学习')}</small>
          </button>
          <button type="button" role="radio" aria-checked={mode === 'practice'} onClick={() => changeMode('practice')}>
            <ListChecks aria-hidden="true" />
            <strong>{text('問題を解く', '做题')}</strong>
            <small>{text('現在の共通テスト型学習をそのまま使用', '继续使用现有共通测试式做题模式')}</small>
          </button>
        </div>
      </NumberedSection>

      <NumberedSection number="02" title={text('科目', '科目')}>
        <div className="segmented-control" role="group" aria-label={text('科目', '科目')}>
          {(mode === 'textbook' ? ['physics'] : ['math-1a', 'physics'] as Question['subject'][]).map((value) => (
            <button type="button" key={value} aria-pressed={subject === value} onClick={() => changeSubject(value as Question['subject'])}>{subjectLabel(value as Question['subject'], language)}</button>
          ))}
        </div>
        {mode === 'textbook' && <p className="field-help">{text('現在は物理の教科書モードを先行実装しています。', '当前先实现物理教科书模式。')}</p>}
      </NumberedSection>

      {mode === 'textbook' ? (
        <NumberedSection number="03" title={text('単元', '单元')}>
          <label className="field-label" htmlFor="textbook-unit">{text('学習する単元', '选择学习单元')}</label>
          <select id="textbook-unit" className="select-control" value={unitId} onChange={(event) => setUnitId(event.target.value)}>
            {textbookUnits.map((unit) => <option key={unit.unitId} value={unit.unitId}>{unit.title}</option>)}
          </select>
          {unitId && <div className="setup-progress-note"><span>{selectedUnitProgress ? text('続きから再開できます', '可以从上次进度继续') : text('最初から開始', '从头开始')}</span><small>{text('難易度選択はありません。教材の順番どおりに進みます。', '没有难度选择，按教材顺序学习。')}</small></div>}
        </NumberedSection>
      ) : (
        <>
          <NumberedSection number="03" title={text('問題', '题目')}>
            <label className="field-label" htmlFor="learning-question">{text('学習する問題', '选择学习题目')}</label>
            <select id="learning-question" className="select-control" value={questionId} onChange={(event) => setQuestionId(event.target.value)}>
              {subjectQuestions.map((question) => <option key={question.questionId} value={question.questionId}>{question.title}</option>)}
            </select>
          </NumberedSection>
          {SHOW_GUIDANCE_LEVEL && (
            <NumberedSection number="04" title={text('誘導レベル', '引导强度')}>
              <div className="choice-grid" role="radiogroup" aria-label={text('誘導レベル', '引导强度')}>
                {variants.map((item) => <button type="button" role="radio" aria-checked={variant === item.value} key={item.value} onClick={() => setVariant(item.value)}><strong>{item.label}</strong><small>{item.description}</small></button>)}
              </div>
            </NumberedSection>
          )}
        </>
      )}

      <RaisedButton type="button" className="primary-button" data-testid="start-learning" disabled={mode === 'textbook' ? !unitId : !questionId} onClick={begin}>
        {mode === 'textbook' ? text(selectedUnitProgress ? '続きから学ぶ' : '教科書モードを始める', selectedUnitProgress ? '继续学习' : '开始教科书模式') : text('この設定で問題を解く', '按此设置开始做题')}
      </RaisedButton>
    </div>
  )
}
