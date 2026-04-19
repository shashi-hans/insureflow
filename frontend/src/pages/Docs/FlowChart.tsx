import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, ExternalLink, GitBranch, Layers, Server, Globe } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
interface FlowStep {
  id: string
  icon: string
  title: string
  subtitle: string
  route?: string
  type: 'start' | 'form' | 'results' | 'proposal' | 'success'
}

interface Product {
  key: string
  label: string
  icon: string
  color: string
  bg: string
  border: string
  textColor: string
  badgeBg: string
  steps: FlowStep[]
  storeSlice: string
  storeFields: string[]
}

// ── Step card styles by type ───────────────────────────────────────────────
const TYPE_STYLES: Record<FlowStep['type'], string> = {
  start:    'bg-navy-900 text-white border-navy-900',
  form:     'bg-white text-navy-900 border-slate-200',
  results:  'bg-teal-500 text-white border-teal-500',
  proposal: 'bg-amber-500 text-white border-amber-500',
  success:  'bg-mint-500 text-white border-mint-500',
}

// ── Product definitions ────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    key: 'car',
    label: 'Car Insurance',
    icon: '🚗',
    color: 'from-blue-500 to-navy-700',
    bg: 'bg-navy-50',
    border: 'border-navy-200',
    textColor: 'text-navy-700',
    badgeBg: 'bg-navy-900',
    storeSlice: 'quoteSlice',
    storeFields: ['vehicleType: car', 'make/model/year', 'coverageType', 'ncbPercent', 'idv', 'addons'],
    steps: [
      { id: 'c1', icon: '🚗', title: 'Registration', subtitle: 'Reg number or New Policy', route: '/motor/quote', type: 'start' },
      { id: 'c2', icon: '📋', title: 'Vehicle Details', subtitle: 'Make · Model · Year · Fuel · City', route: '/motor/quote', type: 'form' },
      { id: 'c3', icon: '🛡️', title: 'Coverage & NCB', subtitle: 'Comprehensive / TP / OD · NCB 0–50%', route: '/motor/quote', type: 'form' },
      { id: 'c4', icon: '👤', title: 'Owner Info', subtitle: 'Name · Phone · Email', route: '/motor/quote', type: 'form' },
      { id: 'c5', icon: '📊', title: 'Compare Plans', subtitle: 'IDV slider · Sort · Filter · Add-ons', route: '/motor/results', type: 'results' },
      { id: 'c6', icon: '📝', title: 'Proposal Form', subtitle: 'Vehicle · Owner · Nominee', route: '/motor/proposal', type: 'proposal' },
      { id: 'c7', icon: '✅', title: 'Policy Issued', subtitle: 'Policy PDF · Email confirmation', route: '/motor/success', type: 'success' },
    ],
  },
  {
    key: 'bike',
    label: 'Bike Insurance',
    icon: '🏍️',
    color: 'from-orange-500 to-red-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    textColor: 'text-orange-700',
    badgeBg: 'bg-orange-600',
    storeSlice: 'quoteSlice',
    storeFields: ['vehicleType: bike', 'make/model/year', 'coverageType', 'ncbPercent', 'idv', 'addons'],
    steps: [
      { id: 'b1', icon: '🏍️', title: 'Registration', subtitle: 'Reg number or New Policy', route: '/bike/quote', type: 'start' },
      { id: 'b2', icon: '📋', title: 'Bike Details', subtitle: 'Honda · RE · KTM · Yamaha etc.', route: '/bike/quote', type: 'form' },
      { id: 'b3', icon: '🛡️', title: 'Coverage & NCB', subtitle: 'From ₹714/yr · NCB up to 50%', route: '/bike/quote', type: 'form' },
      { id: 'b4', icon: '👤', title: 'Owner Info', subtitle: 'Name · Phone · Email', route: '/bike/quote', type: 'form' },
      { id: 'b5', icon: '📊', title: 'Compare Plans', subtitle: 'Shared with Motor Results', route: '/bike/results', type: 'results' },
      { id: 'b6', icon: '📝', title: 'Proposal Form', subtitle: 'Shared with Motor Proposal', route: '/bike/proposal', type: 'proposal' },
      { id: 'b7', icon: '✅', title: 'Policy Issued', subtitle: 'Instant policy PDF', route: '/bike/success', type: 'success' },
    ],
  },
  {
    key: 'health',
    label: 'Health Insurance',
    icon: '🏥',
    color: 'from-teal-500 to-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    textColor: 'text-teal-700',
    badgeBg: 'bg-teal-600',
    storeSlice: 'healthSlice',
    storeFields: ['members (self/spouse/kids/parents)', 'ages', 'sumInsured', 'city', 'preExisting', 'plans'],
    steps: [
      { id: 'h1', icon: '👨‍👩‍👧', title: 'Select Members', subtitle: 'Self · Spouse · Kids · Parents', route: '/health/quote', type: 'start' },
      { id: 'h2', icon: '💰', title: 'Coverage Amount', subtitle: '₹3L – ₹50L · City · Pre-existing', route: '/health/quote', type: 'form' },
      { id: 'h3', icon: '👤', title: 'Contact Info', subtitle: 'Name · Phone · Email', route: '/health/quote', type: 'form' },
      { id: 'h4', icon: '🏥', title: 'Compare Plans', subtitle: 'CSR · Hospitals · Room Rent · Co-pay', route: '/health/results', type: 'results' },
      { id: 'h5', icon: '📝', title: 'Proposal Form', subtitle: 'Member Details · Medical · Nominee', route: '/health/proposal', type: 'proposal' },
      { id: 'h6', icon: '✅', title: 'Policy Issued', subtitle: 'Family floater policy active', route: '/health/success', type: 'success' },
    ],
  },
  {
    key: 'term',
    label: 'Term Insurance',
    icon: '💎',
    color: 'from-purple-500 to-purple-800',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    textColor: 'text-purple-700',
    badgeBg: 'bg-purple-700',
    storeSlice: 'termSlice',
    storeFields: ['dob', 'gender', 'smoker', 'annualIncome', 'coverAmount', 'tenure', 'paymentTerm', 'plans'],
    steps: [
      { id: 't1', icon: '🧑', title: 'Personal Info', subtitle: 'DOB · Gender · Smoker · Income', route: '/term/quote', type: 'start' },
      { id: 't2', icon: '💰', title: 'Coverage Details', subtitle: '₹25L – ₹5Cr · Tenure · Payment Term', route: '/term/quote', type: 'form' },
      { id: 't3', icon: '👤', title: 'Contact Info', subtitle: 'Name · Phone · Email', route: '/term/quote', type: 'form' },
      { id: 't4', icon: '📊', title: 'Compare Plans', subtitle: 'LIC · HDFC · Max Life · ICICI Pru', route: '/term/results', type: 'results' },
      { id: 't5', icon: '📝', title: 'Proposal Form', subtitle: 'Personal · KYC · Employment · Nominee', route: '/term/proposal', type: 'proposal' },
      { id: 't6', icon: '✅', title: 'Policy Issued', subtitle: 'Life cover active instantly', route: '/term/success', type: 'success' },
    ],
  },
]

