import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Hospital, SlidersHorizontal } from 'lucide-react'
import type { RootState } from '../../store'
import { selectHealthPlan } from '../../store/healthSlice'
import type { HealthPlan } from '../../store/healthSlice'
import { formatCurrency } from '../../utils/format'

// ── Plan Card ──────────────────────────────────────────────────────────────
function PlanCard({ plan, selected, onSelect, onBuy }: {
  plan: HealthPlan; selected: boolean; onSelect: () => void; onBuy: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`plan-card ${plan.recommended ? 'recommended' : ''} ${selected ? 'selected' : ''}`}>
      {plan.recommended && (
        <div className="absolute -top-3 left-5">
          <span className="badge bg-teal-500 text-white text-[10px] shadow-sm">Recommended</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-navy-900">{plan.insurerName}</span>
            {plan.tags.map(t => (
              <span key={t} className="badge bg-slate-100 text-slate-600 text-[10px]">{t}</span>
            ))}
          </div>
          <p className="text-xs text-slate-500">Sum Insured: <span className="font-bold text-navy-900">{formatCurrency(plan.sumInsured)}</span></p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-navy-900">{formatCurrency(plan.premium)}</p>
          <p className="text-xs text-slate-400">per year</p>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3 mt-4 p-3 bg-slate-50 rounded-xl">
        <div className="text-center">
          <p className="text-xs text-slate-500">CSR</p>
          <p className="font-bold text-navy-900 text-sm">{plan.claimSettlementRatio}%</p>
        </div>
        <div className="text-center border-x border-slate-200">
          <p className="text-xs text-slate-500">Hospitals</p>
          <p className="font-bold text-navy-900 text-sm">{(plan.cashlessHospitals / 1000).toFixed(0)}K+</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Waiting</p>
          <p className="font-bold text-navy-900 text-sm">{plan.waitingPeriod} mo</p>
        </div>
      </div>

      {/* Room rent + co-pay */}
      <div className="flex gap-4 mt-3 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <Hospital size={12} className="text-teal-500" />
          Room rent: <span className="font-semibold ml-1">{plan.roomRentLimit}</span>
        </span>
        <span>Co-pay: <span className="font-semibold">{plan.coPay === 0 ? 'None' : `${plan.coPay}%`}</span></span>
      </div>

      {/* Coverages toggle */}
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 mt-3 hover:text-teal-700">
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? 'Hide' : 'View'} coverage details
      </button>

      {expanded && (
        <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-4 p-3 bg-slate-50 rounded-xl">
          {Object.entries(plan.coverages).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              {v ? <CheckCircle2 size={13} className="text-teal-500 shrink-0" /> : <XCircle size={13} className="text-slate-300 shrink-0" />}
              <span className={`text-xs ${v ? 'text-navy-900' : 'text-slate-400'}`}>{k}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-5">
        <button onClick={onSelect}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${selected ? 'bg-navy-900 text-white' : 'bg-white border-2 border-slate-200 text-navy-900 hover:border-navy-900'}`}>
          {selected ? '✓ Selected' : 'Select'}
        </button>
        <button onClick={onBuy} className="flex-1 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all">
          Buy Now →
        </button>
      </div>
    </div>
  )
}

// ── Main Results Page ──────────────────────────────────────────────────────
export default function HealthResults() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { plans, members, ages, sumInsured, city, selectedPlanId } = useSelector((s: RootState) => s.health)

  const [sortBy, setSortBy] = useState<'premium' | 'csr' | 'hospitals'>('premium')
  const [maxPremium, setMaxPremium] = useState(30000)
  const [showFilters, setShowFilters] = useState(false)

  // Member summary
  const memberCount = (members.self ? 1 : 0) + (members.spouse ? 1 : 0) + members.kids + (members.father ? 1 : 0) + (members.mother ? 1 : 0)
  const eldestAge = Math.max(ages.self, ages.spouse || 0, ages.father || 0, ages.mother || 0)

  const sorted = [...plans]
    .filter(p => p.premium <= maxPremium)
    .sort((a, b) => {
      if (sortBy === 'premium') return a.premium - b.premium
      if (sortBy === 'csr') return b.claimSettlementRatio - a.claimSettlementRatio
      return b.cashlessHospitals - a.cashlessHospitals
    })

  // Adjust premiums based on sum insured ratio (mock)
  const siRatio = sumInsured / 500000
  const adjusted = sorted.map(p => ({ ...p, premium: Math.round(p.premium * siRatio) }))

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No plans loaded. Please start a quote first.</p>
          <button onClick={() => navigate('/health/quote')} className="btn-primary">Get Health Quote</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-navy-900 text-lg">Health Insurance Plans</h1>
            <p className="text-xs text-slate-500">
              {memberCount} member{memberCount > 1 ? 's' : ''} · Sum insured {formatCurrency(sumInsured)} · {city || 'India'} · Eldest age {eldestAge}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost gap-2">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <button onClick={() => navigate('/health/quote')} className="btn-ghost text-xs">Edit Details</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden lg:block'} lg:w-72 shrink-0 space-y-6`}>
            <div className="card p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Sort By</p>
              <div className="space-y-2">
                {([['premium', 'Lowest Premium'], ['csr', 'Claim Settlement'], ['hospitals', 'Most Hospitals']] as const).map(([val, label]) => (
                  <label key={val} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${sortBy === val ? 'bg-navy-50 text-navy-900' : 'hover:bg-slate-50'}`}>
                    <input type="radio" className="accent-navy-900" checked={sortBy === val} onChange={() => setSortBy(val)} />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Max Annual Premium</p>
                <span className="font-bold text-navy-900 text-sm">{formatCurrency(maxPremium)}</span>
              </div>
              <input type="range" min={5000} max={50000} step={1000} value={maxPremium} onChange={e => setMaxPremium(Number(e.target.value))} className="w-full accent-teal-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>₹5K</span><span>₹50K</span>
              </div>
            </div>

            <div className="card p-5 bg-teal-50 border-teal-100">
              <p className="text-xs font-semibold text-teal-700 mb-2">Tax Benefit u/s 80D</p>
              <p className="text-xs text-teal-600 leading-relaxed">Save up to ₹75,000 in tax per year by buying health insurance for self, spouse, kids & parents.</p>
            </div>
          </aside>

          {/* Plans */}
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-4">{adjusted.length} plan{adjusted.length !== 1 ? 's' : ''} found</p>
            {adjusted.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="font-bold text-navy-900 mb-1">No plans in this range</p>
                <p className="text-sm text-slate-500">Try increasing the max premium filter</p>
              </div>
            ) : (
              <div className="space-y-5">
                {adjusted.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlanId === plan.id}
                    onSelect={() => dispatch(selectHealthPlan(plan.id))}
                    onBuy={() => { dispatch(selectHealthPlan(plan.id)); navigate('/health/proposal') }}
                  />
                ))}
              </div>
            )}

            <p className="text-[11px] text-slate-400 text-center mt-8 leading-relaxed">
              Premiums are indicative. Final premium may vary based on medical history. All amounts incl. 18% GST.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
