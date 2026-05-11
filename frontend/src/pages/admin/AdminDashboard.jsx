import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const API = '/api/admin'

function authHeaders(json = true) {
  const h = { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
  if (json) h['Content-Type'] = 'application/json'
  return h
}

function api(path, opts = {}) {
  return fetch(`${API}${path}`, { headers: authHeaders(opts.json !== false), ...opts }).then(r => r.json())
}

/* ── Sidebar ── */

const NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'products', icon: '🖼️', label: 'Products' },
  { id: 'blog', icon: '📝', label: 'Journal' },
  { id: 'media', icon: '📸', label: 'Media' },
]

/* ── Stats cards on dashboard ── */

function StatCard({ value, label, color, onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-fabric border-stitch-warm p-5 card-hover-fabric ${onClick ? 'cursor-pointer' : ''}`}>
      <p className={`text-3xl font-chinese-display font-bold ${color || 'text-ink-900'}`}>{value}</p>
      <p className="text-xs text-ink-400 mt-1">{label}</p>
    </div>
  )
}

/* ── Product card (visual) ── */

function ProductCard({ p, onClick, onDragStart, onDrop, onDragOver }) {
  const img = p.images?.[0] || ''
  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.setData('text/plain', String(p.id)); onDragStart?.(p) }}
      onDrop={e => { e.preventDefault(); onDrop?.(p, parseInt(e.dataTransfer.getData('text/plain'))) }}
      onDragOver={e => { e.preventDefault(); onDragOver?.(e) }}
      onClick={() => onClick?.(p)}
      className="group bg-white rounded-fabric border-stitch-warm card-hover-fabric overflow-hidden cursor-pointer relative"
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] bg-warmth-100 overflow-hidden">
        {img ? (
          <img src={img} alt={p.title_en} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-warmth-100"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, var(--color-warmth-200) 4px, var(--color-warmth-200) 5px)' }}>
            <p className="font-chinese-display text-ink-400 text-xs">{p.title_en}</p>
          </div>
        )}
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {p.is_featured ? <span className="text-[10px] bg-gamboge text-ink-900 px-1.5 py-0.5 rounded-fabric-sm font-medium">⭐</span> : null}
          {p.is_one_of_a_kind ? <span className="text-[10px] bg-cinnabar text-white px-1.5 py-0.5 rounded-fabric-sm font-medium">孤</span> : null}
        </div>
        <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${p.is_published ? 'bg-jade' : 'bg-ink-300'}`} title={p.is_published ? 'Published' : 'Draft'} />
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="font-chinese-display text-sm text-ink-900 truncate">{p.title_en}</h3>
        <p className="text-xs text-cinnabar font-medium mt-0.5">{p.price || '—'}</p>
      </div>
      {/* Drag handle */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-ink-400 text-xs" title="Drag to reorder">⠿</div>
    </div>
  )
}

/* ── Slide-out editor panel ── */

