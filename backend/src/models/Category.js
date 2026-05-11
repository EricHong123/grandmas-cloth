const { getDb } = require('../config/database')

const Category = {
  findAll() {
    const db = getDb()
    return db.prepare('SELECT * FROM categories ORDER BY sort_order').all()
  },

  findBySlug(slug) {
    const db = getDb()
    return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug)
  },
}

module.exports = Category
