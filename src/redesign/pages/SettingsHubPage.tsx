import { Database, Languages, RotateCcw, Settings2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Question } from '../../domain/questionSchema'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'
import { subjectLabel } from '../../i18n/labels'

export function SettingsHubPage() {
  const settings = useAppStore((state) => state.settings)
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const simulationAttempts = useAppStore((state) => state.simulationAttempts)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const setSettings = useAppStore((state) => state.setSettings)
  const resetProgress = useAppStore((state) => state.resetProgress)
  const { language, setLanguage, text } = useI18n()
  const [resetting, setResetting] = useState(false)

  const clear = () => {
    if (!window.confirm(text('学習記録をすべて消去しますか？この操作は元に戻せません。', '确定清除全部学习记录吗？此操作无法撤销。'))) return
    setResetting(true)
    resetProgress()
    window.setTimeout(() => setResetting(false), 400)
  }

  return (
    <div className="v2-page">
      <header className="v2-page-hero">
        <span className="v2-eyebrow">SETTINGS</span>
        <h1>{text('設定', '设置')}</h1>
        <p>{text('プロフィール、表示、学習の基本設定を管理します。', '管理个人信息、显示和学习基础设置。')}</p>
      </header>

      <section className="v2-settings-card">
        <header><UserRound size={20} /><div><strong>{text('プロフィール', '个人信息')}</strong><small>{text('この端末で使う表示名', '当前设备使用的显示名称')}</small></div></header>
        <label>
          <span>{text('表示名', '显示名称')}</span>
          <input value={settings.displayName} maxLength={24} onChange={(event) => setSettings({ displayName: event.target.value })} />
        </label>
      </section>

      <section className="v2-settings-card">
        <header><Settings2 size={20} /><div><strong>{text('学習設定', '学习设置')}</strong><small>{text('既定の科目と表示方法', '默认科目与显示方式')}</small></div></header>
        <label>
          <span>{text('既定の科目', '默认科目')}</span>
          <select value={settings.defaultSubject} onChange={(event) => setSettings({ defaultSubject: event.target.value as Question['subject'] })}>
            {(['math-1a', 'physics'] as Question['subject'][]).map((value) => <option value={value} key={value}>{subjectLabel(value, language)}</option>)}
          </select>
        </label>
        <label className="v2-toggle-row">
          <div><strong>{text('動きを減らす', '减少动画')}</strong><small>{text('画面遷移の動きを抑えます。', '减少页面切换与动画效果。')}</small></div>
          <input type="checkbox" checked={settings.reduceMotion} onChange={(event) => setSettings({ reduceMotion: event.target.checked })} />
        </label>
        <label className="v2-toggle-row">
          <div><strong>{text('模擬テストの時計', '模拟测试计时器')}</strong><small>{text('作答中に残り時間を表示します。', '作答时显示剩余时间。')}</small></div>
          <input type="checkbox" checked={settings.showTimer} onChange={(event) => setSettings({ showTimer: event.target.checked })} />
        </label>
      </section>

      <section className="v2-settings-card">
        <header><Languages size={20} /><div><strong>{text('言語', '语言')}</strong><small>{text('UI の表示言語', '界面显示语言')}</small></div></header>
        <div className="v2-language-choice">
          <button type="button" aria-pressed={language === 'ja'} onClick={() => setLanguage('ja')}>日本語</button>
          <button type="button" aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
      <section className="v2-menu-list">
        <Link to="/admin"><div><strong>{text('問題カタログ', '题目目录')}</strong><small>{text('登録済み問題を確認', '查看已登记题目')}</small></div><span>→</span></Link>
      </section>
    </div>

      </section>

      <section className="v2-settings-card">
        <header><Database size={20} /><div><strong>{text('学習データ', '学习数据')}</strong><small>{text('このブラウザに保存されています。', '保存在当前浏览器中。')}</small></div></header>
        <div className="v2-data-summary">
          <span><strong>{learningAttempts.length}</strong><small>{text('学習', '学习')}</small></span>
          <span><strong>{simulationAttempts.length}</strong><small>{text('模擬', '模拟')}</small></span>
          <span><strong>{customQuestions.length}</strong><small>{text('追加問題', '追加题')}</small></span>
        </div>
        <button type="button" className="v2-danger-button" disabled={resetting} onClick={clear}><RotateCcw size={17} />{resetting ? text('消去しました', '已清除') : text('学習記録を消去', '清除学习记录')}</button>
      </section>
    </div>
  )
}
