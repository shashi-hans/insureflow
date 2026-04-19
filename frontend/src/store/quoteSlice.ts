import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { QuoteFlowState, VehicleDetails, QuoteConfig, InsurancePlan } from '../types'

const initialState: QuoteFlowState = {
  step: 1,
  vehicle: {},
  config: {
    vehicleType: 'car',
    policyType: 'renewal',
    coverageType: 'comprehensive',
    ncbPercent: 20,
    idv: 650000,
    addons: [],
    claimedLastYear: false,
  },
  owner: { name: '', phone: '', email: '' },
  loading: false,
  plans: [],
  selectedPlanId: null,
}

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setStep: (s, a: PayloadAction<number>) => { s.step = a.payload },
    nextStep: (s) => { if (s.step < 4) s.step++ },
    prevStep: (s) => { if (s.step > 1) s.step-- },
    setVehicle: (s, a: PayloadAction<Partial<VehicleDetails>>) => {
      s.vehicle = { ...s.vehicle, ...a.payload }
    },
    setConfig: (s, a: PayloadAction<Partial<QuoteConfig>>) => {
      s.config = { ...s.config, ...a.payload }
    },
    toggleAddon: (s, a: PayloadAction<string>) => {
      const addons = s.config.addons ?? []
      s.config.addons = addons.includes(a.payload)
        ? addons.filter(x => x !== a.payload)
        : [...addons, a.payload]
    },
    setOwner: (s, a: PayloadAction<{ name?: string; phone?: string; email?: string }>) => {
      s.owner = { ...s.owner, ...a.payload }
    },
    setPlans: (s, a: PayloadAction<InsurancePlan[]>) => { s.plans = a.payload },
    setLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload },
    selectPlan: (s, a: PayloadAction<string>) => { s.selectedPlanId = a.payload },
    setIdv: (s, a: PayloadAction<number>) => { s.config.idv = a.payload },
    resetFlow: () => initialState,
  },
})

export const {
  setStep, nextStep, prevStep,
  setVehicle, setConfig, toggleAddon,
  setOwner, setPlans, setLoading,
  selectPlan, setIdv, resetFlow,
} = quoteSlice.actions

export default quoteSlice.reducer
