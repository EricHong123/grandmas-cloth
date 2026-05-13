import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'
import { JsonLd, faqSchema, breadcrumbSchema } from '../components/common/JsonLd'

export default function FAQPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: faqs, loading } = useApi('/api/faq')
  const [openId, setOpenId] = useState(null)

  return (
    <>
      <SEOHead title={t('nav.faq')} path="/faq" />
      {faqs && <JsonLd data={faqSchema(faqs)} />}
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://grandmascloth.com' },
        { name: 'FAQ', url: 'https://grandmascloth.com/faq' },
      ])} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ Help</p>
        <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-2">{t('nav.faq')}</h1>
        <div className="flex items-center gap-2 mb-12">
          <div className="h-px w-8 bg-cinnabar opacity-40" />
          <div className="h-px w-4 bg-cinnabar opacity-25" />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-white p-5 rounded-fabric border-stitch-warm">
                <div className="h-5 bg-warmth-200 rounded-fabric-sm w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {faqs?.map(faq => (
              <div key={faq.id} className="bg-white rounded-fabric border-stitch-warm overflow-hidden card-hover-fabric">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-warmth-50 transition-colors"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                >
                  <span className="font-chinese-display text-ink-900 pr-4 text-sm">
                    {lang === 'zh' ? faq.question_zh : faq.question_en}
                  </span>
                  <svg
                    className={`w-4 h-4 text-ink-400 shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openId === faq.id && (
                  <div className="px-5 pb-5 text-ink-600 leading-relaxed text-sm border-t border-dashed border-warmth-200 pt-4">
                    {lang === 'zh' ? faq.answer_zh : faq.answer_en}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
