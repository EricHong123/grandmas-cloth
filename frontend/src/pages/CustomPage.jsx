import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/common/SEOHead'

/* ── Configuration: all customization options ── */

const STEPS = ['Theme', 'Size', 'Color', 'Fabric', 'Details']

const OPTIONS = {
  theme: [
    { id: 'flowers', icon: '🌸', label: 'Flowers & Birds', desc: 'Peonies, plum blossoms, lotus — classic Chinese botanical motifs' },
    { id: 'landscape', icon: '🏔️', label: 'Landscape', desc: 'Mountains, rivers, scenes from nature or your favorite place' },
    { id: 'animals', icon: '🐼', label: 'Animals', desc: 'Your pet, a panda, crane, or your Chinese zodiac animal' },
    { id: 'auspicious', icon: '🏮', label: 'Auspicious Symbols', desc: 'Double happiness, good fortune, longevity, prosperity' },
    { id: 'photo', icon: '📷', label: 'From Your Photo', desc: 'Send a photo — Grandma recreates it in fabric' },
    { id: 'artist', icon: '✨', label: 'Artist\'s Choice', desc: 'Let Grandma create what inspires her in the moment' },
  ],
  size: [
    { id: 'petite', label: 'Petite', dims: '20 × 30 cm / 8 × 12 in', desc: 'Desk or bookshelf accent', price: '$149–199' },
    { id: 'medium', label: 'Medium', dims: '40 × 60 cm / 16 × 24 in', desc: 'Standard wall display', price: '$249–349' },
    { id: 'large', label: 'Large', dims: '60 × 90 cm / 24 × 36 in', desc: 'Statement piece for living room', price: '$399–549' },
    { id: 'grand', label: 'Grand', dims: '80 × 120 cm / 32 × 48 in', desc: 'Above the fireplace or entryway', price: '$599–899' },
  ],
  color: [
    { id: 'classic', icon: '🔴', label: 'Classic Chinese', desc: 'Cinnabar red, indigo blue, imperial gold — bold and auspicious', swatch: 'from-red-600 via-amber-500 to-blue-700' },
    { id: 'soft', icon: '🌿', label: 'Soft & Natural', desc: 'Muted earth tones, sage greens, warm beiges — calm and elegant', swatch: 'from-amber-200 via-green-400 to-stone-400' },
    { id: 'vibrant', icon: '🎨', label: 'Vibrant & Bold', desc: 'High contrast, saturated colors — makes a statement', swatch: 'from-fuchsia-500 via-cyan-400 to-yellow-400' },
    { id: 'match', icon: '🏠', label: 'Match My Room', desc: 'Send a photo of your space — Grandma matches the palette', swatch: 'from-gray-300 via-rose-300 to-amber-200' },
  ],
  fabric: [
    { id: 'classic', label: 'Classic', materials: 'Cotton + Linen blend', desc: 'Natural texture, matte finish', add: '' },
    { id: 'premium', label: 'Premium', materials: 'Cotton + Silk accents', desc: 'Subtle sheen where light hits', add: '+$60–120' },
    { id: 'heirloom', label: 'Heirloom', materials: 'Silk, Brocade + Gold thread', desc: 'Museum-grade, luminous depth', add: '+$150–300' },
  ],
}

/* ── Step card component ── */

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-fabric-sm text-sm font-medium transition-colors ${
            i <= current ? 'bg-cinnabar text-white' : 'bg-warmth-100 text-ink-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              i < current ? 'bg-white text-cinnabar' : i === current ? 'bg-white/20 text-white' : 'bg-warmth-200 text-ink-400'
            }`}>
              {i < current ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px w-4 sm:w-8 ${i < current ? 'bg-cinnabar' : 'bg-warmth-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function OptionCard({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 sm:p-5 rounded-fabric border transition-all ${
        selected
          ? 'border-cinnabar bg-warmth-50 shadow-md ring-1 ring-cinnabar/20'
          : 'border-stitch-warm bg-white card-hover-fabric'
      }`}
    >
      {children}
    </button>
  )
}

/* ── Main page ── */

