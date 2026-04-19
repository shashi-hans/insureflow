import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronRight, ChevronLeft, Car, Shield, CheckCircle2, Loader2, Search, MapPin } from 'lucide-react'
import type { RootState } from '../../store'
import {
  nextStep, prevStep, setVehicle, setConfig, setOwner,
  setPlans, setLoading,
} from '../../store/quoteSlice'
import { MOCK_PLANS, CAR_MAKES, CAR_MODELS, NCB_OPTIONS } from '../../data/mockData'
import type { CoverageType } from '../../types'

// ── Step 1: Vehicle registration ──────────────────────────────────────────
function Step1({ onNext }: { onNext: () => void }) {
  const dispatch = useDispatch()
  const [regNo, setRegNo] = useState('')
  const [policyType, setPolicyType] = useState<'renewal' | 'new'>('renewal')
  const [error, setError] = useState('')

  const formatReg = (val: string) => val.toUpperCase().replace(/[^A-Z0-9]/g, '')

  function handleNext() {
    if (policyType === 'renewal' && regNo.length < 9) {
      setError('Please enter a valid registration number (e.g. MH04BX7842)')
      return
    }
    setError('')
    dispatch(setVehicle({ registrationNumber: regNo }))
    onNext()
  }

  return (
    <div className="flex flex-col items-center">
      {/* Policy type pill */}
      <div className="pill-toggle mb-8">
        <button className={policyType === 'renewal' ? 'active' : ''} onClick={() => setPolicyType('renewal')}>
          Renew Existing Policy
        </button>
        <button className={policyType === 'new' ? 'active' : ''} onClick={() => setPolicyType('new')}>
          Buy New Policy
        </button>
      </div>

      {policyType === 'renewal' ? (
        <div className="w-full max-w-sm">
          <label className="block text-sm font-semibold text-navy-900 mb-2">
            Vehicle Registration Number
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-navy-400 font-bold text-sm border-r border-slate-200 pr-3">
              <Car size={15} />
              IND
            </div>
            <input
              className="cf-input pl-20 tracking-widest uppercase font-bold text-lg text-center"
              placeholder="MH 04 BX 7842"
              value={regNo}
              maxLength={12}
              onChange={e => setRegNo(formatReg(e.target.value))}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
            />
          </div>
          {error && <p className="text-coral-500 text-xs mt-2 font-medium">{error}</p>}
          <p className="text-slate-400 text-xs mt-2">We'll fetch your vehicle details automatically</p>
        </div>
      ) : (
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car size={28} className="text-teal-500" />
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            We'll collect your vehicle details in the next step. Click Continue to proceed.
          </p>
          <p className="text-xs text-slate-400">New policy? You'll enter make, model, and year manually.</p>
        </div>
      )}

      <button className="btn-primary mt-8 px-10" onClick={handleNext}>
        Continue <ChevronRight size={16} />
      </button>
    </div>
  )
}

