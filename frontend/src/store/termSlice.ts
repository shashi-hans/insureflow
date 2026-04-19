import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TermPlan {
  id: string
  insurerName: string
  insurerSlug: string
  monthlyPremium: number
  annualPremium: number
  coverAmount: number       // in rupees
  claimSettlementRatio: number
  features: string[]
  recommended?: boolean
  tags: string[]
  coverages: Record<string, boolean | string>
}

export interface TermFlowState {
  step: number
  dob: string
  gender: 'male' | 'female'
  smoker: boolean
  annualIncome: number
  coverAmount: number     // in rupees
  tenure: number          // years
  paymentTerm: 'regular' | 'limited' | 'single'
  owner: { name: string; phone: string; email: string }
  loading: boolean
  plans: TermPlan[]
  selectedPlanId: string | null
}

const initialState: TermFlowState = {
  step: 1,
  dob: '',
  gender: 'male',
  smoker: false,
  annualIncome: 1000000,
  coverAmount: 10000000,
  tenure: 30,
  paymentTerm: 'regular',
  owner: { name: '', phone: '', email: '' },
  loading: false,
  plans: [],
  selectedPlanId: null,
}

const termSlice = createSlice({
  name: 'term',
  initialState,
  reducers: {
    setTermStep: (s, a: PayloadAction<number>) => { s.step = a.payload },
    nextTermStep: (s) => { if (s.step < 3) s.step++ },
    prevTermStep: (s) => { if (s.step > 1) s.step-- },
    setTermPersonal: (s, a: PayloadAction<Partial<Pick<TermFlowState, 'dob' | 'gender' | 'smoker' | 'annualIncome'>>>) => {
      Object.assign(s, a.payload)
    },
    setTermCoverage: (s, a: PayloadAction<Partial<Pick<TermFlowState, 'coverAmount' | 'tenure' | 'paymentTerm'>>>) => {
      Object.assign(s, a.payload)
    },
    setTermOwner: (s, a: PayloadAction<Partial<TermFlowState['owner']>>) => { s.owner = { ...s.owner, ...a.payload } },
    setTermPlans: (s, a: PayloadAction<TermPlan[]>) => { s.plans = a.payload },
    setTermLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload },
    selectTermPlan: (s, a: PayloadAction<string>) => { s.selectedPlanId = a.payload },
    resetTerm: () => initialState,
  },
})

export const {
  setTermStep, nextTermStep, prevTermStep,
  setTermPersonal, setTermCoverage, setTermOwner,
  setTermPlans, setTermLoading, selectTermPlan, resetTerm,
} = termSlice.actions

export default termSlice.reducer
