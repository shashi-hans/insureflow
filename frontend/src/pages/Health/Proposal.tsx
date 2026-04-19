import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, Heart } from 'lucide-react'
import type { RootState } from '../../store'
import { formatCurrency } from '../../utils/format'

const STEP_LABELS = ['Member Details', 'Medical Info', 'Nominee', 'Review & Pay']

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

interface MemberDetail { name: string; dob: string; relation: string; gender: string }

export default function HealthProposal() {
  const navigate = useNavigate()
  const { members, owner, selectedPlanId, plans, sumInsured } = useSelector((s: RootState) => s.health)
  const [step, setStep] = useState(1)
  const [paying, setPaying] = useState(false)

  const selectedPlan = plans.find(p => p.id === selectedPlanId) ?? plans[0]

  // Step 1: member details
  const memberRoles: string[] = ['Self']
  if (members.spouse) memberRoles.push('Spouse')
  for (let i = 0; i < members.kids; i++) memberRoles.push(`Child ${i + 1}`)
  if (members.father) memberRoles.push('Father')
  if (members.mother) memberRoles.push('Mother')

  const [memberDetails, setMemberDetails] = useState<MemberDetail[]>(
    memberRoles.map(r => ({ name: r === 'Self' ? owner.name : '', dob: '', relation: r, gender: 'male' }))
  )

  // Step 2: medical
  const [hasMedical, setHasMedical] = useState(false)
  const [medicalDesc, setMedicalDesc] = useState('')

  // Step 3: nominee
  const [nomineeName, setNomineeName] = useState('')
  const [nomineeRel, setNomineeRel] = useState('')
  const [nomineeDob, setNomineeDob] = useState('')

  function updateMember(i: number, field: keyof MemberDetail, val: string) {
    setMemberDetails(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m))
  }

  function handlePay() {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      navigate('/health/success')
    }, 2000)
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No plan selected.</p>
          <button onClick={() => navigate('/health/results')} className="btn-primary">View Plans</button>
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
          {/* Step 1: Member details */}
          {step === 1 && (
            <div className="space-y-6">
              {memberDetails.map((m, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-3">{m.relation}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Full Name *</label>
                      <input className="cf-input" placeholder="As per Aadhaar" value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Date of Birth *</label>
                      <input type="date" className="cf-input" value={m.dob} onChange={e => updateMember(i, 'dob', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Gender</label>
                      <div className="flex gap-2">
                        {['male', 'female'].map(g => (
                          <button key={g} onClick={() => updateMember(i, 'gender', g)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all capitalize ${m.gender === g ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                            {g === 'male' ? '♂ Male' : '♀ Female'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn-primary w-full" onClick={() => setStep(2)}>
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2: Medical */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-navy-900 text-sm">Any hospitalisations in the last 3 years?</p>
                  <p className="text-xs text-slate-500 mt-0.5">Surgeries, chronic illness treatments, etc.</p>
                </div>
                <div className="pill-toggle">
                  <button className={!hasMedical ? 'active' : ''} onClick={() => setHasMedical(false)}>No</button>
                  <button className={hasMedical ? 'active' : ''} onClick={() => setHasMedical(true)}>Yes</button>
                </div>
              </div>
              {hasMedical && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Brief description</label>
                  <textarea className="cf-input min-h-[80px]" placeholder="E.g. Appendix surgery in 2023..." value={medicalDesc} onChange={e => setMedicalDesc(e.target.value)} />
                </div>
              )}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                Non-disclosure of medical history may lead to claim rejection. Please be honest.
              </div>
              <div className="flex gap-3">
                <button className="btn-ghost" onClick={() => setStep(1)}><ChevronLeft size={16} /> Back</button>
                <button className="btn-primary flex-1" onClick={() => setStep(3)}>Continue <ChevronRight size={16} /></button>
              </div>
            </div>
          )}

          {/* Step 3: Nominee */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nominee Name *</label>
                <input className="cf-input" placeholder="Nominee full name" value={nomineeName} onChange={e => setNomineeName(e.target.value)} />
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
                  <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                    <Heart size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold">{selectedPlan.insurerName}</p>
                    <p className="text-white/60 text-xs">Health Insurance — Family Floater</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-white/50 text-xs">Sum Insured</p><p className="font-bold text-sm">{formatCurrency(sumInsured)}</p></div>
                  <div className="border-x border-white/20"><p className="text-white/50 text-xs">Members</p><p className="font-bold text-sm">{memberDetails.length}</p></div>
                  <div><p className="text-white/50 text-xs">Hospitals</p><p className="font-bold text-sm">{(selectedPlan.cashlessHospitals / 1000).toFixed(0)}K+</p></div>
                </div>
              </div>

              {/* Premium */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Base Premium</span><span className="font-medium">{formatCurrency(Math.round(selectedPlan.premium * 0.847))}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">GST (18%)</span><span className="font-medium">{formatCurrency(Math.round(selectedPlan.premium * 0.153))}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
                  <span>Total Premium</span><span className="text-teal-600">{formatCurrency(selectedPlan.premium)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="btn-ghost" onClick={() => setStep(3)}><ChevronLeft size={16} /> Back</button>
                <button className="btn-primary flex-1 py-4" onClick={handlePay} disabled={paying}>
                  {paying ? <><Loader2 size={16} className="animate-spin" /> Processing Payment...</> : <>Pay {formatCurrency(selectedPlan.premium)} Securely →</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
