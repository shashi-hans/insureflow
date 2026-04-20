import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  CheckCircle2, Download, Share2, ShieldCheck, Phone,
  Mail, Calendar, Copy, ArrowRight, Star, Home,
} from 'lucide-react'
import type { RootState } from '../../store'
import { MOCK_PLANS } from '../../data/mockData'
import { formatCurrency } from '../../utils/format'

const CONFETTI_DOTS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  color: ['bg-teal-400', 'bg-amber-400', 'bg-coral-500', 'bg-mint-400', 'bg-navy-400'][i % 5],
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 1}s`,
  size: Math.random() > 0.5 ? 'w-2 h-2' : 'w-3 h-3',
}))

// ── Confetti dots ─────────────────────────────────────────────────────────
function Confetti() {
  const dots = CONFETTI_DOTS

  return (
    <div className="absolute inset-x-0 top-0 h-40 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <div
          key={d.id}
          className={`absolute ${d.color} ${d.size} rounded-full opacity-70`}
          style={{
            left: d.left,
            top: '-10px',
            animation: `fall 2s ease-in ${d.delay} forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(160px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ── Policy card (downloadable view) ──────────────────────────────────────
function PolicyCard({ plan, policyNo, ownerName }: {
  plan: typeof MOCK_PLANS[0]
  policyNo: string
  ownerName: string
}) {
  return (
    <div className="bg-navy-900 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-4 border-white" />
        <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border-2 border-white" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-teal-gradient rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm">InsureFlow</p>
              <p className="text-white/50 text-[10px]">IRDAI Reg. CB-XXX/XX</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/50">Policy No.</p>
            <p className="font-mono font-bold text-xs">{policyNo}</p>
          </div>
        </div>

        {/* Insured details */}
        <div className="mb-5">
          <p className="text-white/50 text-[10px] mb-1 uppercase tracking-wide">Insured</p>
          <p className="text-xl font-display font-bold">{ownerName || 'Policyholder'}</p>
        </div>

        {/* Plan details */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-white/50 text-[10px] mb-1">Insurer</p>
            <p className="font-semibold text-sm">{plan.insurerName}</p>
          </div>
          <div>
            <p className="text-white/50 text-[10px] mb-1">Coverage</p>
            <p className="font-semibold text-sm capitalize">{plan.coverageType.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-white/50 text-[10px] mb-1">IDV</p>
            <p className="font-semibold text-sm">{formatCurrency(plan.idv)}</p>
          </div>
          <div>
            <p className="text-white/50 text-[10px] mb-1">Premium</p>
            <p className="font-semibold text-sm">{formatCurrency(plan.premium)}/yr</p>
          </div>
        </div>

        {/* Validity bar */}
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[10px]">Valid From</p>
            <p className="text-sm font-bold">09 Mar 2026</p>
          </div>
          <div className="w-20 h-0.5 bg-white/20 relative">
            <div className="absolute inset-0 bg-teal-gradient" />
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[10px]">Valid To</p>
            <p className="text-sm font-bold">08 Mar 2027</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Success Page ─────────────────────────────────────────────────────
export default function Success() {
  const { selectedPlanId, plans, owner } = useSelector((s: RootState) => s.quote)
  const [copied, setCopied] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const allPlans = plans.length > 0 ? plans : MOCK_PLANS
  const plan = allPlans.find(p => p.id === selectedPlanId) ?? allPlans[0]

  const [policyNumber] = useState(
    () => `POL-2026-${plan.insurerSlug.toUpperCase().slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  function copyPolicy() {
    navigator.clipboard.writeText(policyNumber).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextSteps = [
    {
      icon: <Mail size={16} className="text-teal-500" />,
      title: 'Check your email',
      desc: `Policy document sent to ${owner.email || 'your email'}`,
    },
    {
      icon: <Download size={16} className="text-teal-500" />,
      title: 'Download policy PDF',
      desc: 'Save a copy for your records',
    },
    {
      icon: <Phone size={16} className="text-teal-500" />,
      title: 'Save emergency number',
      desc: '1800-266-9999 for 24x7 claims support',
    },
    {
      icon: <Calendar size={16} className="text-teal-500" />,
      title: 'Set renewal reminder',
      desc: 'We will remind you 30 days before expiry',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Success hero */}
      <div className="bg-hero relative overflow-hidden py-16 px-6">
        <Confetti />
        <div className="max-w-lg mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-teal-500/20 backdrop-blur-sm border border-teal-400/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-teal-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            You're Insured!
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">
            Your {plan.insurerName} policy is active. You're now protected against accidents, theft, and third-party liability.
          </p>

          {/* Policy number */}
          <div className="mt-5 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
            <div>
              <p className="text-white/50 text-[10px]">Policy Number</p>
              <p className="font-mono font-bold text-white text-sm">{policyNumber}</p>
            </div>
            <button
              onClick={copyPolicy}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {copied
                ? <CheckCircle2 size={14} className="text-teal-400" />
                : <Copy size={14} className="text-white/70" />
              }
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* Policy card */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-navy-900">Your Policy</h2>
            <button className="btn-ghost text-xs gap-1.5">
              <Download size={13} /> Download PDF
            </button>
          </div>
          <PolicyCard plan={plan} policyNo={policyNumber} ownerName={owner.name} />
        </div>

        {/* Coverage summary */}
        <div className="card p-5">
          <h3 className="font-bold text-navy-900 text-sm mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal-500" /> What's Covered
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(plan.coverages)
              .filter(([, v]) => v === true)
              .map(([key]) => (
                <div key={key} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={13} className="text-teal-500 shrink-0" />
                  {key}
                </div>
              ))}
          </div>
        </div>

        {/* Next steps */}
        <div>
          <h2 className="font-display font-bold text-navy-900 mb-4">What's Next?</h2>
          <div className="space-y-3">
            {nextSteps.map((step, i) => (
              <div key={i} className="card p-4 flex items-start gap-4">
                <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating prompt */}
        <div className="card p-5 text-center bg-amber-50 border-amber-100">
          <p className="font-bold text-navy-900 mb-1">How was your experience?</p>
          <p className="text-xs text-slate-500 mb-3">Your feedback helps us improve for 2M+ users</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} className="w-10 h-10 rounded-xl bg-white border border-amber-200 hover:bg-amber-100 hover:border-amber-400 transition-all flex items-center justify-center">
                <Star size={18} className="text-amber-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="card p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-navy-900 text-sm">Share with family</p>
            <p className="text-xs text-slate-500 mt-0.5">Let them know you're protected</p>
          </div>
          <button
            onClick={() => setShowShare(!showShare)}
            className="btn-ghost text-xs"
          >
            <Share2 size={13} /> Share
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/dashboard" className="btn-secondary justify-center">
            <Home size={16} /> My Policies
          </Link>
          <Link to="/" className="btn-primary justify-center">
            Back to Home <ArrowRight size={16} />
          </Link>
        </div>

        {/* Support */}
        <div className="text-center space-y-1">
          <p className="text-xs text-slate-400">Need help with your policy?</p>
          <p className="text-xs text-slate-500">
            Call <a href="tel:18002669999" className="text-teal-600 font-bold">1800-266-9999</a> or email{' '}
            <a href="mailto:support@insureflow.in" className="text-teal-600 font-bold">support@insureflow.in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
