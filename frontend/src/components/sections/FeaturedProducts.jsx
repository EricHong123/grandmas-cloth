import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApi } from '../../hooks/useApi'
import ProductCard from '../common/ProductCard'

export default function FeaturedProducts() {
  const { t } = useTranslation()
  const { data, loading } = useApi('/api/products?featured=1&limit=8')

  if (loading || !data) {
    return (
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-20">
        <SectionHeader t={t} />
        <LoadingGrid />
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <SectionHeader t={t} />
      </div>

      {/* Desktop: grid. Mobile: horizontal scroll with snap */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {data.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* Mobile carousel */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto px-3 pb-4 snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {data.map(p => (
            <div key={p.id} className="min-w-[75vw] max-w-[75vw] snap-start shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
          {/* Last card: View All */}
          <Link to="/collection" className="min-w-[75vw] max-w-[75vw] snap-start shrink-0 bg-rice rounded-fabric border-stitch-warm border-dashed flex items-center justify-center min-h-[280px]">
            <div className="text-center">
              <p className="text-3xl mb-3">→</p>
              <p className="font-chinese-display text-ink-800">{t('common.viewMore')}</p>
              <p className="text-xs text-ink-500 mt-1">View all pieces</p>
            </div>
          </Link>
        </div>
        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {[...data, { id: 'more' }].map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-cinnabar' : 'bg-warmth-300'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ t }) {
  return (
    <div className="flex items-end justify-between mb-8 sm:mb-10">
      <div>
        <p className="text-[11px] tracking-[0.2em] text-ink-400 uppercase mb-2">The Collection</p>
        <h2 className="text-2xl sm:text-3xl font-chinese-display text-ink-900">{t('home.featuredProducts')}</h2>
        <p className="mt-2 text-sm text-ink-500 max-w-md hidden sm:block">
          Each piece is handmade to order. Allow 2–4 weeks for creation.
        </p>
      </div>
      <Link to="/collection" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-cinnabar hover:text-cinnabar-dark transition-colors border-b border-cinnabar pb-0.5">
        View All Pieces →
      </Link>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-fabric overflow-hidden border-stitch-warm animate-pulse">
            <div className="aspect-[4/3] bg-warmth-200" />
            <div className="p-4 space-y-2"><div className="h-4 bg-warmth-200 rounded-fabric-sm w-3/4" /><div className="h-3 bg-warmth-100 rounded-fabric-sm w-1/2" /></div>
          </div>
        ))}
      </div>
      <div className="sm:hidden flex gap-3 overflow-x-auto px-1 pb-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="min-w-[75vw] max-w-[75vw] shrink-0 bg-white rounded-fabric overflow-hidden border-stitch-warm animate-pulse">
            <div className="aspect-[4/3] bg-warmth-200" />
            <div className="p-4 space-y-2"><div className="h-4 bg-warmth-200 rounded-fabric-sm w-3/4" /><div className="h-3 bg-warmth-100 rounded-fabric-sm w-1/2" /></div>
          </div>
        ))}
      </div>
    </div>
  )
}
