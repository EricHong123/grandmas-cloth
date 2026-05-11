import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApi } from '../../hooks/useApi'
import ProductCard from '../common/ProductCard'

export default function FeaturedProducts() {
  const { t } = useTranslation()
  const { data, loading } = useApi('/api/products?featured=1&limit=6')

  if (loading || !data) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeader t={t} />
        <LoadingGrid />
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <SectionHeader t={t} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <Link to="/collection" className="sm:hidden mt-6 text-center block text-sm font-medium text-cinnabar hover:text-cinnabar-dark">
        {t('common.viewMore')} →
      </Link>
    </section>
  )
}

function SectionHeader({ t }) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-[11px] tracking-[0.2em] text-ink-400 uppercase mb-2">
          The Collection
        </p>
        <h2 className="text-2xl sm:text-3xl font-chinese-display text-ink-900">
          {t('home.featuredProducts')}
        </h2>
        <p className="mt-2 text-sm text-ink-500 max-w-md">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-fabric overflow-hidden border-stitch-warm animate-pulse">
          <div className="aspect-[4/3] bg-warmth-200" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-warmth-200 rounded-fabric-sm w-3/4" />
            <div className="h-3 bg-warmth-100 rounded-fabric-sm w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