// ── Step 2: Vehicle details ───────────────────────────────────────────────
function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const dispatch = useDispatch()
  const saved = useSelector((s: RootState) => s.quote.vehicle)

  const [make, setMake] = useState(saved.make || '')
  const [model, setModel] = useState(saved.model || '')
  const [variant, setVariant] = useState(saved.variant || '')
  const [year, setYear] = useState(saved.year?.toString() || '')
  const [fuelType, setFuelType] = useState(saved.fuelType || '')
  const [city, setCity] = useState(saved.city || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i)
  const models = make ? (CAR_MODELS[make] ?? []) : []
  const variants = ['E', 'S', 'V', 'VXI', 'ZXI', 'ZXI+', 'LXI', 'VXI AMT', 'AT', 'Turbo']
  const fuels = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur']

  function validate() {
    const e: Record<string, string> = {}
    if (!make) e.make = 'Required'
    if (!model) e.model = 'Required'
    if (!year) e.year = 'Required'
    if (!fuelType) e.fuelType = 'Required'
    if (!city) e.city = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (!validate()) return
    dispatch(setVehicle({ make, model, variant, year: Number(year), fuelType, city }))
    onNext()
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-4">
        {/* Make */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Car Make *</label>
          <select className="cf-select" value={make} onChange={e => { setMake(e.target.value); setModel('') }}>
            <option value="">Select Make</option>
            {CAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.make && <p className="text-coral-500 text-xs mt-1">{errors.make}</p>}
        </div>

        {/* Model */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Model *</label>
          <select className="cf-select" value={model} onChange={e => setModel(e.target.value)} disabled={!make}>
            <option value="">Select Model</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.model && <p className="text-coral-500 text-xs mt-1">{errors.model}</p>}
        </div>

        {/* Variant */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Variant</label>
          <select className="cf-select" value={variant} onChange={e => setVariant(e.target.value)}>
            <option value="">Select Variant (Optional)</option>
            {variants.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Year *</label>
          <select className="cf-select" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.year && <p className="text-coral-500 text-xs mt-1">{errors.year}</p>}
        </div>

        {/* Fuel */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Fuel Type *</label>
          <div className="flex flex-wrap gap-2">
            {fuels.map(f => (
              <button
                key={f}
                onClick={() => setFuelType(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                  fuelType === f
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-navy-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {errors.fuelType && <p className="text-coral-500 text-xs mt-1">{errors.fuelType}</p>}
        </div>

        {/* City */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Registration City *</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select className="cf-select pl-9" value={city} onChange={e => setCity(e.target.value)}>
              <option value="">Select City</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {errors.city && <p className="text-coral-500 text-xs mt-1">{errors.city}</p>}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button className="btn-ghost" onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <button className="btn-primary flex-1" onClick={handleNext}>
          View Quotes <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Coverage configuration ────────────────────────────────────────
function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const dispatch = useDispatch()
  const saved = useSelector((s: RootState) => s.quote.config)

  const [coverage, setCoverage] = useState<CoverageType>(saved.coverageType || 'comprehensive')
  const [ncb, setNcb] = useState(saved.ncbPercent ?? 0)
  const [expiry, setExpiry] = useState('')
  const [claimed, setClaimed] = useState(saved.claimedLastYear || false)

  const coverageOptions: { type: CoverageType; title: string; desc: string; from: string; rec?: boolean }[] = [
    {
      type: 'comprehensive',
      title: 'Comprehensive',
      desc: 'Own damage + third party liability + personal accident',
      from: '₹8,500/yr',
      rec: true,
    },
    {
      type: 'third_party',
      title: 'Third Party',
      desc: 'Mandatory cover for damage to others. Basic protection.',
      from: '₹2,100/yr',
    },
    {
      type: 'own_damage',
      title: 'Own Damage Only',
      desc: 'Covers your vehicle damage only (requires valid TP policy)',
      from: '₹5,200/yr',
    },
  ]

  function handleNext() {
    dispatch(setConfig({ coverageType: coverage, ncbPercent: ncb, claimedLastYear: claimed, addons: [] }))
    onNext()
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-7">
      {/* Coverage type */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Coverage Type</p>
        <div className="space-y-2.5">
          {coverageOptions.map(opt => (
            <label
              key={opt.type}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                coverage === opt.type ? 'border-navy-900 bg-navy-50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                className="mt-1 accent-navy-900"
                checked={coverage === opt.type}
                onChange={() => setCoverage(opt.type)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-navy-900 text-sm">{opt.title}</span>
                  {opt.rec && (
                    <span className="badge bg-teal-100 text-teal-700 text-[10px]">Recommended</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
              </div>
              <span className="text-teal-600 font-bold text-sm whitespace-nowrap">from {opt.from}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Previous policy expiry */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Previous Policy Expiry Date
        </label>
        <input
          type="date"
          className="cf-input max-w-xs"
          value={expiry}
          onChange={e => setExpiry(e.target.value)}
        />
        <p className="text-xs text-slate-400 mt-1">Leave blank if you don't have a previous policy</p>
      </div>

      {/* Claimed last year */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <p className="text-sm font-semibold text-navy-900">Claimed in the last year?</p>
          <p className="text-xs text-slate-500 mt-0.5">This affects your No Claim Bonus eligibility</p>
        </div>
        <div className="pill-toggle">
          <button className={!claimed ? 'active' : ''} onClick={() => setClaimed(false)}>No</button>
          <button className={claimed ? 'active' : ''} onClick={() => setClaimed(true)}>Yes</button>
        </div>
      </div>

      {/* NCB */}
      {!claimed && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">No Claim Bonus (NCB)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NCB_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setNcb(opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  ncb === opt.value
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 bg-white hover:border-teal-300'
                }`}
              >
                <div className="text-lg font-bold text-navy-900">{opt.value}%</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  {opt.value === 0 ? 'No NCB' : `${opt.value === 20 ? '1yr' : opt.value === 25 ? '2yr' : opt.value === 35 ? '3yr' : opt.value === 45 ? '4yr' : '5yr+'} claim-free`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button className="btn-ghost" onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <button className="btn-primary flex-1" onClick={handleNext}>
          See Plans <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Personal details + submit ─────────────────────────────────────
function Step4({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const dispatch = useDispatch()
  const loading = useSelector((s: RootState) => s.quote.loading)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Required'
    if (!/^[6-9]\d{9}$/.test(phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    dispatch(setOwner({ name, phone, email }))
    dispatch(setLoading(true))
    // Simulate API call — 1.2s
    setTimeout(() => {
      dispatch(setPlans(MOCK_PLANS))
      dispatch(setLoading(false))
      onSubmit()
    }, 1200)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Shield size={24} className="text-teal-500" />
        </div>
        <p className="text-sm text-slate-500">Almost there! Enter your details to see personalised quotes.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
          <input
            className="cf-input"
            placeholder="Rahul Sharma"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && <p className="text-coral-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Mobile Number *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 border-r border-slate-200 pr-3">+91</span>
            <input
              className="cf-input pl-14"
              placeholder="9876543210"
              value={phone}
              maxLength={10}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          {errors.phone && <p className="text-coral-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
          <input
            type="email"
            className="cf-input"
            placeholder="rahul@gmail.com (optional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-coral-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-4 leading-relaxed">
        By continuing you agree to our Terms of Service. We'll never spam you.
      </p>

      <div className="flex gap-3 mt-6">
        <button className="btn-ghost" onClick={onBack} disabled={loading}>
          <ChevronLeft size={16} /> Back
        </button>
        <button className="btn-primary flex-1" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Fetching Quotes...</>
          ) : (
            <>View Plans <ChevronRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Main QuoteFlow page ────────────────────────────────────────────────────
const STEPS = ['Vehicle', 'Details', 'Coverage', 'Your Info']

export default function QuoteFlow() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const step = useSelector((s: RootState) => s.quote.step)

  const goNext = () => dispatch(nextStep())
  const goBack = () => dispatch(prevStep())
  const goToResults = () => navigate('/motor/results')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top progress bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {STEPS.map((label, i) => {
              const num = i + 1
              const state = num < step ? 'done' : num === step ? 'active' : 'idle'
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`step-dot ${state}`}>
                      {state === 'done' ? <CheckCircle2 size={18} /> : num}
                    </div>
                    <span className={`text-[11px] font-semibold hidden sm:block ${
                      state === 'active' ? 'text-navy-900' : state === 'done' ? 'text-teal-600' : 'text-slate-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-16 sm:w-24 mx-2 rounded-full transition-all duration-500 ${
                      num < step ? 'bg-teal-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Step header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Step {step} of {STEPS.length}
          </div>
          <h1 className="text-2xl font-display font-bold text-navy-900">
            {step === 1 && 'Let\'s start with your vehicle'}
            {step === 2 && 'Tell us about your car'}
            {step === 3 && 'Choose your coverage'}
            {step === 4 && 'Almost done!'}
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            {step === 1 && 'Renewing or buying a new policy?'}
            {step === 2 && 'We need a few details to find the right plans'}
            {step === 3 && 'Select the coverage type and your NCB'}
            {step === 4 && 'Your quotes are ready — just enter your details'}
          </p>
        </div>

        {/* Step card */}
        <div className="card p-6 sm:p-8">
          {step === 1 && <Step1 onNext={goNext} />}
          {step === 2 && <Step2 onNext={goNext} onBack={goBack} />}
          {step === 3 && <Step3 onNext={goNext} onBack={goBack} />}
          {step === 4 && <Step4 onBack={goBack} onSubmit={goToResults} />}
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><Shield size={13} className="text-teal-500" /> IRDAI Regulated</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-teal-500" /> 2M+ Customers</span>
          <span className="flex items-center gap-1.5"><Search size={13} className="text-teal-500" /> 20+ Insurers</span>
        </div>
      </div>
    </div>
  )
}
