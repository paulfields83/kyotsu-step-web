import { ArrowLeft, BarChart3, BookOpen, House, Languages, ListChecks, Settings2 } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n/runtime'
import { languageMeta, type AppLanguage } from '../../i18n/types'
import './app-v2.css'
import './ia-v2.css'

function backTarget(pathname: string) {
  if (pathname === '/' || pathname === '/courses' || pathname === '/practice' || pathname === '/progress' || pathname === '/settings') return null
  if (pathname.startsWith('/learning/textbook/')) return '/courses'
  if (pathname.startsWith('/learning/session/') || pathname.startsWith('/learning/result/')) return '/practice'
  if (pathname.startsWith('/simulation/')) return '/practice'
  if (pathname.startsWith('/analysis') || pathname === '/mistakes' || pathname === '/history') return '/progress'
  return '/'
}

export function RedesignShell() {
  const location = useLocation()
  const { language, setLanguage, text } = useI18n()
  const back = backTarget(location.pathname)
  const focus = /^\/(learning\/(session|textbook)|simulation\/session)/.test(location.pathname)

  useEffect(() => {
    document.documentElement.lang = languageMeta[language].htmlLang
    document.title = text('共通 STEP｜数学・物理', '共通 STEP｜数学・物理')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [language, location.pathname, text])

  const nav = [
    { to: '/', label: text('ホーム', '首页'), icon: House, end: true },
    { to: '/courses', label: text('コース', '课程'), icon: BookOpen },
    { to: '/practice', label: text('練習', '练习'), icon: ListChecks },
    { to: '/progress', label: text('記録', '记录'), icon: BarChart3 },
  ]

  return (
    <div className={`v2-app${focus ? ' v2-app--focus' : ''}`}>
      <header className="v2-header">
        <div className="v2-header__left">
          {back ? (
            <NavLink className="v2-icon-button" to={back} aria-label={text('戻る', '返回')}>
              <ArrowLeft size={20} />
            </NavLink>
          ) : (
            <NavLink className="v2-brand" to="/">
              <span className="v2-brand__mark">KS</span>
              <span><strong>共通 STEP</strong><small>{text('数学・物理', '数学・物理')}</small></span>
            </NavLink>
          )}
          {back && <NavLink className="v2-brand v2-brand--compact" to="/"><strong>共通 STEP</strong></NavLink>}
        </div>

        <div className="v2-header__actions">
          <div className="v2-language" aria-label={text('表示言語', '显示语言')}>
            <Languages size={15} />
            {(Object.keys(languageMeta) as AppLanguage[]).map((value) => (
              <button key={value} type="button" aria-pressed={language === value} onClick={() => setLanguage(value)}>
                {value === 'ja' ? 'JA' : '中'}
              </button>
            ))}
          </div>
          <NavLink className="v2-icon-button" to="/settings" aria-label={text('設定', '设置')}>
            <Settings2 size={19} />
          </NavLink>
        </div>
      </header>

      <main className="v2-content"><Outlet /></main>

      {!focus && (
        <nav className="v2-bottom-nav">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `v2-nav-item${isActive ? ' is-active' : ''}`}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
