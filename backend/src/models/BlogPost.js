const { getDb } = require('../config/database')

function safe(v) {
  if (v === null || v === undefined) return null
  if (typeof v === 'boolean') return v ? 1 : 0
  if (typeof v === 'object') return JSON.stringify(v)
  return v
}

const BlogPost = {
  findAll({ page = 1, limit = 9 } = {}) {
    const db = getDb()
    const { total } = db.prepare('SELECT COUNT(*) as total FROM blog_posts WHERE is_published = 1').get()
    const items = db.prepare(
      'SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(limit, (page - 1) * limit)
    return { items, total, page, limit }
  },

  findBySlug(slug) {
    const db = getDb()
    return db.prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1').get(slug)
  },

  findById(id) {
    const db = getDb()
    return db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id)
  },

  create(data) {
    const db = getDb()
    const defaults = { title_en: '', title_zh: '', slug: '', excerpt: '', content: '', cover_image: null, is_published: 0 }
    const d = { ...defaults, ...data }
    const params = {}
    for (const [k, v] of Object.entries(d)) { params[k] = safe(v) }
    const stmt = db.prepare(
      'INSERT INTO blog_posts (title_en, title_zh, slug, excerpt, content, cover_image, is_published) VALUES (@title_en, @title_zh, @slug, @excerpt, @content, @cover_image, @is_published)'
    )
    const result = stmt.run(params)
    return { id: result.lastInsertRowid, ...d }
  },

  update(id, data) {
    const db = getDb()
    const sets = []
    const params = {}
    for (const f of ['title_en', 'title_zh', 'slug', 'excerpt', 'content', 'cover_image', 'is_published']) {
      if (data[f] !== undefined) {
        sets.push(`${f} = @${f}`)
        params[f] = safe(data[f])
      }
    }
    if (sets.length === 0) return null
    params.id = id
    db.prepare(`UPDATE blog_posts SET ${sets.join(', ')} WHERE id = @id`).run(params)
    return BlogPost.findById(id)
  },

  delete(id) {
    const db = getDb()
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id)
  },
}

module.exports = BlogPost