function EditorPanel({ item, onClose, onSave, onDelete, categories }) {
  const [form, setForm] = useState({ ...item })
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm({ ...item }) }, [item])

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch(`${API}/upload`, { method: 'POST', headers: authHeaders(false), body: fd })
    const json = await res.json()
    if (json.success) update('images', [...(form.images || []), json.data.url])
  }

  const handleSave = async () => {
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const url = form.id ? `${API}/products/${form.id}` : `${API}/products`
    const body = { ...form, category_id: parseInt(form.category_id) || null }
    if (typeof body.images === 'string') body.images = JSON.parse(body.images || '[]')
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) })
    const json = await res.json()
    setSaving(false)
    if (json.success) onSave(json.data)
  }

  return (
    <div className="w-80 shrink-0 bg-white border-l border-dashed border-warmth-300 overflow-y-auto h-[calc(100vh-48px)] sticky top-[48px]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-chinese-display text-ink-900 text-sm">✏️ {form.id ? 'Edit' : 'New'} Product</h3>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-900 text-lg leading-none">&times;</button>
        </div>

        <div className="space-y-3">
          <Field label="Title (EN)" value={form.title_en || ''} onChange={v => update('title_en', v)} />
          <Field label="Title (ZH)" value={form.title_zh || ''} onChange={v => update('title_zh', v)} />
          <Field label="Slug" value={form.slug || ''} onChange={v => update('slug', v)} />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Price" value={form.price || ''} onChange={v => update('price', v)} />
            <Field label="Size" value={form.size || ''} onChange={v => update('size', v)} />
          </div>
          <Field label="Making Time" value={form.making_time || ''} onChange={v => update('making_time', v)} />
          <Field label="Materials (EN)" value={form.materials_en || ''} onChange={v => update('materials_en', v)} />
          <Field label="Materials (ZH)" value={form.materials_zh || ''} onChange={v => update('materials_zh', v)} />
          <Field label="Video URL" value={form.video_url || ''} onChange={v => update('video_url', v)} />

          <div>
            <label className="block text-[11px] text-ink-500 mb-1">Category</label>
            <select value={form.category_id || ''} onChange={e => update('category_id', e.target.value)}
              className="w-full px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white">
              <option value="">—</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </div>

          {/* Images */}
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

          {/* Description */}
          <div>
            <label className="block text-[11px] text-ink-500 mb-1">Description (EN)</label>
            <textarea rows={2} value={form.description_en || ''} onChange={e => update('description_en', e.target.value)}
              className="w-full px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white resize-none" />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-3 text-[11px]">
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!form.is_one_of_a_kind} onChange={e => update('is_one_of_a_kind', e.target.checked ? 1 : 0)} /> One of a Kind</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!form.is_featured} onChange={e => update('is_featured', e.target.checked ? 1 : 0)} /> ⭐ Featured</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!form.is_published} onChange={e => update('is_published', e.target.checked ? 1 : 0)} /> 🟢 Published</label>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2 bg-cinnabar hover:bg-cinnabar-dark disabled:bg-ink-300 text-white text-xs font-medium rounded-fabric transition-colors">
              {saving ? 'Saving...' : '💾 Save'}
            </button>
            {form.id && (
              <button onClick={() => { if (confirm('Delete?')) onDelete(form.id) }}
                className="px-3 py-2 border border-red-300 text-red-500 hover:bg-red-50 text-xs rounded-fabric transition-colors">🗑️</button>
            )}
          </div>

          {form.id && (
            <a href={`/collection/${form.slug}`} target="_blank" rel="noopener noreferrer"
              className="block text-center text-[11px] text-ink-400 hover:text-cinnabar mt-1">👁️ Preview on site →</a>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-[11px] text-ink-500 mb-1">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white" />
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

function ProductsView({ items, loading, onEdit, onToggle, onDelete, dragState, setDragState }) {
  const [draggedOver, setDraggedOver] = useState(null)

  const handleDragStart = (p) => setDragState({ ...dragState, dragging: p.id })
  const handleDrop = (target, sourceId) => {
    setDragState({ dragging: null })
    if (!sourceId || sourceId === target.id) return
    const ordered = [...items]
    const srcIdx = ordered.findIndex(p => p.id === sourceId)
    const tgtIdx = ordered.findIndex(p => p.id === target.id)
    if (srcIdx < 0 || tgtIdx < 0) return
    const [moved] = ordered.splice(srcIdx, 1)
    ordered.splice(tgtIdx, 0, moved)
    // Persist order to backend
    fetch(`${API}/reorder`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ ids: ordered.map(p => p.id) }) })
    // Force re-fetch
    window.location.reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-chinese-display text-lg text-ink-900">Products</h2>
        <button onClick={() => onEdit({ title_en: '', title_zh: '', slug: '', price: '', size: '', materials_en: '', materials_zh: '', making_time: '', video_url: '', is_one_of_a_kind: 1, is_featured: 0, is_published: 1, images: [], description_en: '', description_zh: '', category_id: '' })}
          className="text-xs bg-cinnabar hover:bg-cinnabar-dark text-white px-3 py-1.5 rounded-fabric font-medium transition-colors">
          + New Product
        </button>
      </div>
      {loading ? <p className="text-ink-400 text-sm">Loading...</p> : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map(p => (
            <ProductCard key={p.id} p={p} onClick={onEdit} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={() => setDraggedOver(p.id)} />
          ))}
        </div>
      )}
      <p className="text-[10px] text-ink-400 mt-3">Drag cards to reorder — affects homepage display.</p>
    </div>
  )
}

