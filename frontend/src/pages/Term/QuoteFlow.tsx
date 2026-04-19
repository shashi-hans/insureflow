import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronRight, ChevronLeft, Shield, CheckCircle2, Loader2 } from 'lucide-react'
import type { RootState } from '../../store'
import {
  nextTermStep, prevTermStep,
  setTermPersonal, setTermCoverage, setTermOwner,
  setTermPlans, setTermLoading,
} from '../../store/termSlice'
import type { TermPlan } from '../../store/termSlice'

// ── Mock term plans ────────────────────────────────────────────────────────
const MOCK_TERM_PLANS: TermPlan[] = [
  {
    id: 't1', insurerName: 'LIC of India', insurerSlug: 'lic',
    monthlyPremium: 899, annualPremium: 10188, coverAmount: 10000000,
    claimSettlementRatio: 98.6, recommended: true, tags: ['Highest CSR', 'Most Trusted'],
    features: ['Terminal illness benefit', 'Accidental death benefit', 'Tax benefit u/s 80C'],
    coverages: { 'Death Benefit': true, 'Terminal Illness': true, 'Accidental Death Rider': true, 'Waiver of Premium': false, 'Disability Rider': false, 'Critical Illness Rider': false },
  },
  {
    id: 't2', insurerName: 'HDFC Life', insurerSlug: 'hdfc-life',
    monthlyPremium: 749, annualPremium: 8988, coverAmount: 10000000,
    claimSettlementRatio: 99.1, recommended: false, tags: ['Lowest Premium', 'Quick Claim'],
    features: ['Life stage protection', 'Online discount 5%', 'Flexible payout options'],
    coverages: { 'Death Benefit': true, 'Terminal Illness': true, 'Accidental Death Rider': true, 'Waiver of Premium': true, 'Disability Rider': true, 'Critical Illness Rider': false },
  },
  {
    id: 't3', insurerName: 'Max Life', insurerSlug: 'max-life',
    monthlyPremium: 812, annualPremium: 9744, coverAmount: 10000000,
    claimSettlementRatio: 99.5, recommended: false, tags: ['Highest CSR 2025'],
    features: ['Smart total elite protection', 'Joint life option', 'Increasing cover option'],
    coverages: { 'Death Benefit': true, 'Terminal Illness': true, 'Accidental Death Rider': true, 'Waiver of Premium': true, 'Disability Rider': true, 'Critical Illness Rider': true },
  },
  {
    id: 't4', insurerName: 'ICICI Prudential', insurerSlug: 'icici-pru',
    monthlyPremium: 689, annualPremium: 8268, coverAmount: 10000000,
    claimSettlementRatio: 97.9, recommended: false, tags: ['Cheapest', 'Digital-First'],
    features: ['iProtect Smart plan', 'Whole life option', 'Return of premium add-on'],
    coverages: { 'Death Benefit': true, 'Terminal Illness': true, 'Accidental Death Rider': false, 'Waiver of Premium': false, 'Disability Rider': false, 'Critical Illness Rider': false },
  },
]

