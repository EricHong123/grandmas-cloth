export default function ArtisanVideo() {
  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-6">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ Watch the Process</p>
        <h2 className="text-xl sm:text-2xl font-chinese-display text-ink-900">
          See Grandma Luo at Work
        </h2>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-cinnabar opacity-40" />
          <div className="h-px w-4 bg-cinnabar opacity-25" />
        </div>
      </div>

      <div className="bg-white rounded-fabric-lg border-stitch-warm overflow-hidden shadow-sm">
        {/* Ornamental top bar */}
        <div className="h-1 bg-gradient-to-r from-warmth-200 via-cinnabar to-warmth-200 opacity-40" />
        <div className="p-2 sm:p-3">
          <div className="relative rounded-fabric overflow-hidden bg-ink-900">
            <video
              controls
              preload="metadata"
              poster="/images/grandma-at-work.webp"
              className="w-full aspect-video object-contain"
            >
              <source src="/videos/grandma-making.mp4" type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
        </div>
        <div className="px-4 pb-4 flex items-center gap-3">
          <div className="w-5 h-5 bg-cinnabar rounded-fabric-sm flex items-center justify-center shrink-0">
            <span className="text-white text-[9px] font-bold">匠</span>
          </div>
          <p className="text-xs text-ink-500">
            Every piece is cut, layered, and stitched by hand — a lifetime of craft in every frame.
          </p>
        </div>
      </div>
    </section>
  )
}
