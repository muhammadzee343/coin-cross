import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const PREPARE_Buy_URL = "https://api.coin-crush.com/v1/purchase/prepareBuy";
const EXECUTE_Buy_URL = "https://api.coin-crush.com/v1/purchase/executeBuy";
const PREPARE_SELL_URL = "https://api.coin-crush.com/v1/purchase/prepareSell";
const EXECUTE_SELL_URL = "https://api.coin-crush.com/v1/purchase/executeSell";

interface TransactionResult {
  success: boolean;
  txid?: string;
  error?: string;
}

interface PurchaseState {
  transactions: Record<string, string>;
  signedTransactions: Record<string, string>; 
  results: Record<string, TransactionResult>;
  isPurchaseLoading: boolean;
  isSellLoading: boolean;
  tradeError: string | null;
}

const initialState: PurchaseState = {
  transactions: {},
  signedTransactions: {},
  results: {},
  isPurchaseLoading: false,
  isSellLoading: false,
  tradeError: null,
};

export const prepareBuy = createAsyncThunk(
  "purchase/prepareBuy",
  async ({ publicKey, mints, amountPerPurchaseUsdc, jwtToken }: { publicKey: string; mints: string[]; amountPerPurchaseUsdc: number, jwtToken: string }) => {
    const response = await axios.post(PREPARE_Buy_URL, { publicKey, mints, amountPerPurchaseUsdc }, { headers: { Authorization: `Bearer ${jwtToken}` } });
    return response.data.transactions;
  }
);

export const executeBuy = createAsyncThunk(
  "purchase/executeBuy",
  async ({   signedTransactions, userId, publicKey, jwtToken }: { signedTransactions: Record<string, string>; userId: string; publicKey: string, jwtToken: string }) => {
    const response = await axios.post(EXECUTE_Buy_URL, { signedTransactions, userId, publicKey }, { headers: { Authorization: `Bearer ${jwtToken}` } });
    return response.data.results;
  }
);

export const prepareSell = createAsyncThunk(
  "purchase/prepareSell",
  async ({ publicKey, mints, sellPercentage, jwtToken }: { publicKey: string; mints: string[]; sellPercentage: number, jwtToken: string }) => {
    const response = await axios.post(PREPARE_SELL_URL, { publicKey, mints, sellPercentage }, { headers: { Authorization: `Bearer ${jwtToken}` } });
    return response.data.transactions;
  }
);

export const executeSell = createAsyncThunk(
  "purchase/executeSell",
  async ({ signedTransactions, userId, publicKey, jwtToken }: { signedTransactions: Record<string, string>; userId: string; publicKey: string, jwtToken: string }) => {
    const response = await axios.post(EXECUTE_SELL_URL, { signedTransactions, userId, publicKey }, { headers: { Authorization: `Bearer ${jwtToken}` } });
    return response.data.results;
  }
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    setSignedTransactions: (state, action: PayloadAction<Record<string, string>>) => {
      state.signedTransactions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(prepareBuy.pending, (state) => {
        state.isPurchaseLoading = true;
        state.tradeError = null;
      })
      .addCase(prepareBuy.fulfilled, (state, action) => {
        state.isPurchaseLoading = false;
        state.transactions = action.payload;
      })
      .addCase(prepareBuy.rejected, (state, action) => {
        state.isPurchaseLoading = false;
        state.tradeError = action.error.message || "Failed to prepare transactions.";
      })
      .addCase(executeBuy.pending, (state) => {
        state.isPurchaseLoading = true;
        state.tradeError = null;
      })
      .addCase(executeBuy.fulfilled, (state, action) => {
        state.isPurchaseLoading = false;
        state.results = action.payload;
      })
      .addCase(executeBuy.rejected, (state, action) => {
        state.isPurchaseLoading = false;
        state.tradeError = action.error.message || "Failed to execute transactions.";
      })
      .addCase(prepareSell.pending, (state) => {
        state.isSellLoading = true;
        state.tradeError = null;
      })
      .addCase(prepareSell.fulfilled, (state, action) => {
        state.isSellLoading = false;
        state.transactions = action.payload;
      })
      .addCase(prepareSell.rejected, (state, action) => {
        state.isSellLoading = false;
        state.tradeError = action.error.message || "Failed to prepare transactions.";
      })
      .addCase(executeSell.pending, (state) => {
        state.isSellLoading = true;
        state.tradeError = null;
      })
      .addCase(executeSell.fulfilled, (state, action) => {
        state.isSellLoading = false;
        state.results = action.payload;
      })
      .addCase(executeSell.rejected, (state, action) => {
        state.isSellLoading = false;
        state.tradeError = action.error.message || "Failed to execute transactions.";
      });
  },
});

export const { setSignedTransactions } = purchaseSlice.actions;
export default purchaseSlice.reducer;
