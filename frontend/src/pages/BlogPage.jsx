import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'

export default function BlogPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: posts, loading } = useApi('/api/blog-posts?limit=9')

  return (
    <>
      <SEOHead title={t('nav.blog')} path="/blog" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ Journal</p>
        <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-2">{t('nav.blog')}</h1>
        <div className="flex items-center gap-2 mb-12">
          <div className="h-px w-8 bg-indigo opacity-50" />
          <div className="h-px w-4 bg-indigo opacity-25" />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-fabric border-stitch-warm">
                <div className="aspect-[16/9] bg-warmth-200" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-warmth-200 rounded-fabric-sm w-3/4" />
                  <div className="h-3 bg-warmth-100 rounded-fabric-sm w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-fabric overflow-hidden border-stitch-warm card-hover-fabric"
              >
                <div className="aspect-[16/9] bg-warmth-100 overflow-hidden">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt="" className="w-full h-full object-cover transition-all duration-700 group-hover:saturate-[1.1]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-300">
                      <span className="text-2xl opacity-30">🧵</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-chinese-display text-ink-900 group-hover:text-cinnabar transition-colors">
                    {lang === 'zh' ? post.title_zh : post.title_en}
                  </h3>
                  <p className="text-sm text-ink-500 mt-2 line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-ink-400 mt-3">{post.created_at?.slice(0, 10)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
