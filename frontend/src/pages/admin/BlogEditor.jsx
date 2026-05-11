import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = '/api/admin'

function authHeaders() {
  const token = localStorage.getItem('admin_token')
  return { Authorization: `Bearer ${token}` }
}

const empty = {
  title_en: '', title_zh: '', slug: '', excerpt: '', content: '', cover_image: '', is_published: 1,
}

export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) {
      fetch(`${API}/blog-posts`, { headers: authHeaders() })
        .then(r => r.json())
        .then(json => {
          if (json.success) {
            const p = json.data.find(p => p.id === parseInt(id))
            if (p) setForm({ ...empty, ...p })
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
    if (json.success) update('cover_image', json.data.url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = isNew ? `${API}/blog-posts` : `${API}/blog-posts/${id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
        <h1 className="text-xl font-serif font-bold text-ink-900 mb-6">{isNew ? 'New Post' : 'Edit Post'}</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-warmth-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title (EN)" value={form.title_en} onChange={v => update('title_en', v)} />
            <Field label="Title (ZH)" value={form.title_zh} onChange={v => update('title_zh', v)} />
          </div>
          <Field label="Slug" value={form.slug} onChange={v => update('slug', v)} />
          <div>
            <label className="block text-sm text-ink-500 mb-1">Excerpt</label>
            <textarea rows={2} value={form.excerpt} onChange={e => update('excerpt', e.target.value)}
              className="w-full px-3 py-2 border border-warmth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warmth-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-ink-500 mb-1">Content (HTML)</label>
            <textarea rows={10} value={form.content} onChange={e => update('content', e.target.value)}
              className="w-full px-3 py-2 border border-warmth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warmth-400 resize-none font-mono" />
          </div>
          <div>
            <label className="block text-sm text-ink-500 mb-1">Cover Image</label>
            {form.cover_image && (
              <img src={form.cover_image} alt="" className="w-32 h-20 object-cover rounded-lg mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.is_published} onChange={e => update('is_published', e.target.checked ? 1 : 0)} />
            Published
          </label>
          <button type="submit" disabled={saving}
            className="w-full py-2 bg-warmth-600 hover:bg-warmth-700 disabled:bg-warmth-300 text-white font-medium rounded-lg text-sm">
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-ink-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-warmth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warmth-400"
      />
    </div>
  )
}
