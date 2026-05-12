import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'

export default function StoryPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: story, loading: storyLoading } = useApi('/api/story')
  const { data: press } = useApi('/api/press')
  const { data: workshops } = useApi('/api/workshops')

  return (
    <>
      <SEOHead title={t('story.title')} description={t('story.subtitle')} path="/our-story" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ {t('nav.about')}</p>
        <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-2">{t('story.title')}</h1>
        <div className="flex items-center gap-2 mb-10">
          <div className="h-px w-8 bg-cinnabar opacity-40" />
          <div className="h-px w-4 bg-cinnabar opacity-25" />
        </div>

        {/* Hero photo — grandma at work */}
        <div className="rounded-fabric-lg overflow-hidden border-stitch-warm shadow-lg mb-6">
          <img src="/images/grandma-at-work.webp" alt="Grandma Luo at work — cloth mosaic artisan" className="w-full aspect-[16/9] object-cover" />
        </div>
        {/* Secondary photos — workshop + teaching */}
        <div className="grid grid-cols-2 gap-3 mb-12">
          <div className="rounded-fabric-lg overflow-hidden border-stitch-warm">
            <img src="/images/grandma-teaching.webp" alt="Grandma Luo teaching cloth mosaic" className="w-full aspect-[4/3] object-cover" />
          </div>
          <div className="rounded-fabric-lg overflow-hidden border-stitch-warm">
            <img src="/images/workshop-kids.webp" alt="Children creating cloth mosaic art at workshop" className="w-full aspect-[4/3] object-cover" />
          </div>
        </div>

        {storyLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-warmth-200 rounded-fabric-sm w-3/4" />
            <div className="h-4 bg-warmth-200 rounded-fabric-sm w-full" />
            <div className="h-4 bg-warmth-200 rounded-fabric-sm w-5/6" />
          </div>
        ) : story ? (
          <div
            className="prose prose-lg max-w-none text-ink-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: story.story_body?.[lang] || story.story_body?.en || '' }}
          />
        ) : null}

        {press && press.length > 0 && (
          <section className="mt-16 pt-12 border-t border-dashed border-warmth-300">
            <h2 className="text-xl font-chinese-display text-ink-900 mb-6">{t('story.mediaCoverage')}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {press.map(m => (
                <div key={m.id} className="bg-white p-4 rounded-fabric border-stitch-warm card-hover-fabric">
                  {m.image_url && <img src={m.image_url} alt={m.source} className="w-full rounded-fabric-sm mb-3 border-stitch-warm" />}
                  <p className="font-chinese-display text-sm text-ink-800">{m.source}</p>
                  <p className="text-xs text-ink-500 mt-1">{m.date}</p>
                  <p className="text-sm text-ink-600 mt-2">{m.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {workshops && workshops.length > 0 && (
          <section className="mt-16 pt-12 border-t border-dashed border-warmth-300">
            <h2 className="text-xl font-chinese-display text-ink-900 mb-6">{t('story.workshops')}</h2>
            <div className="space-y-4">
              {workshops.map((w, i) => (
                <div key={w.id} className="flex gap-4 bg-white p-4 rounded-fabric border-stitch-warm card-hover-fabric">
                  <div className="shrink-0 w-24 h-24 rounded-fabric-sm overflow-hidden border-stitch-warm bg-warmth-100">
                    {w.images?.[0] ? (
                      <img src={w.images[0]} alt={w.title_en} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-400 text-xs">[Photo]</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-chinese-display text-ink-900">{w.title_en}</h3>
                    <p className="text-sm text-ink-500 mt-1">{w.date} · {w.location}</p>
                    <p className="text-sm text-ink-600 mt-1">{w.description}</p>
                    <p className="text-xs text-jade font-medium mt-1">{w.attendee_count} attendees</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
