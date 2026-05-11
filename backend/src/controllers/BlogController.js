const BlogPost = require('../models/BlogPost')

const BlogController = {
  list(req, res, next) {
    try {
      const { page, limit } = req.query
      const result = BlogPost.findAll({
        page: parseInt(page) || 1,
        limit: Math.min(parseInt(limit) || 9, 30),
      })
      res.json({ success: true, data: result.items, meta: { total: result.total, page: result.page, limit: result.limit }, error: null })
    } catch (err) { next(err) }
  },

  detail(req, res, next) {
    try {
      const post = BlogPost.findBySlug(req.params.slug)
      if (!post) return res.status(404).json({ success: false, data: null, error: 'Post not found' })
      res.json({ success: true, data: post, error: null })
    } catch (err) { next(err) }
  },
}

module.exports = BlogController
