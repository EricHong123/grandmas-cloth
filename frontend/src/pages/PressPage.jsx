import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'

export default function PressPage() {
  const { t } = useTranslation()
  const { data: press, loading } = useApi('/api/press')

  return (
    <>
      <SEOHead title={t('nav.press')} path="/press" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ {t('nav.about')}</p>
        <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-2">{t('nav.press')}</h1>
        <div className="flex items-center gap-2 mb-12">
          <div className="h-px w-8 bg-cinnabar opacity-40" />
          <div className="h-px w-4 bg-cinnabar opacity-25" />
        </div>

        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white p-6 rounded-fabric border-stitch-warm">
                <div className="h-5 bg-warmth-200 rounded-fabric-sm w-1/3 mb-2" />
                <div className="h-4 bg-warmth-100 rounded-fabric-sm w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {press?.map(m => (
              <div key={m.id} className="bg-white p-6 rounded-fabric border-stitch-warm card-hover-fabric">
                <div className="flex items-start gap-5">
                  {m.image_url && (
                    <div className="w-28 h-36 shrink-0 rounded-fabric-sm overflow-hidden border-stitch-warm bg-warmth-100">
                      <img src={m.image_url} alt={m.source} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-cinnabar opacity-50">◆</span>
                      <h3 className="font-chinese-display text-ink-900">{m.title_en}</h3>
                    </div>
                    <p className="text-sm text-cinnabar font-medium mt-1">{m.source} · {m.date}</p>
                    <p className="text-sm text-ink-500 mt-3">{m.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
