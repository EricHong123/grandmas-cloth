import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'

export default function GalleryPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: items, loading } = useApi('/api/gallery')
  const [lightbox, setLightbox] = useState(null)

  const categories = [...new Set((items || []).map(p => p.category_name_en).filter(Boolean))]

  return (
    <>
      <SEOHead title={t('nav.gallery')} path="/gallery" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink-900 mb-2">{t('nav.gallery')}</h1>
        <p className="text-ink-500 mb-8">{t('home.heroSubtitle')}</p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-warmth-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {items?.map(p => {
              const img = p.images?.[0]
              const title = lang === 'zh' ? p.title_zh : p.title_en
              return img ? (
                <div
                  key={p.id}
                  className="break-inside-avoid bg-white rounded-xl overflow-hidden border border-warmth-100 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setLightbox({ url: img, title })}
                >
                  <img src={img} alt={title} className="w-full" loading="lazy" />
                  <div className="p-2">
                    <p className="text-xs font-medium text-ink-800">{title}</p>
                  </div>
                </div>
              ) : null
            })}
          </div>
        )}

        {lightbox && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <img src={lightbox.url} alt={lightbox.title} className="max-w-full max-h-[90vh] rounded-lg" />
          </div>
        )}
      </div>
    </>
  )
}
