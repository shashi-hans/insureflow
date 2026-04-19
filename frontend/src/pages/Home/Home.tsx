import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Star, TrendingDown, Clock, ShieldCheck, ChevronRight, Zap, HeartHandshake, FileSearch } from 'lucide-react'
import { TESTIMONIALS } from '../../data/mockData'
import { formatCurrency } from '../../utils/format'

/* ── Hero inline quote widget ─────────────────────────────────────────── */
function HeroQuoteWidget() {
  const nav = useNavigate()
  const [activeProduct, setActiveProduct] = useState<'car' | 'bike' | 'health' | 'term'>('car')

  const products: { key: typeof activeProduct; label: string; route: string }[] = [
    { key: 'car',    label: '🚗 Car',    route: '/motor/quote' },
    { key: 'bike',   label: '🏍️ Bike',  route: '/bike/quote' },
    { key: 'health', label: '🏥 Health', route: '/health/quote' },
    { key: 'term',   label: '💎 Term',   route: '/term/quote' },
  ]

  const showVehicleInput = activeProduct === 'car' || activeProduct === 'bike'
  const active = products.find(p => p.key === activeProduct)!

  return (
    <div className="glass-card p-6 w-full max-w-md mx-auto lg:mx-0 shadow-glass-lg">
      <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Get Instant Quote</p>

      {/* Product pills */}
      <div className="flex gap-2 flex-wrap mb-4">
        {products.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveProduct(key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeProduct === key
                ? 'bg-teal-500 border-teal-400 text-white'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Vehicle number (car/bike only) */}
      {showVehicleInput && (
        <div className="mb-4">
          <label className="block text-white/80 text-xs font-medium mb-1.5">
            {activeProduct === 'car' ? 'Car' : 'Bike'} Registration Number
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/40
                       text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/60
                       uppercase tracking-widest"
            placeholder="MH 04 BX 7842"
            maxLength={10}
          />
        </div>
      )}

      {activeProduct === 'health' && (
        <div className="mb-4 p-3 bg-white/10 rounded-xl text-white/80 text-xs">
          Compare health plans for self, family & parents. 10,000+ cashless hospitals.
        </div>
      )}

      {activeProduct === 'term' && (
        <div className="mb-4 p-3 bg-white/10 rounded-xl text-white/80 text-xs">
          Get up to ₹10 Crore life cover at just ₹689/month. 98%+ claim settlement ratio.
        </div>
      )}

      <button
        onClick={() => nav(active.route)}
        className="w-full btn-primary py-3.5 text-base"
      >
        View Plans <ArrowRight size={18} />
      </button>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/15">
        {[['2M+', 'Users'], ['98%', 'Claims Paid'], ['60s', 'To Buy']].map(([val, lbl]) => (
          <div key={lbl} className="flex-1 text-center">
            <p className="text-white font-bold text-base">{val}</p>
            <p className="text-white/50 text-xs">{lbl}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Product cards ────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    icon: '🚗',
    title: 'Car Insurance',
    desc: 'Comprehensive & third-party plans for cars. IDV calculator, add-ons, instant policy.',
    href: '/motor/quote',
    color: 'from-blue-500 to-navy-700',
    startingAt: 2899,
    badge: 'Most Popular',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: '🏍️',
    title: 'Bike Insurance',
    desc: 'Best plans for two-wheelers. Honda, Royal Enfield, Bajaj and all major brands covered.',
    href: '/bike/quote',
    color: 'from-orange-500 to-red-600',
    startingAt: 714,
    badge: 'From ₹714/yr',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  {
    icon: '🏥',
    title: 'Health Insurance',
    desc: 'Individual & family floater plans. 10,000+ cashless hospitals. Tax benefit u/s 80D.',
    href: '/health/quote',
    color: 'from-teal-500 to-teal-700',
    startingAt: 6499,
    badge: 'Tax Benefit u/s 80D',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
  {
    icon: '💎',
    title: 'Term Insurance',
    desc: 'Protect your family with high life cover at low premiums. Up to ₹10 Crore cover.',
    href: '/term/quote',
    color: 'from-purple-500 to-purple-800',
    startingAt: 689,
    badge: '₹1 Cr cover',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
]

/* ── Steps (how it works) ─────────────────────────────────────────────── */
const STEPS = [
  { icon: FileSearch, title: 'Compare Plans', desc: 'Enter your details and instantly compare 20+ insurers side by side. Filter by price, coverage, or claim ratio.' },
  { icon: Zap, title: 'Buy in 60 Seconds', desc: 'Select your plan, fill a short form, pay securely. Your policy PDF arrives in your inbox instantly.' },
  { icon: ShieldCheck, title: 'Claim with Ease', desc: 'File claims online with photo upload. Track every step in real time. Settle directly with the workshop.' },
]

/* ── Trust logos ──────────────────────────────────────────────────────── */
const INSURERS = ['HDFC ERGO', 'Tata AIG', 'ICICI Lombard', 'Bajaj Allianz', 'ACKO', 'Go Digit', 'Niva Bupa', 'Star Health']

/* ── Main component ───────────────────────────────────────────────────── */
export default function Home() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-hero min-h-screen flex items-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left copy */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-teal-300 text-xs font-semibold">Trusted by 2 Million+ Indians</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] mb-6">
              Insurance that{' '}
              <span className="text-gradient">actually</span>{' '}
              works for you.
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
              Compare 20+ top insurers in seconds. Buy the right plan at the best price. Claim without the headache — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button onClick={() => nav('/motor/quote')} className="btn-primary text-base px-8 py-4">
                Get Free Quote <ArrowRight size={18} />
              </button>
              <button onClick={() => nav('/dashboard')} className="btn-outline border-white/30 text-white hover:bg-white/10 text-base px-8 py-4">
                View My Policies
              </button>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-3">
              {[
                '✓ No spam calls',
                '✓ IRDAI registered',
                '✓ Paperless policy',
                '✓ 24x7 support',
              ].map(t => (
                <span key={t} className="text-white/60 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right widget */}
          <div className="flex justify-center lg:justify-end animate-fade-in">
            <HeroQuoteWidget />
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
      </section>

      {/* ── INSURER LOGOS ─────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-400 text-sm font-medium mb-6 uppercase tracking-widest">20+ Trusted Insurance Partners</p>
          <div className="flex flex-wrap justify-center gap-8">
            {INSURERS.map(name => (
              <div key={name} className="flex items-center justify-center h-10 px-4 rounded-lg bg-slate-50 text-slate-500 font-semibold text-sm border border-slate-100 hover:border-teal-200 hover:text-teal-600 transition-colors cursor-default">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CARDS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-teal-500 font-semibold text-sm uppercase tracking-widest mb-2">What we offer</p>
            <h2 className="section-heading mb-4">One platform. All your protection.</h2>
            <p className="section-sub max-w-xl mx-auto">
              From your car to your health to your family's future — compare the best plans from India's top insurers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRODUCTS.map(p => (
              <div
                key={p.title}
                onClick={() => nav(p.href)}
                className="card p-6 cursor-pointer group hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(15,32,68,0.14)] transition-all duration-300"
              >
                {/* Icon with gradient bg */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {p.icon}
                </div>

                <div className={`badge ${p.badgeColor} mb-3`}>{p.badge}</div>

                <h3 className="font-display font-bold text-navy-900 text-lg mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{p.desc}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-slate-400">Starting at</p>
                    <p className="font-bold text-navy-900">{formatCurrency(p.startingAt)}<span className="text-slate-400 font-normal text-xs">/yr</span></p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center transition-colors border border-slate-100">
                    <ChevronRight size={15} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────────── */}
      <section className="bg-navy-900 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '2M+', lbl: 'Policies Sold' },
            { num: '20+', lbl: 'Insurer Partners' },
            { num: '98%', lbl: 'Claim Settlement' },
            { num: '₹500Cr+', lbl: 'Claims Settled' },
          ].map(({ num, lbl }) => (
            <div key={lbl}>
              <p className="text-3xl md:text-4xl font-display font-bold text-teal-400 mb-1">{num}</p>
              <p className="text-slate-400 text-sm">{lbl}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-teal-500 font-semibold text-sm uppercase tracking-widest mb-2">How InsureFlow works</p>
            <h2 className="section-heading mb-4">From quote to cover in 3 steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-0.5 bg-gradient-to-r from-teal-500/0 via-teal-500 to-teal-500/0" />

            {STEPS.map((s, i) => (
              <div key={s.title} className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-teal-gradient flex items-center justify-center mb-5 shadow-[0_8px_24px_rgba(0,180,216,0.3)] relative z-10">
                  <s.icon size={32} className="text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-navy-900 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white">{i + 1}</span>
                </div>
                <h3 className="font-display font-bold text-navy-900 text-xl mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={() => nav('/motor/quote')} className="btn-teal px-8 py-4 text-base">
              Start with Motor Insurance <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY INSUREFLOW ────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Feature list */}
          <div>
            <p className="text-teal-500 font-semibold text-sm uppercase tracking-widest mb-2">Why choose us</p>
            <h2 className="section-heading mb-6">Built for smart insurance buyers.</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-10">
              We're not just a comparison tool. We guide you through every step — from picking the right plan to settling your claim.
            </p>

            <div className="space-y-5">
              {[
                { icon: TrendingDown, title: 'Save up to 40% on premiums', desc: 'Our algorithm finds the cheapest equivalent plan across all 20+ insurers. We show you hidden costs up front.' },
                { icon: Clock, title: 'Policy in under 60 seconds', desc: 'No physical docs. No agent visits. Fill a 4-step form, pay online, and get your PDF policy instantly.' },
                { icon: HeartHandshake, title: 'Claims we actually resolve', desc: 'Our dedicated claims team tracks your case from submission to settlement. We escalate if the insurer delays.' },
                { icon: ShieldCheck, title: 'IRDAI regulated & 100% secure', desc: 'Registered insurance broker. Your data is encrypted, never sold to third parties.' },
              ].map(f => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon size={18} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 mb-0.5">{f.title}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: savings card */}
          <div className="flex justify-center lg:justify-end">
            <div className="card p-8 max-w-sm w-full">
              <p className="font-semibold text-slate-500 text-sm mb-6">How much could you save?</p>
              {[
                { insurer: 'InsureFlow', amount: 11450, highlight: true },
                { insurer: 'Direct from insurer', amount: 13800, highlight: false },
                { insurer: 'Via agent/dealer', amount: 15200, highlight: false },
              ].map(r => (
                <div key={r.insurer} className={`flex items-center justify-between p-4 rounded-xl mb-3 ${r.highlight ? 'bg-teal-50 border-2 border-teal-500' : 'bg-slate-50 border border-slate-100'}`}>
                  <div>
                    <p className={`font-semibold text-sm ${r.highlight ? 'text-teal-700' : 'text-slate-600'}`}>{r.insurer}</p>
                    {r.highlight && <p className="text-teal-500 text-xs">✓ Best price guaranteed</p>}
                  </div>
                  <p className={`font-bold text-lg ${r.highlight ? 'text-teal-700' : 'text-slate-400 line-through'}`}>
                    {formatCurrency(r.amount)}
                  </p>
                </div>
              ))}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-amber-700 font-bold text-lg">{formatCurrency(15200 - 11450)} saved</p>
                <p className="text-amber-600 text-xs">vs. buying through an agent</p>
              </div>
              <button onClick={() => nav('/motor/quote')} className="btn-primary w-full mt-5">
                See My Savings <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-navy-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-2">Real stories</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              2 million+ customers can't be wrong
            </h2>
            <div className="flex items-center justify-center gap-2">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} className="text-amber-400 fill-amber-400" />)}
              <span className="text-white/60 text-sm ml-1">4.8/5 from 48,000+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  {[1,2,3,4,5].slice(0, t.rating).map(i => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-gradient flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.city} · {t.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHECKLIST CTA ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-heading mb-4">Ready to get covered?</h2>
          <p className="section-sub mb-8">Takes less than 2 minutes. No agents, no spam calls.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['Free comparison', 'Instant policy', 'Zero paperwork', '24x7 support', 'IRDAI regulated'].map(f => (
              <div key={f} className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle2 size={15} className="text-teal-500" /> {f}
              </div>
            ))}
          </div>
          <button onClick={() => nav('/motor/quote')} className="btn-primary text-base px-10 py-4">
            Get My Free Quote Now <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}
