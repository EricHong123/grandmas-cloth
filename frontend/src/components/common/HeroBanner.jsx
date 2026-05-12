import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function HeroBanner() {
  const { t } = useTranslation()
  return (
    <section className="relative overflow-hidden bg-warmth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-0 items-center">

          {/* Left — refined text column */}
          <div className="relative z-10 lg:pr-8 py-8 lg:py-12">
            {/* Heritage marker — subtle, curious */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[2px] bg-cinnabar opacity-60" />
              <span className="text-[11px] tracking-[0.25em] text-ink-400 uppercase font-medium">
                Living Heritage · Handmade in China
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-chinese-display text-ink-900 leading-[1.08]">
              Cloth Mosaic.<br />
              <span className="text-cinnabar">One stitch</span> at a time.
            </h1>

            <p className="mt-6 text-base text-ink-500 leading-relaxed max-w-md">
              Handcrafted textile paintings by a 4th-generation artisan. Each piece cut, layered, and stitched from silk, cotton, and centuries of tradition.
            </p>

            {/* Trust micro-signals */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-ink-400">
              <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-1.5 h-1.5 bg-jade rounded-full shrink-0" />One of a Kind</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-1.5 h-1.5 bg-jade rounded-full shrink-0" />2–4 Weeks to Create</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-1.5 h-1.5 bg-jade rounded-full shrink-0" />Free Worldwide Shipping</span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/collection"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-cinnabar hover:bg-cinnabar-dark text-white font-medium rounded-fabric transition-colors shadow-sm text-sm"
              >
                View the Collection
                <span className="ml-2 opacity-70">→</span>
              </Link>
              <Link
                to="/our-story"
                className="inline-flex items-center justify-center px-8 py-3.5 border-stitch text-ink-700 hover:bg-warmth-100 font-medium rounded-fabric transition-all text-sm"
              >
                Meet the Artisan
              </Link>
            </div>
          </div>

          {/* Right — dominant artwork image */}
          <div className="relative lg:-mr-8">
            {/* Main artwork — large, immersive */}
            <div className="relative">
              <div className="bg-white rounded-fabric-lg shadow-xl p-2.5 sm:p-3 border-stitch-warm">
                <div className="relative rounded-fabric overflow-hidden">
                  <img
                    src="/images/hero-artwork.jpg"
                    alt="Handcrafted Chinese cloth mosaic painting — silk and cotton textile art"
                    className="w-full aspect-[4/5] lg:aspect-[5/6] object-cover"
                  />
                  {/* Subtle fabric grain overlay */}
                  <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 1.5px),
                        repeating-linear-gradient(90deg, transparent, transparent 1px, #000 1px, #000 1.5px)
                      `,
                    }}
                  />
                  {/* Mounting corners — traditional framing */}
                  <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-cinnabar opacity-50" />
                  <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-cinnabar opacity-50" />
                  <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-cinnabar opacity-50" />
                  <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-cinnabar opacity-50" />
                </div>
              </div>

              {/* Seal badge on the artwork */}
              <div className="absolute top-6 -right-2 z-20 seal-badge bg-white/90 backdrop-blur-sm">
                One of a Kind
              </div>
            </div>

            {/* Second image — layered behind, peeking out */}
            <div className="absolute -bottom-8 -left-6 z-0 w-36 sm:w-44 rotate-[-5deg]">
              <div className="bg-white rounded-fabric shadow-lg p-1.5 border-stitch-warm">
                <div className="rounded-fabric-sm overflow-hidden">
                  <img
                    src="/images/hero-detail.jpg"
                    alt="Close-up detail of cloth mosaic craftsmanship"
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom trust bar — media recognition */}
      <div className="border-t border-dashed border-warmth-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          <span className="text-[10px] tracking-[0.25em] text-ink-400 uppercase">As Featured In</span>
          <span className="text-sm font-chinese-display text-ink-700">广州新闻</span>
          <span className="text-sm font-chinese-display text-ink-700">虎门新闻</span>
          <span className="text-sm font-chinese-display text-ink-700">虎门日报</span>
          <span className="hidden sm:block text-[10px] tracking-[0.15em] text-cinnabar font-medium">✦ EST. 1980s</span>
        </div>
      </div>
    </section>
  )
}
