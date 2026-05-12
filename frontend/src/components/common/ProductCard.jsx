import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const title = lang === 'zh' ? product.title_zh : product.title_en
  const image = product.images?.[0] || ''

  return (
    <Link
      to={`/collection/${product.slug}`}
      className="group block bg-white rounded-fabric overflow-hidden border-stitch-warm card-hover-fabric relative"
    >
      {/* Image area — adaptive ratio, no forced crop */}
      <div className="overflow-hidden relative bg-warmth-100 flex items-center justify-center" style={{ minHeight: 200 }}>
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-auto max-h-[360px] object-contain transition-all duration-700 group-hover:saturate-[1.1]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, var(--color-warmth-200) 4px, var(--color-warmth-200) 5px), repeating-linear-gradient(-45deg, transparent, transparent 4px, var(--color-warmth-200) 4px, var(--color-warmth-200) 5px)' }} />
            <div className="relative text-center px-3">
              <p className="text-3xl opacity-20 mb-1">◆</p>
              <p className="font-chinese-display text-ink-600 text-sm leading-snug">{title}</p>
            </div>
          </div>
        )}
        {/* Fabric grain overlay */}
        {image && <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, #000 2px, #000 3px)' }} />}
        {/* Status */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {product.is_featured ? <span className="text-[10px] bg-gamboge text-ink-900 px-1.5 py-0.5 rounded-fabric-sm font-medium">⭐</span> : null}
          {product.is_one_of_a_kind ? <span className="text-[10px] bg-cinnabar text-white px-1.5 py-0.5 rounded-fabric-sm font-medium">孤</span> : null}
        </div>
      </div>

      <div className="p-4 relative">
        {product.is_one_of_a_kind ? (
          <div className="absolute -top-3 right-3 seal-badge">{t('product.oneOfAKind')}</div>
        ) : null}
        <h3 className="font-chinese-display text-ink-900 group-hover:text-cinnabar transition-colors text-sm leading-snug pr-16">{title}</h3>
        <p className="text-xs text-ink-400 mt-1.5">{product.size}</p>
        {product.making_time && (
          <p className="text-[11px] text-ink-400 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-gamboge rounded-full" />{product.making_time}
          </p>
        )}
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-sm font-bold text-cinnabar">{product.price || t('product.priceOnRequest')}</p>
            {product.is_one_of_a_kind && <p className="text-[10px] text-ink-400 mt-0.5">Only one exists</p>}
          </div>
          <span className="text-xs text-cinnabar opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
        </div>
      </div>
    </Link>
  )
}
