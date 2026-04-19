import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface HealthMember {
  self: boolean
  spouse: boolean
  kids: number        // 0-4
  father: boolean
  mother: boolean
}

export interface HealthPlan {
  id: string
  insurerName: string
  insurerSlug: string
  premium: number
  sumInsured: number
  cashlessHospitals: number
  claimSettlementRatio: number
  roomRentLimit: string
  waitingPeriod: number   // months
  coPay: number           // %
  recommended?: boolean
  tags: string[]
  coverages: Record<string, boolean | string>
}

export interface HealthFlowState {
  step: number
  members: HealthMember
  ages: { self: number; spouse: number; father: number; mother: number }
  sumInsured: number   // in rupees: 300000, 500000, 1000000, 2500000, 5000000
  city: string
  preExisting: string[]
  owner: { name: string; phone: string; email: string }
  loading: boolean
  plans: HealthPlan[]
  selectedPlanId: string | null
}

const initialState: HealthFlowState = {
  step: 1,
  members: { self: true, spouse: false, kids: 0, father: false, mother: false },
  ages: { self: 30, spouse: 0, father: 0, mother: 0 },
  sumInsured: 500000,
  city: '',
  preExisting: [],
  owner: { name: '', phone: '', email: '' },
  loading: false,
  plans: [],
  selectedPlanId: null,
}

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setHealthStep: (s, a: PayloadAction<number>) => { s.step = a.payload },
    nextHealthStep: (s) => { if (s.step < 4) s.step++ },
    prevHealthStep: (s) => { if (s.step > 1) s.step-- },
    setMembers: (s, a: PayloadAction<Partial<HealthMember>>) => { s.members = { ...s.members, ...a.payload } },
    setAges: (s, a: PayloadAction<Partial<HealthFlowState['ages']>>) => { s.ages = { ...s.ages, ...a.payload } },
    setSumInsured: (s, a: PayloadAction<number>) => { s.sumInsured = a.payload },
    setHealthCity: (s, a: PayloadAction<string>) => { s.city = a.payload },
    togglePreExisting: (s, a: PayloadAction<string>) => {
      s.preExisting = s.preExisting.includes(a.payload)
        ? s.preExisting.filter(x => x !== a.payload)
        : [...s.preExisting, a.payload]
    },
    setHealthOwner: (s, a: PayloadAction<Partial<HealthFlowState['owner']>>) => { s.owner = { ...s.owner, ...a.payload } },
    setHealthPlans: (s, a: PayloadAction<HealthPlan[]>) => { s.plans = a.payload },
    setHealthLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload },
    selectHealthPlan: (s, a: PayloadAction<string>) => { s.selectedPlanId = a.payload },
    resetHealth: () => initialState,
  },
})

export const {
  setHealthStep, nextHealthStep, prevHealthStep,
  setMembers, setAges, setSumInsured, setHealthCity,
  togglePreExisting, setHealthOwner,
  setHealthPlans, setHealthLoading, selectHealthPlan, resetHealth,
} = healthSlice.actions

export default healthSlice.reducer
