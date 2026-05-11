import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'

export default function CraftPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: story, loading } = useApi('/api/story')

  return (
    <>
      <SEOHead title={t('craft.title')} description={t('craft.subtitle')} path="/the-craft" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ The Tradition</p>
        <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-2">{t('craft.title')}</h1>
        <div className="flex items-center gap-2 mb-12">
          <div className="h-px w-8 bg-indigo opacity-50" />
          <div className="h-px w-4 bg-indigo opacity-25" />
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-chinese-display text-ink-900 mb-4">{t('craft.whatIs')}</h2>
          {loading ? (
            <div className="animate-pulse h-20 bg-warmth-200 rounded-fabric" />
          ) : story?.craft_intro ? (
            <div className="prose max-w-none text-ink-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: story.craft_intro[lang] || story.craft_intro.en }} />
          ) : null}
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-chinese-display text-ink-900 mb-4">{t('craft.process')}</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {['Design', 'Cut Fabric', 'Layer & Compose', 'Fix & Frame'].map((step, i) => (
              <div key={step} className="bg-white p-5 rounded-fabric border-stitch-warm text-center card-hover-fabric">
                <div className="w-10 h-10 rounded-fabric-sm bg-indigo text-white font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-ink-800">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-chinese-display text-ink-900 mb-4">{t('craft.materials')}</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {['Silk 丝绸', 'Cotton 棉布', 'Linen 麻布', 'Brocade 织锦', 'Canvas Board', 'Natural Adhesive'].map(m => (
              <div key={m} className="bg-white p-3.5 rounded-fabric border-stitch-warm text-center text-sm text-ink-700">{m}</div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-chinese-display text-ink-900 mb-4">{t('craft.history')}</h2>
          <div className="bg-rice rounded-fabric-lg p-6 border-stitch-warm">
            <p className="text-ink-600 leading-relaxed text-sm">
              Cloth patchwork painting (布贴画 / Bù Tiē Huà) dates back to the Tang Dynasty (618-907 CE).
              Originally a folk art practiced by women in rural China, it transforms fabric scraps into richly textured,
              layered paintings. Unlike embroidery which works thread onto fabric, cloth mosaic builds images through
              the interplay of different textiles — each with its own weight, sheen, and hand-feel. In 2008, the
              craft was officially recognized as part of China&apos;s intangible cultural heritage.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