export default function CustomPage() {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [choices, setChoices] = useState({})

  const update = (key, val) => {
    setChoices(prev => ({ ...prev, [key]: val }))
    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 250)
    }
  }

  const selectedLabel = (key, id) => {
    const opts = OPTIONS[key]
    if (!opts) return id
    const found = opts.find(o => o.id === id)
    return found ? found.label || found.dims || id : id
  }

  const whatsappMessage = useMemo(() => {
    const parts = [
      'Hi! I\'d like to commission a custom cloth mosaic piece:',
      '',
      `• Theme: ${selectedLabel('theme', choices.theme)}`,
      `• Size: ${selectedLabel('size', choices.size)}`,
      `• Color: ${selectedLabel('color', choices.color)}`,
      `• Fabric: ${selectedLabel('fabric', choices.fabric)}`,
      choices.details ? `• Personal note: ${choices.details}` : '',
      '',
      'Can you tell me about pricing and timeline?',
    ]
    return encodeURIComponent(parts.filter(Boolean).join('\n'))
  }, [choices])

  return (
    <>
      <SEOHead title="Custom Commission" description="Commission a one-of-a-kind cloth mosaic piece made just for you." path="/custom" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <p className="text-xs tracking-[0.2em] text-ink-400 uppercase mb-2">✦ Bespoke</p>
        <h1 className="text-3xl sm:text-4xl font-chinese-display text-ink-900 mb-2">
          Commission a Piece
        </h1>
        <p className="text-ink-500 mb-2 max-w-lg">
          Every commission is a conversation. Tell Grandma what you dream of — she'll bring it to life in fabric.
        </p>
        <div className="flex items-center gap-2 mb-10">
          <div className="h-px w-8 bg-cinnabar opacity-40" />
          <div className="h-px w-4 bg-cinnabar opacity-25" />
        </div>

        <StepIndicator current={step} />

        {/* ── Step 1: Theme ── */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-chinese-display text-ink-900 mb-1">What should it depict?</h2>
            <p className="text-sm text-ink-500 mb-6">Choose a theme — or pick "From Your Photo" to send your own reference.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {OPTIONS.theme.map(o => (
                <OptionCard key={o.id} selected={choices.theme === o.id} onClick={() => update('theme', o.id)}>
                  <span className="text-2xl">{o.icon}</span>
                  <h3 className="font-chinese-display text-sm text-ink-900 mt-2">{o.label}</h3>
                  <p className="text-xs text-ink-500 mt-1 leading-relaxed">{o.desc}</p>
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Size ── */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-chinese-display text-ink-900 mb-1">How large should it be?</h2>
            <p className="text-sm text-ink-500 mb-6">All sizes are approximate. Custom dimensions welcome.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {OPTIONS.size.map(o => (
                <OptionCard key={o.id} selected={choices.size === o.id} onClick={() => update('size', o.id)}>
                  {/* Size visual bar */}
                  <div className={`bg-warmth-200 rounded-fabric-sm mb-3 mx-auto ${
                    o.id === 'petite' ? 'w-10 h-10' : o.id === 'medium' ? 'w-16 h-16' : o.id === 'large' ? 'w-24 h-20' : 'w-32 h-24'
                  }`} />
                  <h3 className="font-chinese-display text-sm text-ink-900">{o.label}</h3>
                  <p className="text-[11px] text-ink-400 mt-0.5">{o.dims}</p>
                  <p className="text-xs text-ink-500 mt-1">{o.desc}</p>
                  <p className="text-xs font-bold text-cinnabar mt-2">{o.price}</p>
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Color ── */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-chinese-display text-ink-900 mb-1">What color mood?</h2>
            <p className="text-sm text-ink-500 mb-6">Pick a direction — Grandma will work within that palette.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {OPTIONS.color.map(o => (
                <OptionCard key={o.id} selected={choices.color === o.id} onClick={() => update('color', o.id)}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-fabric-sm bg-gradient-to-br ${o.swatch} shrink-0`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{o.icon}</span>
                        <h3 className="font-chinese-display text-sm text-ink-900">{o.label}</h3>
                      </div>
                      <p className="text-xs text-ink-500 mt-1 leading-relaxed">{o.desc}</p>
                    </div>
                  </div>
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Fabric ── */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-chinese-display text-ink-900 mb-1">Which fabric quality?</h2>
            <p className="text-sm text-ink-500 mb-6">Fabric defines the texture and longevity of the piece.</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {OPTIONS.fabric.map(o => (
                <OptionCard key={o.id} selected={choices.fabric === o.id} onClick={() => update('fabric', o.id)}>
                  {/* Fabric texture visual */}
                  <div className={`h-16 rounded-fabric-sm mb-3 ${
                    o.id === 'classic'
                      ? 'bg-gradient-to-br from-warmth-100 to-warmth-200'
                      : o.id === 'premium'
                      ? 'bg-gradient-to-br from-warmth-100 via-amber-50 to-warmth-200'
                      : 'bg-gradient-to-br from-amber-100 via-red-50 to-yellow-100'
                  }`} />
                  <h3 className="font-chinese-display text-sm text-ink-900">{o.label}</h3>
                  <p className="text-[11px] text-ink-400">{o.materials}</p>
                  <p className="text-xs text-ink-500 mt-1">{o.desc}</p>
                  {o.add && <p className="text-xs font-medium text-cinnabar mt-1.5">{o.add}</p>}
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 5: Details + Summary ── */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-chinese-display text-ink-900 mb-1">Any personal touches?</h2>
            <p className="text-sm text-ink-500 mb-6">Add a name, date, short message — or anything else you'd like Grandma to know.</p>
            <textarea
              rows={3}
              value={choices.details || ''}
              onChange={e => setChoices(prev => ({ ...prev, details: e.target.value }))}
              placeholder="e.g. 'For my daughter's wedding — include her name 美玲 and the date 2026.06.15'"
              className="w-full px-4 py-3 border-stitch-warm rounded-fabric text-sm focus:outline-none focus:ring-2 focus:ring-cinnabar bg-white resize-none mb-8"
            />

            {/* Summary */}
            <div className="bg-rice rounded-fabric-lg p-6 border-stitch-warm mb-8">
              <h3 className="font-chinese-display text-ink-900 mb-4">Your Commission Summary</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Theme', choices.theme],
                  ['Size', choices.size],
                  ['Color', choices.color],
                  ['Fabric', choices.fabric],
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-ink-400 w-16 shrink-0 text-xs">{label}</span>
                    <span className="text-ink-800 font-medium">{val ? selectedLabel(label.toLowerCase(), val) : '—'}</span>
                  </div>
                ))}
                {choices.details && (
                  <div className="flex gap-3">
                    <span className="text-ink-400 w-16 shrink-0 text-xs">Note</span>
                    <span className="text-ink-700 text-xs italic">"{choices.details}"</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-ink-400 mt-4 pt-4 border-t border-dashed border-warmth-300">
                Grandma will review your choices and respond with a sketch, fabric swatches, and a final price — usually within 24 hours.
              </p>
            </div>

            {/* CTA */}
            <a
              href={`https://wa.me/86?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-cinnabar hover:bg-cinnabar-dark text-white px-8 py-4 rounded-fabric font-medium transition-colors shadow-sm group w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              <div className="text-left">
                <span className="font-medium block">Send to Grandma on WhatsApp</span>
                <span className="text-xs opacity-70">Usually replies within 24 hours</span>
              </div>
            </a>

            {/* Back/edit buttons */}
            <div className="mt-4 flex gap-3 justify-center sm:justify-start">
              {STEPS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setStep(i)}
                  className={`text-xs px-3 py-1 rounded-fabric-sm transition-colors ${
                    i === step ? 'bg-cinnabar text-white' : 'text-ink-500 hover:text-cinnabar hover:bg-warmth-100'
                  }`}
                >
                  {i + 1}. {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skip to WhatsApp — always visible */}
        {step < 4 && (
          <div className="mt-10 pt-8 border-t border-dashed border-warmth-300 text-center">
            <p className="text-xs text-ink-400 mb-2">Prefer to describe your idea directly?</p>
            <a
              href="https://wa.me/86?text=Hi! I'd like to discuss a custom cloth mosaic commission."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cinnabar hover:text-cinnabar-dark font-medium border-b border-cinnabar pb-0.5 transition-colors"
            >
              Skip to WhatsApp →
            </a>
          </div>
        )}
      </div>
    </>
  )
}
