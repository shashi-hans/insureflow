import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronRight, ChevronLeft, Heart, Shield, CheckCircle2, Loader2, Plus, Minus, MapPin } from 'lucide-react'
import type { RootState } from '../../store'
import {
  nextHealthStep, prevHealthStep,
  setMembers, setAges, setSumInsured, setHealthCity,
  togglePreExisting, setHealthOwner,
  setHealthPlans, setHealthLoading,
} from '../../store/healthSlice'
import type { HealthPlan } from '../../store/healthSlice'

// ── Mock health plans ──────────────────────────────────────────────────────
const MOCK_HEALTH_PLANS: HealthPlan[] = [
  {
    id: 'h1', insurerName: 'Niva Bupa', insurerSlug: 'niva-bupa',
    premium: 12800, sumInsured: 500000, cashlessHospitals: 10000,
    claimSettlementRatio: 91.6, roomRentLimit: 'No limit', waitingPeriod: 24, coPay: 0,
    recommended: true, tags: ['Best Value', 'No Room Rent Limit'],
    coverages: { 'Day Care': true, 'Maternity': false, 'OPD': false, 'Dental': false, 'Pre-existing after 2yr': true, 'AYUSH': true, 'Mental Health': true },
  },
  {
    id: 'h2', insurerName: 'Star Health', insurerSlug: 'star-health',
    premium: 14200, sumInsured: 500000, cashlessHospitals: 14000,
    claimSettlementRatio: 90.2, roomRentLimit: 'Single AC', waitingPeriod: 36, coPay: 0,
    recommended: false, tags: ['Max Hospitals', 'Trusted Brand'],
    coverages: { 'Day Care': true, 'Maternity': true, 'OPD': true, 'Dental': false, 'Pre-existing after 2yr': false, 'AYUSH': true, 'Mental Health': false },
  },
  {
    id: 'h3', insurerName: 'ICICI Lombard', insurerSlug: 'icici-lombard',
    premium: 11500, sumInsured: 500000, cashlessHospitals: 8500,
    claimSettlementRatio: 88.4, roomRentLimit: '1% of SI', waitingPeriod: 24, coPay: 10,
    recommended: false, tags: ['Lowest Premium', 'Digital-First'],
    coverages: { 'Day Care': true, 'Maternity': false, 'OPD': false, 'Dental': false, 'Pre-existing after 2yr': true, 'AYUSH': false, 'Mental Health': true },
  },
  {
    id: 'h4', insurerName: 'HDFC ERGO', insurerSlug: 'hdfc-ergo',
    premium: 15900, sumInsured: 500000, cashlessHospitals: 12000,
    claimSettlementRatio: 93.8, roomRentLimit: 'No limit', waitingPeriod: 24, coPay: 0,
    recommended: false, tags: ['High CSR', 'Premium Cover'],
    coverages: { 'Day Care': true, 'Maternity': true, 'OPD': true, 'Dental': true, 'Pre-existing after 2yr': true, 'AYUSH': true, 'Mental Health': true },
  },
]

