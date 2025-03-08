"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const PREPARE_BUY_URL = "https://api.coin-crush.com/v1/purchase/prepareBuy";
const EXECUTE_BUY_URL = "https://api.coin-crush.com/v1/purchase/executeBuy";
const PREPARE_SELL_URL = "https://api.coin-crush.com/v1/purchase/prepareSell";
const EXECUTE_SELL_URL = "https://api.coin-crush.com/v1/purchase/executeSell";

interface PurchaseState {
  loading: boolean;
  data: any;
  error: string | null;
  executeLoading: boolean;
  executeData: any;
  executeError: string | null;
}

// Initial state
const initialState: PurchaseState = {
  loading: false,
  data: null,
  error: null,
  executeLoading: false,
  executeData: null,
  executeError: null,
};

// Async thunk for prepareBuy
export const prepareBuy = createAsyncThunk(
  "purchase/prepareBuy",
  async (
    {
      publicKey,
      mints,
      amountPerPurchaseUsdc,
      token,
    }: {
      publicKey: string;
      mints: string[];
      amountPerPurchaseUsdc: number;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(PREPARE_BUY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ publicKey, mints, amountPerPurchaseUsdc }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for executeBuy
export const executeBuy = createAsyncThunk(
  "purchase/executeBuy",
  async (
    {
      signedTransactions,
      userId,
      publicKey,
      token,
    }: {
      signedTransactions: Record<string, string>;
      userId: string;
      publicKey: string;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(EXECUTE_BUY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ signedTransactions, userId, publicKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for prepareSell
export const prepareSell = createAsyncThunk(
  "purchase/prepareSell",
  async (
    {
      publicKey,
      mints,
      sellPercentage,
      token,
    }: {
      publicKey: string;
      mints: string[];
      sellPercentage: number;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(PREPARE_SELL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ publicKey, mints, sellPercentage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for executeSell
export const executeSell = createAsyncThunk(
  "purchase/executeSell",
  async (
    {
      signedTransactions,
      userId,
      publicKey,
      token,
    }: {
      signedTransactions: Record<string, string>;
      userId: string;
      publicKey: string;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(EXECUTE_SELL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ signedTransactions, userId, publicKey }), // Fix applied here
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create slice
const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Prepare Buy
      .addCase(prepareBuy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(prepareBuy.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(prepareBuy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Execute Buy
      .addCase(executeBuy.pending, (state) => {
        state.executeLoading = true;
        state.executeError = null;
      })
      .addCase(executeBuy.fulfilled, (state, action) => {
        state.executeLoading = false;
        state.executeData = action.payload;
      })
      .addCase(executeBuy.rejected, (state, action) => {
        state.executeLoading = false;
        state.executeError = action.payload as string;
      })

      // Prepare Sell
      .addCase(prepareSell.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(prepareSell.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(prepareSell.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Execute Sell
      .addCase(executeSell.pending, (state) => {
        state.executeLoading = true;
        state.executeError = null;
      })
      .addCase(executeSell.fulfilled, (state, action) => {
        state.executeLoading = false;
        state.executeData = action.payload;
      })
      .addCase(executeSell.rejected, (state, action) => {
        state.executeLoading = false;
        state.executeError = action.payload as string;
      });
  },
});

export default purchaseSlice.reducer;
