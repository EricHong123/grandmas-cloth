const ContactMessage = require('../models/ContactMessage')

const ContactController = {
  submit(req, res, next) {
    try {
      const { name, email, phone, message } = req.body
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, data: null, error: 'Name, email, and message are required.' })
      }
      const record = ContactMessage.create({ name, email, phone: phone || null, product_id: null, message })
      res.json({ success: true, data: { id: record.id }, error: null })
    } catch (err) { next(err) }
  },

  inquiry(req, res, next) {
    try {
      const { product_id, name, email, message } = req.body
      const record = ContactMessage.create({
        name: name || 'Anonymous',
        email: email || '',
        phone: null,
        product_id: product_id || null,
        message: message || 'Product inquiry',
      })
      res.json({ success: true, data: { id: record.id }, error: null })
    } catch (err) { next(err) }
  },
}

module.exports = ContactController
