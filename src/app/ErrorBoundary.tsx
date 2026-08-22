import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useAppStore } from '../stores/useAppStore'

type State = { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App render error', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    const isChinese = useAppStore.getState().settings.language === 'zh'
    return <main className="fatal-error"><p className="eyebrow">RECOVERY</p><h1>{isChinese ? '页面暂时无法继续显示' : '表示を続けられませんでした'}</h1><p>{isChinese ? '已保存的学习记录不会丢失，请重新加载页面。' : '保存済みの学習記録は消えていません。ページを再読み込みしてください。'}</p><button type="button" className="raised-button" onClick={() => window.location.reload()}>{isChinese ? '重新加载' : '再読み込み'}</button></main>
  }
}
