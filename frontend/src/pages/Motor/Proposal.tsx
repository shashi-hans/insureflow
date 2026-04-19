import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Car, User, Shield, MapPin, ChevronRight, ChevronLeft,
  CheckCircle2, Loader2, Phone, Mail, CreditCard, Calendar,
  FileText, AlertCircle,
} from 'lucide-react'
import type { RootState } from '../../store'
import { MOCK_PLANS } from '../../data/mockData'
import { formatCurrency } from '../../utils/format'

// ── Step indicator ────────────────────────────────────────────────────────
const STEPS = ['Vehicle', 'Owner', 'Nominee', 'Review & Pay']

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between max-w-xl mx-auto">
      {STEPS.map((label, i) => {
        const n = i + 1
        const state = n < step ? 'done' : n === step ? 'active' : 'idle'
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`step-dot ${state}`}>
                {state === 'done' ? <CheckCircle2 size={16} /> : n}
              </div>
              <span className={`text-[11px] font-semibold hidden sm:block ${
                state === 'active' ? 'text-navy-900' : state === 'done' ? 'text-teal-600' : 'text-slate-400'
              }`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-2 rounded-full mb-4 transition-all duration-500 ${
                n < step ? 'bg-teal-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Shared field component ────────────────────────────────────────────────
function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-coral-500">*</span>}
      </label>
      {children}
      {error && <p className="text-coral-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  )
}

// ── Step 1: Vehicle details ───────────────────────────────────────────────
function VehicleStep({ onNext }: { onNext: (d: Record<string, string>) => void }) {
  const saved = useSelector((s: RootState) => s.quote.vehicle)
  const [form, setForm] = useState({
    regNo: saved.registrationNumber || '',
    make: saved.make || '',
    model: saved.model || '',
    variant: saved.variant || '',
    year: saved.year?.toString() || '',
    fuelType: saved.fuelType || '',
    engineNo: '',
    chassisNo: '',
    color: '',
    city: saved.city || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  function validate() {
    const e: Record<string, string> = {}
    if (!form.regNo) e.regNo = 'Required'
    if (!form.make) e.make = 'Required'
    if (!form.model) e.model = 'Required'
    if (!form.year) e.year = 'Required'
    if (!form.engineNo) e.engineNo = 'Required'
    if (!form.chassisNo) e.chassisNo = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Registration Number" required error={errors.regNo}>
          <input className="cf-input uppercase tracking-widest font-bold" placeholder="MH04BX7842"
            value={form.regNo} onChange={f('regNo')} />
        </Field>
        <Field label="Make" required error={errors.make}>
          <input className="cf-input" placeholder="Maruti Suzuki" value={form.make} onChange={f('make')} />
        </Field>
        <Field label="Model" required error={errors.model}>
          <input className="cf-input" placeholder="Swift" value={form.model} onChange={f('model')} />
        </Field>
        <Field label="Variant">
          <input className="cf-input" placeholder="ZXI" value={form.variant} onChange={f('variant')} />
        </Field>
        <Field label="Year of Manufacture" required error={errors.year}>
          <input className="cf-input" placeholder="2022" value={form.year} onChange={f('year')} maxLength={4} />
        </Field>
        <Field label="Fuel Type">
          <select className="cf-select" value={form.fuelType} onChange={f('fuelType')}>
            <option value="">Select</option>
            {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </Field>
        <Field label="Engine Number" required error={errors.engineNo}>
          <input className="cf-input uppercase" placeholder="K12MN1234567"
            value={form.engineNo} onChange={f('engineNo')} />
        </Field>
        <Field label="Chassis Number" required error={errors.chassisNo}>
          <input className="cf-input uppercase" placeholder="MA3ERLF1S00123456"
            value={form.chassisNo} onChange={f('chassisNo')} />
        </Field>
        <Field label="Vehicle Color">
          <input className="cf-input" placeholder="Pearl White" value={form.color} onChange={f('color')} />
        </Field>
        <Field label="Registration City">
          <input className="cf-input" placeholder="Mumbai" value={form.city} onChange={f('city')} />
        </Field>
      </div>
      <button className="btn-primary w-full mt-2"
        onClick={() => { if (validate()) onNext(form) }}>
        Continue <ChevronRight size={16} />
      </button>
    </div>
  )
}

// ── Step 2: Owner details ─────────────────────────────────────────────────
function OwnerStep({ onNext, onBack }: { onNext: (d: Record<string, string>) => void; onBack: () => void }) {
  const saved = useSelector((s: RootState) => s.quote.owner)
  const [form, setForm] = useState({
    name: saved.name || '',
    phone: saved.phone || '',
    email: saved.email || '',
    dob: '',
    gender: '',
    pan: '',
    address: '',
    pincode: '',
    state: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit mobile'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter valid email'
    if (!form.dob) e.dob = 'Required'
    if (!form.address) e.address = 'Required'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name" required error={errors.name}>
          <input className="cf-input" placeholder="Rahul Sharma" value={form.name} onChange={f('name')} />
        </Field>
        <Field label="Mobile Number" required error={errors.phone}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 border-r border-slate-200 pr-3">+91</span>
            <input className="cf-input pl-14" placeholder="9876543210"
              value={form.phone} onChange={f('phone')} maxLength={10} />
          </div>
        </Field>
        <Field label="Email Address" required error={errors.email}>
          <input type="email" className="cf-input" placeholder="rahul@gmail.com"
            value={form.email} onChange={f('email')} />
        </Field>
        <Field label="Date of Birth" required error={errors.dob}>
          <input type="date" className="cf-input" value={form.dob} onChange={f('dob')} />
        </Field>
        <Field label="Gender">
          <select className="cf-select" value={form.gender} onChange={f('gender')}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="PAN Number">
          <input className="cf-input uppercase" placeholder="ABCDE1234F"
            value={form.pan} onChange={f('pan')} maxLength={10} />
        </Field>
        <div className="col-span-2">
          <Field label="Address" required error={errors.address}>
            <input className="cf-input" placeholder="House No, Street, Area"
              value={form.address} onChange={f('address')} />
          </Field>
        </div>
        <Field label="Pincode" required error={errors.pincode}>
          <input className="cf-input" placeholder="400001" value={form.pincode}
            onChange={f('pincode')} maxLength={6} />
        </Field>
        <Field label="State">
          <select className="cf-select" value={form.state} onChange={f('state')}>
            <option value="">Select State</option>
            {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat',
              'Rajasthan', 'Uttar Pradesh', 'West Bengal'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex gap-3 mt-2">
        <button className="btn-ghost" onClick={onBack}><ChevronLeft size={16} /> Back</button>
        <button className="btn-primary flex-1"
          onClick={() => { if (validate()) onNext(form) }}>
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Nominee details ───────────────────────────────────────────────
function NomineeStep({ onNext, onBack }: { onNext: (d: Record<string, string>) => void; onBack: () => void }) {
  const [form, setForm] = useState({ name: '', relation: '', dob: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.relation) e.relation = 'Required'
    if (!form.dob) e.dob = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="space-y-5">
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800">
        <p className="font-semibold mb-0.5">Why add a nominee?</p>
        <p className="text-teal-700 text-xs">In case of an unfortunate event, the claim benefit will be paid to your nominee.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Nominee Name" required error={errors.name}>
          <input className="cf-input" placeholder="Sunita Sharma" value={form.name} onChange={f('name')} />
        </Field>
        <Field label="Relationship" required error={errors.relation}>
          <select className="cf-select" value={form.relation} onChange={f('relation')}>
            <option value="">Select</option>
            {['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Date of Birth" required error={errors.dob}>
          <input type="date" className="cf-input" value={form.dob} onChange={f('dob')} />
        </Field>
        <Field label="Phone Number">
          <input className="cf-input" placeholder="9876543210" value={form.phone} onChange={f('phone')} maxLength={10} />
        </Field>
      </div>

      <div className="flex gap-3">
        <button className="btn-ghost" onClick={onBack}><ChevronLeft size={16} /> Back</button>
        <button className="btn-primary flex-1"
          onClick={() => { if (validate()) onNext(form) }}>
          Review Proposal <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Review & Pay ──────────────────────────────────────────────────
function ReviewStep({
  vehicle, owner, nominee, plan, onBack, onPay, paying,
}: {
  vehicle: Record<string, string>
  owner: Record<string, string>
  nominee: Record<string, string>
  plan: typeof MOCK_PLANS[0]
  onBack: () => void
  onPay: () => void
  paying: boolean
}) {
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-navy-900">{value || '—'}</span>
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Plan summary */}
      <div className="bg-teal-gradient rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs font-medium">Selected Plan</p>
            <p className="text-lg font-display font-bold mt-0.5">{plan.insurerName}</p>
            <p className="text-white/80 text-xs mt-1 capitalize">{plan.coverageType.replace('_', ' ')} · IDV {formatCurrency(plan.idv)}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-bold">{formatCurrency(plan.premium)}</p>
            <p className="text-white/70 text-xs">/year incl. GST</p>
          </div>
        </div>
      </div>

      {/* Review sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Car size={14} className="text-teal-500" />
            <p className="text-xs font-bold text-navy-900 uppercase tracking-wide">Vehicle</p>
          </div>
          <Row label="Reg. Number" value={vehicle.regNo} />
          <Row label="Make & Model" value={`${vehicle.make} ${vehicle.model}`} />
          <Row label="Year" value={vehicle.year} />
          <Row label="Fuel Type" value={vehicle.fuelType} />
          <Row label="Engine No." value={vehicle.engineNo} />
          <Row label="Chassis No." value={vehicle.chassisNo} />
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-teal-500" />
            <p className="text-xs font-bold text-navy-900 uppercase tracking-wide">Owner</p>
          </div>
          <Row label="Name" value={owner.name} />
          <Row label="Mobile" value={`+91 ${owner.phone}`} />
          <Row label="Email" value={owner.email} />
          <Row label="DOB" value={owner.dob} />
          <Row label="Address" value={owner.address} />
          <Row label="Pincode" value={owner.pincode} />
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-teal-500" />
            <p className="text-xs font-bold text-navy-900 uppercase tracking-wide">Nominee</p>
          </div>
          <Row label="Name" value={nominee.name} />
          <Row label="Relationship" value={nominee.relation} />
          <Row label="DOB" value={nominee.dob} />
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={14} className="text-teal-500" />
            <p className="text-xs font-bold text-navy-900 uppercase tracking-wide">Premium Breakup</p>
          </div>
          <Row label="Base Premium" value={formatCurrency(plan.breakup.basePremium)} />
          <Row label="Add-on Premium" value={formatCurrency(plan.breakup.addonPremium)} />
          <Row label="NCB Discount" value={`-${formatCurrency(plan.breakup.ncbDiscount)}`} />
          <Row label="GST (18%)" value={formatCurrency(plan.breakup.gst)} />
          <div className="flex justify-between pt-2 mt-1 border-t border-slate-200">
            <span className="text-sm font-bold text-navy-900">Total Payable</span>
            <span className="text-sm font-bold text-teal-600">{formatCurrency(plan.premium)}</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-3.5">
        <input type="checkbox" className="mt-0.5 accent-teal-500" defaultChecked />
        <p className="text-xs text-slate-600 leading-relaxed">
          I confirm all the details above are correct. I agree to the{' '}
          <a href="/terms" className="text-teal-600 underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-teal-600 underline">Privacy Policy</a>.
          I authorise InsureFlow to share my details with {plan.insurerName}.
        </p>
      </div>

      {/* Pay button */}
      <div className="flex gap-3">
        <button className="btn-ghost" onClick={onBack} disabled={paying}>
          <ChevronLeft size={16} /> Back
        </button>
        <button className="btn-primary flex-1 text-base py-4" onClick={onPay} disabled={paying}>
          {paying ? (
            <><Loader2 size={18} className="animate-spin" /> Processing Payment...</>
          ) : (
            <><CreditCard size={18} /> Pay {formatCurrency(plan.premium)}</>
          )}
        </button>
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        Secured by 256-bit SSL encryption · Powered by Razorpay
      </p>
    </div>
  )
}

// ── Main Proposal Page ────────────────────────────────────────────────────
export default function Proposal() {
  const navigate = useNavigate()
  const { selectedPlanId, plans, vehicle } = useSelector((s: RootState) => s.quote)

  const allPlans = plans.length > 0 ? plans : MOCK_PLANS
  const plan = allPlans.find(p => p.id === selectedPlanId) ?? allPlans[0]

  const [step, setStep] = useState(1)
  const [vehicleData, setVehicleData] = useState<Record<string, string>>({})
  const [ownerData, setOwnerData] = useState<Record<string, string>>({})
  const [nomineeData, setNomineeData] = useState<Record<string, string>>({})
  const [paying, setPaying] = useState(false)

  function handlePay() {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      navigate('/motor/success')
    }, 2000)
  }

  const stepTitles = [
    { title: 'Vehicle Details', sub: 'Confirm your vehicle information' },
    { title: 'Owner Details', sub: 'Your personal and contact information' },
    { title: 'Nominee Details', sub: 'Who receives benefits in your absence' },
    { title: 'Review & Pay', sub: 'Confirm everything before payment' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <StepBar step={step} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Plan badge */}
        <div className="flex items-center justify-between mb-6 p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-xs font-bold text-teal-700">
              {plan.insurerName.slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-navy-900 text-sm">{plan.insurerName}</p>
              <p className="text-xs text-slate-500 capitalize">{plan.coverageType.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-navy-900">{formatCurrency(plan.premium)}</p>
            <p className="text-[11px] text-slate-400">/year</p>
          </div>
        </div>

        {/* Step card */}
        <div className="card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-display font-bold text-navy-900">{stepTitles[step - 1].title}</h1>
            <p className="text-slate-500 text-sm mt-1">{stepTitles[step - 1].sub}</p>
          </div>

          {step === 1 && (
            <VehicleStep onNext={d => { setVehicleData(d); setStep(2) }} />
          )}
          {step === 2 && (
            <OwnerStep
              onNext={d => { setOwnerData(d); setStep(3) }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <NomineeStep
              onNext={d => { setNomineeData(d); setStep(4) }}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <ReviewStep
              vehicle={vehicleData}
              owner={ownerData}
              nominee={nomineeData}
              plan={plan}
              onBack={() => setStep(3)}
              onPay={handlePay}
              paying={paying}
            />
          )}
        </div>

        {/* Trust bar */}
        <div className="mt-5 flex items-center justify-center gap-6 text-xs text-slate-400 flex-wrap">
          <span className="flex items-center gap-1.5"><Shield size={12} className="text-teal-500" />IRDAI Regulated</span>
          <span className="flex items-center gap-1.5"><FileText size={12} className="text-teal-500" />Instant Policy Copy</span>
          <span className="flex items-center gap-1.5"><Phone size={12} className="text-teal-500" />24x7 Support</span>
          <span className="flex items-center gap-1.5"><Mail size={12} className="text-teal-500" />Policy on Email</span>
        </div>
      </div>
    </div>
  )
}
