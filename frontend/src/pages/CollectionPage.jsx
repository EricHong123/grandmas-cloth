import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import ProductCard from '../components/common/ProductCard'
import SEOHead from '../components/common/SEOHead'

export default function CollectionPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || ''
  const [view, setView] = useState('grid')

  const query = `/api/products?limit=50${activeCategory ? `&category=${activeCategory}` : ''}`
  const { data: products, loading } = useApi(query)
  const { data: categories } = useApi('/api/categories')

  const handleCategory = (slug) => {
    const params = slug ? { category: slug } : {}
    setSearchParams(params)
  }

  return (
    <>
      <SEOHead title={t('nav.collection')} path="/collection" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ {t('nav.collection')}</p>
            <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-2">{t('nav.collection')}</h1>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-cinnabar opacity-40" />
              <div className="h-px w-4 bg-cinnabar opacity-25" />
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white rounded-fabric-sm border-stitch-warm p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-fabric-sm transition-colors ${view === 'grid' ? 'bg-warmth-200 text-cinnabar' : 'text-ink-400 hover:text-ink-600'}`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setView('masonry')}
              className={`p-2 rounded-fabric-sm transition-colors ${view === 'masonry' ? 'bg-warmth-200 text-cinnabar' : 'text-ink-400 hover:text-ink-600'}`}
              title="Gallery view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
              </svg>
            </button>
          </div>
        </div>

        {categories && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => handleCategory('')}
              className={`px-4 py-2 rounded-fabric-sm text-sm font-medium transition-colors ${
                !activeCategory ? 'bg-cinnabar text-white' : 'bg-white text-ink-600 hover:bg-warmth-100 border-stitch-warm'
              }`}
            >
              {t('product.all')}
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => handleCategory(c.slug)}
                className={`px-4 py-2 rounded-fabric-sm text-sm font-medium transition-colors ${
                  activeCategory === c.slug ? 'bg-cinnabar text-white' : 'bg-white text-ink-600 hover:bg-warmth-100 border-stitch-warm'
                }`}
              >
                {c.name_en}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <LoadingView view={view} />
        ) : products && products.length > 0 ? (
          view === 'masonry' ? (
            <MasonryView products={products} lang={lang} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )
        ) : (
          <p className="text-center text-ink-400 py-12">No products found.</p>
        )}
      </div>
    </>
  )
}

function MasonryView({ products, lang }) {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
      {products?.map(p => {
        const img = p.images?.[0]
        const title = lang === 'zh' ? p.title_zh : p.title_en
        return (
          <div key={p.id} className="break-inside-avoid bg-white rounded-fabric overflow-hidden border-stitch-warm card-hover-fabric">
            <a href={`/collection/${p.slug}`}>
              <div className="bg-warmth-100">
                {img ? (
                  <img src={img} alt={title} className="w-full" loading="lazy" />
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center text-ink-300">
                    <span className="text-2xl opacity-30">🧵</span>
                  </div>
                )}
              </div>
            </a>
            <div className="p-3">
              <a href={`/collection/${p.slug}`} className="text-sm font-chinese-display text-ink-900 hover:text-cinnabar transition-colors">{title}</a>
              {p.price && <p className="text-xs text-cinnabar font-medium mt-1">{p.price}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LoadingView({ view }) {
  return (
    <div className={view === 'masonry' ? 'columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className={`animate-pulse ${view === 'masonry' ? 'break-inside-avoid mb-4' : ''}`}>
          <div className="bg-white rounded-fabric border-stitch-warm">
            <div className={`bg-warmth-200 ${view === 'masonry' ? 'aspect-[3/4]' : 'aspect-[4/3]'} rounded-fabric-sm`} />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-warmth-200 rounded-fabric-sm w-3/4" />
              <div className="h-3 bg-warmth-100 rounded-fabric-sm w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
