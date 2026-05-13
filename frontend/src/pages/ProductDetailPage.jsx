import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'
import { JsonLd, productSchema, breadcrumbSchema } from '../components/common/JsonLd'
import VideoEmbed from '../components/common/VideoEmbed'
import ProductCard from '../components/common/ProductCard'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const preview = searchParams.get('preview') === '1' ? '?preview=1' : ''
  const { data: product, loading, error } = useApi(`/api/products/${slug}${preview}`)

  // Lightbox
  const [lightbox, setLightbox] = useState(null)
  const closeLightbox = useCallback(() => setLightbox(null), [])
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeLightbox])

  // Related products — fetch all, filter by same category client-side
  const { data: allProducts } = useApi('/api/products?limit=50')

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
  const mainImage = product.images?.[0] || ''
  const hasMultipleImages = product.images?.length > 1
  const relatedItems = (allProducts || []).filter(p => p.slug !== slug && p.category_id === product.category_id).slice(0, 4)

  return (
    <>
      <SEOHead title={title} description={description?.replace(/<[^>]*>/g, '').substring(0, 160)} image={mainImage} path={`/collection/${slug}`} />
      <JsonLd data={productSchema(product)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://grandmascloth.com' },
        { name: 'Collection', url: 'https://grandmascloth.com/collection' },
        { name: title, url: `https://grandmascloth.com/collection/${slug}` },
      ])} />

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center cursor-zoom-out" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl z-10">&times;</button>
          <img src={lightbox} alt={title} className="max-w-full max-h-[92vh] object-contain px-4" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-ink-400 mb-8">
          <Link to="/" className="hover:text-cinnabar">Home</Link>
          <span>/</span>
          <Link to="/collection" className="hover:text-cinnabar">{t('nav.collection')}</Link>
          <span>/</span>
          <span className="text-ink-600">{title.substring(0, 40)}{title.length > 40 ? '...' : ''}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* ── LEFT: Images ── */}
          <div>
            {/* Main image — large, clickable, adaptive ratio */}
            <div
              className="bg-warmth-50 rounded-fabric-lg border-stitch-warm overflow-hidden cursor-zoom-in relative flex items-center justify-center"
              style={{ minHeight: 400 }}
              onClick={() => mainImage && setLightbox(mainImage)}
            >
              {mainImage ? (
                <img src={mainImage} alt={title} className="w-full h-auto max-h-[600px] object-contain" />
              ) : (
                <div className="text-center text-ink-400">
                  <span className="text-6xl opacity-20">◆</span>
                  <p className="font-chinese-display text-sm mt-2">{title}</p>
                </div>
              )}
              {mainImage && (
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-fabric-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to enlarge
                </div>
              )}
              {/* Mounting corners */}
              {mainImage && <>
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gamboge opacity-50" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gamboge opacity-50" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gamboge opacity-50" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gamboge opacity-50" />
              </>}
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setLightbox(img)}
                    className={`w-16 h-16 rounded-fabric-sm border-stitch-warm overflow-hidden cursor-pointer transition-all ${mainImage === img ? 'ring-2 ring-cinnabar' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${title} detail ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div>
            {/* One-of-a-kind banner */}
            {product.is_one_of_a_kind && (
              <div className="flex items-center gap-2 mb-4 bg-cinnabar/5 border border-cinnabar/20 rounded-fabric-sm px-3 py-2 text-[11px] text-cinnabar font-medium">
                <span className="text-base">◆</span>
                This is a <strong>one-of-a-kind piece</strong>. Once sold, it cannot be recreated.
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-chinese-display text-ink-900 leading-tight mb-2">{title}</h1>

            {/* One-line value proposition */}
            <p className="text-sm text-ink-500 mb-6 leading-relaxed">
              {product.making_time
                ? `Handcrafted over ${product.making_time} — each stitch, cut, and layer by Grandma Luo's hands.`
                : 'Handcrafted with decades of tradition in every stitch.'}
            </p>

            {/* Price — prominent */}
            <p className="text-3xl font-bold text-cinnabar mb-6">{product.price || t('product.priceOnRequest')}</p>

            {/* Key highlights — 3 icons, not a spec table */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {product.size && (
                <div className="bg-rice rounded-fabric p-3 text-center border-stitch-warm">
                  <p className="text-lg mb-0.5">📐</p>
                  <p className="text-[10px] text-ink-400 uppercase tracking-wide">Size</p>
                  <p className="text-xs font-medium text-ink-800 mt-0.5">{product.size}</p>
                </div>
              )}
              {materials && (
                <div className="bg-rice rounded-fabric p-3 text-center border-stitch-warm">
                  <p className="text-lg mb-0.5">🧵</p>
                  <p className="text-[10px] text-ink-400 uppercase tracking-wide">Materials</p>
                  <p className="text-xs font-medium text-ink-800 mt-0.5">{materials}</p>
                </div>
              )}
              {product.making_time && (
                <div className="bg-rice rounded-fabric p-3 text-center border-stitch-warm">
                  <p className="text-lg mb-0.5">⏳</p>
                  <p className="text-[10px] text-ink-400 uppercase tracking-wide">Creation</p>
                  <p className="text-xs font-medium text-ink-800 mt-0.5">{product.making_time}</p>
                </div>
              )}
            </div>

            {/* Description — story-driven */}
            {description && (
              <div className="prose prose-sm text-ink-600 mb-8 leading-relaxed max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
            )}

            {/* CTA */}
            <a
              href={`https://wa.me/8613532328175?text=${encodeURIComponent(`Hi, I'm interested in "${title}" — is it still available?`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-cinnabar hover:bg-cinnabar-dark text-white px-8 py-4 rounded-fabric font-medium transition-colors shadow-sm group w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
              <div className="text-left">
                <span className="font-medium block">{t('product.inquire')}</span>
                <span className="text-xs opacity-70">Response within hours</span>
              </div>
            </a>
          </div>
        </div>

        {/* ── Trust bar ── */}
        <div className="mt-12 pt-8 border-t border-dashed border-warmth-300 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-ink-400">
          <span>✦ As featured in <strong className="text-ink-600">广州新闻</strong></span>
          <span>✦ <strong className="text-ink-600">虎门新闻</strong></span>
          <span>✦ <strong className="text-ink-600">虎门日报</strong></span>
          <span>✦ <strong className="text-ink-600">4th-generation</strong> artisan</span>
          <span>✦ <strong className="text-ink-600">Free</strong> worldwide shipping</span>
        </div>

        {/* ── Video ── */}
        <VideoEmbed url={product.video_url} />

        {/* ── You May Also Like ── */}
        {relatedItems.length > 0 && (
          <section className="mt-16 pt-10 border-t border-dashed border-warmth-300">
            <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-1">✦ You May Also Like</p>
            <h2 className="text-xl font-chinese-display text-ink-900 mb-6">Related Pieces</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedItems.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      <div className="h-4 bg-warmth-200 rounded-fabric-sm w-48 mb-8" />
      <div className="grid lg:grid-cols-2 gap-14">
        <div className="bg-warmth-200 rounded-fabric-lg" style={{ minHeight: 400 }} />
        <div className="space-y-4">
          <div className="h-6 bg-warmth-200 rounded-fabric-sm w-2/3" />
          <div className="h-8 bg-warmth-200 rounded-fabric-sm w-1/3" />
          <div className="h-20 bg-warmth-100 rounded-fabric w-full" />
          <div className="h-12 bg-warmth-200 rounded-fabric w-1/2" />
        </div>
      </div>
    </div>
  )
}