// ── Step 1: Personal info ──────────────────────────────────────────────────
function Step1({ onNext }: { onNext: () => void }) {
  const dispatch = useDispatch()
  const state = useSelector((s: RootState) => s.term)

  const [dob, setDob] = useState(state.dob)
  const [gender, setGender] = useState(state.gender)
  const [smoker, setSmoker] = useState(state.smoker)
  const [income, setIncome] = useState(state.annualIncome)
  const [error, setError] = useState('')

  const incomeOptions = [
    { value: 500000, label: '₹5L – ₹10L' },
    { value: 1000000, label: '₹10L – ₹25L' },
    { value: 2500000, label: '₹25L – ₹50L' },
    { value: 5000000, label: '₹50L – ₹1Cr' },
    { value: 10000000, label: '₹1Cr+' },
  ]

  function handleNext() {
    if (!dob) { setError('Please enter your date of birth'); return }
    const age = new Date().getFullYear() - new Date(dob).getFullYear()
    if (age < 18 || age > 65) { setError('Age must be between 18 and 65 years'); return }
    setError('')
    dispatch(setTermPersonal({ dob, gender, smoker, annualIncome: income }))
    onNext()
  }

  const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      {/* DOB */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Date of Birth *</label>
        <input type="date" className="cf-input max-w-xs" value={dob} onChange={e => { setDob(e.target.value); setError('') }} max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} />
        {age && <p className="text-teal-600 text-xs mt-1 font-medium">Age: {age} years</p>}
        {error && <p className="text-coral-500 text-xs mt-1">{error}</p>}
      </div>

      {/* Gender */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Gender</p>
        <div className="flex gap-3">
          {(['male', 'female'] as const).map(g => (
            <button key={g} onClick={() => setGender(g)}
              className={`flex-1 max-w-[160px] py-3 rounded-xl border-2 text-sm font-semibold transition-all ${gender === g ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {g === 'male' ? '♂ Male' : '♀ Female'}
            </button>
          ))}
        </div>
      </div>

      {/* Smoker */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <p className="text-sm font-semibold text-navy-900">Do you smoke or consume tobacco?</p>
          <p className="text-xs text-slate-500 mt-0.5">Smokers have higher premiums. Be honest to avoid claim rejection.</p>
        </div>
        <div className="pill-toggle">
          <button className={!smoker ? 'active' : ''} onClick={() => setSmoker(false)}>No</button>
          <button className={smoker ? 'active' : ''} onClick={() => setSmoker(true)}>Yes</button>
        </div>
      </div>

      {/* Annual income */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Annual Income</p>
        <div className="flex flex-wrap gap-2">
          {incomeOptions.map(opt => (
            <button key={opt.value} onClick={() => setIncome(opt.value)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${income === opt.value ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-navy-900 hover:border-teal-300'}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1.5">Recommended cover: 15–20× your annual income</p>
      </div>

      <button className="btn-primary w-full mt-2" onClick={handleNext}>Continue <ChevronRight size={16} /></button>
    </div>
  )
}

// ── Step 2: Coverage details ───────────────────────────────────────────────
function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const dispatch = useDispatch()
  const state = useSelector((s: RootState) => s.term)

  const [cover, setCover] = useState(state.coverAmount)
  const [tenure, setTenure] = useState(state.tenure)
  const [payTerm, setPayTerm] = useState(state.paymentTerm)

  const coverOptions = [
    { value: 2500000,  label: '₹25 Lakh' },
    { value: 5000000,  label: '₹50 Lakh' },
    { value: 10000000, label: '₹1 Crore', popular: true },
    { value: 20000000, label: '₹2 Crore' },
    { value: 50000000, label: '₹5 Crore' },
  ]

  const tenureOptions = [10, 15, 20, 25, 30, 40]

  function handleNext() {
    dispatch(setTermCoverage({ coverAmount: cover, tenure, paymentTerm: payTerm }))
    onNext()
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Cover amount */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Life Cover Amount</p>
        <div className="flex flex-wrap gap-2">
          {coverOptions.map(opt => (
            <button key={opt.value} onClick={() => setCover(opt.value)}
              className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all relative ${cover === opt.value ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-navy-900 hover:border-teal-300'}`}>
              {opt.label}
              {opt.popular && <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Popular</span>}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Your family receives this amount as a lump sum upon your death</p>
      </div>

      {/* Tenure */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Policy Tenure (years)</p>
        <div className="flex flex-wrap gap-2">
          {tenureOptions.map(t => (
            <button key={t} onClick={() => setTenure(t)}
              className={`w-14 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${tenure === t ? 'border-navy-900 bg-navy-900 text-white' : 'border-slate-200 bg-white text-navy-900 hover:border-navy-300'}`}>
              {t}yr
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1.5">Longer tenure = more coverage years at the same rate</p>
      </div>

      {/* Payment term */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Premium Payment Term</p>
        <div className="space-y-2">
          {([
            { val: 'regular', title: 'Regular Pay', desc: 'Pay premiums throughout the policy term' },
            { val: 'limited', title: 'Limited Pay (10yr)', desc: 'Pay for 10 years, covered for full tenure' },
            { val: 'single',  title: 'Single Pay',  desc: 'Pay once, covered for the entire tenure' },
          ] as const).map(opt => (
            <label key={opt.val} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payTerm === opt.val ? 'border-navy-900 bg-navy-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <input type="radio" className="mt-1 accent-navy-900" checked={payTerm === opt.val} onChange={() => setPayTerm(opt.val)} />
              <div>
                <p className="font-semibold text-navy-900 text-sm">{opt.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn-ghost" onClick={onBack}><ChevronLeft size={16} /> Back</button>
        <button className="btn-primary flex-1" onClick={handleNext}>See Plans <ChevronRight size={16} /></button>
      </div>
    </div>
  )
}

// ── Step 3: Contact ────────────────────────────────────────────────────────
function Step3({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const dispatch = useDispatch()
  const loading = useSelector((s: RootState) => s.term.loading)
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
    dispatch(setTermOwner({ name, phone, email }))
    dispatch(setTermLoading(true))
    setTimeout(() => {
      dispatch(setTermPlans(MOCK_TERM_PLANS))
      dispatch(setTermLoading(false))
      onSubmit()
    }, 1200)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Shield size={24} className="text-teal-500" />
        </div>
        <p className="text-sm text-slate-500">Your personalised term plans are ready — just enter your details.</p>
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
const STEPS = ['Personal Info', 'Coverage', 'Your Info']

export default function TermQuoteFlow() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const step = useSelector((s: RootState) => s.term.step)

  const goNext = () => dispatch(nextTermStep())
  const goBack = () => dispatch(prevTermStep())
  const goToResults = () => navigate('/term/results')

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
            {step === 1 && 'Tell us about yourself'}
            {step === 2 && 'Choose your coverage'}
            {step === 3 && 'Almost done!'}
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            {step === 1 && 'We use this to calculate the most accurate premium for you'}
            {step === 2 && 'Select life cover amount, policy tenure & payment option'}
            {step === 3 && 'Enter your details to see personalised term plans'}
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          {step === 1 && <Step1 onNext={goNext} />}
          {step === 2 && <Step2 onNext={goNext} onBack={goBack} />}
          {step === 3 && <Step3 onBack={goBack} onSubmit={goToResults} />}
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><Shield size={13} className="text-teal-500" /> IRDAI Regulated</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-teal-500" /> Tax Benefit u/s 80C</span>
          <span className="flex items-center gap-1.5"><Shield size={13} className="text-teal-500" /> 98%+ CSR</span>
        </div>
      </div>
    </div>
  )
}
