const { getDb } = require('../config/database')

const Product = {
  findAll({ category, page = 1, limit = 12, featured } = {}) {
    const db = getDb()
    let sql = 'SELECT p.*, c.name_en as category_name_en, c.name_zh as category_name_zh FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_published = 1'
    const params = []

    if (category) {
      sql += ' AND c.slug = ?'
      params.push(category)
    }
    if (featured) {
      sql += ' AND p.is_featured = 1'
    }

    const countSql = sql.replace(/SELECT .* FROM/, 'SELECT COUNT(*) as total FROM')
    const { total } = db.prepare(countSql).get(...params)

    sql += ' ORDER BY p.sort_order ASC, p.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, (page - 1) * limit)

    const items = db.prepare(sql).all(...params).map(parseProduct)
    return { items, total, page, limit }
  },

  findBySlug(slug) {
    const db = getDb()
    const row = db.prepare(
      'SELECT p.*, c.name_en as category_name_en, c.name_zh as category_name_zh FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ? AND p.is_published = 1'
    ).get(slug)
    return row ? parseProduct(row) : null
  },

  findById(id) {
    const db = getDb()
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  },

  create(data) {
    const db = getDb()
    const stmt = db.prepare(
      `INSERT INTO products (category_id, title_en, title_zh, slug, description_en, description_zh,
       price, size, materials_en, materials_zh, making_time, is_one_of_a_kind, images, video_url, is_featured, is_published)
       VALUES (@category_id, @title_en, @title_zh, @slug, @description_en, @description_zh,
       @price, @size, @materials_en, @materials_zh, @making_time, @is_one_of_a_kind, @images, @video_url, @is_featured, @is_published)`
    )
    const result = stmt.run({ ...data, images: JSON.stringify(data.images || []) })
    return { id: result.lastInsertRowid, ...data }
  },

  update(id, data) {
    const db = getDb()
    const sets = []
    const params = {}
    const fields = ['category_id', 'title_en', 'title_zh', 'slug', 'description_en', 'description_zh',
      'price', 'size', 'materials_en', 'materials_zh', 'making_time', 'is_one_of_a_kind', 'images', 'video_url', 'is_featured', 'is_published']
    for (const f of fields) {
      if (data[f] !== undefined) {
        if (f === 'images') {
          sets.push(`${f} = ?`)
          params[f] = JSON.stringify(data[f])
        } else {
          sets.push(`${f} = @${f}`)
          params[f] = data[f]
        }
      }
    }
    if (sets.length === 0) return null
    sets.push('updated_at = datetime("now")')
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
