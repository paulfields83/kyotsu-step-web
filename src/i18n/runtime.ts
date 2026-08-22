import { useCallback } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { languageMeta, type AppLanguage } from './types'

export function useI18n() {
  const language = useAppStore((state) => state.settings.language)
  const setSettings = useAppStore((state) => state.setSettings)
  const text = useCallback(<T,>(japanese: T, chinese: T): T => language === 'zh' ? chinese : japanese, [language])
  const setLanguage = useCallback((next: AppLanguage) => setSettings({ language: next }), [setSettings])

  return {
    language,
    locale: languageMeta[language].locale,
    text,
    setLanguage,
  }
}
