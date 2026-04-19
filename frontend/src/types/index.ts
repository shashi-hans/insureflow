// ── Product types ──────────────────────────────────────────────────────────
export type ProductType = 'motor' | 'health' | 'travel' | 'life'
export type CoverageType = 'comprehensive' | 'third_party' | 'own_damage'
export type VehicleType = 'car' | 'bike' | 'commercial'
export type PolicyType = 'new' | 'renewal'

// ── Quote flow ─────────────────────────────────────────────────────────────
export interface VehicleDetails {
  registrationNumber: string
  make: string
  model: string
  variant: string
  year: number
  fuelType: string
  city: string
}

export interface QuoteConfig {
  vehicleType: VehicleType
  policyType: PolicyType
  coverageType: CoverageType
  ncbPercent: number          // 0 | 20 | 25 | 35 | 45 | 50
  idv: number
  addons: string[]
  claimedLastYear: boolean
}

export interface QuoteRequest {
  vehicle: VehicleDetails
  config: QuoteConfig
  ownerName: string
  ownerPhone: string
  ownerEmail: string
}

// ── Plan / Insurer ─────────────────────────────────────────────────────────
export interface PlanAddon {
  id: string
  name: string
  premium: number
  description: string
  popular?: boolean
}

export interface PremiumBreakup {
  basePremium: number
  addonPremium: number
  ncbDiscount: number
  gst: number
  total: number
}

export interface InsurancePlan {
  id: string
  insurerSlug: string
  insurerName: string
  insurerLogo: string
          // colour for the insurer brand
  coverageType: CoverageType
  idv: number
  premium: number
  breakup: PremiumBreakup
  claimSettlementRatio: number   // %
  cashlessGarages: number
  coverages: Record<string, boolean | string>
  addons: PlanAddon[]
  recommended?: boolean
  popular?: boolean
  tags: string[]
}

// ── Policy (dashboard) ─────────────────────────────────────────────────────
export type PolicyStatus = 'active' | 'expiring_soon' | 'expired' | 'pending'

export interface Policy {
  id: string
  policyNumber: string
  insurerName: string
  insurerLogo: string
  productType: ProductType
  vehicleNumber?: string
  vehicleName?: string
  status: PolicyStatus
  premium: number
  startDate: string        // ISO
  endDate: string          // ISO
  daysToExpiry: number
  idv?: number
  sumInsured?: number
  policyPdfUrl?: string
}

// ── Claims ────────────────────────────────────────────────────────────────
export type ClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'surveyed'
  | 'approved'
  | 'settled'
  | 'rejected'

export interface Claim {
  id: string
  claimNumber: string
  policyId: string
  policyNumber: string
  insurerName: string
  insurerLogo: string
  incidentDate: string
  filedDate: string
  status: ClaimStatus
  claimAmount: number
  settledAmount?: number
  description: string
  vehicleNumber?: string
  timeline: ClaimTimelineItem[]
}

export interface ClaimTimelineItem {
  step: string
  date?: string
  status: 'done' | 'current' | 'pending'
  description: string
}

// ── UI state ──────────────────────────────────────────────────────────────
export interface QuoteFlowState {
  step: number                   // 1-4
  vehicle: Partial<VehicleDetails>
  config: Partial<QuoteConfig>
  owner: { name: string; phone: string; email: string }
  loading: boolean
  plans: InsurancePlan[]
  selectedPlanId: string | null
}

export interface DashboardState {
  policies: Policy[]
  claims: Claim[]
  loading: boolean
}
