const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const apiRoutes = require('./routes/api')
const adminRoutes = require('./routes/admin')
const { errorHandler } = require('./middleware/errorHandler')
const { rateLimiter } = require('./middleware/rateLimiter')

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(express.json())
app.use('/api', rateLimiter)

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), { maxAge: '30d', immutable: true }))

app.use('/api', apiRoutes)
app.use('/api/admin', adminRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'))
  })
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app
