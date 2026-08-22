import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, NumberedSection, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import type { Question } from '../domain/questionSchema'
import type { SimulationSession } from '../domain/attempts'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { difficultyLabel, subjectLabel, taxonomyLabel } from '../i18n/labels'

type Strategy = 'range' | 'selected-priority' | 'exclude' | 'weakness'

export function SimulationSetupPage() {
  const navigate = useNavigate()
  const customQuestions = useAppStore((state) => state.customQuestions)
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const defaultSubject = useAppStore((state) => state.settings.defaultSubject)
  const startSimulation = useAppStore((state) => state.startSimulation)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const [subject, setSubject] = useState<Question['subject']>(defaultSubject)
  const [count, setCount] = useState(1)
  const [difficulty, setDifficulty] = useState<'all' | Question['difficulty']>('all')
  const [majorUnit, setMajorUnit] = useState('all')
  const [timeMode, setTimeMode] = useState<SimulationSession['timeMode']>('unlimited')
  const [strategy, setStrategy] = useState<Strategy>('range')

  const subjectQuestions = catalog.filter((question) => question.subject === subject && question.status === 'published')
  const units = [...new Set(subjectQuestions.map((question) => question.taxonomy.majorUnit))]
  const wrongCounts = new Map<string, number>()
  learningAttempts.forEach((attempt) => {
    const wrong = Object.values(attempt.answers).filter((answer) => !answer.isFirstCorrect).length
    wrongCounts.set(attempt.questionId, (wrongCounts.get(attempt.questionId) ?? 0) + wrong)
  })
  const available = subjectQuestions
    .filter((question) => difficulty === 'all' || question.difficulty === difficulty)
    .filter((question) => majorUnit === 'all' || (strategy === 'exclude' ? question.taxonomy.majorUnit !== majorUnit : question.taxonomy.majorUnit === majorUnit))
    .sort((a, b) => strategy === 'weakness' ? (wrongCounts.get(b.questionId) ?? 0) - (wrongCounts.get(a.questionId) ?? 0) : strategy === 'selected-priority' && majorUnit !== 'all' ? Number(b.taxonomy.majorUnit === majorUnit) - Number(a.taxonomy.majorUnit === majorUnit) : 0)
  const selected = available.slice(0, count)
  const begin = () => selected.length && navigate(`/simulation/session/${startSimulation(selected.map((question) => question.questionId), timeMode)}`)

  return (
    <div className="page-stack">
      <header className="page-hero"><p className="eyebrow">SIMULATION SETUP</p><h1>{text('模擬テスト設定', '模拟测试设置')}</h1><p>{text('範囲と時間を決め、フィードバックなしで取り組みます。', '选择范围和时间，在没有即时提示的条件下完成测试。')}</p></header>
      <NumberedSection number="01" title={text('科目と問題数', '科目与题目数')}>
        <div className="segmented-control" role="group" aria-label={text('模擬テスト科目', '模拟测试科目')}>{(['math-1a', 'physics'] as Question['subject'][]).map((value) => <button type="button" key={value} aria-pressed={subject === value} onClick={() => { setSubject(value); setMajorUnit('all'); setDifficulty('all') }}>{subjectLabel(value, language)}</button>)}</div>
        <label className="field-label" htmlFor="simulation-count">{text('問題数', '题目数')}</label>
        <select id="simulation-count" className="select-control" value={count} onChange={(event) => setCount(Number(event.target.value))}><option value={1}>1 {text('問', '题')}</option><option value={2}>2 {text('問', '题')}</option></select>
      </NumberedSection>
      <NumberedSection number="02" title={text('範囲と難易度', '范围与难度')}>
        <label className="field-label" htmlFor="simulation-unit">{text('範囲', '范围')}</label>
        <select id="simulation-unit" className="select-control" value={majorUnit} onChange={(event) => setMajorUnit(event.target.value)}><option value="all">{text('全範囲', '全部范围')}</option>{units.map((unit) => <option value={unit} key={unit}>{taxonomyLabel(unit, language)}</option>)}</select>
        <label className="field-label" htmlFor="simulation-difficulty">{text('難易度', '难度')}</label>
        <select id="simulation-difficulty" className="select-control" value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}><option value="all">{text('すべて', '全部')}</option>{(['basic', 'standard', 'advanced', 'exam'] as Question['difficulty'][]).map((value) => <option value={value} key={value}>{difficultyLabel(value, language)}</option>)}</select>
        <label className="field-label" htmlFor="simulation-strategy">{text('出題方法', '出题方式')}</label>
        <select id="simulation-strategy" className="select-control" value={strategy} onChange={(event) => setStrategy(event.target.value as Strategy)}><option value="range">{text('指定範囲', '指定范围')}</option><option value="selected-priority">{text('選択範囲を優先', '优先所选范围')}</option><option value="exclude">{text('選択範囲を除外', '排除所选范围')}</option><option value="weakness">{text('弱点中心', '薄弱点优先')}</option></select>
      </NumberedSection>
      <NumberedSection number="03" title={text('時間', '时间')}>
        <div className="choice-grid" role="radiogroup" aria-label={text('時間モード', '计时模式')}>
          {([{ value: 'unlimited', label: text('時間制限なし', '不限时') }, { value: 'exam-1.2', label: text('本番の 1.2 倍', '正式时长的 1.2 倍') }, { value: 'exam', label: text('本番時間', '正式考试时长') }] as const).map((item) => <button type="button" role="radio" aria-checked={timeMode === item.value} key={item.value} onClick={() => setTimeMode(item.value)}><strong>{item.label}</strong></button>)}
        </div>
      </NumberedSection>
      <NumberedSection number="04" title={text('出題予定', '预计出题')}>
        {selected.length ? <div className="selected-question-list">{selected.map((question) => <div key={question.questionId}><strong>{question.title}</strong><StatusBadge>{difficultyLabel(question.difficulty, language)}</StatusBadge></div>)}</div> : <EmptyState title={text('条件に合う問題がありません', '没有符合条件的题目')} body={text('範囲か難易度を変更してください。', '请调整范围或难度。')} />}
      </NumberedSection>
      <RaisedButton type="button" className="primary-button" data-testid="start-simulation" disabled={!selected.length} onClick={begin}>{text('模擬テストを始める', '开始模拟测试')}</RaisedButton>
    </div>
  )
}