/* ── Blog view (simple cards) ── */

function BlogView({ items, loading, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-chinese-display text-lg text-ink-900">Journal</h2>
        <button onClick={() => onEdit({ title_en: '', title_zh: '', slug: '', excerpt: '', content: '', is_published: 1 })}
          className="text-xs bg-cinnabar hover:bg-cinnabar-dark text-white px-3 py-1.5 rounded-fabric font-medium transition-colors">
          + New Post
        </button>
      </div>
      {loading ? <p className="text-ink-400 text-sm">Loading...</p> : (
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
  const [saving, setSaving] = useState(false)
  useEffect(() => { setForm({ ...item }) }, [item])
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSave = async () => {
    setSaving(true)
    const method = form.id ? 'PUT' : 'POST'
    const url = form.id ? `${API}/blog-posts/${form.id}` : `${API}/blog-posts`
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) })
    const json = await res.json()
    setSaving(false)
    if (json.success) onSave()
  }

  return (
    <div className="w-80 shrink-0 bg-white border-l border-dashed border-warmth-300 overflow-y-auto h-[calc(100vh-48px)] sticky top-[48px]">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-chinese-display text-ink-900 text-sm">✏️ {form.id ? 'Edit' : 'New'} Post</h3>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-900 text-lg">&times;</button>
        </div>
        <Field label="Title (EN)" value={form.title_en || ''} onChange={v => update('title_en', v)} />
        <Field label="Title (ZH)" value={form.title_zh || ''} onChange={v => update('title_zh', v)} />
        <Field label="Slug" value={form.slug || ''} onChange={v => update('slug', v)} />
        <div><label className="block text-[11px] text-ink-500 mb-1">Excerpt</label>
          <textarea rows={2} value={form.excerpt || ''} onChange={e => update('excerpt', e.target.value)}
            className="w-full px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white resize-none" /></div>
        <div><label className="block text-[11px] text-ink-500 mb-1">Content (HTML)</label>
          <textarea rows={6} value={form.content || ''} onChange={e => update('content', e.target.value)}
            className="w-full px-2 py-1.5 border-stitch-warm rounded-fabric-sm text-xs focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white resize-none font-mono" /></div>
        <label className="flex items-center gap-1.5 text-[11px]"><input type="checkbox" checked={!!form.is_published} onChange={e => update('is_published', e.target.checked ? 1 : 0)} /> Published</label>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-cinnabar hover:bg-cinnabar-dark disabled:bg-ink-300 text-white text-xs font-medium rounded-fabric">{saving ? 'Saving...' : '💾 Save'}</button>
          {form.id && <button onClick={() => { if (confirm('Delete?')) { onDelete(form.id); onClose() } }} className="px-3 py-2 border border-red-300 text-red-500 hover:bg-red-50 text-xs rounded-fabric">🗑️</button>}
        </div>
      </div>
    </div>
  )
}

