import { ArrowRight, Atom, BookOpenCheck, CheckCircle2, Clock3, Flame, Sigma, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../styles/redesign-preview.css'

const subjects = [
  {
    key: 'math',
    eyebrow: 'MATHEMATICS',
    title: '数学 I・A',
    detail: '数と式',
    progress: 72,
    meta: '12 / 24 項目',
    icon: Sigma,
  },
  {
    key: 'physics',
    eyebrow: 'PHYSICS',
    title: '物理',
    detail: '運動と力',
    progress: 38,
    meta: '8 / 21 項目',
    icon: Atom,
  },
]

export function HomePreviewPage() {
  return (
    <div className="ui2-page">
      <header className="ui2-topbar">
        <Link className="ui2-brand" to="/problems" aria-label="共通 STEP">
          <span className="ui2-brand-mark">KS</span>
          <span>
            <strong>共通 STEP</strong>
            <small>数学・物理</small>
          </span>
        </Link>
        <span className="ui2-preview-badge">UI PREVIEW</span>
      </header>

      <main className="ui2-main">
        <section className="ui2-welcome">
          <p>こんばんは</p>
          <h1>今日も、続きから。</h1>
        </section>

        <section className="ui2-continue-card">
          <div className="ui2-continue-head">
            <div>
              <span className="ui2-kicker">CONTINUE</span>
              <h2>数学 I・A</h2>
              <p>数と式 <span aria-hidden="true">›</span> 実数</p>
            </div>
            <div className="ui2-ring" aria-label="進捗 72%">
              <strong>72</strong><span>%</span>
            </div>
          </div>

          <div className="ui2-progress" aria-hidden="true">
            <span style={{ width: '72%' }} />
          </div>

          <div className="ui2-continue-footer">
            <div className="ui2-mini-meta">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>前回：確認問題 3 / 5</span>
            </div>
            <Link className="ui2-primary-button" to="/learning/setup">
              続きから学習する
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="ui2-section">
          <div className="ui2-section-head">
            <div>
              <span className="ui2-kicker">SUBJECTS</span>
              <h2>学習する科目</h2>
            </div>
            <Link to="/learning/setup">すべて見る</Link>
          </div>

          <div className="ui2-subject-grid">
            {subjects.map(({ key, eyebrow, title, detail, progress, meta, icon: Icon }) => (
              <Link key={key} className={`ui2-subject-card ui2-subject-card--${key}`} to="/learning/setup">
                <div className="ui2-subject-icon"><Icon size={22} aria-hidden="true" /></div>
                <span className="ui2-subject-eyebrow">{eyebrow}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
                <div className="ui2-subject-progress"><span style={{ width: `${progress}%` }} /></div>
                <div className="ui2-subject-meta">
                  <span>{meta}</span>
                  <strong>{progress}%</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="ui2-section">
          <div className="ui2-section-head">
            <div>
              <span className="ui2-kicker">TODAY</span>
              <h2>今日の学習</h2>
            </div>
          </div>

          <div className="ui2-stat-grid">
            <article>
              <Clock3 size={19} aria-hidden="true" />
              <strong>32</strong>
              <span>min</span>
              <small>学習時間</small>
            </article>
            <article>
              <Target size={19} aria-hidden="true" />
              <strong>5</strong>
              <span>問</span>
              <small>解いた問題</small>
            </article>
            <article>
              <Flame size={19} aria-hidden="true" />
              <strong>4</strong>
              <span>日</span>
              <small>連続学習</small>
            </article>
          </div>
        </section>

        <section className="ui2-secondary-card">
          <div className="ui2-secondary-icon"><BookOpenCheck size={22} aria-hidden="true" /></div>
          <div>
            <span className="ui2-kicker">PRACTICE</span>
            <h2>模擬テスト</h2>
            <p>ヒントなしで現在の実力を確認</p>
          </div>
          <Link to="/simulation/setup" aria-label="模擬テストへ">
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </section>

        <p className="ui2-note">この画面は UI 検討用プレビューです。既存の学習データ・API・正式画面には変更を加えていません。</p>
      </main>
    </div>
  )
}
