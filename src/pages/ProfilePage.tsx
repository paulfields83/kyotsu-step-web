import { Database, History, ListRestart, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog, NumberedSection, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import type { Question } from '../domain/questionSchema'
import { useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { subjectLabel } from '../i18n/labels'
import { languageMeta, type AppLanguage } from '../i18n/types'

export function ProfilePage() {
  const settings = useAppStore((state) => state.settings)
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const simulationAttempts = useAppStore((state) => state.simulationAttempts)
  const customQuestions = useAppStore((state) => state.customQuestions)
  const setSettings = useAppStore((state) => state.setSettings)
  const resetProgress = useAppStore((state) => state.resetProgress)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { language, text } = useI18n()
  const displayName = language === 'zh' && settings.displayName === '学習者' ? '学习者' : settings.displayName
  const reset = () => { resetProgress(); setConfirmOpen(false) }
  return <div className="page-stack"><header className="page-hero"><p className="eyebrow">PROFILE / LOCAL</p><h1>{text('マイページ', '我的')}</h1><p>{text('表示と学習設定はこのブラウザだけに保存されます。', '显示与学习设置只保存在当前浏览器中。')}</p></header><NumberedSection number="01" title={text('プロフィール', '个人设置')}><label className="field-label">{text('表示名', '显示名称')}<input className="text-control" aria-label={text('表示名', '显示名称')} maxLength={24} value={displayName} onChange={(event) => setSettings({ displayName: event.target.value })} /></label><label className="field-label">{text('既定の科目', '默认科目')}<select className="select-control" aria-label={text('既定の科目', '默认科目')} value={settings.defaultSubject} onChange={(event) => setSettings({ defaultSubject: event.target.value as Question['subject'] })}>{(['math-1a', 'physics'] as Question['subject'][]).map((value) => <option value={value} key={value}>{subjectLabel(value, language)}</option>)}</select></label></NumberedSection><NumberedSection number="02" title={text('言語', '语言')}><div className="segmented-control" role="group" aria-label={text('表示言語', '显示语言')}>{(Object.keys(languageMeta) as AppLanguage[]).map((value) => <button type="button" key={value} aria-pressed={language === value} onClick={() => setSettings({ language: value })}>{languageMeta[value].label}</button>)}</div></NumberedSection><NumberedSection number="03" title={text('表示', '显示')}><label className="toggle-row"><span><Settings2 aria-hidden="true" /><strong>{text('動きを減らす', '减少动态效果')}</strong><small>{text('アニメーションと画面移動の動きを抑えます。', '减少动画和页面切换时的动态效果。')}</small></span><input type="checkbox" checked={settings.reduceMotion} onChange={(event) => setSettings({ reduceMotion: event.target.checked })} /></label><label className="toggle-row"><span><History aria-hidden="true" /><strong>{text('模擬テストの時計', '模拟测试计时器')}</strong><small>{text('作答画面で残り時間を表示します。', '在作答页面显示剩余时间。')}</small></span><input type="checkbox" checked={settings.showTimer} onChange={(event) => setSettings({ showTimer: event.target.checked })} /></label></NumberedSection><NumberedSection number="04" title={text('この端末のデータ', '本设备的数据')}><div className="data-summary"><Database aria-hidden="true" /><p><strong>{learningAttempts.length} {text('学習', '次学习')}・{simulationAttempts.length} {text('模擬', '次模拟')}・{customQuestions.length} {text('追加問題', '道追加题')}</strong><br />{text('保存先：このブラウザの localStorage', '保存位置：当前浏览器的 localStorage')}<br />{text('表示時刻：Asia/Tokyo', '显示时区：Asia/Tokyo')}</p></div><div className="tag-row"><StatusBadge>{text('ログインなし', '无需登录')}</StatusBadge><StatusBadge>{text('外部送信なし', '不向外部发送')}</StatusBadge><StatusBadge>{text('端末間同期なし', '不跨设备同步')}</StatusBadge></div><div className="result-actions"><Link className="raised-link" to="/history">{text('履歴を確認', '查看记录')}</Link><Link className="raised-link" to="/admin">{text('題庫を管理', '管理题库')}</Link><RaisedButton className="danger-button" onClick={() => setConfirmOpen(true)}><ListRestart aria-hidden="true" />{text('学習記録を消去', '清除学习记录')}</RaisedButton></div></NumberedSection><ConfirmDialog open={confirmOpen} title={text('学習記録を消去しますか？', '确定清除学习记录吗？')} body={text('学習・模擬の session と履歴をこの端末から消します。追加問題と設定は残ります。この操作は元に戻せません。', '这会删除本设备上的学习、模拟测试和历史记录；追加题目与设置会保留。此操作无法撤销。')} confirmLabel={text('記録を消去', '清除记录')} onCancel={() => setConfirmOpen(false)} onConfirm={reset} /></div>
}
