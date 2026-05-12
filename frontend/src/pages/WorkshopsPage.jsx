import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'

export default function WorkshopsPage() {
  const { t } = useTranslation()
  const { data: workshops, loading } = useApi('/api/workshops')

  return (
    <>
      <SEOHead title={t('nav.workshops')} path="/workshops" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ {t('nav.about')}</p>
        <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-2">{t('nav.workshops')}</h1>
        <div className="flex items-center gap-2 mb-12">
          <div className="h-px w-8 bg-jade opacity-50" />
          <div className="h-px w-4 bg-jade opacity-25" />
        </div>

        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex gap-4 bg-white p-4 rounded-fabric border-stitch-warm">
                <div className="w-32 h-24 bg-warmth-200 rounded-fabric-sm shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-warmth-200 rounded-fabric-sm w-2/3" />
                  <div className="h-3 bg-warmth-100 rounded-fabric-sm w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {workshops?.map(w => (
              <div key={w.id} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-fabric border-stitch-warm card-hover-fabric">
                <div className="w-full sm:w-40 h-28 rounded-fabric-sm shrink-0 overflow-hidden border-stitch-warm">
                  <img src={w.id % 2 === 0 ? '/images/workshop-kids.webp' : '/images/grandma-teaching.webp'} alt={w.title_en} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-chinese-display text-ink-900">{w.title_en}</h3>
                  <p className="text-sm text-ink-500 mt-1">{w.date} · {w.location}</p>
                  <p className="text-sm text-ink-600 mt-2">{w.description}</p>
                  <p className="text-xs text-jade font-medium mt-2">
                    <span className="text-jade">◆</span> {w.attendee_count} children participated
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
