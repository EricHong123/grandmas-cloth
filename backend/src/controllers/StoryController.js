const { getDb } = require('../config/database')

const StoryController = {
  get(req, res, next) {
    try {
      const db = getDb()
      const items = db.prepare('SELECT * FROM site_content WHERE key LIKE ?').all('story_%')
      const data = {}
      for (const item of items) data[item.key] = { en: item.value_en, zh: item.value_zh }
      res.json({ success: true, data, error: null })
    } catch (err) { next(err) }
  },

  press(req, res, next) {
    try {
      const db = getDb()
      const items = db.prepare('SELECT * FROM media_coverages ORDER BY sort_order').all()
      res.json({ success: true, data: items, error: null })
    } catch (err) { next(err) }
  },

  workshops(req, res, next) {
    try {
      const db = getDb()
      const items = db.prepare('SELECT * FROM workshops ORDER BY date DESC').all()
      const parsed = items.map(w => ({ ...w, images: JSON.parse(w.images || '[]') }))
      res.json({ success: true, data: parsed, error: null })
    } catch (err) { next(err) }
  },

  faq(req, res, next) {
    try {
      const db = getDb()
      const items = db.prepare('SELECT * FROM faqs ORDER BY sort_order').all()
      res.json({ success: true, data: items, error: null })
    } catch (err) { next(err) }
  },

  sitemap(req, res, next) {
    try {
      const db = getDb()
      const products = db.prepare('SELECT slug, updated_at FROM products WHERE is_published = 1').all()
      const posts = db.prepare('SELECT slug, created_at FROM blog_posts WHERE is_published = 1').all()
      const base = `${req.protocol}://${req.get('host')}`

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

      const pages = ['', '/our-story', '/collection', '/the-craft', '/gallery', '/press', '/workshops', '/blog', '/faq', '/contact']
      for (const p of pages) {
        xml += `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq></url>\n`
      }
      for (const p of products) {
        xml += `  <url><loc>${base}/collection/${p.slug}</loc><lastmod>${p.updated_at}</lastmod></url>\n`
      }
      for (const p of posts) {
        xml += `  <url><loc>${base}/blog/${p.slug}</loc><lastmod>${p.created_at}</lastmod></url>\n`
      }
      xml += '</urlset>'

      res.header('Content-Type', 'application/xml')
      res.send(xml)
    } catch (err) { next(err) }
  },
}

module.exports = StoryController
