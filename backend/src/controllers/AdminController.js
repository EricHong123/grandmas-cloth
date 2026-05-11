const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getDb } = require('../config/database')
const { JWT_SECRET } = require('../middleware/auth')
const Product = require('../models/Product')
const BlogPost = require('../models/BlogPost')

const AdminController = {
  login(req, res, next) {
    try {
      const { username, password } = req.body
      const db = getDb()
      const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username)
      if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
        return res.status(401).json({ success: false, data: null, error: 'Invalid credentials' })
      }
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' })
      res.json({ success: true, data: { token }, error: null })
    } catch (err) { next(err) }
  },

  upload(req, res, next) {
    try {
      if (!req.file) return res.status(400).json({ success: false, data: null, error: 'No file' })
      const url = `/uploads/${req.file.filename}`
      res.json({ success: true, data: { url }, error: null })
    } catch (err) { next(err) }
  },

  productList(req, res, next) {
    try { res.json({ success: true, data: Product.findAll({ limit: 100 }).items, error: null }) } catch (err) { next(err) }
  },
  productCreate(req, res, next) {
    try { res.json({ success: true, data: Product.create(req.body), error: null }) } catch (err) { next(err) }
  },
  productUpdate(req, res, next) {
    try {
      const result = Product.update(req.params.id, req.body)
      if (!result) return res.status(404).json({ success: false, data: null, error: 'Not found' })
      res.json({ success: true, data: result, error: null })
    } catch (err) { next(err) }
  },
  productDelete(req, res, next) {
    try { Product.delete(req.params.id); res.json({ success: true, data: null, error: null }) } catch (err) { next(err) }
  },

  blogList(req, res, next) {
    try {
      const db = getDb()
      res.json({ success: true, data: db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all(), error: null })
    } catch (err) { next(err) }
  },
  blogCreate(req, res, next) {
    try { res.json({ success: true, data: BlogPost.create(req.body), error: null }) } catch (err) { next(err) }
  },
  blogUpdate(req, res, next) {
    try {
      const result = BlogPost.update(req.params.id, req.body)
      if (!result) return res.status(404).json({ success: false, data: null, error: 'Not found' })
      res.json({ success: true, data: result, error: null })
    } catch (err) { next(err) }
  },
  blogDelete(req, res, next) {
    try { BlogPost.delete(req.params.id); res.json({ success: true, data: null, error: null }) } catch (err) { next(err) }
  },

  galleryList(req, res, next) { AdminController.productList(req, res, next) },
  galleryCreate(req, res, next) { AdminController.productCreate(req, res, next) },
  galleryDelete(req, res, next) { AdminController.productDelete(req, res, next) },

  pressList(req, res, next) {
    try {
      const db = getDb()
      res.json({ success: true, data: db.prepare('SELECT * FROM media_coverages ORDER BY sort_order').all(), error: null })
    } catch (err) { next(err) }
  },
  pressCreate(req, res, next) {
    try {
      const db = getDb()
      const { title_en, title_zh, source, date, description, image_url, link, sort_order } = req.body
      const result = db.prepare(
        'INSERT INTO media_coverages (title_en, title_zh, source, date, description, image_url, link, sort_order) VALUES (?,?,?,?,?,?,?,?)'
      ).run(title_en, title_zh, source, date, description, image_url, link, sort_order || 0)
      res.json({ success: true, data: { id: result.lastInsertRowid }, error: null })
    } catch (err) { next(err) }
  },
  pressUpdate(req, res, next) {
    try {
      const db = getDb()
      const { title_en, title_zh, source, date, description, image_url, link, sort_order } = req.body
      db.prepare(
        'UPDATE media_coverages SET title_en=?,title_zh=?,source=?,date=?,description=?,image_url=?,link=?,sort_order=? WHERE id=?'
      ).run(title_en, title_zh, source, date, description, image_url, link, sort_order, req.params.id)
      res.json({ success: true, data: null, error: null })
    } catch (err) { next(err) }
  },
  pressDelete(req, res, next) {
    try { const db = getDb(); db.prepare('DELETE FROM media_coverages WHERE id=?').run(req.params.id); res.json({ success: true, data: null, error: null }) } catch (err) { next(err) }
  },

  workshopList(req, res, next) {
    try { const db = getDb(); res.json({ success: true, data: db.prepare('SELECT * FROM workshops ORDER BY date DESC').all(), error: null }) } catch (err) { next(err) }
  },
  workshopCreate(req, res, next) {
    try {
      const db = getDb()
      const { title_en, title_zh, date, location, description, images, attendee_count } = req.body
      const result = db.prepare(
        'INSERT INTO workshops (title_en,title_zh,date,location,description,images,attendee_count) VALUES (?,?,?,?,?,?,?)'
      ).run(title_en, title_zh, date, location, description, JSON.stringify(images || []), attendee_count || 0)
      res.json({ success: true, data: { id: result.lastInsertRowid }, error: null })
    } catch (err) { next(err) }
  },
  workshopUpdate(req, res, next) {
    try {
      const db = getDb()
      const { title_en, title_zh, date, location, description, images, attendee_count } = req.body
      db.prepare(
        'UPDATE workshops SET title_en=?,title_zh=?,date=?,location=?,description=?,images=?,attendee_count=? WHERE id=?'
      ).run(title_en, title_zh, date, location, description, JSON.stringify(images || []), attendee_count, req.params.id)
      res.json({ success: true, data: null, error: null })
    } catch (err) { next(err) }
  },
  workshopDelete(req, res, next) {
    try { const db = getDb(); db.prepare('DELETE FROM workshops WHERE id=?').run(req.params.id); res.json({ success: true, data: null, error: null }) } catch (err) { next(err) }
  },

  faqList(req, res, next) {
    try { const db = getDb(); res.json({ success: true, data: db.prepare('SELECT * FROM faqs ORDER BY sort_order').all(), error: null }) } catch (err) { next(err) }
  },
  faqCreate(req, res, next) {
    try {
      const db = getDb()
      const { question_en, question_zh, answer_en, answer_zh, sort_order } = req.body
      const result = db.prepare(
        'INSERT INTO faqs (question_en,question_zh,answer_en,answer_zh,sort_order) VALUES (?,?,?,?,?)'
      ).run(question_en, question_zh, answer_en, answer_zh, sort_order || 0)
      res.json({ success: true, data: { id: result.lastInsertRowid }, error: null })
    } catch (err) { next(err) }
  },
  faqUpdate(req, res, next) {
    try {
      const db = getDb()
      const { question_en, question_zh, answer_en, answer_zh, sort_order } = req.body
      db.prepare(
        'UPDATE faqs SET question_en=?,question_zh=?,answer_en=?,answer_zh=?,sort_order=? WHERE id=?'
      ).run(question_en, question_zh, answer_en, answer_zh, sort_order, req.params.id)
      res.json({ success: true, data: null, error: null })
    } catch (err) { next(err) }
  },
  faqDelete(req, res, next) {
    try { const db = getDb(); db.prepare('DELETE FROM faqs WHERE id=?').run(req.params.id); res.json({ success: true, data: null, error: null }) } catch (err) { next(err) }
  },

  storyGet(req, res, next) {
    try {
      const db = getDb()
      const items = db.prepare("SELECT * FROM site_content WHERE key LIKE 'story_%'").all()
      res.json({ success: true, data: items, error: null })
    } catch (err) { next(err) }
  },
  storyUpdate(req, res, next) {
    try {
      const db = getDb()
      const { key, value_en, value_zh } = req.body
      db.prepare('UPDATE site_content SET value_en=?, value_zh=? WHERE key=?').run(value_en, value_zh, key)
      res.json({ success: true, data: null, error: null })
    } catch (err) { next(err) }
  },

  stats(req, res, next) {
    try {
      const db = getDb()
      const totalProducts = db.prepare('SELECT COUNT(*) as c FROM products').get().c
      const published = db.prepare('SELECT COUNT(*) as c FROM products WHERE is_published = 1').get().c
      const inquiries = db.prepare('SELECT COUNT(*) as c FROM contact_messages').get().c
      const recentInquiries = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5').all()
      const blogPosts = db.prepare('SELECT COUNT(*) as c FROM blog_posts').get().c
      res.json({ success: true, data: { totalProducts, published, inquiries, recentInquiries, blogPosts }, error: null })
    } catch (err) { next(err) }
  },

  mediaList(req, res, next) {
    try {
      const fs = require('fs')
      const path = require('path')
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads')
      const files = fs.readdirSync(uploadsDir).filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
      const images = files.map(f => ({ name: f, url: `/uploads/${f}` }))
      res.json({ success: true, data: images, error: null })
    } catch (err) { next(err) }
  },

  reorder(req, res, next) {
    try {
      const db = getDb()
      const { ids } = req.body
      const stmt = db.prepare('UPDATE products SET sort_order = ? WHERE id = ?')
      const tx = db.transaction(() => {
        ids.forEach((id, i) => stmt.run(i, id))
      })
      tx()
      res.json({ success: true, data: null, error: null })
    } catch (err) { next(err) }
  },
}

module.exports = AdminController
