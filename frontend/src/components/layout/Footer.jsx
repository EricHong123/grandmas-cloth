import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-calico text-ink-200 mt-20 relative overflow-hidden">
      {/* Top stitch border */}
      <div className="pattern-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo-small.webp" alt="Grandma's Cloth" className="w-7 h-7 rounded-fabric-sm object-cover" />
              <span className="text-lg font-chinese-display text-gamboge-light">Grandma's Cloth</span>
            </div>
            <p className="text-sm text-indigo-light leading-relaxed opacity-80">
              Preserving the intangible cultural heritage of Chinese cloth mosaic art — one stitch at a time.
            </p>
            <p className="text-xs text-indigo-light opacity-50 mt-3 tracking-widest">
              非遗传承 · 布贴画 · 中国手工艺术
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gamboge-light mb-4 uppercase tracking-[0.2em]">{t('nav.about')}</h4>
            <div className="space-y-2.5 text-sm">
              <Link to="/our-story" className="block text-indigo-light hover:text-gamboge transition-colors opacity-80 hover:opacity-100">{t('nav.ourStory')}</Link>
              <Link to="/press" className="block text-indigo-light hover:text-gamboge transition-colors opacity-80 hover:opacity-100">{t('nav.press')}</Link>
              <Link to="/workshops" className="block text-indigo-light hover:text-gamboge transition-colors opacity-80 hover:opacity-100">{t('nav.workshops')}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gamboge-light mb-4 uppercase tracking-[0.2em]">{t('nav.contact')}</h4>
            <div className="space-y-2.5 text-sm">
              <a href="https://wa.me/8613532328175" className="block text-indigo-light hover:text-gamboge transition-colors opacity-80 hover:opacity-100">WhatsApp</a>
              <Link to="/contact" className="block text-indigo-light hover:text-gamboge transition-colors opacity-80 hover:opacity-100">{t('contact.form')}</Link>
              <Link to="/faq" className="block text-indigo-light hover:text-gamboge transition-colors opacity-80 hover:opacity-100">{t('nav.faq')}</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-indigo opacity-30 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-indigo-light opacity-50">
          <span>&copy; {new Date().getFullYear()} Grandma's Cloth. All rights reserved.</span>
          <span className="tracking-widest">✦ 布贴画 · 中国的温度 ✦</span>
        </div>
      </div>
    </footer>
  )
}
