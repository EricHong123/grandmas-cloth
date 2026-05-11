import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = '/api/admin'

function authHeaders() {
  const token = localStorage.getItem('admin_token')
  return { Authorization: `Bearer ${token}` }
}

const empty = {
  title_en: '', title_zh: '', slug: '', category_id: '', price: '', size: '',
  description_en: '', description_zh: '', materials_en: '', materials_zh: '',
  making_time: '', video_url: '', is_one_of_a_kind: 1, is_featured: 1, is_published: 1, images: [],
}

export default function ProductEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) {
      fetch(`${API}/products`, { headers: authHeaders() })
        .then(r => r.json())
        .then(json => {
          if (json.success) {
            const p = json.data.find(p => p.id === parseInt(id))
            if (p) setForm({ ...empty, ...p, images: p.images || [] })
          }
        })
    }
  }, [id, isNew])

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch(`${API}/upload`, { method: 'POST', headers: authHeaders(), body: fd })
    const json = await res.json()
    if (json.success) update('images', [...form.images, json.data.url])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = isNew ? `${API}/products` : `${API}/products/${id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category_id: parseInt(form.category_id) || null }),
      })
      const json = await res.json()
      if (json.success) navigate('/admin/dashboard')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-serif font-bold text-ink-900 mb-6">{isNew ? 'New Product' : 'Edit Product'}</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-warmth-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title (EN)" value={form.title_en} onChange={v => update('title_en', v)} />
            <Field label="Title (ZH)" value={form.title_zh} onChange={v => update('title_zh', v)} />
          </div>
          <Field label="Slug" value={form.slug} onChange={v => update('slug', v)} />
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price" value={form.price} onChange={v => update('price', v)} />
            <Field label="Size" value={form.size} onChange={v => update('size', v)} />
            <Field label="Making Time" value={form.making_time} onChange={v => update('making_time', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Materials (EN)" value={form.materials_en} onChange={v => update('materials_en', v)} />
            <Field label="Materials (ZH)" value={form.materials_zh} onChange={v => update('materials_zh', v)} />
          </div>
          <div>
            <label className="block text-sm text-ink-500 mb-1">Description (EN)</label>
            <textarea rows={3} value={form.description_en} onChange={e => update('description_en', e.target.value)}
              className="w-full px-3 py-2 border border-warmth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warmth-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-ink-500 mb-1">Description (ZH)</label>
            <textarea rows={3} value={form.description_zh} onChange={e => update('description_zh', e.target.value)}
              className="w-full px-3 py-2 border border-warmth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warmth-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-ink-500 mb-1">Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.images.map((img, i) => (
                <div key={i} className="w-20 h-20 rounded-lg overflow-hidden relative group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => update('images', form.images.filter((_, j) => j !== i))}
                    className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          </div>
          <div>
            <label className="block text-sm text-ink-500 mb-1">Video URL (YouTube or .mp4)</label>
            <input
              type="text"
              value={form.video_url || ''}
              onChange={e => update('video_url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
              className="w-full px-3 py-2 border border-warmth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warmth-400"
            />
            <p className="text-xs text-ink-400 mt-1">Shows as "Watch the Artisan at Work" on the product page.</p>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.is_one_of_a_kind} onChange={e => update('is_one_of_a_kind', e.target.checked ? 1 : 0)} />
              One of a Kind
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.is_featured} onChange={e => update('is_featured', e.target.checked ? 1 : 0)} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.is_published} onChange={e => update('is_published', e.target.checked ? 1 : 0)} />
              Published
            </label>
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2 bg-warmth-600 hover:bg-warmth-700 disabled:bg-warmth-300 text-white font-medium rounded-lg text-sm">
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm text-ink-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-warmth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warmth-400"
      />
    </div>
  )
}