// ── Step 1: Members ────────────────────────────────────────────────────────
function Step1({ onNext }: { onNext: () => void }) {
  const dispatch = useDispatch()
  const { members, ages } = useSelector((s: RootState) => s.health)

  const [localMembers, setLocalMembers] = useState({ ...members })
  const [localAges, setLocalAges] = useState({ ...ages })

  function toggleMember(key: keyof typeof localMembers, val?: number) {
    if (typeof val === 'number') {
      setLocalMembers(m => ({ ...m, [key]: val }))
    } else {
      setLocalMembers(m => ({ ...m, [key]: !m[key] }))
    }
  }

  function handleNext() {
    dispatch(setMembers(localMembers))
    dispatch(setAges(localAges))
    onNext()
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Who would you like to insure?</p>

      {/* Self */}
      <div className="flex items-center justify-between p-4 rounded-xl border-2 border-teal-500 bg-teal-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧑</span>
          <div>
            <p className="font-semibold text-navy-900 text-sm">Self</p>
            <p className="text-xs text-slate-500">Always included</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Age</label>
          <select className="cf-select w-20 py-2 text-sm" value={localAges.self} onChange={e => setLocalAges(a => ({ ...a, self: Number(e.target.value) }))}>
            {Array.from({ length: 60 }, (_, i) => i + 18).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Spouse */}
      <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${localMembers.spouse ? 'border-navy-900 bg-navy-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
        onClick={() => toggleMember('spouse')}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">💑</span>
          <div>
            <p className="font-semibold text-navy-900 text-sm">Spouse</p>
            <p className="text-xs text-slate-500">Husband / Wife</p>
          </div>
        </div>
        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
          {localMembers.spouse && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Age</label>
              <select className="cf-select w-20 py-2 text-sm" value={localAges.spouse || 28} onChange={e => setLocalAges(a => ({ ...a, spouse: Number(e.target.value) }))}>
                {Array.from({ length: 60 }, (_, i) => i + 18).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}
          <input type="checkbox" className="w-5 h-5 accent-navy-900" checked={localMembers.spouse} onChange={() => toggleMember('spouse')} />
        </div>
      </div>

      {/* Kids */}
      <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👶</span>
          <div>
            <p className="font-semibold text-navy-900 text-sm">Children</p>
            <p className="text-xs text-slate-500">Up to 25 years</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLocalMembers(m => ({ ...m, kids: Math.max(0, m.kids - 1) }))}
            className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-navy-900 transition-colors">
            <Minus size={14} />
          </button>
          <span className="w-6 text-center font-bold text-navy-900">{localMembers.kids}</span>
          <button onClick={() => setLocalMembers(m => ({ ...m, kids: Math.min(4, m.kids + 1) }))}
            className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-navy-900 transition-colors">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Parents */}
      {(['father', 'mother'] as const).map(parent => (
        <div key={parent} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${localMembers[parent] ? 'border-navy-900 bg-navy-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
          onClick={() => toggleMember(parent)}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{parent === 'father' ? '👨' : '👩'}</span>
            <div>
              <p className="font-semibold text-navy-900 text-sm capitalize">{parent}</p>
              <p className="text-xs text-slate-500">In-laws also covered</p>
            </div>
          </div>
          <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
            {localMembers[parent] && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500">Age</label>
                <select className="cf-select w-20 py-2 text-sm" value={localAges[parent] || 55} onChange={e => setLocalAges(a => ({ ...a, [parent]: Number(e.target.value) }))}>
                  {Array.from({ length: 40 }, (_, i) => i + 40).map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
            <input type="checkbox" className="w-5 h-5 accent-navy-900" checked={localMembers[parent]} onChange={() => toggleMember(parent)} />
          </div>
        </div>
      ))}

      <button className="btn-primary w-full mt-2" onClick={handleNext}>
        Continue <ChevronRight size={16} />
      </button>
    </div>
  )
}

// ── Step 2: Coverage + City ────────────────────────────────────────────────
function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const dispatch = useDispatch()
  const { sumInsured, city, preExisting } = useSelector((s: RootState) => s.health)

  const [localSI, setLocalSI] = useState(sumInsured)
  const [localCity, setLocalCity] = useState(city)
  const [localPE, setLocalPE] = useState<string[]>([...preExisting])
  const [error, setError] = useState('')

  const siOptions = [
    { value: 300000, label: '₹3 Lakh' },
    { value: 500000, label: '₹5 Lakh', popular: true },
    { value: 1000000, label: '₹10 Lakh' },
    { value: 2500000, label: '₹25 Lakh' },
    { value: 5000000, label: '₹50 Lakh' },
  ]

  const diseases = ['Diabetes', 'Hypertension', 'Heart Disease', 'Thyroid', 'Asthma', 'Kidney Disease', 'Cancer (history)', 'Obesity']
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']

  function handleNext() {
    if (!localCity) { setError('Please select your city'); return }
    dispatch(setSumInsured(localSI))
    dispatch(setHealthCity(localCity))
    localPE.forEach(d => {
      if (!preExisting.includes(d)) dispatch(togglePreExisting(d))
    })
    preExisting.forEach(d => {
      if (!localPE.includes(d)) dispatch(togglePreExisting(d))
    })
    onNext()
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Sum Insured</p>
        <div className="flex flex-wrap gap-2">
          {siOptions.map(opt => (
            <button key={opt.value} onClick={() => setLocalSI(opt.value)}
              className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all relative ${localSI === opt.value ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-navy-900 hover:border-teal-300'}`}>
              {opt.label}
              {opt.popular && <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Popular</span>}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Recommended: ₹5–10 Lakh for a family of 4 in a metro city</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Your City *</label>
        <div className="relative">
          <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select className="cf-select pl-9" value={localCity} onChange={e => { setLocalCity(e.target.value); setError('') }}>
            <option value="">Select City</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {error && <p className="text-coral-500 text-xs mt-1">{error}</p>}
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Any pre-existing conditions? <span className="text-slate-400 font-normal normal-case">(optional)</span></p>
        <div className="flex flex-wrap gap-2">
          {diseases.map(d => (
            <button key={d} onClick={() => setLocalPE(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${localPE.includes(d) ? 'bg-coral-500 text-white border-coral-500' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
              {d}
            </button>
          ))}
        </div>
        {localPE.length > 0 && (
          <p className="text-xs text-slate-500 mt-2">Pre-existing diseases are covered after a waiting period (usually 2–4 years)</p>
        )}
      </div>

      <div className="flex gap-3">
        <button className="btn-ghost" onClick={onBack}><ChevronLeft size={16} /> Back</button>
        <button className="btn-primary flex-1" onClick={handleNext}>Continue <ChevronRight size={16} /></button>
      </div>
    </div>
  )
}

// ── Step 3: Personal details ───────────────────────────────────────────────
function Step3({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const dispatch = useDispatch()
  const loading = useSelector((s: RootState) => s.health.loading)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Required'
    if (!/^[6-9]\d{9}$/.test(phone)) e.phone = 'Enter a valid 10-digit number'
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    dispatch(setHealthOwner({ name, phone, email }))
    dispatch(setHealthLoading(true))
    setTimeout(() => {
      dispatch(setHealthPlans(MOCK_HEALTH_PLANS))
      dispatch(setHealthLoading(false))
      onSubmit()
    }, 1200)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Heart size={24} className="text-teal-500" />
        </div>
        <p className="text-sm text-slate-500">Your personalised health plans are ready — just enter your details.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
          <input className="cf-input" placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
          {errors.name && <p className="text-coral-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Mobile Number *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 border-r border-slate-200 pr-3">+91</span>
            <input className="cf-input pl-14" placeholder="9876543210" value={phone} maxLength={10} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
          </div>
          {errors.phone && <p className="text-coral-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
          <input type="email" className="cf-input" placeholder="rahul@gmail.com (optional)" value={email} onChange={e => setEmail(e.target.value)} />
          {errors.email && <p className="text-coral-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="btn-ghost" onClick={onBack} disabled={loading}><ChevronLeft size={16} /> Back</button>
        <button className="btn-primary flex-1" onClick={handleSubmit} disabled={loading}>
          {loading ? <><Loader2 size={16} className="animate-spin" /> Fetching Plans...</> : <>View Plans <ChevronRight size={16} /></>}
        </button>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
const STEPS = ['Members', 'Coverage', 'Your Info']

export default function HealthQuoteFlow() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const step = useSelector((s: RootState) => s.health.step)

  const goNext = () => dispatch(nextHealthStep())
  const goBack = () => dispatch(prevHealthStep())
  const goToResults = () => navigate('/health/results')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between max-w-xs mx-auto">
            {STEPS.map((label, i) => {
              const num = i + 1
              const state = num < step ? 'done' : num === step ? 'active' : 'idle'
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`step-dot ${state}`}>{state === 'done' ? <CheckCircle2 size={18} /> : num}</div>
                    <span className={`text-[11px] font-semibold hidden sm:block ${state === 'active' ? 'text-navy-900' : state === 'done' ? 'text-teal-600' : 'text-slate-400'}`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-24 sm:w-36 mx-2 rounded-full transition-all duration-500 ${num < step ? 'bg-teal-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Step {step} of {STEPS.length}
          </div>
          <h1 className="text-2xl font-display font-bold text-navy-900">
            {step === 1 && 'Who do you want to insure?'}
            {step === 2 && 'Choose your coverage'}
            {step === 3 && 'Almost done!'}
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            {step === 1 && 'Select all family members to cover under one policy'}
            {step === 2 && 'Pick your sum insured and share any health conditions'}
            {step === 3 && 'Enter your details to see personalised health plans'}
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          {step === 1 && <Step1 onNext={goNext} />}
          {step === 2 && <Step2 onNext={goNext} onBack={goBack} />}
          {step === 3 && <Step3 onBack={goBack} onSubmit={goToResults} />}
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><Shield size={13} className="text-teal-500" /> IRDAI Regulated</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-teal-500" /> 10,000+ Hospitals</span>
          <span className="flex items-center gap-1.5"><Heart size={13} className="text-teal-500" /> Tax Benefit u/s 80D</span>
        </div>
      </div>
    </div>
  )
}
