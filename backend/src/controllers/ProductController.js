const Product = require('../models/Product')
const Category = require('../models/Category')

const ProductController = {
  list(req, res, next) {
    try {
      const { category, page, limit, featured } = req.query
      const result = Product.findAll({
        category,
        page: parseInt(page) || 1,
        limit: Math.min(parseInt(limit) || 12, 50),
        featured: featured === '1',
      })
      res.json({ success: true, data: result.items, meta: { total: result.total, page: result.page, limit: result.limit }, error: null })
    } catch (err) { next(err) }
  },

  detail(req, res, next) {
    try {
      const product = Product.findBySlug(req.params.slug)
      if (!product) return res.status(404).json({ success: false, data: null, error: 'Product not found' })
      res.json({ success: true, data: product, error: null })
    } catch (err) { next(err) }
  },

  categories(req, res, next) {
    try {
      const categories = Category.findAll()
      res.json({ success: true, data: categories, error: null })
    } catch (err) { next(err) }
  },
}

module.exports = ProductController
