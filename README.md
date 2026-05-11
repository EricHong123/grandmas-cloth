# Grandma's Cloth

> 布贴画 · 奶奶的手艺 · 中国的温度

Independent website for a 4th-generation Chinese intangible cultural heritage cloth mosaic (布贴画) artisan. Built to showcase handcrafted textile paintings to international customers, with a **Social Media → Website → WhatsApp** conversion funnel.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TailwindCSS 4 |
| Routing | react-router-dom v7 |
| i18n | react-i18next (English / 中文) |
| Backend | Node.js, Express 5 |
| Database | SQLite (better-sqlite3) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Upload | multer |
| Design System | Chinese folk art — fabric textures, stitch borders, seal badges, indigo calico patterns |

---

## Project Structure

```
grandmas-cloth/
├── frontend/                     # React SPA
│   ├── public/images/            # Static assets (hero images, etc.)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # HeroBanner, ProductCard, SEOHead, VideoEmbed
│   │   │   ├── layout/           # Header, Footer, WhatsAppButton, LanguageSwitcher
│   │   │   └── sections/         # FeaturedProducts, StorySnippet, ArtisanHands, etc.
│   │   ├── pages/
│   │   │   ├── HomePage, CollectionPage, ProductDetailPage, CustomPage, ...
│   │   │   └── admin/            # AdminLogin, AdminDashboard, ProductEditor, BlogEditor
│   │   ├── hooks/                # useApi (data fetching)
│   │   ├── i18n/                 # en.json, zh.json
│   │   └── index.css             # Design system tokens, fabric textures, utilities
│   └── vite.config.js
│
├── backend/                      # Express MVC API
│   ├── src/
│   │   ├── config/database.js    # SQLite connection
│   │   ├── models/               # Product, Category, BlogPost, ContactMessage
│   │   ├── controllers/          # Product, Story, Blog, Gallery, Contact, Admin
│   │   ├── routes/               # api.js (public), admin.js (JWT-protected)
│   │   ├── middleware/           # auth, rateLimiter, errorHandler
│   │   └── seed/seed.js          # Schema + sample data
│   ├── data/                     # SQLite database (gitignored)
│   └── uploads/                  # Uploaded images (gitignored)
│
└── .gitignore
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### 1. Backend

```bash
cd backend
npm install
npm run seed        # Create tables + sample data
npm start           # → http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev         # → http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `localhost:3001`.

### 3. Production mode

```bash
cd frontend && npm run build     # Output → frontend/dist/
cd ../backend
NODE_ENV=production npm start    # Serves API + static frontend on one port
```

---

## Admin Panel

| URL | Purpose |
|-----|---------|
| `/admin` | Login page |
| `/admin/dashboard` | Content management (products, blog, FAQ, press, workshops) |
| `/admin/products/new` | Add product |
| `/admin/products/:id/edit` | Edit product (images, video URL, metadata) |

**Default credentials:** `admin` / `admin123`

> ⚠️ Change the password and `JWT_SECRET` before deploying to production.

---

## API Endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | Product list (`?category=&page=&limit=&featured=`) |
| GET | `/api/products/:slug` | Product detail |
| GET | `/api/categories` | Category list |
| GET | `/api/gallery` | Gallery items |
| GET | `/api/story` | Our Story page content |
| GET | `/api/press` | Media coverage |
| GET | `/api/workshops` | Workshop/event list |
| GET | `/api/blog-posts` | Blog post list |
| GET | `/api/blog-posts/:slug` | Blog post detail |
| GET | `/api/faq` | FAQ list |
| GET | `/api/sitemap.xml` | Dynamic sitemap |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/inquiry` | Product inquiry |

### Admin (JWT-protected)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/upload` | Image upload (multipart) |
| CRUD | `/api/admin/products` | Product management |
| CRUD | `/api/admin/blog-posts` | Blog management |
| CRUD | `/api/admin/press` | Press/coverage management |
| CRUD | `/api/admin/workshops` | Workshop management |
| CRUD | `/api/admin/faq` | FAQ management |
| GET/PUT | `/api/admin/story` | Story content management |

All responses use a unified envelope:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { "total": 50, "page": 1, "limit": 12 }
}
```

---

## Key Features

- **14 public pages** — Home, About (Story / Press / Workshops), Collection (grid + gallery views), Product Detail, The Craft, Journal (Blog), FAQ, Contact, Custom Commission
- **Custom Commission flow** — 5-step guided builder (Theme → Size → Color → Fabric → Details) → WhatsApp summary
- **Video embed** — YouTube + Bilibili + direct video, with fabric-frame styling
- **i18n** — Full English / Chinese toggle, database fields hold bilingual content
- **Admin panel** — CRUD for products, blog posts, media, workshops, FAQ; image upload; JWT auth
- **SEO** — react-helmet-async meta tags, dynamic sitemap.xml, OG tags per page
- **Design system** — Chinese folk art aesthetic: fabric-weave backgrounds, stitch-dash borders, seal-stamp badges, indigo calico patterns, organic fabric-cut corners

---

## Design Tokens

The CSS design system is defined in `frontend/src/index.css`:

| Token | Purpose |
|-------|---------|
| `rounded-fabric` / `rounded-fabric-sm` / `rounded-fabric-lg` | Organic fabric-cut corners |
| `border-stitch` / `border-stitch-warm` | Dashed stitch-style borders |
| `seal-badge` | Red seal-stamp badge for one-of-a-kind items |
| `bg-calico` | Blue calico (蓝印花布) pattern for dark sections |
| `bg-brocade` | Warm brocade shimmer gradient |
| `font-chinese-display` | Chinese serif font stack (Noto Serif SC, Songti SC, KaiTi) |
| `pattern-divider` | Stitch-line section separator |
| `card-hover-fabric` | Fabric-layer hover effect (no scale) |

Colours: `warmth-*` (earth/dye tones), `ink-*` (calligraphy greys), `cinnabar`, `indigo`, `gamboge`, `jade`, `rice`, `brocade`.

---

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3001` | Backend server port |
| `NODE_ENV` | — | Set to `production` to serve frontend static files |
| `JWT_SECRET` | (hardcoded) | Change before production deployment |

---

## Deployment

### Hostinger VPS (recommended)

```bash
# 1. VPS: install Node.js 20 LTS + nginx + PM2
# 2. Clone repo
git clone https://github.com/EricHong123/grandmas-cloth.git
cd grandmas-cloth

# 3. Build frontend
cd frontend && npm install && npm run build

# 4. Setup backend
cd ../backend && npm install && npm run seed

# 5. Start with PM2
pm2 start src/app.js --name grandmas-cloth

# 6. Nginx: proxy /api/* → localhost:3001, else → frontend/dist/
# 7. SSL: certbot --nginx
```

### Alternative: separate hosting

- **Frontend**: upload `frontend/dist/` to any static host (Hostinger shared, Vercel, Cloudflare Pages)
- **Backend**: deploy to Railway, Render, or a VPS
- Set `CORS` origins in `backend/src/app.js` if on different domains

---

## License

Private repository. All rights reserved.
