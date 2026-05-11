import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import StoryPage from './pages/StoryPage'
import CollectionPage from './pages/CollectionPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CraftPage from './pages/CraftPage'
import PressPage from './pages/PressPage'
import WorkshopsPage from './pages/WorkshopsPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import CustomPage from './pages/CustomPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductEditor from './pages/admin/ProductEditor'
import BlogEditor from './pages/admin/BlogEditor'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/our-story" element={<StoryPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/collection/:slug" element={<ProductDetailPage />} />
        <Route path="/the-craft" element={<CraftPage />} />
        <Route path="/gallery" element={<Navigate to="/collection" replace />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/custom" element={<CustomPage />} />
      </Route>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products/new" element={<ProductEditor />} />
      <Route path="/admin/products/:id/edit" element={<ProductEditor />} />
      <Route path="/admin/blog/new" element={<BlogEditor />} />
      <Route path="/admin/blog/:id/edit" element={<BlogEditor />} />
    </Routes>
  )
}
