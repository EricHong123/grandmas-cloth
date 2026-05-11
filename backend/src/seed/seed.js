const { getDb } = require('../config/database')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const db = getDb()

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES categories(id),
    title_en TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_en TEXT,
    description_zh TEXT,
    price TEXT,
    size TEXT,
    materials_en TEXT,
    materials_zh TEXT,
    making_time TEXT,
    is_one_of_a_kind INTEGER DEFAULT 1,
    images TEXT DEFAULT '[]',
    video_url TEXT,
    is_featured INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS media_coverages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_en TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    source TEXT NOT NULL,
    date TEXT,
    description TEXT,
    image_url TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS workshops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_en TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    date TEXT,
    location TEXT,
    description TEXT,
    images TEXT DEFAULT '[]',
    attendee_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_en TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    is_published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    product_id INTEGER,
    message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_en TEXT NOT NULL,
    question_zh TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    answer_zh TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value_en TEXT,
    value_zh TEXT
  );
`)

// Migration: add video_url to existing products table
try { db.exec('ALTER TABLE products ADD COLUMN video_url TEXT') } catch (_) { /* already exists */ }

const dataDir = path.join(__dirname, '..', '..', 'data')
const imagesDir = path.join(__dirname, '..', '..', 'uploads')
fs.mkdirSync(dataDir, { recursive: true })
fs.mkdirSync(imagesDir, { recursive: true })

const catCount = db.prepare('SELECT COUNT(*) as cnt FROM categories').get().cnt
if (catCount === 0) {
  const insertCat = db.prepare('INSERT INTO categories (name_en, name_zh, slug, sort_order) VALUES (?, ?, ?, ?)')
  insertCat.run('Framed Wall Art', '装框壁挂', 'framed-wall-art', 1)
  insertCat.run('Table Decor', '桌面摆件', 'table-decor', 2)
  insertCat.run('Custom Commission', '定制服务', 'custom-commission', 3)
  insertCat.run('Small Gifts', '小型礼品', 'small-gifts', 4)

  const insertProduct = db.prepare(
    `INSERT INTO products (category_id, title_en, title_zh, slug, description_en, description_zh, price, size, materials_en, materials_zh, making_time, is_one_of_a_kind, is_featured)
     VALUES (@category_id, @title_en, @title_zh, @slug, @description_en, @description_zh, @price, @size, @materials_en, @materials_zh, @making_time, 1, 1)`
  )
  insertProduct.run({ category_id: 1, title_en: 'Peonies in Bloom', title_zh: '牡丹盛放', slug: 'peonies-in-bloom',
    description_en: 'A vibrant cloth mosaic depicting peonies — the king of flowers in Chinese culture, symbolizing prosperity and honor.',
    description_zh: '一幅生动的布贴画，描绘了中国文化中的花王——牡丹，象征着富贵与尊荣。',
    price: '$299', size: '60cm x 45cm', materials_en: 'Silk, cotton, linen on canvas', materials_zh: '丝绸、棉布、麻布于画布', making_time: '2-3 weeks' })
  insertProduct.run({ category_id: 1, title_en: 'Lotus Pond', title_zh: '荷塘月色', slug: 'lotus-pond',
    description_en: 'A serene cloth painting of a lotus pond under moonlight.',
    description_zh: '一幅宁静的布贴画，描绘月下荷塘。莲花出淤泥而不染。',
    price: '$349', size: '80cm x 50cm', materials_en: 'Silk, cotton, brocade on canvas', materials_zh: '丝绸、棉布、织锦于画布', making_time: '3-4 weeks' })
  insertProduct.run({ category_id: 2, title_en: 'Fortune Panda', title_zh: '福运熊猫', slug: 'fortune-panda',
    description_en: 'An adorable panda crafted from textured black-and-white fabrics.',
    description_zh: '一只用黑白纹理布料制作的可爱的熊猫。',
    price: '$79', size: '20cm x 15cm', materials_en: 'Cotton, felt, on wood board', materials_zh: '棉布、毛毡于木板', making_time: '1 week' })
  insertProduct.run({ category_id: 2, title_en: 'Plum Blossom Fan', title_zh: '梅花折扇', slug: 'plum-blossom-fan',
    description_en: 'A decorative folding fan featuring plum blossoms.',
    description_zh: '一把装饰折扇，以梅花为主题——冬日的花朵，象征坚韧与希望。',
    price: '$129', size: '35cm (open)', materials_en: 'Silk, cotton on fan frame', materials_zh: '丝绸、棉布于扇骨', making_time: '1-2 weeks' })

  const insertCoverage = db.prepare(
    'INSERT INTO media_coverages (title_en, title_zh, source, date, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
  )
  insertCoverage.run('Guangzhou News Feature', '广州新闻报道', '广州新闻', '2022', 'Featured interview about preserving intangible cultural heritage.', 1)
  insertCoverage.run('Humen News Coverage', '虎门新闻报道', '虎门新闻', '2022', 'Coverage of a community workshop teaching children cloth patchwork art.', 2)
  insertCoverage.run('Humen Daily Profile', '虎门日报专访', '虎门日报', '2023', 'In-depth profile of the artisan\'s 40-year journey.', 3)

  const insertWorkshop = db.prepare(
    'INSERT INTO workshops (title_en, title_zh, date, location, description, attendee_count) VALUES (?, ?, ?, ?, ?, ?)'
  )
  insertWorkshop.run('Children\'s Workshop at Humen Library', '虎门图书馆少儿工作坊', '2022-07', 'Humen Library', 'Introducing 30 children to cloth patchwork art.', 30)
  insertWorkshop.run('Community Cultural Day', '社区文化日', '2022-09', 'Humen Community Center', 'Demonstrating techniques to 50+ community members.', 50)
  insertWorkshop.run('School Heritage Program', '学校非遗进校园', '2023-03', 'Humen Primary School', 'Teaching traditional cloth art to 40 students.', 40)
  insertWorkshop.run('Summer Art Camp', '暑期艺术营', '2023-07', 'Humen Cultural Center', 'A 3-day camp teaching the full cloth mosaic process.', 25)

  const insertBlog = db.prepare(
    'INSERT INTO blog_posts (title_en, title_zh, slug, excerpt, content, is_published) VALUES (?, ?, ?, ?, ?, 1)'
  )
  insertBlog.run('The Story Behind "Peonies in Bloom"', '《牡丹盛放》背后的故事', 'story-behind-peonies-in-bloom',
    'Every piece tells a story. Discover the inspiration behind one of our most beloved works.',
    '<p>Every cloth painting begins with a feeling...</p>')
  insertBlog.run('What Makes Cloth Mosaic a Cultural Heritage?', '布贴画何以成为文化遗产？', 'what-makes-cloth-mosaic-cultural-heritage',
    'Understanding the centuries-old roots of cloth patchwork painting.',
    '<p>Cloth patchwork painting dates back to the Tang Dynasty...</p>')

  const insertFaq = db.prepare(
    'INSERT INTO faqs (question_en, question_zh, answer_en, answer_zh, sort_order) VALUES (?, ?, ?, ?, ?)'
  )
  insertFaq.run('How do I purchase a piece?', '如何购买作品？', 'Simply contact us via WhatsApp. We\'ll discuss preferences, pricing, and shipping.', '只需通过 WhatsApp 联系我们。', 1)
  insertFaq.run('Do you ship internationally?', '是否支持国际物流？', 'Yes! Worldwide via DHL and EMS, typically 7-15 business days.', '是的！DHL 和 EMS 全球发货，通常 7-15 天。', 2)
  insertFaq.run('Can I request a custom piece?', '可以定制作品吗？', 'Absolutely. Share your vision on WhatsApp.', '当然可以。通过 WhatsApp 告诉我们您的想法。', 3)
  insertFaq.run('How do I care for my cloth art?', '如何保养布贴画？', 'Keep away from direct sunlight and moisture. Dust gently with a soft brush.', '避免阳光直射和潮湿。用软刷轻轻除尘。', 4)

  const insertContent = db.prepare('INSERT INTO site_content (key, value_en, value_zh) VALUES (?, ?, ?)')
  insertContent.run('story_title', 'Our Story — Four Decades of Cloth Mosaic', '我们的故事——四十年的布贴画之路')
  insertContent.run('story_body',
    '<p>Born in Humen, Guangdong, I began learning cloth patchwork painting from my mother when I was a young girl. What started as a childhood fascination grew into a lifelong devotion. For over forty years, I have cut, layered, and stitched fabric into landscapes, flowers, birds, and scenes from Chinese folklore.</p><p>This art form — <em>Bu Tie Hua</em> — transforms humble fabric scraps into richly textured paintings. Each piece requires patience, precision, and a deep understanding of how colors and textures interact. No two pieces are ever the same.</p><p>In recent years, I have devoted myself to passing this craft to the next generation, teaching workshops for children in our community.</p>',
    '<p>我出生于广东虎门，从小跟着母亲学习布贴画。儿时的兴趣变成了一生的热爱。四十多年来，我剪裁、层叠、拼贴布料，创作出山水、花鸟、人物和民间故事。</p><p>这门手艺——布贴画——将普通的碎布变成质感丰富的画作。每一件作品都需要耐心、精准，以及对色彩和纹理相互作用的深刻理解。没有两件作品是完全相同的。</p><p>近年来，我致力于将这门手艺传给下一代，在社区为孩子们举办教学工作坊。</p>')
  insertContent.run('craft_intro',
    '<p>Cloth patchwork painting (<em>Bu Tie Hua</em>) is a traditional Chinese folk art with roots tracing back to the Tang Dynasty (618-907 CE). Unlike embroidery, which works thread onto fabric, cloth mosaic builds images by cutting and layering different fabrics — silk, cotton, linen, brocade — to create depth, texture, and vibrant color compositions.</p>',
    '<p>布贴画是中国传统民间艺术，其根源可追溯到唐代（公元618-907年）。与刺绣不同，布贴画不是用线在布上绣花，而是通过剪裁和层叠不同的布料——丝绸、棉布、麻布、织锦——来创造深度、质感和丰富的色彩构图。</p>')

  const hash = bcrypt.hashSync('admin123', 10)
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', hash)
}

console.log('Database seeded successfully.')
process.exit(0)
