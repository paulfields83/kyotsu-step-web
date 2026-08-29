import { ArrowLeft, BarChart3, CircleUserRound, Languages, ListChecks, Trophy } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'
import { languageMeta, type AppLanguage } from '../../i18n/types'

export function AppShell() {
  const location = useLocation()
  const reduceMotion = useAppStore((state) => state.settings.reduceMotion)
  const { language, setLanguage, text } = useI18n()
  const isFocusRoute = /\/(learning|simulation)\/session\//.test(location.pathname)
  const previousPath = useRef(location.pathname)
  const navigation = [
    { to: '/problems', label: text('問題', '题目'), icon: ListChecks },
    { to: '/analysis', label: text('分析', '分析'), icon: BarChart3 },
    { to: '/ranking', label: text('ランキング', '排行榜'), icon: Trophy },
    { to: '/profile', label: text('マイページ', '我的'), icon: CircleUserRound },
  ]

  useEffect(() => {
    document.documentElement.lang = languageMeta[language].htmlLang
    document.title = text('共通 STEP｜数学・物理', '共通 STEP｜数学・物理')
  }, [language, text])

  useEffect(() => {
    if (previousPath.current === location.pathname) return
    previousPath.current = location.pathname
    const main = document.getElementById('main-content')
    main?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className={`app-frame${isFocusRoute ? ' app-frame--focus' : ''}${reduceMotion ? ' app-frame--reduce-motion' : ''}`}>
      <a className="skip-link" href="#main-content">{text('本文へ移動', '跳到正文')}</a>
      <header className="top-header">
        <NavLink to="/problems" className="brand" aria-label={text('共通 STEP ホーム', '共通 STEP 首页')}>
          <span className="brand-mark">KS</span>
          <span><strong>共通 STEP</strong><small>{text('数学・物理', '数学・物理')}</small></span>
        </NavLink>
        <div className="header-actions">
          {isFocusRoute && (
            <NavLink to="/problems" className="header-back-link" aria-label={text('問題一覧へ戻る', '返回题目主页')}>
              <ArrowLeft size={18} aria-hidden="true" />
              <span>{text('問題へ', '返回题目')}</span>
            </NavLink>
          )}
          <Languages size={17} aria-hidden="true" />
          <div className="language-switcher" role="group" aria-label={text('表示言語', '显示语言')} data-testid="language-switcher">
            {(Object.keys(languageMeta) as AppLanguage[]).map((value) => (
              <button type="button" key={value} aria-pressed={language === value} onClick={() => setLanguage(value)}>{languageMeta[value].label}</button>
            ))}
          </div>
        </div>
      </header>
      <main id="main-content" className="app-content" tabIndex={-1}><Outlet /></main>
      {!isFocusRoute && (
        <nav className="bottom-navigation" aria-label={text('主要ナビゲーション', '主导航')}>
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}>
              <Icon aria-hidden="true" size={21} strokeWidth={2.2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