// ── Step Card ──────────────────────────────────────────────────────────────
function StepCard({ step, color, onClick }: { step: FlowStep; color: string; onClick: () => void }) {
  const style = TYPE_STYLES[step.type]
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center text-center p-3 rounded-2xl border-2 w-28 shrink-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group ${style}`}
    >
      <span className="text-2xl mb-1.5">{step.icon}</span>
      <p className="text-xs font-bold leading-tight">{step.title}</p>
      <p className={`text-[10px] mt-1 leading-tight opacity-70`}>{step.subtitle}</p>
      {step.route && (
        <ExternalLink size={10} className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity" />
      )}
    </button>
  )
}

// ── Arrow ──────────────────────────────────────────────────────────────────
function Arrow({ color }: { color: string }) {
  return (
    <div className={`flex items-center shrink-0 ${color}`}>
      <div className="h-0.5 w-5 bg-current opacity-40" />
      <ChevronRight size={14} className="opacity-60 -ml-1" />
    </div>
  )
}

// ── Product Flow ───────────────────────────────────────────────────────────
function ProductFlow({ product, onStepClick }: { product: Product; onStepClick: (route: string) => void }) {
  return (
    <div className={`rounded-2xl border ${product.border} ${product.bg} p-5 overflow-x-auto`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center text-base shadow-sm`}>
          {product.icon}
        </div>
        <div>
          <h3 className={`font-bold text-sm ${product.textColor}`}>{product.label}</h3>
          <p className={`text-xs opacity-60 ${product.textColor}`}>Redux: <code className="font-mono">{product.storeSlice}</code></p>
        </div>
      </div>

      <div className="flex items-center gap-0 min-w-max pb-1">
        {product.steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <StepCard
              step={step}
              color={product.textColor}
              onClick={() => step.route && onStepClick(step.route)}
            />
            {i < product.steps.length - 1 && <Arrow color={product.textColor} />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Legend ─────────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { type: 'start' as const, label: 'Entry / Step 1' },
    { type: 'form' as const, label: 'Form Step' },
    { type: 'results' as const, label: 'Results / Compare' },
    { type: 'proposal' as const, label: 'Proposal / Pay' },
    { type: 'success' as const, label: 'Success / Done' },
  ]
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {items.map(({ type, label }) => (
        <div key={type} className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-md border-2 ${TYPE_STYLES[type]}`} />
          <span className="text-xs text-slate-600">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Architecture Section ───────────────────────────────────────────────────
function ArchSection() {
  const layers = [
    {
      icon: Globe,
      title: 'Frontend (React SPA)',
      color: 'bg-navy-900',
      items: [
        'React 18 + TypeScript + Vite 7',
        'Tailwind CSS v4 — @theme design tokens',
        'Redux Toolkit — 3 slices (quote, health, term)',
        'React Router v6 — 18 routes',
        'Lucide React icons',
      ],
    },
    {
      icon: Layers,
      title: 'State Management',
      color: 'bg-teal-600',
      items: [
        'quoteSlice — Car + Bike (vehicleType flag)',
        'healthSlice — Members, ages, sumInsured, city',
        'termSlice — DOB, gender, smoker, coverAmount',
        'Each slice: step, owner, plans, selectedPlanId',
        'RootState auto-typed via ReturnType<getState>',
      ],
    },
    {
      icon: Server,
      title: 'Backend (FastAPI)',
      color: 'bg-amber-500',
      items: [
        'FastAPI + Pydantic — /api/motor, /api/policies, /api/claims',
        'Motor pricing: IDV depreciation + NCB + GST engine',
        'POST /api/motor/quote — returns 4 insurer plans',
        'GET /api/motor/vehicle/{reg} — vehicle lookup',
        'POST /api/claims — generates CLM-XXXX number',
      ],
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {layers.map(layer => (
        <div key={layer.title} className="card overflow-hidden">
          <div className={`${layer.color} px-4 py-3 flex items-center gap-2`}>
            <layer.icon size={16} className="text-white" />
            <span className="text-white font-bold text-sm">{layer.title}</span>
          </div>
          <ul className="p-4 space-y-1.5">
            {layer.items.map(item => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="text-teal-500 mt-0.5 shrink-0">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ── Post-purchase flow ─────────────────────────────────────────────────────
function PostPurchaseFlow({ onStepClick }: { onStepClick: (r: string) => void }) {
  const steps = [
    { icon: '✅', title: 'Policy Issued', sub: 'Policy number + PDF', route: '/motor/success', bg: 'bg-mint-500 text-white border-mint-500' },
    { icon: '📁', title: 'Dashboard', sub: 'All policies · Expiry alerts', route: '/dashboard', bg: 'bg-navy-900 text-white border-navy-900' },
    { icon: '🔔', title: 'Renewal Alert', sub: '30 days before expiry', route: '/dashboard', bg: 'bg-amber-500 text-white border-amber-500' },
    { icon: '🩺', title: 'File Claim', sub: 'Incident · Photos · Docs', route: '/claims', bg: 'bg-coral-500 text-white border-coral-500' },
    { icon: '📡', title: 'Track Claim', sub: 'Submitted → Approved → Settled', route: '/claims', bg: 'bg-teal-500 text-white border-teal-500' },
  ]

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 overflow-x-auto">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={16} className="text-slate-500" />
        <h3 className="font-bold text-sm text-slate-700">Post-Purchase Flow — Dashboard & Claims</h3>
      </div>
      <div className="flex items-center min-w-max">
        {steps.map((step, i) => (
          <div key={step.title} className="flex items-center">
            <button
              onClick={() => onStepClick(step.route)}
              className={`flex flex-col items-center text-center p-3 rounded-2xl border-2 w-28 shrink-0 transition-all hover:-translate-y-1 hover:shadow-lg ${step.bg}`}
            >
              <span className="text-2xl mb-1.5">{step.icon}</span>
              <p className="text-xs font-bold leading-tight">{step.title}</p>
              <p className="text-[10px] mt-1 leading-tight opacity-70">{step.sub}</p>
            </button>
            {i < steps.length - 1 && (
              <div className="flex items-center text-slate-400 shrink-0">
                <div className="h-0.5 w-5 bg-current opacity-40" />
                <ChevronRight size={14} className="opacity-60 -ml-1" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── API Endpoints Table ────────────────────────────────────────────────────
const API_ENDPOINTS = [
  { method: 'POST', path: '/api/motor/quote', desc: 'Pricing engine — returns 4 insurer plans with computed premiums', badge: 'bg-teal-100 text-teal-700' },
  { method: 'GET',  path: '/api/motor/vehicle/{reg}', desc: 'Vehicle lookup by registration number', badge: 'bg-blue-100 text-blue-700' },
  { method: 'GET',  path: '/api/policies', desc: 'List all user policies', badge: 'bg-blue-100 text-blue-700' },
  { method: 'GET',  path: '/api/policies/{id}', desc: 'Single policy detail', badge: 'bg-blue-100 text-blue-700' },
  { method: 'GET',  path: '/api/claims', desc: 'List all filed claims', badge: 'bg-blue-100 text-blue-700' },
  { method: 'POST', path: '/api/claims', desc: 'File new claim — generates CLM-XXXX number', badge: 'bg-teal-100 text-teal-700' },
  { method: 'GET',  path: '/api/claims/{id}', desc: 'Single claim detail + timeline', badge: 'bg-blue-100 text-blue-700' },
  { method: 'GET',  path: '/health', desc: 'API health check', badge: 'bg-slate-100 text-slate-600' },
]

// ── Pricing Formula ────────────────────────────────────────────────────────
function PricingFormula() {
  const rows = [
    { label: 'IDV', formula: 'base_value × (1 − min(0.5, vehicle_age × 0.05))', note: '5% depreciation/yr' },
    { label: 'Base Premium', formula: 'IDV × insurer_rate', note: 'comprehensive' },
    { label: 'NCB Discount', formula: 'Base × ncb_rate', note: '0% – 50%' },
    { label: 'After NCB', formula: 'Base − NCB Discount', note: '' },
    { label: 'GST', formula: 'After NCB × 18%', note: 'statutory' },
    { label: 'Total Premium', formula: 'After NCB + GST', note: 'final payable' },
  ]
  return (
    <div className="card overflow-hidden">
      <div className="bg-navy-900 px-4 py-3">
        <p className="text-white font-bold text-sm">Motor Pricing Engine — api/routers/motor.py</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                <td className="px-4 py-2.5 font-bold text-navy-900 w-32">{r.label}</td>
                <td className="px-4 py-2.5 font-mono text-teal-700">{r.formula}</td>
                <td className="px-4 py-2.5 text-slate-400">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
const TABS = ['Product Flows', 'Architecture', 'API Reference', 'Pricing Engine']

export default function FlowChart() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  function handleStepClick(route: string) {
    navigate(route)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-hero py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-1.5 mb-4">
            <GitBranch size={14} className="text-teal-300" />
            <span className="text-teal-300 text-xs font-semibold">Project Documentation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
            InsureFlow — Product Flowchart
          </h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Visual documentation of all product flows, architecture, and API endpoints. Click any step to navigate directly to that page.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['4 Products', '18 Routes', '3 Redux Slices', '7 API Endpoints'].map(s => (
              <span key={s} className="text-xs font-semibold bg-white/10 border border-white/20 text-white/80 px-3 py-1.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === i ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Tab 0: Product Flows ── */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-navy-900">Product Flows</h2>
                <p className="text-sm text-slate-500 mt-1">Click any step card to navigate to that page in the app</p>
              </div>
            </div>

            <Legend />

            {PRODUCTS.map(product => (
              <ProductFlow key={product.key} product={product} onStepClick={handleStepClick} />
            ))}

            <PostPurchaseFlow onStepClick={handleStepClick} />

            {/* Shared components note */}
            <div className="card p-5 bg-amber-50 border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Shared Pages</p>
              <p className="text-sm text-amber-700">
                Bike flow reuses <code className="bg-amber-100 px-1 rounded">Motor/Results</code>, <code className="bg-amber-100 px-1 rounded">Motor/Proposal</code>, and <code className="bg-amber-100 px-1 rounded">Motor/Success</code> — only the QuoteFlow differs (bike-specific makes/models + <code className="bg-amber-100 px-1 rounded">vehicleType: 'bike'</code> dispatched on mount).
                Health and Term success pages also reuse <code className="bg-amber-100 px-1 rounded">Motor/Success</code>.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 1: Architecture ── */}
        {activeTab === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-display font-bold text-navy-900 mb-1">Architecture</h2>
              <p className="text-sm text-slate-500">Frontend SPA + FastAPI backend (currently disconnected — frontend uses mock data)</p>
            </div>

            <ArchSection />

            {/* Redux state diagram */}
            <div>
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Layers size={16} className="text-teal-500" /> Redux Store Structure
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {PRODUCTS.map(p => (
                  <div key={p.key} className={`rounded-2xl border ${p.border} ${p.bg} p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{p.icon}</span>
                      <div>
                        <p className={`font-bold text-sm ${p.textColor}`}>{p.label}</p>
                        <code className={`text-xs opacity-70 ${p.textColor}`}>{p.storeSlice}</code>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {p.storeFields.map(f => (
                        <li key={f} className={`text-xs flex items-center gap-1.5 ${p.textColor} opacity-80`}>
                          <span className="opacity-50">▸</span>
                          <code>{f}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {/* Extra: common fields */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🔗</span>
                    <div>
                      <p className="font-bold text-sm text-slate-700">All Slices (common)</p>
                      <code className="text-xs opacity-70 text-slate-500">shared structure</code>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {['step: number', 'owner: {name, phone, email}', 'loading: boolean', 'plans: Plan[]', 'selectedPlanId: string | null'].map(f => (
                      <li key={f} className="text-xs flex items-center gap-1.5 text-slate-600">
                        <span className="opacity-50">▸</span>
                        <code>{f}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* File structure */}
            <div className="card p-5">
              <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2">
                <Layers size={16} className="text-teal-500" /> Project File Structure
              </h3>
              <pre className="text-xs text-slate-600 leading-6 overflow-x-auto">{`insureflow/
├── api/                     FastAPI backend
│   ├── main.py              App entry, CORS config
│   ├── schemas.py           Pydantic request/response models
│   └── routers/
│       ├── motor.py         Pricing engine + vehicle lookup
│       ├── policies.py      Policy CRUD
│       └── claims.py        Claim filing + tracking
│
└── frontend/src/
    ├── App.tsx              18 routes
    ├── store/
    │   ├── quoteSlice.ts    Car + Bike state
    │   ├── healthSlice.ts   Health state
    │   └── termSlice.ts     Term state
    └── pages/
        ├── Home/            Landing page
        ├── Motor/           Car (QuoteFlow, Results, Proposal, Success)
        ├── Bike/            Bike (QuoteFlow only — reuses Motor pages)
        ├── Health/          Health (QuoteFlow, Results, Proposal)
        ├── Term/            Term (QuoteFlow, Results, Proposal)
        ├── Dashboard/       Policy list + claims tab
        ├── Claims/          File + track claims
        └── Docs/            This page`}</pre>
            </div>
          </div>
        )}

        {/* ── Tab 2: API Reference ── */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-navy-900 mb-1">API Reference</h2>
              <p className="text-sm text-slate-500">FastAPI backend · runs on <code className="bg-slate-100 px-1.5 py-0.5 rounded text-navy-700">localhost:8000</code> · Swagger UI at <code className="bg-slate-100 px-1.5 py-0.5 rounded text-navy-700">/docs</code></p>
            </div>

            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Method</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Endpoint</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {API_ENDPOINTS.map(ep => (
                    <tr key={ep.path} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className={`badge text-xs font-bold ${ep.badge}`}>{ep.method}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-navy-700">{ep.path}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{ep.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Request example */}
            <div className="card overflow-hidden">
              <div className="bg-navy-900 px-4 py-3 flex items-center gap-2">
                <span className="badge bg-teal-500 text-white text-xs">POST</span>
                <code className="text-white text-sm">/api/motor/quote</code>
              </div>
              <div className="grid md:grid-cols-2 divide-x divide-slate-100">
                <div className="p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Request Body</p>
                  <pre className="text-xs text-slate-700 leading-5">{`{
  "vehicle": {
    "make": "Maruti Suzuki",
    "model": "Swift",
    "year": 2022,
    "fuel_type": "Petrol",
    "city": "Mumbai"
  },
  "coverage_type": "comprehensive",
  "ncb_percent": 20,
  "idv": 650000
}`}</pre>
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Response</p>
                  <pre className="text-xs text-slate-700 leading-5">{`{
  "quote_id": "uuid",
  "idv_min": 455000,
  "idv_max": 845000,
  "plans": [{
    "id": "hdfc-ergo-a1b2",
    "insurer_name": "HDFC ERGO",
    "premium": 12450,
    "breakup": {
      "base_premium": 9200,
      "ncb_discount": 1150,
      "gst": 2600,
      "total": 12450
    },
    "claim_settlement_ratio": 98.2,
    "cashless_garages": 6900
  }]
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Pricing Engine ── */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-navy-900 mb-1">Motor Pricing Engine</h2>
              <p className="text-sm text-slate-500">The backend computes real premiums based on vehicle age, IDV, NCB, coverage type and applies GST</p>
            </div>

            <PricingFormula />

            {/* Insurer base rates */}
            <div className="card overflow-hidden">
              <div className="bg-navy-900 px-4 py-3">
                <p className="text-white font-bold text-sm">Insurer Base Rates (% of IDV)</p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Insurer</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Base Rate</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">CSR</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cashless Garages</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: 'HDFC ERGO', rate: '1.80%', csr: '98.2%', garages: '6,900' },
                    { name: 'ICICI Lombard', rate: '2.10%', csr: '97.8%', garages: '8,500' },
                    { name: 'Tata AIG', rate: '1.55%', csr: '96.4%', garages: '5,500' },
                    { name: 'ACKO', rate: '1.30%', csr: '95.1%', garages: '1,900' },
                  ].map(r => (
                    <tr key={r.name} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-navy-900 text-sm">{r.name}</td>
                      <td className="px-4 py-3 font-mono text-teal-700 text-sm">{r.rate}</td>
                      <td className="px-4 py-3 text-sm">{r.csr}</td>
                      <td className="px-4 py-3 text-sm">{r.garages}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* NCB table */}
            <div className="card overflow-hidden">
              <div className="bg-teal-600 px-4 py-3">
                <p className="text-white font-bold text-sm">NCB (No Claim Bonus) Discount Rates</p>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-slate-100">
                {[
                  { years: 'New/Claimed', pct: '0%' },
                  { years: '1 yr clean', pct: '20%' },
                  { years: '2 yrs clean', pct: '25%' },
                  { years: '3 yrs clean', pct: '35%' },
                  { years: '4 yrs clean', pct: '45%' },
                  { years: '5+ yrs clean', pct: '50%' },
                ].map(r => (
                  <div key={r.pct} className="p-3 text-center">
                    <p className="text-lg font-bold text-teal-600">{r.pct}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{r.years}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status: BE connected? */}
            <div className="card p-5 bg-amber-50 border-amber-100">
              <p className="font-bold text-amber-700 text-sm mb-2">⚠️ Current Status: Backend Not Wired</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                The frontend currently uses hardcoded <code className="bg-amber-100 px-1 rounded">MOCK_PLANS</code> from <code className="bg-amber-100 px-1 rounded">mockData.ts</code>.
                The FastAPI backend runs independently at <code className="bg-amber-100 px-1 rounded">localhost:8000</code> but receives no calls.
                To connect: replace the <code className="bg-amber-100 px-1 rounded">setTimeout + MOCK_PLANS</code> in each QuoteFlow with a real
                <code className="bg-amber-100 px-1 rounded mx-1">fetch('/api/motor/quote', ...)</code> call.
              </p>
            </div>
          </div>
        )}

        {/* Quick nav to live pages */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Quick Navigation</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '🏠 Home', route: '/' },
              { label: '🚗 Car Quote', route: '/motor/quote' },
              { label: '🏍️ Bike Quote', route: '/bike/quote' },
              { label: '🏥 Health Quote', route: '/health/quote' },
              { label: '💎 Term Quote', route: '/term/quote' },
              { label: '📁 Dashboard', route: '/dashboard' },
              { label: '🩺 Claims', route: '/claims' },
            ].map(link => (
              <button key={link.route} onClick={() => navigate(link.route)}
                className="flex items-center gap-1.5 btn-ghost text-xs">
                {link.label} <ArrowRight size={11} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
