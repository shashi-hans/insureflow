import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Menu, X, ChevronDown, Bell, User, Lock, Phone, AlertTriangle, Calendar, Car } from 'lucide-react'
import { MOCK_POLICIES } from '../../data/mockData'

const products = [
  { label: 'Car Insurance',    href: '/motor/quote',  icon: '🚗' },
  { label: 'Bike Insurance',   href: '/bike/quote',   icon: '🏍️' },
  { label: 'Health Insurance', href: '/health/quote', icon: '🏥' },
  { label: 'Term Insurance',   href: '/term/quote',   icon: '💎' },
  { label: 'Travel Insurance', href: '/travel',       icon: '✈️' },
]

const ADMIN_MOBILE   = '8873626092'
const ADMIN_PASSWORD = '887362'

function AdminLoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [mobile, setMobile]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (mobile === ADMIN_MOBILE && password === ADMIN_PASSWORD) {
      onSuccess()
    } else {
      setError('Invalid mobile number or password.')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-glass-lg w-full max-w-sm p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-navy-900">Admin Login</h2>
            <p className="text-xs text-slate-500">Enter your credentials to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mobile Number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); setError('') }}
                placeholder="10-digit mobile number"
                className="cf-input pl-9"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                maxLength={6}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="6-digit password"
                className="cf-input pl-9"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {error && <p className="text-xs text-coral-600 font-medium">{error}</p>}

          <button type="submit" className="btn-secondary w-full mt-2">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen]       = useState(false)
  const [dropOpen, setDropOpen]       = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [loginOpen, setLoginOpen]     = useState(false)
  const [notifOpen, setNotifOpen]     = useState(false)

  const expiringPolicies = MOCK_POLICIES.filter(p => p.status === 'expiring_soon')

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-navy-900/95 backdrop-blur-md border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-teal-gradient rounded-lg flex items-center justify-center shadow-[0_2px_10px_rgba(0,180,216,0.4)]">
                <Shield size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Insure<span className="text-teal-500">Flow</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <div className="relative" onMouseEnter={() => setDropOpen(true)} onMouseLeave={() => setDropOpen(false)}>
                <button className="flex items-center gap-1 text-sm font-medium transition-colors text-white/80 hover:text-white">
                  Products <ChevronDown size={14} className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                    <div className="bg-white rounded-2xl shadow-glass-md border border-slate-100 p-2 w-56">
                      {products.map(p => (
                        <Link key={p.href} to={p.href} onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-navy-800 transition-colors">
                          <span className="text-lg">{p.icon}</span>{p.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/claims" className="text-sm font-medium transition-colors text-white/80 hover:text-white">
                Claims
              </Link>
              <Link to="/dashboard" className="text-sm font-medium transition-colors text-white/80 hover:text-white">
                My Policies
              </Link>
            </nav>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => setNotifOpen(true)} className="relative p-2 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10">
                <Bell size={18} />
                {expiringPolicies.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-coral-500 rounded-full" />}
              </button>
              <div className="relative" onMouseEnter={() => setAccountOpen(true)} onMouseLeave={() => setAccountOpen(false)}>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white/80 hover:text-white hover:bg-white/10">
                  <User size={16} /> Account <ChevronDown size={14} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                </button>
                {accountOpen && (
                  <div className="absolute top-full right-0 pt-3">
                    <div className="bg-white rounded-2xl shadow-glass-md border border-slate-100 p-2 w-40">
                      <Link to="/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-navy-800 transition-colors">
                        <User size={15} /> Guest
                      </Link>
                      <button onClick={() => { setAccountOpen(false); setLoginOpen(true) }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-navy-800 transition-colors">
                        <Shield size={15} /> Admin
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/motor/quote" className="btn-primary text-xs px-4 py-2.5">
                Get Quote
              </Link>
            </div>

            {/* Mobile burger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-white">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-navy-900 border-t border-white/10 px-4 py-4 space-y-1">
            {products.map(p => (
              <Link key={p.href} to={p.href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 text-sm font-medium text-white/80 hover:text-white">
                <span>{p.icon}</span>{p.label}
              </Link>
            ))}
            <div className="border-t border-white/10 my-2 pt-2">
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 text-sm font-medium text-white/80 hover:text-white">
                My Policies
              </Link>
              <Link to="/claims" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 text-sm font-medium text-white/80 hover:text-white">
                Claims
              </Link>
            </div>
            <Link to="/motor/quote" onClick={() => setMenuOpen(false)} className="btn-primary w-full mt-2">
              Get Free Quote
            </Link>
          </div>
        )}
      </header>

      {loginOpen && (
        <AdminLoginModal
          onClose={() => setLoginOpen(false)}
          onSuccess={() => { setLoginOpen(false); navigate('/docs') }}
        />
      )}

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
                <p className="text-xs text-slate-500">{expiringPolicies.length} alert{expiringPolicies.length !== 1 ? 's' : ''}</p>
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
                  <Link to="/dashboard" onClick={() => setNotifOpen(false)} className="mt-3 flex items-center justify-center w-full py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-colors">
                    Renew Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
