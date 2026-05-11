import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = '/api/admin'

function authHeaders() {
  const token = localStorage.getItem('admin_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('products')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async (t) => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/${t}`, { headers: authHeaders() })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setItems(json.data || [])
    } catch (err) {
      if (err.message === 'Invalid token' || err.message === 'Unauthorized') {
        localStorage.removeItem('admin_token')
        navigate('/admin')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems(tab) }, [tab])

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    await fetch(`${API}/${tab}/${id}`, { method: 'DELETE', headers: authHeaders() })
    fetchItems(tab)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin')
  }

  const tabs = ['products', 'blog-posts', 'gallery', 'press', 'workshops', 'faq']

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="bg-ink-900 text-white px-6 py-3 flex items-center justify-between">
        <h1 className="font-serif font-bold">ClothArt Admin</h1>
        <button onClick={handleLogout} className="text-sm text-ink-400 hover:text-white">Logout</button>
      </header>
      <div className="flex gap-6 max-w-7xl mx-auto p-6">
        <nav className="w-48 shrink-0 space-y-1">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                tab === t ? 'bg-warmth-600 text-white' : 'text-ink-600 hover:bg-warmth-100'
              }`}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </nav>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink-900 capitalize">{tab.replace('-', ' ')}</h2>
            {(tab === 'products' || tab === 'gallery') && (
              <Link to="/admin/products/new" className="text-sm bg-warmth-600 text-white px-3 py-1.5 rounded-lg hover:bg-warmth-700">
                + Add
              </Link>
            )}
            {tab === 'blog-posts' && (
              <Link to="/admin/blog/new" className="text-sm bg-warmth-600 text-white px-3 py-1.5 rounded-lg hover:bg-warmth-700">
                + Add
              </Link>
            )}
          </div>
          {loading ? (
            <p className="text-ink-400 text-sm">Loading...</p>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="bg-white p-3 rounded-lg border border-warmth-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-ink-900">
                      {item.title_en || item.question_en || item.name_en || `Item #${item.id}`}
                    </span>
                    <span className="text-xs text-ink-400 ml-2">
                      {item.slug || item.date || ''}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {(tab === 'products' || tab === 'gallery') && (
                      <Link to={`/admin/products/${item.id}/edit`} className="text-xs text-warmth-600 hover:text-warmth-700">Edit</Link>
                    )}
                    {tab === 'blog-posts' && (
                      <Link to={`/admin/blog/${item.id}/edit`} className="text-xs text-warmth-600 hover:text-warmth-700">Edit</Link>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
