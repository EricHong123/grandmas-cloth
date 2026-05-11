const { getDb } = require('../config/database')

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
    const stmt = db.prepare(
      'INSERT INTO blog_posts (title_en, title_zh, slug, excerpt, content, cover_image, is_published) VALUES (@title_en, @title_zh, @slug, @excerpt, @content, @cover_image, @is_published)'
    )
    const result = stmt.run(data)
    return { id: result.lastInsertRowid, ...data }
  },

  update(id, data) {
    const db = getDb()
    const sets = []
    const params = {}
    for (const f of ['title_en', 'title_zh', 'slug', 'excerpt', 'content', 'cover_image', 'is_published']) {
      if (data[f] !== undefined) {
        sets.push(`${f} = @${f}`)
        params[f] = data[f]
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
