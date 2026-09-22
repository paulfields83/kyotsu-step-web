import { ArrowRight, Atom, Clock3, ListChecks, Sigma } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Question } from '../../domain/questionSchema'
import { getQuestionCatalog, useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'
import { difficultyLabel } from '../../i18n/labels'

export function PracticePage() {
  const navigate = useNavigate()
  const defaultSubject = useAppStore((state) => state.settings.defaultSubject)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const startLearning = useAppStore((state) => state.startLearning)
  const { language, text } = useI18n()
  const [subject, setSubject] = useState<Question['subject']>(defaultSubject)
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const questions = useMemo(
    () => catalog.filter((question) => question.subject === subject && question.status === 'published'),
    [catalog, subject],
  )

  const startPractice = (questionId: string, light: boolean) => {
    const variant = light ? 'selfCheck' : 'standard'
    navigate(`/learning/session/${startLearning(questionId, variant)}`)
  }

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">PRACTICE</span>
        <h1>{text('練習', '练习')}</h1>
        <p>{text('問題を選び、Standard または Light ですぐ始めます。', '选择题目后，直接用 Standard 或 Light 开始。')}</p>
      </header>

      <Link className="v2-simulation-card" to="/simulation/setup">
        <span className="v2-simulation-card__icon"><Clock3 size={21} /></span>
        <div>
          <span className="v2-eyebrow">SIMULATION</span>
          <strong>{text('模擬テスト', '模拟测试')}</strong>
          <small>{text('ヒントなしで現在の実力を確認', '无提示检查当前水平')}</small>
        </div>
        <ArrowRight size={18} />
      </Link>

      <div className="v2-subject-switch v2-subject-switch--spaced" role="group" aria-label={text('科目', '科目')}>
        <button type="button" aria-pressed={subject === 'math-1a'} onClick={() => setSubject('math-1a')}>
          <Sigma size={18} />数学 I・A
        </button>
        <button type="button" aria-pressed={subject === 'physics'} onClick={() => setSubject('physics')}>
          <Atom size={18} />{text('物理', '物理')}
        </button>
      </div>

      <section className="v2-practice-list">
        <div className="v2-practice-intro">
          <div>
            <span className="v2-eyebrow">QUESTION BANK</span>
            <h2>{text('問題を選ぶ', '选择题目')}</h2>
          </div>
          <span className="v2-question-count"><ListChecks size={15} />{questions.length}</span>
        </div>

        {!questions.length && (
          <div className="v2-empty-card">{text('公開中の問題はまだありません。', '暂时没有已发布题目。')}</div>
        )}

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
                <strong>Standard</strong>
                <small>{text('通常の引導', '正常引导')}</small>
              </button>
              <button type="button" onClick={() => startPractice(question.questionId, true)}>
                <strong>Light</strong>
                <small>{text('必要時だけヒント', '按需查看提示')}</small>
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
