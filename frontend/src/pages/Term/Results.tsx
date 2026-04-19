import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import type { RootState } from '../../store'
import { selectTermPlan } from '../../store/termSlice'
import type { TermPlan } from '../../store/termSlice'
import { formatCurrency } from '../../utils/format'

// ── Plan Card ──────────────────────────────────────────────────────────────
function PlanCard({ plan, selected, onSelect, onBuy }: {
  plan: TermPlan; selected: boolean; onSelect: () => void; onBuy: () => void
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
          <p className="text-xs text-slate-500">Life Cover: <span className="font-bold text-navy-900">{formatCurrency(plan.coverAmount)}</span></p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-navy-900">{formatCurrency(plan.monthlyPremium)}<span className="text-sm text-slate-400 font-normal">/mo</span></p>
          <p className="text-xs text-slate-400">{formatCurrency(plan.annualPremium)}/yr</p>
        </div>
      </div>

      {/* CSR + features */}
      <div className="flex items-center gap-4 mt-4 p-3 bg-slate-50 rounded-xl text-sm">
        <div className="text-center">
          <p className="text-xs text-slate-500">Claim Settlement</p>
          <p className="font-bold text-navy-900">{plan.claimSettlementRatio}%</p>
        </div>
        <div className="border-l border-slate-200 pl-4 flex-1">
          <div className="flex flex-wrap gap-1.5">
            {plan.features.map(f => (
              <span key={f} className="text-xs text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Coverages */}
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 mt-3 hover:text-teal-700">
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? 'Hide' : 'View'} included benefits
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
export default function TermResults() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { plans, coverAmount, tenure, dob, gender, selectedPlanId } = useSelector((s: RootState) => s.term)

  const [sortBy, setSortBy] = useState<'premium' | 'csr'>('premium')
  const [maxPremium, setMaxPremium] = useState(2000)
  const [showFilters, setShowFilters] = useState(false)

  const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null

  // Scale premiums to selected cover amount
  const coverRatio = coverAmount / 10000000
  const sorted = [...plans]
    .map(p => ({
      ...p,
      monthlyPremium: Math.round(p.monthlyPremium * coverRatio),
      annualPremium: Math.round(p.annualPremium * coverRatio),
    }))
    .filter(p => p.monthlyPremium <= maxPremium)
    .sort((a, b) => sortBy === 'premium' ? a.monthlyPremium - b.monthlyPremium : b.claimSettlementRatio - a.claimSettlementRatio)

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No plans loaded. Please start a quote first.</p>
          <button onClick={() => navigate('/term/quote')} className="btn-primary">Get Term Quote</button>
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
            <h1 className="font-display font-bold text-navy-900 text-lg">Term Life Insurance Plans</h1>
            <p className="text-xs text-slate-500">
              Cover: {formatCurrency(coverAmount)} · Tenure: {tenure} years · {age ? `Age ${age}` : ''} · {gender}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost gap-2">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <button onClick={() => navigate('/term/quote')} className="btn-ghost text-xs">Edit Details</button>
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
                {([['premium', 'Lowest Premium'], ['csr', 'Claim Settlement']] as const).map(([val, label]) => (
                  <label key={val} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${sortBy === val ? 'bg-navy-50 text-navy-900' : 'hover:bg-slate-50'}`}>
                    <input type="radio" className="accent-navy-900" checked={sortBy === val} onChange={() => setSortBy(val)} />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Max Monthly Premium</p>
                <span className="font-bold text-navy-900 text-sm">₹{maxPremium.toLocaleString()}</span>
              </div>
              <input type="range" min={300} max={5000} step={100} value={maxPremium} onChange={e => setMaxPremium(Number(e.target.value))} className="w-full accent-teal-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>₹300</span><span>₹5,000</span></div>
            </div>

            <div className="card p-5 bg-purple-50 border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-2">Tax Benefit u/s 80C</p>
              <p className="text-xs text-purple-600 leading-relaxed">Term insurance premiums qualify for deduction up to ₹1.5 Lakh per year under Section 80C.</p>
            </div>
          </aside>

          {/* Plans */}
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-4">{sorted.length} plan{sorted.length !== 1 ? 's' : ''} found</p>
            {sorted.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="font-bold text-navy-900 mb-1">No plans in this range</p>
                <p className="text-sm text-slate-500">Try increasing the max premium filter</p>
              </div>
            ) : (
              <div className="space-y-5">
                {sorted.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlanId === plan.id}
                    onSelect={() => dispatch(selectTermPlan(plan.id))}
                    onBuy={() => { dispatch(selectTermPlan(plan.id)); navigate('/term/proposal') }}
                  />
                ))}
              </div>
            )}

            <p className="text-[11px] text-slate-400 text-center mt-8 leading-relaxed">
              Premiums are indicative based on age and health status. Final premium determined after medical underwriting. All amounts incl. 18% GST.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
