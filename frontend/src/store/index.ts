import { configureStore } from '@reduxjs/toolkit'
import quoteReducer from './quoteSlice'
import healthReducer from './healthSlice'
import termReducer from './termSlice'

export const store = configureStore({
  reducer: {
    quote: quoteReducer,
    health: healthReducer,
    term: termReducer,
  },
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
