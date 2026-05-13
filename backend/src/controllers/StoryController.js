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
      const parsed = items.map(w => {
        let images = []
        try { images = JSON.parse(w.images || '[]') } catch (_) { images = [] }
        return { ...w, images }
      })
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
      const products = db.prepare('SELECT slug, updated_at, created_at, title_en, images FROM products WHERE is_published = 1').all()
      const posts = db.prepare('SELECT slug, created_at, title_en, cover_image FROM blog_posts WHERE is_published = 1').all()
      const base = `${req.protocol}://${req.get('host')}`

      const esc = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n'

      const pages = ['', '/our-story', '/collection', '/the-craft', '/press', '/workshops', '/blog', '/faq', '/contact', '/custom']
      for (const p of pages) {
        xml += `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq></url>\n`
      }
      for (const p of products) {
        xml += `  <url><loc>${base}/collection/${p.slug}</loc><lastmod>${p.updated_at || p.created_at}</lastmod>\n`
        const imgs = JSON.parse(p.images || '[]')
        for (const img of imgs) {
          xml += `    <image:image><image:loc>${base}${img}</image:loc><image:title>${esc(p.title_en)}</image:title></image:image>\n`
        }
        xml += '  </url>\n'
      }
      for (const p of posts) {
        xml += `  <url><loc>${base}/blog/${p.slug}</loc><lastmod>${p.created_at}</lastmod>\n`
        if (p.cover_image) {
          xml += `    <image:image><image:loc>${base}${p.cover_image}</image:loc><image:title>${esc(p.title_en)}</image:title></image:image>\n`
        }
        xml += '  </url>\n'
      }
      // Homepage video
      xml += `  <url><loc>${base}/</loc>\n    <video:video><video:title>Grandma Luo Making Cloth Mosaic Art</video:title><video:description>Watch 4th-generation artisan Luo Yifang create Chinese cloth mosaic art by hand.</video:description><video:content_loc>${base}/videos/grandma-making.mp4</video:content_loc><video:thumbnail_loc>${base}/images/grandma-at-work.webp</video:thumbnail_loc></video:video>\n  </url>\n`
      xml += '</urlset>'

      res.header('Content-Type', 'application/xml')
      res.send(xml)
    } catch (err) { next(err) }
  },
}

module.exports = StoryController
