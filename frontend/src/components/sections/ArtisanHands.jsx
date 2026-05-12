export default function ArtisanHands() {
  return (
    <section className="relative bg-rice overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, var(--color-ink-600) 8px, var(--color-ink-600) 9px)' }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        {/* Artisan photo */}
        <div className="mb-8 inline-block">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-stitch-warm shadow-lg mx-auto bg-warmth-200">
            <img
              src="/images/grandma-at-work.webp"
              alt="Grandma Luo — 4th-generation cloth mosaic artisan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Ornament */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-10 bg-cinnabar opacity-30" />
          <span className="text-cinnabar opacity-50 text-xs">◆</span>
          <div className="h-px w-10 bg-cinnabar opacity-30" />
        </div>

        {/* Quote */}
        <blockquote className="text-xl sm:text-2xl lg:text-3xl font-chinese-display text-ink-800 leading-relaxed italic max-w-2xl mx-auto">
          &ldquo;Every piece begins with my hands —<br className="hidden sm:block" />
          cutting, layering, stitching.<br />
          <span className="text-cinnabar not-italic">No two are ever the same.</span>&rdquo;
        </blockquote>

        {/* Attribution */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-warmth-200 rounded-fabric-sm flex items-center justify-center">
            <span className="text-warmth-600 text-xs font-bold">布</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-chinese-display text-ink-800">Grandma Luo</p>
            <p className="text-xs text-ink-400">4th-generation cloth mosaic artisan · Since 1980s</p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-1 h-1 bg-cinnabar rounded-full opacity-30" />
          ))}
        </div>
      </div>
    </section>
  )
}
