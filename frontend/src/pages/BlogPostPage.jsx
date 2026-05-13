import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'
import { JsonLd, articleSchema, breadcrumbSchema } from '../components/common/JsonLd'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: post, loading, error } = useApi(`/api/blog-posts/${slug}`)

  if (loading) return <PostSkeleton />
  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-chinese-display text-ink-900 mb-2">Post Not Found</h1>
        <Link to="/blog" className="text-cinnabar hover:text-cinnabar-dark">← {t('common.back')}</Link>
      </div>
    )
  }

  const title = lang === 'zh' ? post.title_zh : post.title_en

  return (
    <>
      <SEOHead title={title} description={post.excerpt} image={post.cover_image} path={`/blog/${slug}`} />
      <JsonLd data={articleSchema(post)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://grandmascloth.com' },
        { name: 'Journal', url: 'https://grandmascloth.com/blog' },
        { name: title, url: `https://grandmascloth.com/blog/${slug}` },
      ])} />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link to="/blog" className="text-sm text-ink-500 hover:text-cinnabar transition-colors mb-8 inline-block">
          ← {t('nav.blog')}
        </Link>
        {post.cover_image && (
          <img src={post.cover_image} alt="" className="w-full aspect-[16/9] object-cover rounded-fabric-lg mb-8 border-stitch-warm" />
        )}
        <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-4 leading-tight">{title}</h1>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-6 bg-cinnabar opacity-40" />
          <p className="text-xs text-ink-400 tracking-wide">{post.created_at?.slice(0, 10)}</p>
        </div>
        <div className="prose prose-lg max-w-none text-ink-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  )
}

function PostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      <div className="h-4 bg-warmth-200 rounded-fabric-sm w-16 mb-8" />
      <div className="aspect-[16/9] bg-warmth-200 rounded-fabric-lg mb-8" />
      <div className="h-8 bg-warmth-200 rounded-fabric-sm w-3/4 mb-4" />
      <div className="h-4 bg-warmth-100 rounded-fabric-sm w-1/3 mb-8" />
      <div className="space-y-3">
        <div className="h-4 bg-warmth-100 rounded-fabric-sm w-full" />
        <div className="h-4 bg-warmth-100 rounded-fabric-sm w-5/6" />
        <div className="h-4 bg-warmth-100 rounded-fabric-sm w-4/6" />
      </div>
    </div>
  )
}
