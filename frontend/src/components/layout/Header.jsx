import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const topLinks = [
  { path: '/', label: 'nav.home', end: true },
]

const aboutChildren = [
  { path: '/our-story', label: 'nav.ourStory' },
  { path: '/press', label: 'nav.press' },
  { path: '/workshops', label: 'nav.workshops' },
]

const contactChildren = [
  { path: '/faq', label: 'nav.faq' },
  { path: '/contact', label: 'nav.contact' },
]

function Dropdown({ label, children, mobile }) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (mobile) {
    return (
      <div>
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 rounded-fabric-sm text-sm text-ink-600 hover:bg-warmth-100 transition-colors">
          {t(label)}
          <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="ml-3 space-y-1 mt-1">
            {children.map(c => (
              <NavLink key={c.path} to={c.path} end
                className={({ isActive }) => `block px-3 py-1.5 rounded-fabric-sm text-sm transition-colors ${isActive ? 'bg-warmth-200 text-warmth-800 font-medium' : 'text-ink-500 hover:text-ink-900'}`}>
                {t(c.label)}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-fabric-sm text-sm text-ink-600 hover:text-ink-900 hover:bg-warmth-100 transition-colors">
        {t(label)}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-fabric-sm shadow-lg border-stitch-warm py-1 min-w-[160px] z-50">
          {children.map(c => (
            <NavLink key={c.path} to={c.path} end onClick={() => setOpen(false)}
              className={({ isActive }) => `block px-4 py-2 text-sm transition-colors ${isActive ? 'bg-warmth-100 text-cinnabar font-medium' : 'text-ink-600 hover:bg-warmth-50'}`}>
              {t(c.label)}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-warmth-50/96 backdrop-blur-md border-b border-dashed border-warmth-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-7 h-7 bg-cinnabar rounded-fabric-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">布</span>
            </span>
            <span className="text-lg font-chinese-display text-ink-900 tracking-tight">Grandma's Cloth</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {topLinks.map(({ path, label, end }) => (
              <NavLink key={path} to={path} end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-fabric-sm text-sm transition-colors ${isActive ? 'bg-warmth-200 text-cinnabar font-medium' : 'text-ink-600 hover:text-ink-900 hover:bg-warmth-100'}`
                }>
                {t(label)}
              </NavLink>
            ))}
            <Dropdown label="nav.about">{aboutChildren}</Dropdown>
            <NavLink to="/collection"
              className={({ isActive }) =>
                `px-3 py-2 rounded-fabric-sm text-sm transition-colors ${isActive ? 'bg-warmth-200 text-cinnabar font-medium' : 'text-ink-600 hover:text-ink-900 hover:bg-warmth-100'}`
              }>
              {t('nav.collection')}
            </NavLink>
            <NavLink to="/custom"
              className={({ isActive }) =>
                `px-3 py-2 rounded-fabric-sm text-sm transition-colors ${isActive ? 'bg-cinnabar text-white font-medium' : 'text-cinnabar hover:bg-warmth-100'}`
              }>
              {t('nav.custom')}
            </NavLink>
            <NavLink to="/the-craft"
              className={({ isActive }) =>
                `px-3 py-2 rounded-fabric-sm text-sm transition-colors ${isActive ? 'bg-warmth-200 text-cinnabar font-medium' : 'text-ink-600 hover:text-ink-900 hover:bg-warmth-100'}`
              }>
              {t('nav.theCraft')}
            </NavLink>
            <NavLink to="/blog"
              className={({ isActive }) =>
                `px-3 py-2 rounded-fabric-sm text-sm transition-colors ${isActive ? 'bg-warmth-200 text-cinnabar font-medium' : 'text-ink-600 hover:text-ink-900 hover:bg-warmth-100'}`
              }>
              {t('nav.blog')}
            </NavLink>
            <Dropdown label="nav.contact">{contactChildren}</Dropdown>
            <LanguageSwitcher />
          </nav>

          <button
            className="lg:hidden p-2 rounded-fabric-sm text-ink-600 hover:bg-warmth-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="lg:hidden pb-4 border-t border-dashed border-warmth-300 pt-2">
            {topLinks.map(({ path, label, end }) => (
              <NavLink key={path} to={path} end={end} onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-fabric-sm text-sm ${isActive ? 'bg-warmth-200 text-cinnabar font-medium' : 'text-ink-600 hover:bg-warmth-100'}`}>
                {t(label)}
              </NavLink>
            ))}
            <Dropdown label="nav.about" mobile>{aboutChildren}</Dropdown>
            <NavLink to="/collection" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `block px-3 py-2 rounded-fabric-sm text-sm ${isActive ? 'bg-warmth-200 text-cinnabar font-medium' : 'text-ink-600 hover:bg-warmth-100'}`}>
              {t('nav.collection')}
            </NavLink>
            <NavLink to="/custom" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `block px-3 py-2 rounded-fabric-sm text-sm ${isActive ? 'bg-cinnabar text-white font-medium' : 'text-cinnabar hover:bg-warmth-100'}`}>
              {t('nav.custom')}
            </NavLink>
            <NavLink to="/the-craft" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `block px-3 py-2 rounded-fabric-sm text-sm ${isActive ? 'bg-warmth-200 text-cinnabar font-medium' : 'text-ink-600 hover:bg-warmth-100'}`}>
              {t('nav.theCraft')}
            </NavLink>
            <NavLink to="/blog" onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `block px-3 py-2 rounded-fabric-sm text-sm ${isActive ? 'bg-warmth-200 text-cinnabar font-medium' : 'text-ink-600 hover:bg-warmth-100'}`}>
              {t('nav.blog')}
            </NavLink>
            <Dropdown label="nav.contact" mobile>{contactChildren}</Dropdown>
            <div className="px-3 py-2"><LanguageSwitcher /></div>
          </nav>
        )}
      </div>
    </header>
  )
}
