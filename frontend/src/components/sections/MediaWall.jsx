import { useTranslation } from 'react-i18next'
import { useApi } from '../../hooks/useApi'

export default function MediaWall() {
  const { t } = useTranslation()
  const { data } = useApi('/api/press')

  if (!data || data.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ As Seen In</p>
        <h2 className="text-2xl sm:text-3xl font-chinese-display text-ink-900">
          {t('home.mediaRecognition')}
        </h2>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-cinnabar opacity-40" />
          <div className="h-px w-4 bg-cinnabar opacity-25" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {data.map(m => (
          <div key={m.id} className="flex flex-col items-center gap-2.5 p-5 bg-white rounded-fabric border-stitch-warm card-hover-fabric relative">
            {/* Small decorative diamond */}
            <span className="absolute top-2 right-2 text-[8px] text-cinnabar opacity-30">◆</span>
            <span className="text-sm font-chinese-display text-ink-800">{m.source}</span>
            <span className="text-xs text-ink-400">{m.date}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
