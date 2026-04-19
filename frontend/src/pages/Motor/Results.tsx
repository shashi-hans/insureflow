import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  SlidersHorizontal, CheckCircle2, X, ChevronDown, ChevronUp,
  Star, Shield, Wrench, Info, ArrowLeft, Zap,
} from 'lucide-react'
import type { RootState } from '../../store'
import { selectPlan, setIdv, toggleAddon } from '../../store/quoteSlice'
import { MOCK_PLANS } from '../../data/mockData'
import { formatCurrency } from '../../utils/format'
import type { InsurancePlan, CoverageType } from '../../types'

// ── IDV Slider ───────────────────────────────────────────────────────────
function IDVSlider({ idv, min, max, onChange }: { idv: number; min: number; max: number; onChange: (v: number) => void }) {
  const pct = Math.round(((idv - min) / (max - min)) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{formatCurrency(min)}</span>
        <span className="font-bold text-navy-900 text-sm">{formatCurrency(idv)}</span>
        <span>{formatCurrency(max)}</span>
      </div>
      <div className="relative h-2 bg-slate-200 rounded-full">
        <div className="absolute h-2 bg-teal-gradient rounded-full" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={5000}
          value={idv}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-teal-500 rounded-full shadow"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <p className="text-[11px] text-slate-400">Insured Declared Value — affects your premium & claim payout</p>
    </div>
  )
}

