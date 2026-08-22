import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NumberedSection, RaisedButton } from '../components/ui/Primitives'
import type { LearningVariant, Question } from '../domain/questionSchema'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { subjectLabel } from '../i18n/labels'

export function LearningSetupPage() {
  const navigate = useNavigate()
  const customQuestions = useAppStore((state) => state.customQuestions)
  const defaultSubject = useAppStore((state) => state.settings.defaultSubject)
  const startLearning = useAppStore((state) => state.startLearning)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const variants: { value: LearningVariant; label: string; description: string }[] = [
    { value: 'detailed', label: text('詳細穴埋め', '详细引导'), description: text('手順を細かく確認', '逐步确认完整过程') },
    { value: 'standard', label: text('標準穴埋め', '标准引导'), description: text('要点だけ回答', '只回答关键步骤') },
    { value: 'selfCheck', label: text('自力確認', '自主检查'), description: text('最小限の空欄', '仅保留必要填空') },
  ]
  const [subject, setSubject] = useState<Question['subject']>(defaultSubject)
  const subjectQuestions = catalog.filter((question) => question.subject === subject && question.status === 'published')
  const [questionId, setQuestionId] = useState(subjectQuestions[0]?.questionId ?? catalog[0].questionId)
  const [variant, setVariant] = useState<LearningVariant>('detailed')

  const changeSubject = (next: Question['subject']) => {
    setSubject(next)
    setQuestionId(catalog.find((question) => question.subject === next)?.questionId ?? catalog[0].questionId)
  }
  const begin = () => navigate(`/learning/session/${startLearning(questionId, variant)}`)

  return (
    <div className="page-stack">
      <header className="page-hero"><p className="eyebrow">LEARNING SETUP</p><h1>{text('学習設定', '学习设置')}</h1><p>{text('同じ解答データから、考える空欄の密度を選びます。', '同一道题可以选择不同引导强度，决定需要自己完成多少步骤。')}</p></header>
      <NumberedSection number="01" title={text('科目', '科目')}>
        <div className="segmented-control" role="group" aria-label={text('科目', '科目')}>
          {(['math-1a', 'physics'] as Question['subject'][]).map((value) => <button type="button" key={value} aria-pressed={subject === value} onClick={() => changeSubject(value)}>{subjectLabel(value, language)}</button>)}
        </div>
      </NumberedSection>
      <NumberedSection number="02" title={text('問題', '题目')}>
        <label className="field-label" htmlFor="learning-question">{text('学習する問題', '选择学习题目')}</label>
        <select id="learning-question" className="select-control" value={questionId} onChange={(event) => setQuestionId(event.target.value)}>{subjectQuestions.map((question) => <option key={question.questionId} value={question.questionId}>{question.title}</option>)}</select>
      </NumberedSection>
      <NumberedSection number="03" title={text('誘導レベル', '引导强度')}>
        <div className="choice-grid" role="radiogroup" aria-label={text('誘導レベル', '引导强度')}>
          {variants.map((item) => <button type="button" role="radio" aria-checked={variant === item.value} key={item.value} onClick={() => setVariant(item.value)}><strong>{item.label}</strong><small>{item.description}</small></button>)}
        </div>
      </NumberedSection>
      <RaisedButton type="button" className="primary-button" data-testid="start-learning" onClick={begin}>{text('この設定で学習を始める', '按此设置开始学习')}</RaisedButton>
    </div>
  )
}
