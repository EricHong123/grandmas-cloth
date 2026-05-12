import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApi } from '../../hooks/useApi'

export default function WorkshopPreview() {
  const { t } = useTranslation()
  const { data } = useApi('/api/workshops')

  if (!data || data.length === 0) return null

  return (
    <section className="bg-rice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ Community</p>
            <h2 className="text-2xl sm:text-3xl font-chinese-display text-ink-900">{t('home.workshopPreview')}</h2>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px w-8 bg-jade opacity-50" />
              <div className="h-px w-4 bg-jade opacity-25" />
            </div>
          </div>
          <Link to="/workshops" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-jade hover:text-jade-dark transition-colors border-b border-jade pb-0.5">
            {t('common.viewMore')} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.slice(0, 4).map(w => (
            <div key={w.id} className="bg-white rounded-fabric p-4 border-stitch-warm card-hover-fabric">
              <div className="aspect-[4/3] rounded-fabric-sm mb-3 overflow-hidden border-stitch-warm">
                <img src={w.id % 2 === 0 ? '/images/workshop-kids.webp' : '/images/grandma-teaching.webp'} alt={w.title_en} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-chinese-display text-sm text-ink-900">{w.title_en}</h3>
              <p className="text-xs text-ink-500 mt-1.5">
                {w.date} · <span className="text-jade font-medium">{w.attendee_count}</span> attendees
              </p>
            </div>
          ))}
        </div>
        <Link to="/workshops" className="sm:hidden mt-6 text-center block text-sm font-medium text-jade">
          {t('common.viewMore')} →
        </Link>
      </div>
    </section>
  )
}