// ── Plan Card ────────────────────────────────────────────────────────────
function PlanCard({ plan, selected, onSelect, onBuy }: { plan: InsurancePlan; selected: boolean; onSelect: () => void; onBuy: () => void }) {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)
  const selectedAddons = useSelector((s: RootState) => s.quote.config.addons ?? [])

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const a = plan.addons.find(x => x.id === id)
    return sum + (a?.premium ?? 0)
  }, 0)
  const totalPremium = plan.premium + addonsTotal

  const coverageRows = Object.entries(plan.coverages)

  return (
    <div className={`plan-card transition-all duration-300 ${selected ? 'selected' : ''} ${plan.recommended ? 'recommended' : ''}`}>
      {/* Recommended badge */}
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="badge bg-teal-500 text-white shadow-md px-4 py-1">
            <Zap size={11} fill="currentColor" /> Recommended
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mt-1">
        {/* Insurer */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-navy-900">
              {plan.insurerName.slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-navy-900 text-sm leading-tight">{plan.insurerName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={10} fill="#f59e0b" className="text-amber-400" />
                <span className="text-[11px] text-slate-500">{plan.claimSettlementRatio}% CSR</span>
              </div>
            </div>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {plan.tags.map(t => (
              <span key={t} className="badge bg-slate-100 text-slate-600 text-[10px]">{t}</span>
            ))}
          </div>
        </div>

        {/* Premium */}
        <div className="text-right shrink-0">
          <p className="text-2xl font-display font-bold text-navy-900">{formatCurrency(totalPremium)}</p>
          <p className="text-xs text-slate-400">/year (incl. GST)</p>
          {addonsTotal > 0 && (
            <p className="text-[11px] text-teal-600 font-medium mt-0.5">+{formatCurrency(addonsTotal)} addons</p>
          )}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
        <div className="text-center">
          <p className="text-xs font-bold text-navy-900">{formatCurrency(plan.idv)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">IDV</p>
        </div>
        <div className="text-center border-x border-slate-100">
          <p className="text-xs font-bold text-navy-900">{plan.claimSettlementRatio}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Claim Settled</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-navy-900">{plan.cashlessGarages.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Cashless Garages</p>
        </div>
      </div>

      {/* Expand coverage */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-1 text-xs text-teal-600 font-semibold mt-4 hover:underline"
      >
        {expanded ? <><ChevronUp size={13} /> Hide coverage</> : <><ChevronDown size={13} /> View coverage</>}
      </button>

      {expanded && (
        <div className="mt-3 space-y-1.5 bg-slate-50 rounded-xl p-3">
          {coverageRows.map(([key, val]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-slate-600">{key}</span>
              {typeof val === 'boolean' ? (
                val
                  ? <CheckCircle2 size={14} className="text-teal-500" />
                  : <X size={14} className="text-slate-300" />
              ) : (
                <span className="font-semibold text-navy-900">{val}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Addons */}
      {plan.addons.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Add-ons</p>
          <div className="flex flex-wrap gap-2">
            {plan.addons.map(addon => {
              const checked = selectedAddons.includes(addon.id)
              return (
                <button
                  key={addon.id}
                  onClick={e => { e.stopPropagation(); dispatch(toggleAddon(addon.id)) }}
                  title={addon.description}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    checked
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                  }`}
                >
                  {checked ? <CheckCircle2 size={11} /> : <span className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block" />}
                  {addon.name}
                  {addon.popular && <span className="text-amber-500">★</span>}
                  <span className="text-slate-400">+{formatCurrency(addon.premium)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Select / Buy buttons */}
      <div className="flex gap-2 mt-5">
        <button
          onClick={onSelect}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
            selected
              ? 'bg-navy-900 text-white'
              : 'bg-white border-2 border-slate-200 text-navy-900 hover:border-navy-900'
          }`}
        >
          {selected ? '✓ Selected' : 'Select'}
        </button>
        <button
          onClick={onBuy}
          className="flex-1 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all"
        >
          Buy Now →
        </button>
      </div>
    </div>
  )
}

// ── Filters sidebar ───────────────────────────────────────────────────────
function FilterBar({
  coverage, setCoverage, maxPremium, setMaxPremium,
}: {
  coverage: CoverageType | 'all'
  setCoverage: (v: CoverageType | 'all') => void
  maxPremium: number
  setMaxPremium: (v: number) => void
}) {
  const coverageOpts: { value: CoverageType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Plans' },
    { value: 'comprehensive', label: 'Comprehensive' },
    { value: 'third_party', label: 'Third Party' },
    { value: 'own_damage', label: 'Own Damage' },
  ]

  return (
    <div className="card p-5 sticky top-28">
      <div className="flex items-center gap-2 mb-5">
        <SlidersHorizontal size={15} className="text-teal-500" />
        <h3 className="font-bold text-sm text-navy-900">Filters</h3>
      </div>

      <div className="space-y-5">
        {/* Coverage filter */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Coverage Type</p>
          <div className="space-y-1.5">
            {coverageOpts.map(o => (
              <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="accent-teal-500"
                  checked={coverage === o.value}
                  onChange={() => setCoverage(o.value)}
                />
                <span className="text-sm text-slate-700">{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Max premium */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Max Premium</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>₹5,000</span>
              <span className="font-bold text-navy-900">{formatCurrency(maxPremium)}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={25000}
              step={500}
              value={maxPremium}
              onChange={e => setMaxPremium(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>
        </div>

        {/* Key coverage checkboxes */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Must Include</p>
          {['Zero Depreciation', 'Engine Protection', 'Roadside Assist', 'NCB Protection'].map(feat => (
            <label key={feat} className="flex items-center gap-2 cursor-pointer mb-1.5">
              <input type="checkbox" className="accent-teal-500" />
              <span className="text-xs text-slate-700">{feat}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Results Page ─────────────────────────────────────────────────────
export default function Results() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { plans, vehicle, config, selectedPlanId } = useSelector((s: RootState) => s.quote)

  const displayPlans = plans.length > 0 ? plans : MOCK_PLANS

  const [filterCoverage, setFilterCoverage] = useState<CoverageType | 'all'>('all')
  const [maxPremium, setMaxPremium] = useState(25000)
  const [idv, setIdvLocal] = useState(650000)
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'csr'>('recommended')
  const [showFilter, setShowFilter] = useState(false)

  function handleIdvChange(v: number) {
    setIdvLocal(v)
    dispatch(setIdv(v))
  }

  const filtered = displayPlans
    .filter(p => filterCoverage === 'all' || p.coverageType === filterCoverage)
    .filter(p => p.premium <= maxPremium)
    .sort((a, b) => {
      if (sortBy === 'price') return a.premium - b.premium
      if (sortBy === 'csr') return b.claimSettlementRatio - a.claimSettlementRatio
      return (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0)
    })

  const vehicleLabel = vehicle.make
    ? `${vehicle.make} ${vehicle.model ?? ''} ${vehicle.year ?? ''}`
    : 'Your Vehicle'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Results header bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-navy-900 transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="font-bold text-navy-900 text-sm">{vehicleLabel}</p>
                <p className="text-xs text-slate-500">
                  {vehicle.registrationNumber && `${vehicle.registrationNumber} • `}
                  {config.coverageType ?? 'comprehensive'} • NCB {config.ncbPercent ?? 0}%
                </p>
              </div>
            </div>

            {/* Sort + Filter controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilter(v => !v)}
                className="btn-ghost sm:hidden"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>

              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                {([['recommended', 'Best Match'], ['price', 'Lowest Price'], ['csr', 'Claim Rating']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setSortBy(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      sortBy === val ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-7">
          {/* Sidebar — desktop */}
          <aside className="w-64 shrink-0 hidden sm:block">
            {/* IDV selector */}
            <div className="card p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={15} className="text-teal-500" />
                <h3 className="font-bold text-sm text-navy-900">Insured Declared Value</h3>
                <Info size={13} className="text-slate-400 cursor-help" title="Market value of your car used to calculate claims" />
              </div>
              <IDVSlider idv={idv} min={450000} max={850000} onChange={handleIdvChange} />
            </div>

            <FilterBar
              coverage={filterCoverage}
              setCoverage={setFilterCoverage}
              maxPremium={maxPremium}
              setMaxPremium={setMaxPremium}
            />
          </aside>

          {/* Mobile filter drawer */}
          {showFilter && (
            <div className="fixed inset-0 z-50 sm:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-navy-900">Filters</h3>
                  <button onClick={() => setShowFilter(false)}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">IDV</p>
                  <IDVSlider idv={idv} min={450000} max={850000} onChange={handleIdvChange} />
                </div>
                <FilterBar
                  coverage={filterCoverage}
                  setCoverage={setFilterCoverage}
                  maxPremium={maxPremium}
                  setMaxPremium={setMaxPremium}
                />
              </div>
            </div>
          )}

          {/* Plan cards */}
          <div className="flex-1 min-w-0">
            {/* Count bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-navy-900">{filtered.length}</span> plans found
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Wrench size={12} />
                <span>Prices inclusive of GST</span>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="font-bold text-navy-900 mb-1">No plans match your filters</p>
                <p className="text-sm text-slate-500">Try adjusting the max premium or coverage type</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filtered.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlanId === plan.id}
                    onSelect={() => dispatch(selectPlan(plan.id))}
                    onBuy={() => { dispatch(selectPlan(plan.id)); navigate('/motor/proposal') }}
                  />
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-[11px] text-slate-400 text-center mt-8 leading-relaxed">
              Premiums shown are indicative and may vary based on vehicle condition and underwriting. IRDAI Reg. No. CB-XXX/XX
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
