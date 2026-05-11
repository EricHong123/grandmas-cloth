import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggle = () => {
    const next = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  return (
    <button
      onClick={toggle}
      className="px-2 py-1 text-xs font-medium rounded border border-ink-200 text-ink-500 hover:bg-warmth-100 transition-colors"
    >
      {i18n.language === 'en' ? '中文' : 'EN'}
    </button>
  )
}
