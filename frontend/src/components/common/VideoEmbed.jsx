/**
 * Parse video URL → { platform, embedUrl }
 * Supports: YouTube, Bilibili, direct video files
 */
function parseVideoUrl(url) {
  if (!url) return null

  // YouTube
  const ytPatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([\w-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([\w-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([\w-]{11})/,
  ]
  for (const p of ytPatterns) {
    const m = url.match(p)
    if (m) return { platform: 'youtube', embedUrl: `https://www.youtube.com/embed/${m[1]}` }
  }

  // Bilibili (B站)
  const biliPatterns = [
    /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[\w]+)/,
    /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(av\d+)/i,
    /(?:https?:\/\/)?b23\.tv\/(BV[\w]+)/,
  ]
  for (const p of biliPatterns) {
    const m = url.match(p)
    if (m) return { platform: 'bilibili', embedUrl: `https://player.bilibili.com/player.html?bvid=${m[1]}&page=1&high_quality=1&autoplay=0` }
  }

  // Direct video file
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)) {
    return { platform: 'direct', embedUrl: url }
  }

  // Unknown — link fallback
  return { platform: 'link', embedUrl: url }
}

export default function VideoEmbed({ url }) {
  if (!url) return null

  const video = parseVideoUrl(url)
  if (!video) return null

  return (
    <section className="mt-12">
      {/* Section header */}
      <div className="mb-4">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-1">
          ✦ Behind the Piece
        </p>
        <h3 className="text-lg font-chinese-display text-ink-900">
          Watch the Artisan at Work
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-px w-6 bg-cinnabar opacity-40" />
          <div className="h-px w-3 bg-cinnabar opacity-25" />
        </div>
      </div>

      {/* Video container with fabric frame */}
      <div className="bg-white rounded-fabric-lg border-stitch-warm overflow-hidden shadow-sm">
        {/* Ornamental top bar — like a scroll rod */}
        <div className="h-1 bg-gradient-to-r from-warmth-200 via-cinnabar to-warmth-200 opacity-40" />

        <div className="p-2 sm:p-3">
          <div className="relative rounded-fabric overflow-hidden bg-ink-900">
            {(video.platform === 'youtube' || video.platform === 'bilibili') ? (
              /* YouTube / Bilibili embed */
              <div className="aspect-video">
                <iframe
                  src={video.embedUrl}
                  title="Artisan at work — cloth mosaic process"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : video.platform === 'direct' ? (
              /* Direct video file */
              <div className="aspect-video">
                <video
                  controls
                  className="w-full h-full object-contain bg-ink-900"
                  preload="metadata"
                  poster="/images/hero-detail.jpg"
                >
                  <source src={video.embedUrl} />
                  Your browser does not support video playback.
                </video>
              </div>
            ) : (
              /* Unknown — link fallback */
              <div className="aspect-video flex items-center justify-center">
                <a
                  href={video.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cinnabar hover:text-cinnabar-dark font-medium text-sm"
                >
                  Open Video →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        <div className="px-4 pb-4 flex items-center gap-3">
          <div className="w-5 h-5 bg-cinnabar rounded-fabric-sm flex items-center justify-center shrink-0">
            <span className="text-white text-[9px] font-bold">匠</span>
          </div>
          <p className="text-xs text-ink-500">
            See how Grandma Luo brings this piece to life — every cut, layer, and stitch by hand.
          </p>
        </div>
      </div>
    </section>
  )
}
