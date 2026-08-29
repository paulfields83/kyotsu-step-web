import { ArrowLeft, BarChart3, CircleUserRound, Languages, ListChecks, Trophy } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '../../stores/useAppStore'
import { useI18n } from '../../i18n/runtime'
import { languageMeta, type AppLanguage } from '../../i18n/types'

type BackTarget = {
  to: string
  jaLabel: string
  zhLabel: string
}

function getBackTarget(pathname: string): BackTarget | null {
  const topLevelRoutes = new Set(['/problems', '/analysis', '/ranking', '/profile'])
  if (topLevelRoutes.has(pathname)) return null

  if (pathname === '/learning/setup') return { to: '/problems', jaLabel: '問題へ戻る', zhLabel: '返回题目' }
  if (/^\/learning\/session\//.test(pathname)) return { to: '/learning/setup', jaLabel: '学習設定へ戻る', zhLabel: '返回学习设置' }
  if (/^\/learning\/result\//.test(pathname)) return { to: '/learning/setup', jaLabel: '学習設定へ戻る', zhLabel: '返回学习设置' }

  if (pathname === '/simulation/setup') return { to: '/problems', jaLabel: '問題へ戻る', zhLabel: '返回题目' }
  if (/^\/simulation\/session\//.test(pathname)) return { to: '/simulation/setup', jaLabel: '模擬テスト設定へ戻る', zhLabel: '返回模拟测试设置' }
  if (/^\/simulation\/result\//.test(pathname)) return { to: '/simulation/setup', jaLabel: '模擬テスト設定へ戻る', zhLabel: '返回模拟测试设置' }

  if (/^\/analysis\//.test(pathname)) return { to: '/analysis', jaLabel: '分析へ戻る', zhLabel: '返回分析' }
  if (pathname === '/mistakes') return { to: '/analysis', jaLabel: '分析へ戻る', zhLabel: '返回分析' }
  if (pathname === '/history') return { to: '/profile', jaLabel: 'マイページへ戻る', zhLabel: '返回我的' }
  if (pathname === '/admin') return { to: '/profile', jaLabel: 'マイページへ戻る', zhLabel: '返回我的' }

  return { to: '/problems', jaLabel: '問題へ戻る', zhLabel: '返回题目' }
}

export function AppShell() {
  const location = useLocation()
  const reduceMotion = useAppStore((state) => state.settings.reduceMotion)
  const { language, setLanguage, text } = useI18n()
  const isFocusRoute = /\/(learning|simulation)\/session\//.test(location.pathname)
  const backTarget = getBackTarget(location.pathname)
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
        <div className="header-leading">
          {backTarget && (
            <NavLink
              to={backTarget.to}
              className="header-back-link"
              data-testid="app-back-button"
              aria-label={text(backTarget.jaLabel, backTarget.zhLabel)}
            >
              <ArrowLeft size={18} aria-hidden="true" />
              <span>{text('戻る', '返回')}</span>
            </NavLink>
          )}
          <NavLink to="/problems" className="brand" aria-label={text('共通 STEP ホーム', '共通 STEP 首页')}>
            <span className="brand-mark">KS</span>
            <span><strong>共通 STEP</strong><small>{text('数学・物理', '数学・物理')}</small></span>
          </NavLink>
        </div>
        <div className="header-actions">
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
