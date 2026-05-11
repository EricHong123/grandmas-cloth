const { getDb } = require('../config/database')

const ContactMessage = {
  create(data) {
    const db = getDb()
    const stmt = db.prepare(
      'INSERT INTO contact_messages (name, email, phone, product_id, message) VALUES (@name, @email, @phone, @product_id, @message)'
    )
    const result = stmt.run(data)
    return { id: result.lastInsertRowid, ...data }
  },
}

module.exports = ContactMessage
