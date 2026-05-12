import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function StorySnippet() {
  const { t } = useTranslation()
  return (
    <section className="bg-calico text-ink-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative z-10">
              {/* Main photo — grandma at work */}
              <div className="bg-ink-800 rounded-fabric-lg overflow-hidden border-stitch-warm relative shadow-xl">
                <img
                  src="/images/grandma-at-work.webp"
                  alt="Grandma Luo creating cloth mosaic art by hand"
                  className="w-full aspect-[4/3] object-cover hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gamboge opacity-60" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gamboge opacity-60" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gamboge opacity-60" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gamboge opacity-60" />
              </div>
              {/* Floating workshop photo */}
              <div className="absolute -bottom-4 -right-4 z-20 rotate-[3deg]">
                <div className="bg-white rounded-fabric shadow-lg p-1.5 border-stitch-warm w-28">
                  <div className="rounded-fabric-sm overflow-hidden">
                    <img
                      src="/images/workshop-kids.webp"
                      alt="Children learning cloth mosaic at community workshop"
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] text-gamboge-light uppercase mb-3">The Artisan</p>
            <h2 className="text-2xl sm:text-3xl font-chinese-display text-gamboge-light mb-5 leading-tight">
              {t('home.ourStory')}
            </h2>
            <p className="text-ink-300 leading-relaxed mb-6 text-[15px]">
              {t('home.storySnippet')}
            </p>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-ink-600" />
              <span className="text-xs text-ink-500 tracking-widest">✦</span>
              <div className="h-px flex-1 bg-ink-600" />
            </div>
            <Link
              to="/our-story"
              className="inline-flex items-center gap-2 text-gamboge-light hover:text-gamboge font-medium transition-colors border-b border-gamboge pb-1"
            >
              {t('home.readStory')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
