const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'cloth-art-secret-change-in-production'

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, data: null, error: 'Unauthorized' })
  }
  try {
    req.admin = jwt.verify(header.slice(7), JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ success: false, data: null, error: 'Invalid token' })
  }
}

module.exports = { auth, JWT_SECRET }
