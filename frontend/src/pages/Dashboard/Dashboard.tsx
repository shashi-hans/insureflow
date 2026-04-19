import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Bell, FileText, RefreshCcw, Plus, ChevronRight,
  Car, HeartPulse, Plane, LifeBuoy, Clock, CheckCircle2,
  AlertTriangle, XCircle, Download, Eye, X, Calendar,
} from 'lucide-react'
import { MOCK_POLICIES, MOCK_CLAIMS } from '../../data/mockData'
import { formatCurrency, formatDate, getDaysToExpiry } from '../../utils/format'
import type { Policy, PolicyStatus } from '../../types'

// ── Helpers ───────────────────────────────────────────────────────────────
const productIcons: Record<string, React.ReactNode> = {
  motor: <Car size={18} />,
  health: <HeartPulse size={18} />,
  travel: <Plane size={18} />,
  life: <LifeBuoy size={18} />,
}

const productGradients: Record<string, string> = {
  motor: 'bg-teal-gradient',
  health: 'bg-coral-gradient',
  travel: 'bg-amber-gradient',
  life: 'bg-mint-gradient',
}

function statusConfig(status: PolicyStatus) {
  switch (status) {
    case 'active':
      return { label: 'Active', color: 'bg-mint-100 text-mint-600', icon: <CheckCircle2 size={11} /> }
    case 'expiring_soon':
      return { label: 'Expiring Soon', color: 'bg-amber-50 text-amber-600', icon: <AlertTriangle size={11} /> }
    case 'expired':
      return { label: 'Expired', color: 'bg-red-50 text-red-500', icon: <XCircle size={11} /> }
    case 'pending':
      return { label: 'Pending', color: 'bg-slate-100 text-slate-500', icon: <Clock size={11} /> }
  }
}

