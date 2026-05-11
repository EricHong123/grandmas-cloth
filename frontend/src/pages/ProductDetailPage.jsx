import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'
import VideoEmbed from '../components/common/VideoEmbed'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: product, loading, error } = useApi(`/api/products/${slug}`)

  if (loading) return <DetailSkeleton />
  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-chinese-display text-ink-900 mb-2">Product Not Found</h1>
        <Link to="/collection" className="text-cinnabar hover:text-cinnabar-dark">← {t('common.back')}</Link>
      </div>
    )
  }

  const title = lang === 'zh' ? product.title_zh : product.title_en
  const description = lang === 'zh' ? product.description_zh : product.description_en
  const materials = lang === 'zh' ? product.materials_zh : product.materials_en

  return (
    <>
      <SEOHead title={title} description={description} image={product.images?.[0]} path={`/collection/${slug}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link to="/collection" className="text-sm text-ink-500 hover:text-cinnabar transition-colors mb-8 inline-block">
          ← {t('nav.collection')}
        </Link>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image with fabric frame */}
          <div>
            <div className="aspect-[4/3] bg-warmth-100 rounded-fabric-lg overflow-hidden border-stitch-warm relative">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-warmth-100">
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 6px, var(--color-warmth-200) 6px, var(--color-warmth-200) 7px), repeating-linear-gradient(-45deg, transparent, transparent 6px, var(--color-warmth-200) 6px, var(--color-warmth-200) 7px)`,
                    }}
                  />
                  <div className="relative text-center">
                    <p className="text-4xl opacity-20">◆</p>
                    <p className="font-chinese-display text-ink-500 text-sm mt-1">{title}</p>
                  </div>
                </div>
              )}
              {/* Mounting corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gamboge opacity-60" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gamboge opacity-60" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gamboge opacity-60" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gamboge opacity-60" />
            </div>
            {/* Thumbnail strip placeholder */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.slice(1, 4).map((img, i) => (
                  <div key={i} className="w-16 h-16 rounded-fabric-sm bg-warmth-100 border-stitch-warm overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-chinese-display text-ink-900 flex-1 leading-tight">{title}</h1>
              {product.is_one_of_a_kind ? (
                <div className="seal-badge shrink-0">{t('product.oneOfAKind')}</div>
              ) : null}
            </div>

            <p className="text-3xl font-bold text-cinnabar mb-2">{product.price || t('product.priceOnRequest')}</p>
            <p className="text-xs text-ink-400 tracking-widest mb-8">
              {product.is_one_of_a_kind ? '孤品 · One of a Kind — No two pieces are alike' : ''}
            </p>

            {/* Specs in a fabric-inspired layout */}
            <div className="space-y-3 mb-8 bg-rice rounded-fabric p-5 border-stitch-warm">
              {product.size && <Spec label={t('product.size')} value={product.size} />}
              {materials && <Spec label={t('product.materials')} value={materials} />}
              {product.making_time && <Spec label={t('product.makingTime')} value={product.making_time} />}
              {product.category_name_en && (
                <Spec label={t('product.category')} value={lang === 'zh' ? product.category_name_zh : product.category_name_en} />
              )}
            </div>

            {description && (
              <div className="prose prose-sm text-ink-600 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
            )}

            {/* CTA — premium inquiry */}
            <a
              href={`https://wa.me/86?text=${encodeURIComponent(`Hi, I'm interested in "${title}" — is it still available?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-cinnabar hover:bg-cinnabar-dark text-white px-8 py-3.5 rounded-fabric font-medium transition-colors shadow-sm group"
            >
              <WhatsAppIcon />
              <div className="text-left">
                <span className="text-sm font-medium block">{t('product.inquire')}</span>
                <span className="text-[11px] opacity-70">Response within hours</span>
              </div>
              <span className="opacity-50 group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Video section — full width below product info */}
        <VideoEmbed url={product.video_url} />
      </div>
    </>
  )
}

function Spec({ label, value }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-ink-400 w-28 shrink-0 text-xs tracking-wide uppercase">{label}</span>
      <span className="text-ink-800 font-medium">{value}</span>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
    </svg>
  )
}

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      <div className="h-4 bg-warmth-200 rounded-fabric-sm w-24 mb-8" />
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-[4/3] bg-warmth-200 rounded-fabric-lg" />
        <div className="space-y-4">
          <div className="h-8 bg-warmth-200 rounded-fabric-sm w-3/4" />
          <div className="h-6 bg-warmth-200 rounded-fabric-sm w-1/4" />
          <div className="h-4 bg-warmth-100 rounded-fabric-sm w-full" />
          <div className="h-4 bg-warmth-100 rounded-fabric-sm w-5/6" />
        </div>
      </div>
    </div>
  )
}
