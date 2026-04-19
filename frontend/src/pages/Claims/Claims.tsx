import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, CheckCircle2, Clock, AlertTriangle, Upload,
  ChevronRight, Car, Phone, Camera, Shield,
} from 'lucide-react'
import { MOCK_CLAIMS, MOCK_POLICIES } from '../../data/mockData'
import { formatCurrency, formatDate } from '../../utils/format'

// ── File New Claim Form ───────────────────────────────────────────────────
function NewClaimForm({ onCancel }: { onCancel: () => void }) {
  const [step, setStep] = useState(1)
  const [policyId, setPolicyId] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [incidentType, setIncidentType] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const incidentTypes = [
    { id: 'accident', label: 'Accident / Collision', icon: <Car size={18} /> },
    { id: 'theft', label: 'Theft / Break-in', icon: <AlertTriangle size={18} /> },
    { id: 'natural', label: 'Natural Calamity', icon: <Shield size={18} /> },
    { id: 'fire', label: 'Fire Damage', icon: <AlertTriangle size={18} /> },
  ]

  function handleSubmit() {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-teal-500" />
        </div>
        <h3 className="text-xl font-display font-bold text-navy-900 mb-2">Claim Registered!</h3>
        <p className="text-slate-500 text-sm mb-1">Your claim number is</p>
        <p className="text-2xl font-bold text-teal-600 mb-4">CLM-2026-0043</p>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          Our team will contact you within 24 hours. You can track the status on your dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          <button onClick={onCancel} className="btn-ghost">File Another Claim</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {['Policy', 'Incident', 'Details', 'Documents'].map((label, i) => {
          const n = i + 1
          const state = n < step ? 'done' : n === step ? 'active' : 'idle'
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`step-dot ${state} w-8 h-8 text-sm`}>
                  {state === 'done' ? '✓' : n}
                </div>
                <span className={`text-[10px] mt-1 ${state === 'idle' ? 'text-slate-400' : 'text-navy-700'}`}>{label}</span>
              </div>
              {i < 3 && <div className={`h-0.5 flex-1 mx-1 mb-4 ${n < step ? 'bg-teal-400' : 'bg-slate-200'}`} />}
            </div>
          )
        })}
      </div>

      {/* Step 1: Policy selection */}
      {step === 1 && (
        <div className="space-y-3">
          <h3 className="font-bold text-navy-900 mb-4">Which policy is this claim for?</h3>
          {MOCK_POLICIES.map(p => (
            <label
              key={p.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                policyId === p.id ? 'border-navy-900 bg-navy-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input type="radio" className="accent-navy-900" checked={policyId === p.id} onChange={() => setPolicyId(p.id)} />
              <div className="flex-1">
                <p className="font-semibold text-navy-900 text-sm">{p.insurerName}</p>
                <p className="text-xs text-slate-500">{p.policyNumber}</p>
                {p.vehicleName && <p className="text-xs text-slate-400 mt-0.5">{p.vehicleName} · {p.vehicleNumber}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 capitalize">{p.productType}</p>
                <p className={`text-[11px] font-semibold mt-0.5 ${p.status === 'active' ? 'text-mint-600' : 'text-amber-600'}`}>
                  {p.status === 'active' ? 'Active' : 'Expiring'}
                </p>
              </div>
            </label>
          ))}
          <button
            className="btn-primary w-full mt-2"
            disabled={!policyId}
            onClick={() => setStep(2)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2: Incident details */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-bold text-navy-900 mb-4">What happened?</h3>

          <div className="grid grid-cols-2 gap-3">
            {incidentTypes.map(t => (
              <button
                key={t.id}
                onClick={() => setIncidentType(t.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  incidentType === t.id ? 'border-navy-900 bg-navy-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                  incidentType === t.id ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{t.icon}</div>
                <p className="text-xs font-semibold text-navy-900">{t.label}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Date of Incident *</label>
            <input type="date" className="cf-input max-w-xs" value={incidentDate} onChange={e => setIncidentDate(e.target.value)} />
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn-primary flex-1" disabled={!incidentType || !incidentDate} onClick={() => setStep(3)}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Description */}
      {step === 3 && (
        <div className="space-y-5">
          <h3 className="font-bold text-navy-900 mb-4">Describe the incident</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Description *</label>
            <textarea
              className="cf-input min-h-[120px] resize-none"
              placeholder="Describe what happened, location, damage extent..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Estimate Amount (₹)</label>
            <input type="number" className="cf-input max-w-xs" placeholder="e.g. 45000" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">FIR Number (if applicable)</label>
            <input className="cf-input max-w-xs" placeholder="e.g. FIR/2026/001234" />
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost" onClick={() => setStep(2)}>Back</button>
            <button className="btn-primary flex-1" disabled={!description.trim()} onClick={() => setStep(4)}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Documents */}
      {step === 4 && (
        <div className="space-y-5">
          <h3 className="font-bold text-navy-900 mb-2">Upload Documents</h3>
          <p className="text-sm text-slate-500 mb-4">Attach photos or documents to speed up your claim</p>

          {[
            { label: 'Vehicle RC Copy', required: true },
            { label: 'Driver\'s License', required: true },
            { label: 'Photos of Damage', required: false, icon: <Camera size={14} /> },
            { label: 'FIR Copy (if applicable)', required: false },
            { label: 'Repair Estimate', required: false },
          ].map(doc => (
            <div key={doc.label} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                {doc.icon ?? <FileText size={14} className="text-slate-400" />}
                <span className="font-medium">{doc.label}</span>
                {doc.required && <span className="text-coral-500 text-xs">*</span>}
              </div>
              <button className="btn-ghost text-xs px-3 py-2">
                <Upload size={12} /> Upload
              </button>
            </div>
          ))}

          {/* Contact */}
          <div className="bg-teal-50 rounded-xl p-4 flex items-center gap-3">
            <Phone size={16} className="text-teal-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-teal-800">Need help filing?</p>
              <p className="text-xs text-teal-600">Call us at 1800-266-9999 (free)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost" onClick={() => setStep(3)}>Back</button>
            <button className="btn-primary flex-1" onClick={handleSubmit}>
              Submit Claim <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Claims Page ──────────────────────────────────────────────────────
export default function Claims() {
  const [view, setView] = useState<'list' | 'new'>('list')

  const claimStatusColor: Record<string, string> = {
    submitted: 'bg-slate-100 text-slate-600',
    under_review: 'bg-blue-50 text-blue-600',
    surveyed: 'bg-purple-50 text-purple-600',
    approved: 'bg-mint-100 text-mint-600',
    settled: 'bg-teal-50 text-teal-700',
    rejected: 'bg-red-50 text-red-500',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-hero py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Claims Center</h1>
          <p className="text-white/70 text-sm">File, track, and manage all your insurance claims in one place</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {view === 'list' ? (
          <>
            {/* Actions row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-navy-900 text-xl">My Claims</h2>
                <p className="text-slate-500 text-sm mt-0.5">{MOCK_CLAIMS.length} total claims</p>
              </div>
              <button className="btn-primary" onClick={() => setView('new')}>
                <FileText size={15} /> File New Claim
              </button>
            </div>

            {/* Claims list */}
            {MOCK_CLAIMS.length === 0 ? (
              <div className="card p-16 text-center">
                <Shield size={44} className="text-slate-200 mx-auto mb-4" />
                <p className="font-bold text-navy-900 mb-1">No claims yet</p>
                <p className="text-sm text-slate-400 mb-6">All your insurance claims will appear here</p>
                <button className="btn-primary" onClick={() => setView('new')}>File Your First Claim</button>
              </div>
            ) : (
              <div className="space-y-5">
                {MOCK_CLAIMS.map(claim => (
                  <div key={claim.id} className="card overflow-hidden">
                    {/* Status strip */}
                    <div className={`h-1 w-full ${
                      claim.status === 'settled' || claim.status === 'approved' ? 'bg-teal-gradient' :
                      claim.status === 'rejected' ? 'bg-coral-gradient' : 'bg-amber-gradient'
                    }`} />

                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-navy-900">{claim.claimNumber}</h3>
                            <span className={`badge ${claimStatusColor[claim.status]} text-[10px] capitalize`}>
                              {claim.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{claim.insurerName} · {claim.policyNumber}</p>
                          {claim.vehicleNumber && (
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <Car size={11} />{claim.vehicleNumber}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-display font-bold text-navy-900">{formatCurrency(claim.claimAmount)}</p>
                          {claim.settledAmount && (
                            <p className="text-xs text-mint-600 font-semibold mt-0.5">Settled: {formatCurrency(claim.settledAmount)}</p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 mb-5">{claim.description}</p>

                      {/* Timeline */}
                      <div className="mb-4">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Claim Progress</p>
                        <div className="relative">
                          {/* Line */}
                          <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-slate-200" />

                          <div className="space-y-4">
                            {claim.timeline.map((t, i) => (
                              <div key={i} className="flex items-start gap-4 pl-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                  t.status === 'done' ? 'bg-teal-500' :
                                  t.status === 'current' ? 'bg-navy-900 ring-2 ring-navy-200' :
                                  'bg-slate-200'
                                }`}>
                                  {t.status === 'done' ? (
                                    <CheckCircle2 size={14} className="text-white" />
                                  ) : t.status === 'current' ? (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  ) : (
                                    <Clock size={12} className="text-slate-400" />
                                  )}
                                </div>
                                <div className="flex-1 pb-1">
                                  <div className="flex items-center justify-between">
                                    <p className={`text-sm font-semibold ${t.status === 'pending' ? 'text-slate-400' : 'text-navy-900'}`}>
                                      {t.step}
                                    </p>
                                    {t.date && <p className="text-xs text-slate-400">{formatDate(t.date)}</p>}
                                  </div>
                                  <p className={`text-xs mt-0.5 ${t.status === 'pending' ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {t.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Filed info */}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                        <span>Filed: {formatDate(claim.filedDate)}</span>
                        <span>Incident: {formatDate(claim.incidentDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info box */}
            <div className="mt-8 card p-5 bg-navy-50 border-navy-100">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-navy-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy-900 text-sm">Need immediate claim assistance?</p>
                  <p className="text-slate-600 text-xs mt-1">
                    Call our 24x7 claims helpline at{' '}
                    <a href="tel:18002669999" className="text-teal-600 font-bold">1800-266-9999</a>{' '}
                    or{' '}
                    <a href="mailto:claims@insureflow.in" className="text-teal-600 font-bold">claims@insureflow.in</a>
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-bold text-navy-900 text-xl">File a New Claim</h2>
              <button onClick={() => setView('list')} className="btn-ghost text-xs">
                Cancel
              </button>
            </div>
            <NewClaimForm onCancel={() => setView('list')} />
          </div>
        )}
      </div>
    </div>
  )
}