// ── Policy Card ───────────────────────────────────────────────────────────
function PolicyCard({ policy }: { policy: Policy }) {
  const { label, color, icon } = statusConfig(policy.status)
  const iconEl = productIcons[policy.productType]
  const grad = productGradients[policy.productType]

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${grad} rounded-xl flex items-center justify-center text-white shrink-0`}>
            {iconEl}
          </div>
          <div>
            <p className="font-bold text-navy-900 text-sm">{policy.insurerName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{policy.policyNumber}</p>
          </div>
        </div>
        <span className={`badge ${color} text-[10px]`}>{icon}{label}</span>
      </div>

      {/* Vehicle / insured */}
      {(policy.vehicleName || policy.vehicleNumber) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
          <Car size={12} className="text-slate-400" />
          <span className="font-medium">{policy.vehicleName}</span>
          {policy.vehicleNumber && <span className="text-slate-400">· {policy.vehicleNumber}</span>}
        </div>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-[10px] text-slate-400 mb-0.5">Premium</p>
          <p className="text-xs font-bold text-navy-900">{formatCurrency(policy.premium)}</p>
        </div>
        {policy.idv && (
          <div>
            <p className="text-[10px] text-slate-400 mb-0.5">IDV</p>
            <p className="text-xs font-bold text-navy-900">{formatCurrency(policy.idv)}</p>
          </div>
        )}
        {policy.sumInsured && (
          <div>
            <p className="text-[10px] text-slate-400 mb-0.5">Sum Insured</p>
            <p className="text-xs font-bold text-navy-900">{formatCurrency(policy.sumInsured)}</p>
          </div>
        )}
        <div>
          <p className="text-[10px] text-slate-400 mb-0.5">Expires</p>
          <p className={`text-xs font-bold ${policy.daysToExpiry < 30 ? 'text-amber-600' : 'text-navy-900'}`}>
            {formatDate(policy.endDate)}
          </p>
        </div>
      </div>

      {/* Expiry bar */}
      {policy.status === 'expiring_soon' && (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Expires in</span>
            <span className="font-bold text-amber-600">{policy.daysToExpiry} days</span>
          </div>
          <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-gradient rounded-full"
              style={{ width: `${Math.min(100, (policy.daysToExpiry / 30) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        {policy.status === 'expiring_soon' && (
          <Link to="/motor/quote" className="btn-primary text-xs px-4 py-2.5 flex-1">
            <RefreshCcw size={12} /> Renew
          </Link>
        )}
        <button className="btn-ghost text-xs flex-1">
          <Eye size={12} /> View Policy
        </button>
        {policy.policyPdfUrl && (
          <button className="btn-ghost text-xs px-3">
            <Download size={12} />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Claim Status Badge ────────────────────────────────────────────────────
const claimColors: Record<string, string> = {
  submitted: 'bg-slate-100 text-slate-600',
  under_review: 'bg-blue-50 text-blue-600',
  surveyed: 'bg-purple-50 text-purple-600',
  approved: 'bg-mint-100 text-mint-600',
  settled: 'bg-teal-50 text-teal-700',
  rejected: 'bg-red-50 text-red-500',
}

// ── Stats card ────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab]   = useState<'policies' | 'claims'>('policies')
  const [notifOpen, setNotifOpen]   = useState(false)

  const activePolicies    = MOCK_POLICIES.filter(p => p.status === 'active' || p.status === 'expiring_soon')
  const expiringPolicies  = MOCK_POLICIES.filter(p => p.status === 'expiring_soon')
  const expiringCount     = expiringPolicies.length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-hero pt-12 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-teal-300 text-sm font-medium mb-1">Good morning</p>
              <h1 className="text-3xl font-display font-bold text-white">My Policies</h1>
              <p className="text-white/60 text-sm mt-1">{MOCK_POLICIES.length} policies · {MOCK_CLAIMS.length} claims</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setNotifOpen(true)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors relative">
                <Bell size={16} />
                {expiringCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[9px] font-bold flex items-center justify-center">
                    {expiringCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <StatCard label="Active Policies" value={`${activePolicies.length}`} sub="All products" color="text-teal-400" />
            <StatCard label="Total Premium" value="₹43,650" sub="This year" color="text-white" />
            <StatCard label="Claims Filed" value={`${MOCK_CLAIMS.length}`} sub="All time" color="text-amber-400" />
            <StatCard label="Claim Settled" value="₹42,500" sub="Last claim" color="text-mint-500" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 pb-12">
        {/* Expiry alert */}
        {expiringCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">
                  {expiringCount} {expiringCount === 1 ? 'policy' : 'policies'} expiring soon
                </p>
                <p className="text-xs text-amber-600 mt-0.5">Renew now to avoid a coverage gap</p>
              </div>
            </div>
            <Link to="/motor/quote" className="btn-primary text-xs px-4 py-2.5 shrink-0">
              Renew <ChevronRight size={13} />
            </Link>
          </div>
        )}

        {/* Tabs + actions */}
        <div className="flex items-center justify-between mb-5">
          <div className="pill-toggle">
            <button className={activeTab === 'policies' ? 'active' : ''} onClick={() => setActiveTab('policies')}>
              Policies ({MOCK_POLICIES.length})
            </button>
            <button className={activeTab === 'claims' ? 'active' : ''} onClick={() => setActiveTab('claims')}>
              Claims ({MOCK_CLAIMS.length})
            </button>
          </div>

          {activeTab === 'policies' ? (
            <Link to="/motor/quote" className="btn-secondary text-xs px-4 py-2.5">
              <Plus size={13} /> Add Policy
            </Link>
          ) : (
            <Link to="/claims/new" className="btn-secondary text-xs px-4 py-2.5">
              <Plus size={13} /> File Claim
            </Link>
          )}
        </div>

        {/* Policies tab */}
        {activeTab === 'policies' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_POLICIES.map(p => <PolicyCard key={p.id} policy={p} />)}

            {/* Add new card */}
            <Link
              to="/motor/quote"
              className="card p-5 border-2 border-dashed border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer min-h-[200px] group"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-teal-100 rounded-2xl flex items-center justify-center transition-colors">
                <Plus size={22} className="text-slate-400 group-hover:text-teal-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-600 group-hover:text-teal-700 text-sm">Add New Policy</p>
                <p className="text-xs text-slate-400 mt-0.5">Motor, Health, Travel & more</p>
              </div>
            </Link>
          </div>
        )}

        {/* Claims tab */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            {MOCK_CLAIMS.map(claim => (
              <div key={claim.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
                      <FileText size={16} className="text-navy-600" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-900 text-sm">{claim.claimNumber}</p>
                      <p className="text-xs text-slate-400">{claim.insurerName} · {claim.policyNumber}</p>
                    </div>
                  </div>
                  <span className={`badge ${claimColors[claim.status]} text-[10px] capitalize`}>
                    {claim.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 text-center">
                  <div>
                    <p className="text-[10px] text-slate-400 mb-0.5">Claim Amount</p>
                    <p className="text-xs font-bold text-navy-900">{formatCurrency(claim.claimAmount)}</p>
                  </div>
                  {claim.settledAmount && (
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">Settled</p>
                      <p className="text-xs font-bold text-mint-600">{formatCurrency(claim.settledAmount)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-slate-400 mb-0.5">Filed</p>
                    <p className="text-xs font-bold text-navy-900">{formatDate(claim.filedDate)}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-0">
                    {claim.timeline.map((t, i) => (
                      <div key={i} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            t.status === 'done' ? 'bg-teal-500 text-white' :
                            t.status === 'current' ? 'bg-navy-900 text-white ring-2 ring-navy-200' :
                            'bg-slate-200 text-slate-400'
                          }`}>
                            {t.status === 'done' ? '✓' : i + 1}
                          </div>
                          <p className={`text-[9px] mt-1 text-center leading-tight max-w-[60px] ${
                            t.status === 'pending' ? 'text-slate-400' : 'text-slate-600'
                          }`}>{t.step}</p>
                        </div>
                        {i < claim.timeline.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 mb-4 ${t.status === 'done' ? 'bg-teal-300' : 'bg-slate-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-3 bg-slate-50 rounded-lg p-2.5">{claim.description}</p>
              </div>
            ))}

            {MOCK_CLAIMS.length === 0 && (
              <div className="card p-12 text-center">
                <Shield size={40} className="text-slate-200 mx-auto mb-4" />
                <p className="font-bold text-navy-900">No claims yet</p>
                <p className="text-sm text-slate-400 mt-1">Your claim history will appear here</p>
                <Link to="/claims/new" className="btn-primary mt-5 inline-flex">File a Claim</Link>
              </div>
            )}
          </div>
        )}

        {/* Quick actions */}
        <div className="mt-10">
          <h2 className="font-display font-bold text-navy-900 text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Car size={20} />, label: 'Car Quote', href: '/motor/quote', color: 'bg-teal-50 text-teal-600' },
              { icon: <HeartPulse size={20} />, label: 'Health Quote', href: '/health', color: 'bg-coral-50 text-coral-500' },
              { icon: <FileText size={20} />, label: 'File Claim', href: '/claims/new', color: 'bg-amber-50 text-amber-600' },
              { icon: <Shield size={20} />, label: 'All Policies', href: '#', color: 'bg-navy-50 text-navy-700' },
            ].map(a => (
              <Link key={a.label} to={a.href} className="card p-4 flex flex-col items-center gap-2.5 hover:shadow-card-hover transition-all group">
                <div className={`w-11 h-11 ${a.color} rounded-xl flex items-center justify-center`}>{a.icon}</div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-navy-900">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {notifOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={() => setNotifOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-glass-lg w-full max-w-sm p-6">
            <button onClick={() => setNotifOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <Bell size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-navy-900">Notifications</h2>
                <p className="text-xs text-slate-500">{expiringCount} alert{expiringCount !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="space-y-3">
              {expiringPolicies.map(policy => (
                <div key={policy.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-900">Policy Expiring Soon</p>
                      <p className="text-xs text-slate-500 mt-0.5">{policy.insurerName} — {policy.policyNumber}</p>
                      <div className="mt-2 space-y-1">
                        {policy.vehicleName && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Car size={12} /> {policy.vehicleName} ({policy.vehicleNumber})
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Calendar size={12} /> Expires on {new Date(policy.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <AlertTriangle size={11} /> Expires in {policy.daysToExpiry} days
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setNotifOpen(false)} className="mt-3 flex items-center justify-center w-full py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-colors">
                    Renew Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
