// lib/store.ts
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import coinsReducer from './features/coinsSlice'
import purchaseReducer from './features/purchaseSlice'
import portfolioReducer from './features/portfolioSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      coins: coinsReducer,
      purchase: purchaseReducer,
      portfolio: portfolioReducer,
    }, // Add your reducers here
  })
}

// Types for better TypeScript support
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
