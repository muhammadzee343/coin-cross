"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

const API_URL = "https://api.coin-crush.com/v1/solana/tokenAccounts";

interface TokenAccount {
  mint: string;
  uiAmount: number;
  decimals: number;
}

interface SolanaState {
  tokenAccounts: TokenAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: SolanaState = {
  tokenAccounts: [],
  loading: false,
  error: null,
};

export const fetchTokenAccounts = createAsyncThunk(
  "solana/fetchTokenAccounts",
  async (
    { publicKey, jwtToken }: { publicKey: string; jwtToken: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}?publicKey=${publicKey}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data?.tokenAccounts;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const solanaSlice = createSlice({
  name: "solana",
  initialState,
  reducers: {
    clearTokenAccounts: (state) => {
      state.tokenAccounts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTokenAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.tokenAccounts = action.payload;
      })
      .addCase(fetchTokenAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      });
  },
});

export const { clearTokenAccounts } = solanaSlice.actions;
export const selectTokenAccounts = (state: RootState) =>
  state.solana.tokenAccounts;
export default solanaSlice.reducer;
