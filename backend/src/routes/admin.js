const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { auth } = require('../middleware/auth')
const AdminController = require('../controllers/AdminController')

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

router.post('/login', AdminController.login)
router.get('/stats', auth, AdminController.stats)
router.get('/media', auth, AdminController.mediaList)
router.post('/reorder', auth, AdminController.reorder)
router.post('/upload', auth, upload.single('image'), AdminController.upload)

router.get('/products', auth, AdminController.productList)
router.post('/products', auth, AdminController.productCreate)
router.put('/products/:id', auth, AdminController.productUpdate)
router.delete('/products/:id', auth, AdminController.productDelete)

router.get('/blog-posts', auth, AdminController.blogList)
router.post('/blog-posts', auth, AdminController.blogCreate)
router.put('/blog-posts/:id', auth, AdminController.blogUpdate)
router.delete('/blog-posts/:id', auth, AdminController.blogDelete)

router.get('/gallery', auth, AdminController.galleryList)
router.post('/gallery', auth, AdminController.galleryCreate)
router.delete('/gallery/:id', auth, AdminController.galleryDelete)

router.get('/press', auth, AdminController.pressList)
router.post('/press', auth, AdminController.pressCreate)
router.put('/press/:id', auth, AdminController.pressUpdate)
router.delete('/press/:id', auth, AdminController.pressDelete)

router.get('/workshops', auth, AdminController.workshopList)
router.post('/workshops', auth, AdminController.workshopCreate)
router.put('/workshops/:id', auth, AdminController.workshopUpdate)
router.delete('/workshops/:id', auth, AdminController.workshopDelete)

router.get('/faq', auth, AdminController.faqList)
router.post('/faq', auth, AdminController.faqCreate)
router.put('/faq/:id', auth, AdminController.faqUpdate)
router.delete('/faq/:id', auth, AdminController.faqDelete)

router.get('/story', auth, AdminController.storyGet)
router.put('/story', auth, AdminController.storyUpdate)

module.exports = router