/* ── Media library view ── */

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
    await fetch(`${API}/upload`, { method: 'POST', headers: authHeaders(false), body: fd })
    fetchMedia()
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
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
        <div className="text-center py-16 text-ink-400">
          <p className="text-4xl mb-2">📸</p>
          <p className="text-sm">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {images.map((img, i) => (
            <div key={i} className="aspect-square bg-warmth-100 rounded-fabric-sm overflow-hidden border-stitch-warm relative group cursor-pointer" onClick={() => copyUrl(img.url)}>
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-medium">{copied === img.url ? 'Copied!' : 'Click to copy URL'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── MAIN ADMIN LAYOUT ── */

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [view, setView] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)  // product being edited
  const [editingBlog, setEditingBlog] = useState(null)
  const [categories, setCategories] = useState([])
  const [dragState, setDragState] = useState({ dragging: null })

  const fetchItems = useCallback(async (tab) => {
    setLoading(true)
    try {
      const json = await api(`/${tab}`)
      if (json.success) setItems(json.data || [])
    } catch (err) { if (err.message?.includes('Unauthorized')) { localStorage.removeItem('admin_token'); navigate('/admin') } }
    setLoading(false)
  }, [navigate])

  const fetchStats = useCallback(async () => {
    const json = await api('/stats')
    if (json.success) setStats(json.data)
  }, [])

  useEffect(() => {
    if (view === 'dashboard') fetchStats()
    else if (view === 'products') fetchItems('products')
    else if (view === 'blog') fetchItems('blog-posts')
  }, [view, fetchStats, fetchItems])

  useEffect(() => {
    api('/categories').then(j => { if (j.success) setCategories(j.data) })
  }, [])

  const handleLogout = () => { localStorage.removeItem('admin_token'); navigate('/admin') }

  const handleProductSave = (saved) => {
    setEditing(null)
    fetchItems('products')
    fetchStats()
  }

  const handleProductDelete = async (id) => {
    await api(`/products/${id}`, { method: 'DELETE' })
    setEditing(null)
    fetchItems('products')
    fetchStats()
  }

  const handleBlogSave = () => {
    setEditingBlog(null)
    fetchItems('blog-posts')
    fetchStats()
  }

  const handleBlogDelete = async (id) => {
    await api(`/blog-posts/${id}`, { method: 'DELETE' })
    fetchItems('blog-posts')
    fetchStats()
  }

  const handleNavigate = (v, newItem) => {
    setView(v)
    if (newItem) setEditing({ title_en: '', title_zh: '', slug: '', price: '', size: '', materials_en: '', materials_zh: '', making_time: '', video_url: '', is_one_of_a_kind: 1, is_featured: 0, is_published: 1, images: [], description_en: '', description_zh: '', category_id: '' })
  }

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      {/* Top bar */}
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

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-14 sm:w-44 shrink-0 bg-white border-r border-dashed border-warmth-300 py-3 flex flex-col gap-0.5 px-1.5 sm:px-3">
          {NAV.map(({ id, icon, label }) => (
            <button key={id} onClick={() => { setView(id); setEditing(null); setEditingBlog(null) }}
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-fabric-sm text-xs transition-colors ${
                view === id ? 'bg-cinnabar text-white font-medium' : 'text-ink-600 hover:bg-warmth-100'
              }`}>
              <span className="text-base">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* Main content area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {view === 'dashboard' && <DashboardView stats={stats} onNavigate={handleNavigate} />}
          {view === 'products' && (
            <ProductsView items={items} loading={loading} onEdit={setEditing} onDelete={handleProductDelete} dragState={dragState} setDragState={setDragState} />
          )}
          {view === 'blog' && (
            <BlogView items={items} loading={loading} onEdit={setEditingBlog} onDelete={handleBlogDelete} />
          )}
          {view === 'media' && <MediaView />}
        </div>

        {/* Slide-out editor panels */}
        {editing && (
          <EditorPanel item={editing} onClose={() => setEditing(null)} onSave={handleProductSave} onDelete={handleProductDelete} categories={categories} />
        )}
        {editingBlog && (
          <BlogEditorPanel item={editingBlog} onClose={() => setEditingBlog(null)} onSave={handleBlogSave} onDelete={handleBlogDelete} />
        )}
      </div>
    </div>
  )
}
