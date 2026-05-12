import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../../config'

const API = `${API_BASE}/api/admin`

function authHeaders(json = true) {
  const h = { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
  if (json) h['Content-Type'] = 'application/json'
  return h
}

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders(opts.json !== false), ...opts })
  return res.json()
}

/* ── Slug generation ── */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

function uniqueSlug(base, existingSlugs, currentId) {
  let slug = base
  let n = 2
  while (existingSlugs.has(slug)) {
    const existing = [...existingSlugs].find(s => s === slug)
    if (currentId && existing === slug) break // editing own slug is fine
    slug = `${base}-${n}`
    n++
  }
  return slug
}

/* ── Toast notification system ── */

let toastId = 0
const ToastContext = { listeners: new Set() }

function useToast() {
  const [toasts, setToasts] = useState([])
  useEffect(() => {
    const fn = (t) => setToasts(prev => [...prev, t])
    ToastContext.listeners.add(fn)
    return () => ToastContext.listeners.delete(fn)
  }, [])
  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id))
  return { toasts, dismiss }
}

function toast(message, type = 'success') {
  const id = ++toastId
  ToastContext.listeners.forEach(fn => fn({ id, message, type }))
  setTimeout(() => {
    ToastContext.listeners.forEach(fn => {
      fn({ id, type: '__dismiss' })
    })
  }, 3500)
}

