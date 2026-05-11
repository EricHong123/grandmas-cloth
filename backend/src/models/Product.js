const { getDb } = require('../config/database')

// Ensure value is safe for SQLite binding (primitive only)
function safe(v) {
  if (v === null || v === undefined) return null
  if (typeof v === 'boolean') return v ? 1 : 0
  if (typeof v === 'object') return JSON.stringify(v)
  return v
}

const Product = {
  findAll({ category, page = 1, limit = 12, featured, includeDrafts } = {}) {
    const db = getDb()
    let sql = 'SELECT p.*, c.name_en as category_name_en, c.name_zh as category_name_zh FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1'
    if (!includeDrafts) sql += ' AND p.is_published = 1'
    const params = []

    if (category) { sql += ' AND c.slug = ?'; params.push(category) }
    if (featured) sql += ' AND p.is_featured = 1'

    const countSql = sql.replace(/SELECT .* FROM/, 'SELECT COUNT(*) as total FROM')
    const { total } = db.prepare(countSql).get(...params)

    sql += ' ORDER BY p.sort_order ASC, p.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, (page - 1) * limit)

    const items = db.prepare(sql).all(...params).map(parseProduct)
    return { items, total, page, limit }
  },

  findBySlug(slug, { preview } = {}) {
    const db = getDb()
    let sql = 'SELECT p.*, c.name_en as category_name_en, c.name_zh as category_name_zh FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?'
    if (!preview) sql += ' AND p.is_published = 1'
    const row = db.prepare(sql).get(slug)
    return row ? parseProduct(row) : null
  },

  findById(id) {
    const db = getDb()
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  },

  create(data) {
    const db = getDb()
    const defaults = { category_id: null, title_en: '', title_zh: '', slug: '', description_en: '', description_zh: '',
      price: '', size: '', materials_en: '', materials_zh: '', making_time: '', is_one_of_a_kind: 1,
      images: '[]', video_url: null, is_featured: 0, is_published: 1 }
    const d = { ...defaults, ...data, images: safe(data.images) || '[]' }
    // Build params safely
    const params = {}
    for (const [k, v] of Object.entries(d)) { params[k] = safe(v) }
    const stmt = db.prepare(
      `INSERT INTO products (category_id, title_en, title_zh, slug, description_en, description_zh,
       price, size, materials_en, materials_zh, making_time, is_one_of_a_kind, images, video_url, is_featured, is_published)
       VALUES (@category_id, @title_en, @title_zh, @slug, @description_en, @description_zh,
       @price, @size, @materials_en, @materials_zh, @making_time, @is_one_of_a_kind, @images, @video_url, @is_featured, @is_published)`
    )
    const result = stmt.run(params)
    return { id: result.lastInsertRowid, ...d }
  },

  update(id, data) {
    const db = getDb()
    const sets = []
    const params = {}
    const fields = ['category_id', 'title_en', 'title_zh', 'slug', 'description_en', 'description_zh',
      'price', 'size', 'materials_en', 'materials_zh', 'making_time', 'is_one_of_a_kind', 'images', 'video_url', 'is_featured', 'is_published']
    for (const f of fields) {
      if (data[f] !== undefined) {
        sets.push(`${f} = @${f}`)
        params[f] = safe(data[f])
      }
    }
    if (sets.length === 0) return null
    sets.push("updated_at = datetime('now')")
    params.id = id
    db.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = @id`).run(params)
    return Product.findById(id)
  },

  delete(id) {
    const db = getDb()
    db.prepare('DELETE FROM products WHERE id = ?').run(id)
  },
}

function parseProduct(row) {
  if (!row) return row
  return {
    ...row,
    images: JSON.parse(row.images || '[]'),
    is_one_of_a_kind: !!row.is_one_of_a_kind,
    is_featured: !!row.is_featured,
    is_published: !!row.is_published,
  }
}

module.exports = Product
