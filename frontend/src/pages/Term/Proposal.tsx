import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, Shield } from 'lucide-react'
import type { RootState } from '../../store'
import { formatCurrency } from '../../utils/format'

const STEP_LABELS = ['Personal Details', 'KYC & Employment', 'Nominee', 'Review & Pay']

function StepBar({ step }: { step: number }) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {STEP_LABELS.map((label, i) => {
            const num = i + 1
            const state = num < step ? 'done' : num === step ? 'active' : 'idle'
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`step-dot ${state}`}>{state === 'done' ? <CheckCircle2 size={18} /> : num}</div>
                  <span className={`text-[10px] font-semibold hidden sm:block ${state === 'active' ? 'text-navy-900' : state === 'done' ? 'text-teal-600' : 'text-slate-400'}`}>{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`h-0.5 w-12 sm:w-20 mx-2 rounded-full transition-all duration-500 ${num < step ? 'bg-teal-500' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function TermProposal() {
  const navigate = useNavigate()
  const { owner, selectedPlanId, plans, coverAmount, tenure } = useSelector((s: RootState) => s.term)
  const [step, setStep] = useState(1)
  const [paying, setPaying] = useState(false)

  const selectedPlan = plans.find(p => p.id === selectedPlanId) ?? plans[0]

  // Step 1: personal
  const [fullName, setFullName] = useState(owner.name)
  const [email, setEmail] = useState(owner.email)
  const [dob, setDob] = useState('')
  const [pan, setPan] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')

  // Step 2: KYC + employment
  const [aadhaar, setAadhaar] = useState('')
  const [occupation, setOccupation] = useState('')
  const [employer, setEmployer] = useState('')
  const [education, setEducation] = useState('')

  // Step 3: nominee
  const [nomineeName, setNomineeName] = useState('')
  const [nomineeRel, setNomineeRel] = useState('')
  const [nomineeDob, setNomineeDob] = useState('')

  function handlePay() {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      navigate('/term/success')
    }, 2000)
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No plan selected.</p>
          <button onClick={() => navigate('/term/results')} className="btn-primary">View Plans</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StepBar step={step} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Step {step} of {STEP_LABELS.length}
          </div>
          <h1 className="text-2xl font-display font-bold text-navy-900">{STEP_LABELS[step - 1]}</h1>
        </div>

        <div className="card p-6 sm:p-8">
          {/* Step 1: Personal */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name (as per PAN) *</label>
                  <input className="cf-input" placeholder="Rahul Sharma" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Date of Birth *</label>
                  <input type="date" className="cf-input" value={dob} onChange={e => setDob(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email *</label>
                  <input type="email" className="cf-input" placeholder="rahul@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">PAN Number *</label>
                  <input className="cf-input uppercase tracking-widest" placeholder="ABCDE1234F" maxLength={10} value={pan} onChange={e => setPan(e.target.value.toUpperCase())} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Pincode *</label>
                  <input className="cf-input" placeholder="400001" maxLength={6} value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, ''))} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Address *</label>
                  <input className="cf-input" placeholder="Street, Locality, City" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
              </div>
              <button className="btn-primary w-full mt-2" onClick={() => setStep(2)}>Continue <ChevronRight size={16} /></button>
            </div>
          )}

          {/* Step 2: KYC */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Aadhaar Number</label>
                <input className="cf-input tracking-widest" placeholder="XXXX XXXX XXXX" maxLength={14} value={aadhaar} onChange={e => setAadhaar(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Occupation *</label>
                <select className="cf-select" value={occupation} onChange={e => setOccupation(e.target.value)}>
                  <option value="">Select Occupation</option>
                  {['Salaried (Private)', 'Salaried (Government)', 'Self-Employed', 'Business Owner', 'Freelancer', 'Student', 'Homemaker'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {occupation && occupation.includes('Salaried') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Employer Name</label>
                  <input className="cf-input" placeholder="Company name" value={employer} onChange={e => setEmployer(e.target.value)} />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Educational Qualification *</label>
                <select className="cf-select" value={education} onChange={e => setEducation(e.target.value)}>
                  <option value="">Select Qualification</option>
                  {['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Doctorate'].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="btn-ghost" onClick={() => setStep(1)}><ChevronLeft size={16} /> Back</button>
                <button className="btn-primary flex-1" onClick={() => setStep(3)}>Continue <ChevronRight size={16} /></button>
              </div>
            </div>
          )}

          {/* Step 3: Nominee */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nominee Full Name *</label>
                <input className="cf-input" placeholder="Nominee name" value={nomineeName} onChange={e => setNomineeName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Relationship *</label>
                <select className="cf-select" value={nomineeRel} onChange={e => setNomineeRel(e.target.value)}>
                  <option value="">Select Relationship</option>
                  {['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nominee Date of Birth</label>
                <input type="date" className="cf-input max-w-xs" value={nomineeDob} onChange={e => setNomineeDob(e.target.value)} />
              </div>
              <div className="flex gap-3 mt-4">
                <button className="btn-ghost" onClick={() => setStep(2)}><ChevronLeft size={16} /> Back</button>
                <button className="btn-primary flex-1" onClick={() => setStep(4)}>Continue <ChevronRight size={16} /></button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Pay */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Plan summary */}
              <div className="p-5 rounded-xl bg-navy-900 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Shield size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold">{selectedPlan.insurerName}</p>
                    <p className="text-white/60 text-xs">Term Life Insurance</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-white/50 text-xs">Life Cover</p><p className="font-bold text-sm">{formatCurrency(coverAmount)}</p></div>
                  <div className="border-x border-white/20"><p className="text-white/50 text-xs">Tenure</p><p className="font-bold text-sm">{tenure} years</p></div>
                  <div><p className="text-white/50 text-xs">CSR</p><p className="font-bold text-sm">{selectedPlan.claimSettlementRatio}%</p></div>
                </div>
              </div>

              {/* Premium */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Annual Premium (Base)</span><span className="font-medium">{formatCurrency(Math.round(selectedPlan.annualPremium * 0.847))}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">GST (18%)</span><span className="font-medium">{formatCurrency(Math.round(selectedPlan.annualPremium * 0.153))}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
                  <span>Total Annual Premium</span><span className="text-teal-600">{formatCurrency(selectedPlan.annualPremium)}</span>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0" />
                Save up to ₹46,800 in taxes under Section 80C with this premium
              </div>

              <div className="flex gap-3">
                <button className="btn-ghost" onClick={() => setStep(3)}><ChevronLeft size={16} /> Back</button>
                <button className="btn-primary flex-1 py-4" onClick={handlePay} disabled={paying}>
                  {paying ? <><Loader2 size={16} className="animate-spin" /> Processing Payment...</> : <>Pay {formatCurrency(selectedPlan.annualPremium)} Securely →</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
