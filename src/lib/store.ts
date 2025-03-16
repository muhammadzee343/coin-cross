// lib/store.ts
import { configureStore } from '@reduxjs/toolkit'
import coinsReducer from './features/coinsSlice'
import purchaseReducer from './features/tradeCoinSlice'
import portfolioReducer from './features/portfolioSlice'
import authReducer from './features/authSlice'
import transactionReducer from './features/withdrawTransactionSlice'
import solanaReducer from './features/solanaSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      coins: coinsReducer,
      purchase: purchaseReducer,
      portfolio: portfolioReducer,
      auth: authReducer,
      transaction: transactionReducer,
      solana: solanaReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
