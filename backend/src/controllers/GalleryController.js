const Product = require('../models/Product')

const GalleryController = {
  list(req, res, next) {
    try {
      const { category } = req.query
      const result = Product.findAll({ category, limit: 50, page: 1 })
      res.json({ success: true, data: result.items, error: null })
    } catch (err) { next(err) }
  },
}

module.exports = GalleryController
