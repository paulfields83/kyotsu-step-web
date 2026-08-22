export type AppLanguage = 'ja' | 'zh'

export const languageMeta: Record<AppLanguage, { label: string; htmlLang: string; locale: string }> = {
  ja: { label: '日本語', htmlLang: 'ja', locale: 'ja-JP' },
  zh: { label: '中文', htmlLang: 'zh-CN', locale: 'zh-CN' },
}
