// API base URL — set by Vite at build time
// In dev, proxy handles /api → localhost:3001
// In production (Cloudflare Pages), set VITE_API_URL to your Render backend
const API_BASE = import.meta.env.VITE_API_URL || ''

export { API_BASE }
