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
      <div className="aspect-[4/3] overflow-hidden relative">
        {image ? (
          <>
            <img src={image} alt={title} className="w-full h-full object-cover transition-all duration-700 group-hover:saturate-[1.1]" loading="lazy" />
            {/* Fabric grain overlay */}
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, #000 2px, #000 3px)`,
              }}
            />
          </>
        ) : (
          /* Emptystate — fabric texture + title, not [Photo] */
          <div className="w-full h-full flex items-center justify-center bg-warmth-100 relative">
            {/* Fabric weave pattern */}
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, transparent, transparent 4px, var(--color-warmth-200) 4px, var(--color-warmth-200) 5px),
                  repeating-linear-gradient(-45deg, transparent, transparent 4px, var(--color-warmth-200) 4px, var(--color-warmth-200) 5px)
                `,
              }}
            />
            <div className="relative text-center px-3">
              <p className="text-3xl opacity-20 mb-1">◆</p>
              <p className="font-chinese-display text-ink-600 text-sm leading-snug">{title}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 relative">
        {product.is_one_of_a_kind ? (
          <div className="absolute -top-3 right-3 seal-badge">
            {t('product.oneOfAKind')}
          </div>
        ) : null}

        <h3 className="font-chinese-display text-ink-900 group-hover:text-cinnabar transition-colors text-sm leading-snug pr-16">
          {title}
        </h3>
        <p className="text-xs text-ink-400 mt-1.5">{product.size}</p>

        {/* Making time — premium signal */}
        {product.making_time && (
          <p className="text-[11px] text-ink-400 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-gamboge rounded-full" />
            {product.making_time}
          </p>
        )}

        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-sm font-bold text-cinnabar">{product.price || t('product.priceOnRequest')}</p>
            {product.is_one_of_a_kind && (
              <p className="text-[10px] text-ink-400 mt-0.5">Only one exists</p>
            )}
          </div>
          <span className="text-xs text-cinnabar opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