function ToastContainer({ toasts, dismiss }) {
  const filtered = toasts.filter(t => t.type !== '__dismiss')
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {filtered.map(t => (
        <div key={t.id}
          className={`pointer-events-auto px-4 py-2.5 rounded-fabric text-sm font-medium shadow-lg flex items-center gap-2 animate-[slideUp_0.3s_ease-out] ${
            t.type === 'error' ? 'bg-red-600 text-white' :
            t.type === 'info' ? 'bg-ink-800 text-white' :
            'bg-jade text-white'
          }`}
          onClick={() => dismiss(t.id)}
        >
          <span>{t.type === 'error' ? '✕' : t.type === 'info' ? 'ℹ' : '✓'}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}

/* ── Sidebar ── */

const NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'products', icon: '🖼️', label: 'Products' },
  { id: 'blog', icon: '📝', label: 'Journal' },
  { id: 'media', icon: '📸', label: 'Media' },
]

/* ── Stats cards ── */

function StatCard({ value, label, color, onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-fabric border-stitch-warm p-5 card-hover-fabric ${onClick ? 'cursor-pointer' : ''}`}>
      <p className={`text-3xl font-chinese-display font-bold ${color || 'text-ink-900'}`}>{value}</p>
      <p className="text-xs text-ink-400 mt-1">{label}</p>
    </div>
  )
}

/* ── Product card ── */

function ProductCard({ p, onClick, onDragStart, onDrop, onDragOver, isDragging }) {
  const img = p.images?.[0] || ''
  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.setData('text/plain', String(p.id)); onDragStart?.(p); e.currentTarget.style.opacity = '0.5' }}
      onDragEnd={e => { e.currentTarget.style.opacity = '1'; onDragStart?.(null) }}
      onDrop={e => { e.preventDefault(); onDrop?.(p, parseInt(e.dataTransfer.getData('text/plain'))) }}
      onDragOver={e => { e.preventDefault(); onDragOver?.(p) }}
      onClick={() => onClick?.(p)}
      className={`group bg-white rounded-fabric border-stitch-warm card-hover-fabric overflow-hidden cursor-pointer relative transition-all duration-200 ${isDragging ? 'ring-2 ring-cinnabar scale-[1.02]' : ''}`}
    >
      <div className="aspect-[4/3] bg-warmth-100 overflow-hidden">
        {img ? (
          <img src={img} alt={p.title_en} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-warmth-100"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, var(--color-warmth-200) 4px, var(--color-warmth-200) 5px)' }}>
            <p className="font-chinese-display text-ink-400 text-xs">{p.title_en}</p>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {p.is_featured ? <span className="text-[10px] bg-gamboge text-ink-900 px-1.5 py-0.5 rounded-fabric-sm font-medium">⭐</span> : null}
          {p.is_one_of_a_kind ? <span className="text-[10px] bg-cinnabar text-white px-1.5 py-0.5 rounded-fabric-sm font-medium">孤</span> : null}
        </div>
        <div className={`absolute top-2 right-2 flex items-center gap-1 ${p.is_published ? 'bg-jade/90 text-white' : 'bg-ink-200 text-ink-600'} text-[9px] px-1.5 py-0.5 rounded-fabric-sm font-medium`}>
          {p.is_published ? 'Live' : 'Draft'}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-chinese-display text-sm text-ink-900 truncate">{p.title_en}</h3>
        <p className="text-xs text-cinnabar font-medium mt-0.5">{p.price || '—'}</p>
      </div>
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-ink-400 text-xs" title="Drag to reorder">⠿</div>
    </div>
  )
}

/* ── Slide-out product editor ── */

function EditorPanel({ item, onClose, onSave, onDelete, categories, existingSlugs }) {
  const [form, setForm] = useState(() => {
    const initial = { ...item }
    if (!initial.slug && initial.title_en) initial.slug = slugify(initial.title_en)
    return initial
  })
  const [initialForm] = useState(() => JSON.stringify(form))
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => { setForm({ ...item }); setErrors({}) }, [item])

  const isDirty = useMemo(() => JSON.stringify(form) !== initialForm, [form, initialForm])

  const update = (f, v) => {
    setForm(p => {
      const next = { ...p, [f]: v }
      // Auto-generate slug from title_en if slug hasn't been manually edited
      if (f === 'title_en') {
        const currentSlug = p.slug
        const autoSlug = slugify(p.title_en)
        if (!currentSlug || currentSlug === autoSlug || currentSlug.startsWith(autoSlug)) {
          next.slug = uniqueSlug(slugify(v), existingSlugs, p.id)
        }
      }
      return next
    })
    setErrors(prev => ({ ...prev, [f]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title_en?.trim()) errs.title_en = 'Title is required'
    if (!form.slug?.trim()) errs.slug = 'Slug is required'
    if (form.price && !/^[\$\£\€]?\d/.test(form.price)) errs.price = 'Invalid format'
    if (form.video_url && !/^https?:\/\/.+/.test(form.video_url)) errs.video_url = 'Must be a valid URL'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch(`${API}/upload`, { method: 'POST', headers: authHeaders(false), body: fd })
    const json = await res.json()
    if (json.success) {
      update('images', [...(form.images || []), json.data.url])
      toast('Image uploaded')
    } else {
      toast('Upload failed', 'error')
    }
  }

  const handleSave = async (publishStatus) => {
    if (!validate()) { toast('Fix errors before saving', 'error'); return }
    const willPublish = publishStatus !== undefined ? publishStatus : form.is_published
    setSaving(true)
    try {
      const method = form.id ? 'PUT' : 'POST'
      const url = form.id ? `${API}/products/${form.id}` : `${API}/products`
      const body = { ...form, is_published: willPublish ? 1 : 0, category_id: parseInt(form.category_id) || null }
      if (typeof body.images === 'string') body.images = JSON.parse(body.images || '[]')
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) })
      const json = await res.json()
      if (json.success) {
        update('is_published', willPublish ? 1 : 0)
        toast(willPublish ? 'Published — now live on site' : 'Draft saved — not visible to customers')
        onSave({ ...form, is_published: willPublish ? 1 : 0 })
      } else {
        toast(json.error || 'Save failed', 'error')
      }
    } catch (err) {
      toast('Network error — try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Close without saving?')) return
    }
    onClose()
  }

  const handleDelete = () => {
    if (!window.confirm('Permanently delete this product?')) return
    onDelete(form.id)
    toast('Product deleted', 'info')
  }

  return (
    <div className="w-80 shrink-0 bg-white border-l border-dashed border-warmth-300 overflow-y-auto h-[calc(100vh-48px)] sticky top-[48px]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-chinese-display text-ink-900 text-sm">{form.id ? '✏️ Edit' : '＋ New'} Product</h3>
          <button onClick={handleClose} className="text-ink-400 hover:text-ink-900 text-lg leading-none" title="ESC to close">&times;</button>
        </div>
        {isDirty && <p className="text-[10px] text-gamboge mb-3">● Unsaved changes</p>}

        <div className="space-y-3">
          <Field label="Title (EN)" value={form.title_en || ''} onChange={v => update('title_en', v)} error={errors.title_en} required />
          <Field label="Title (ZH)" value={form.title_zh || ''} onChange={v => update('title_zh', v)} />
          <Field label="Slug" value={form.slug || ''} onChange={v => update('slug', v)} error={errors.slug} required placeholder="auto-generated-from-title" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Price" value={form.price || ''} onChange={v => update('price', v)} error={errors.price} />
            <Field label="Size" value={form.size || ''} onChange={v => update('size', v)} />
          </div>
          <Field label="Making Time" value={form.making_time || ''} onChange={v => update('making_time', v)} />
          <Field label="Materials (EN)" value={form.materials_en || ''} onChange={v => update('materials_en', v)} />
          <Field label="Materials (ZH)" value={form.materials_zh || ''} onChange={v => update('materials_zh', v)} />
          <Field label="Video URL" value={form.video_url || ''} onChange={v => update('video_url', v)} error={errors.video_url} placeholder="YouTube / Bilibili / .mp4" />

          <div>
            <label className="block text-[11px] text-ink-500 mb-1">Category</label>
            <select value={form.category_id || ''} onChange={e => update('category_id', e.target.value)}
              className="w-full px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white">
              <option value="">—</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-ink-500 mb-1">Images</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(form.images || []).map((img, i) => (
                <div key={i} className="w-14 h-14 rounded-fabric-sm overflow-hidden relative group border-stitch-warm">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => update('images', form.images.filter((_, j) => j !== i))}
                    className="absolute inset-0 bg-black/50 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ))}
            </div>
            <input type="file" accept="image/*" onChange={handleUpload} className="text-[11px]" />
          </div>

          <div>
            <label className="block text-[11px] text-ink-500 mb-1">Description (EN)</label>
            <textarea rows={2} value={form.description_en || ''} onChange={e => update('description_en', e.target.value)}
              className="w-full px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white resize-none" />
          </div>

          <div className="flex flex-wrap gap-3 text-[11px]">
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!form.is_one_of_a_kind} onChange={e => update('is_one_of_a_kind', e.target.checked ? 1 : 0)} /> One of a Kind</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!form.is_featured} onChange={e => update('is_featured', e.target.checked ? 1 : 0)} /> ⭐ Featured</label>
          </div>

          {/* Status bar */}
          <div className={`text-[11px] rounded-fabric-sm px-3 py-2 flex items-center gap-2 ${form.is_published ? 'bg-jade/10 text-jade border border-jade/30' : 'bg-ink-100 text-ink-500 border border-ink-200'}`}>
            <span className={`w-2 h-2 rounded-full ${form.is_published ? 'bg-jade' : 'bg-ink-400'}`} />
            <span className="font-medium">{form.is_published ? 'Published — visible to customers' : 'Draft — not visible to customers'}</span>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={() => handleSave(0)} disabled={saving}
              className={`flex-1 py-2 border text-xs font-medium rounded-fabric transition-colors ${
                form.is_published ? 'border-ink-300 text-ink-600 hover:bg-ink-50' : 'bg-ink-200 text-ink-500'
              }`}>
              {saving ? '...' : '💾 Save Draft'}
            </button>
            {!form.is_published && (
              <button onClick={() => handleSave(1)} disabled={saving}
                className="flex-1 py-2 bg-jade hover:bg-jade-dark text-white text-xs font-medium rounded-fabric transition-colors">
                {saving ? '...' : '🚀 Publish'}
              </button>
            )}
            {form.is_published && (
              <button onClick={() => handleSave(0)} disabled={saving}
                className="px-3 py-2 border border-gamboge text-gamboge-dark hover:bg-gamboge/10 text-xs rounded-fabric transition-colors">
                Unpublish
              </button>
            )}
            {form.id && (
              <button onClick={handleDelete}
                className="px-3 py-2 border border-red-300 text-red-500 hover:bg-red-50 text-xs rounded-fabric transition-colors">🗑️</button>
            )}
          </div>
          <p className="text-[10px] text-ink-400">Ctrl+S to save · ESC to close</p>
          {form.id && form.slug && (
            <a href={`/collection/${form.slug}${form.is_published ? '' : '?preview=1'}`} target="_blank" rel="noopener noreferrer"
              className={`block text-center text-[11px] mt-1 transition-colors ${
                form.is_published ? 'text-ink-400 hover:text-cinnabar' : 'text-gamboge hover:text-gamboge-dark'
              }`}>
              {form.is_published ? '👁 View live page →' : '🔒 Preview (draft — only you can see via this link) →'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, error, required, placeholder }) {
  return (
    <div>
      <label className="block text-[11px] text-ink-500 mb-1">
        {label}{required ? <span className="text-cinnabar ml-0.5">*</span> : ''}
      </label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-2 py-1.5 rounded-fabric-sm text-xs focus:outline-none focus:ring-2 bg-white transition-colors ${
          error ? 'border-2 border-red-400 focus:ring-red-400' : 'border-stitch-warm focus:ring-cinnabar'
        }`} />
      {error && <p className="text-[10px] text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

/* ── Dashboard view ── */

function DashboardView({ stats, onNavigate }) {
  if (!stats) return <p className="text-ink-400 text-sm">Loading...</p>
  return (
    <div>
      <h2 className="font-chinese-display text-lg text-ink-900 mb-4">Welcome back 👋</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard value={stats.totalProducts} label={`Total Products (${stats.published} published)`} color="text-ink-900" onClick={() => onNavigate('products')} />
        <StatCard value={stats.blogPosts} label="Journal Posts" color="text-indigo" onClick={() => onNavigate('blog')} />
        <StatCard value={stats.inquiries} label="Inquiries" color="text-cinnabar" />
        <StatCard value="+ New" label="Create Product" color="text-jade" onClick={() => onNavigate('products', true)} />
      </div>

      {stats.recentInquiries?.length > 0 && (
        <div>
          <h3 className="font-chinese-display text-sm text-ink-900 mb-3">📬 Recent Inquiries</h3>
          <div className="space-y-2">
            {stats.recentInquiries.map(q => (
              <div key={q.id} className="bg-white rounded-fabric border-stitch-warm p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-900 font-medium">{q.name || 'Anonymous'}</p>
                  <p className="text-xs text-ink-500">{q.message?.slice(0, 80)}{(q.message?.length > 80 ? '...' : '')}</p>
                </div>
                <span className="text-[10px] text-ink-400">{q.created_at?.slice(0, 16)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Products view ── */

function ProductsView({ items, loading, onEdit }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | published | draft | featured
  const [dragItem, setDragItem] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)

  const filtered = useMemo(() => {
    let result = items || []
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        (p.title_en || '').toLowerCase().includes(q) ||
        (p.title_zh || '').includes(q) ||
        (p.slug || '').includes(q)
      )
    }
    if (filter === 'published') result = result.filter(p => p.is_published)
    if (filter === 'draft') result = result.filter(p => !p.is_published)
    if (filter === 'featured') result = result.filter(p => p.is_featured)
    return result
  }, [items, search, filter])

  const handleDragStart = (p) => setDragItem(p)
  const handleDragEnd = () => { setDragItem(null); setDropTarget(null) }
  const handleDrop = (target, sourceId) => {
    setDropTarget(null)
    if (!sourceId || sourceId === target.id) return
    const ordered = [...(items || [])]
    const srcIdx = ordered.findIndex(p => p.id === sourceId)
    const tgtIdx = ordered.findIndex(p => p.id === target.id)
    if (srcIdx < 0 || tgtIdx < 0) return
    const [moved] = ordered.splice(srcIdx, 1)
    ordered.splice(tgtIdx, 0, moved)
    // Optimistic: update local state immediately
    const updated = ordered.map((p, i) => ({ ...p, sort_order: i }))
    // Persist in background
    fetch(`${API}/reorder`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ ids: updated.map(p => p.id) }),
    }).then(r => r.json()).then(j => {
      if (j.success) toast('Order saved')
      else toast('Failed to save order', 'error')
    }).catch(() => toast('Network error', 'error'))
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="font-chinese-display text-lg text-ink-900">Products</h2>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-36 sm:w-48 pl-7 pr-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-ink-400">🔍</span>
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 text-xs">✕</button>
            )}
          </div>
          {/* Filter */}
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white">
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="featured">⭐ Featured</option>
          </select>
          <button onClick={() => onEdit({ title_en: '', title_zh: '', slug: '', price: '', size: '', materials_en: '', materials_zh: '', making_time: '', video_url: '', is_one_of_a_kind: 1, is_featured: 0, is_published: 0, images: [], description_en: '', description_zh: '', category_id: '' })}
            className="text-xs bg-cinnabar hover:bg-cinnabar-dark text-white px-3 py-1.5 rounded-fabric font-medium transition-colors whitespace-nowrap">
            + New
          </button>
        </div>
      </div>

      {loading ? <p className="text-ink-400 text-sm">Loading...</p> : filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-400">
          <p className="text-4xl mb-2">{search || filter !== 'all' ? '🔍' : '🖼️'}</p>
          <p className="text-sm">{search || filter !== 'all' ? 'No products match' : 'No products yet'}</p>
          {search && <button onClick={() => { setSearch(''); setFilter('all') }} className="text-xs text-cinnabar mt-2">Clear filters</button>}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(p => (
              <ProductCard key={p.id} p={p} onClick={onEdit}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragOver={(target) => setDropTarget(target?.id)}
                isDragging={dragItem?.id === p.id}
              />
            ))}
          </div>
          <p className="text-[10px] text-ink-400 mt-3">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}{search || filter !== 'all' ? ' (filtered)' : ''} · Drag to reorder
          </p>
        </>
      )}
    </div>
  )
}

