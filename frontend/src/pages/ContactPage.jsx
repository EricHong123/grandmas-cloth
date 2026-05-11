import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { postApi } from '../hooks/useApi'
import SEOHead from '../components/common/SEOHead'

export default function ContactPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await postApi('/api/contact', form)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      // ignore
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <SEOHead title={t('contact.title')} path="/contact" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ Get in Touch</p>
        <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-2">{t('contact.title')}</h1>
        <div className="flex items-center gap-2 mb-12">
          <div className="h-px w-8 bg-cinnabar opacity-40" />
          <div className="h-px w-4 bg-cinnabar opacity-25" />
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <a
              href="https://wa.me/86"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-cinnabar hover:bg-cinnabar-dark text-white p-5 rounded-fabric transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              <div>
                <p className="font-medium">{t('contact.whatsapp')}</p>
                <p className="text-sm opacity-80">+86 (WhatsApp)</p>
              </div>
            </a>

            <div className="bg-rice p-5 rounded-fabric border-stitch-warm">
              <p className="font-chinese-display text-ink-900 text-sm">{t('contact.email')}</p>
              <p className="text-sm text-cinnabar mt-1">hello@grandmascloth.com</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-fabric border-stitch-warm space-y-4">
            <h3 className="font-chinese-display text-ink-900">{t('contact.form')}</h3>
            <div>
              <label className="block text-xs text-ink-500 mb-1 tracking-wide">{t('contact.name')}</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border-stitch-warm rounded-fabric-sm text-sm focus:outline-none focus:ring-2 focus:ring-cinnabar bg-warmth-50"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-500 mb-1 tracking-wide">{t('contact.email')}</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border-stitch-warm rounded-fabric-sm text-sm focus:outline-none focus:ring-2 focus:ring-cinnabar bg-warmth-50"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-500 mb-1 tracking-wide">{t('contact.message')}</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border-stitch-warm rounded-fabric-sm text-sm focus:outline-none focus:ring-2 focus:ring-cinnabar bg-warmth-50 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-cinnabar hover:bg-cinnabar-dark disabled:bg-ink-300 text-white font-medium rounded-fabric transition-colors text-sm"
            >
              {sending ? t('common.loading') : sent ? t('contact.sent') : t('contact.send')}
            </button>
            {sent && <p className="text-jade text-sm text-center">{t('contact.sent')}</p>}
          </form>
        </div>
      </div>
    </>
  )
}
