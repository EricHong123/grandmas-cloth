import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      localStorage.setItem('admin_token', json.data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warmth-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-warmth-200 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-serif font-bold text-ink-900 text-center">Admin Login</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <label className="block text-sm text-ink-500 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-warmth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warmth-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-ink-500 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-warmth-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warmth-400"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-warmth-600 hover:bg-warmth-700 disabled:bg-warmth-300 text-white font-medium rounded-lg transition-colors text-sm"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