/* ── Blog view ── */

function BlogView({ items, loading, onEdit }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-chinese-display text-lg text-ink-900">Journal</h2>
        <button onClick={() => onEdit({ title_en: '', title_zh: '', slug: '', excerpt: '', content: '', is_published: 0 })}
          className="text-xs bg-cinnabar hover:bg-cinnabar-dark text-white px-3 py-1.5 rounded-fabric font-medium transition-colors">
          + New Post
        </button>
      </div>
      {loading ? <p className="text-ink-400 text-sm">Loading...</p> : items.length === 0 ? (
        <div className="text-center py-16 text-ink-400"><p className="text-4xl mb-2">📝</p><p className="text-sm">No posts yet</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(post => (
            <div key={post.id} onClick={() => onEdit(post)}
              className="bg-white rounded-fabric border-stitch-warm p-4 card-hover-fabric cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${post.is_published ? 'bg-jade' : 'bg-ink-300'}`} />
                <h3 className="font-chinese-display text-sm text-ink-900">{post.title_en}</h3>
              </div>
              <p className="text-xs text-ink-500 line-clamp-2">{post.excerpt}</p>
              <p className="text-[10px] text-ink-400 mt-2">{post.created_at?.slice(0, 10)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Blog editor panel ── */

function BlogEditorPanel({ item, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({ ...item })
  const [initialForm] = useState(() => JSON.stringify(item))
  const [saving, setSaving] = useState(false)
  useEffect(() => { setForm({ ...item }) }, [item])
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const isDirty = useMemo(() => JSON.stringify(form) !== initialForm, [form, initialForm])

  const handleSave = async (publishStatus) => {
    if (!form.title_en?.trim()) { toast('Title is required', 'error'); return }
    const willPublish = publishStatus !== undefined ? publishStatus : form.is_published
    setSaving(true)
    const body = { ...form, is_published: willPublish ? 1 : 0 }
    const method = form.id ? 'PUT' : 'POST'
    const url = form.id ? `${API}/blog-posts/${form.id}` : `${API}/blog-posts`
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) })
    const json = await res.json()
    setSaving(false)
    if (json.success) { update('is_published', willPublish ? 1 : 0); toast(willPublish ? 'Published' : 'Draft saved'); onSave() }
    else toast(json.error || 'Save failed', 'error')
  }

  const handleClose = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Close without saving?')) return
    onClose()
  }

  const handleDelete = () => {
    if (!window.confirm('Delete this post?')) return
    onDelete(form.id)
    onClose()
    toast('Post deleted', 'info')
  }

  return (
    <div className="w-80 shrink-0 bg-white border-l border-dashed border-warmth-300 overflow-y-auto h-[calc(100vh-48px)] sticky top-[48px]">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-chinese-display text-ink-900 text-sm">{form.id ? '✏️ Edit' : '＋ New'} Post</h3>
          <button onClick={handleClose} className="text-ink-400 hover:text-ink-900 text-lg">&times;</button>
        </div>
        {isDirty && <p className="text-[10px] text-gamboge">● Unsaved changes</p>}
        <Field label="Title (EN)" value={form.title_en || ''} onChange={v => update('title_en', v)} required />
        <Field label="Title (ZH)" value={form.title_zh || ''} onChange={v => update('title_zh', v)} />
        <Field label="Slug" value={form.slug || ''} onChange={v => update('slug', v)} required />
        <div><label className="block text-[11px] text-ink-500 mb-1">Excerpt</label>
          <textarea rows={2} value={form.excerpt || ''} onChange={e => update('excerpt', e.target.value)}
            className="w-full px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white resize-none" /></div>
        <div><label className="block text-[11px] text-ink-500 mb-1">Content (HTML)</label>
          <textarea rows={6} value={form.content || ''} onChange={e => update('content', e.target.value)}
            className="w-full px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white resize-none font-mono" /></div>
        {/* Status bar */}
        <div className={`text-[11px] rounded-fabric-sm px-3 py-2 flex items-center gap-2 ${form.is_published ? 'bg-jade/10 text-jade border border-jade/30' : 'bg-ink-100 text-ink-500 border border-ink-200'}`}>
          <span className={`w-2 h-2 rounded-full ${form.is_published ? 'bg-jade' : 'bg-ink-400'}`} />
          <span className="font-medium">{form.is_published ? 'Published — visible to customers' : 'Draft — not visible to customers'}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave(0)} disabled={saving}
            className={`flex-1 py-2 border text-xs font-medium rounded-fabric transition-colors ${
              form.is_published ? 'border-ink-300 text-ink-600 hover:bg-ink-50' : 'bg-ink-200 text-ink-500'
            }`}>
            {saving ? '...' : '💾 Save Draft'}
          </button>
          {!form.is_published && (
            <button onClick={() => handleSave(1)} disabled={saving}
              className="flex-1 py-2 bg-jade hover:bg-jade-dark text-white text-xs font-medium rounded-fabric transition-colors">
              {saving ? '...' : '🚀 Publish'}
            </button>
          )}
          {form.is_published && (
            <button onClick={() => handleSave(0)} disabled={saving}
              className="px-3 py-2 border border-gamboge text-gamboge-dark hover:bg-gamboge/10 text-xs rounded-fabric transition-colors">
              Unpublish
            </button>
          )}
          {form.id && <button onClick={handleDelete} className="px-3 py-2 border border-red-300 text-red-500 hover:bg-red-50 text-xs rounded-fabric">🗑️</button>}
        </div>
      </div>
    </div>
  )
}

/* ── Media library ── */

function MediaView() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)

  const fetchMedia = async () => {
    setLoading(true)
    const json = await api('/media')
    if (json.success) setImages(json.data)
    setLoading(false)
  }
  useEffect(() => { fetchMedia() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch(`${API}/upload`, { method: 'POST', headers: authHeaders(false), body: fd })
    const json = await res.json()
    if (json.success) { toast('Uploaded'); fetchMedia() }
    else toast('Upload failed', 'error')
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url)
      toast('URL copied to clipboard')
      setTimeout(() => setCopied(null), 2000)
    }).catch(() => toast('Failed to copy', 'error'))
  }

  const handleDelete = async (name) => {
    if (!confirm(`Delete ${name}?`)) return
    // Note: no backend delete-media endpoint yet — add if needed
    toast('Media deletion not yet implemented', 'info')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-chinese-display text-lg text-ink-900">Media Library</h2>
        <label className="text-xs bg-cinnabar hover:bg-cinnabar-dark text-white px-3 py-1.5 rounded-fabric font-medium transition-colors cursor-pointer">
          + Upload
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>
      {loading ? <p className="text-ink-400 text-sm">Loading...</p> : images.length === 0 ? (
        <div className="text-center py-16 text-ink-400"><p className="text-4xl mb-2">📸</p><p className="text-sm">No images uploaded yet</p></div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {images.map((img, i) => (
            <div key={i} className="aspect-square bg-warmth-100 rounded-fabric-sm overflow-hidden border-stitch-warm relative group cursor-pointer" onClick={() => copyUrl(img.url)}>
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-medium">{copied === img.url ? 'Copied!' : 'Copy URL'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── MAIN ADMIN ── */

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toasts: toastList, dismiss } = useToast()
  const [view, setView] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [editingBlog, setEditingBlog] = useState(null)
  const [categories, setCategories] = useState([])

  const existingSlugs = useMemo(() => {
    const slugs = new Set()
    items.forEach(p => { if (p.slug) slugs.add(p.slug) })
    return slugs
  }, [items])

  const fetchItems = useCallback(async (tab) => {
    setLoading(true)
    try {
      const json = await api(`/${tab}`)
      if (json.success) setItems(json.data || [])
    } catch (err) {
      if (err.message?.includes('Unauthorized')) { localStorage.removeItem('admin_token'); navigate('/admin') }
    }
    setLoading(false)
  }, [navigate])

  const fetchStats = useCallback(async () => {
    const json = await api('/stats')
    if (json.success) setStats(json.data)
  }, [])

  useEffect(() => {
    if (view === 'dashboard') { fetchStats(); setEditing(null); setEditingBlog(null) }
    else if (view === 'products') { fetchItems('products'); setEditingBlog(null) }
    else if (view === 'blog') { fetchItems('blog-posts'); setEditing(null) }
    else if (view === 'media') { setEditing(null); setEditingBlog(null) }
  }, [view, fetchStats, fetchItems])

  useEffect(() => { api('/categories').then(j => { if (j.success) setCategories(j.data) }) }, [])

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (editing) document.querySelector('#editor-save-btn')?.click()
        if (editingBlog) document.querySelector('#blog-save-btn')?.click()
      }
      if (e.key === 'Escape') {
        if (editing) setEditing(null)
        if (editingBlog) setEditingBlog(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [editing, editingBlog])

  const handleLogout = () => { localStorage.removeItem('admin_token'); navigate('/admin') }

  const handleProductSave = () => {
    setEditing(null)
    fetchItems('products')
    fetchStats()
  }

  const handleProductDelete = async (id) => {
    const json = await api(`/products/${id}`, { method: 'DELETE' })
    if (json.success) {
      setEditing(null)
      fetchItems('products')
      fetchStats()
    } else {
      toast(json.error || 'Delete failed', 'error')
    }
  }

  const handleBlogSave = () => {
    setEditingBlog(null)
    fetchItems('blog-posts')
    fetchStats()
  }

  const handleBlogDelete = async (id) => {
    const json = await api(`/blog-posts/${id}`, { method: 'DELETE' })
    if (json.success) {
      fetchItems('blog-posts')
      fetchStats()
    } else {
      toast(json.error || 'Delete failed', 'error')
    }
  }

  const handleNavigate = (v, newItem) => {
    setView(v)
    if (newItem) setEditing({ title_en: '', title_zh: '', slug: '', price: '', size: '', materials_en: '', materials_zh: '', making_time: '', video_url: '', is_one_of_a_kind: 1, is_featured: 0, is_published: 0, images: [], description_en: '', description_zh: '', category_id: '' })
  }

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <header className="bg-ink-900 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 bg-cinnabar rounded-fabric-sm flex items-center justify-center"><span className="text-white text-[10px] font-bold">布</span></span>
          <h1 className="font-chinese-display text-sm">Grandma's Cloth</h1>
          <span className="text-[10px] text-ink-500 hidden sm:inline">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-ink-400 hover:text-white transition-colors">👁️ View Site</a>
          <button onClick={handleLogout} className="text-[10px] text-ink-400 hover:text-white transition-colors">Logout</button>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="w-14 sm:w-44 shrink-0 bg-white border-r border-dashed border-warmth-300 py-3 flex flex-col gap-0.5 px-1.5 sm:px-3">
          {NAV.map(({ id, icon, label }) => (
            <button key={id} onClick={() => setView(id)}
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-fabric-sm text-xs transition-colors ${
                view === id ? 'bg-cinnabar text-white font-medium' : 'text-ink-600 hover:bg-warmth-100'
              }`}>
              <span className="text-base">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {view === 'dashboard' && <DashboardView stats={stats} onNavigate={handleNavigate} />}
          {view === 'products' && <ProductsView items={items} loading={loading} onEdit={setEditing} />}
          {view === 'blog' && <BlogView items={items} loading={loading} onEdit={setEditingBlog} />}
          {view === 'media' && <MediaView />}
        </div>

        {editing && (
          <EditorPanel item={editing} onClose={() => setEditing(null)} onSave={handleProductSave} onDelete={handleProductDelete} categories={categories} existingSlugs={existingSlugs} />
        )}
        {editingBlog && (
          <BlogEditorPanel item={editingBlog} onClose={() => setEditingBlog(null)} onSave={handleBlogSave} onDelete={handleBlogDelete} />
        )}
      </div>

      <ToastContainer toasts={toastList} dismiss={dismiss} />
    </div>
  )
}
