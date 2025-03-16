"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const REFRESH_PORTFOLIO_URL =
  "https://api.coin-crush.com/v1/solana/refreshPortfolio";

interface PortfolioState {
  loading: boolean;
  data: any;
  error: string | null;
}

const initialState: PortfolioState = {
  loading: false,
  data: null,
  error: null,
};

export const refreshPortfolio = createAsyncThunk(
  "portfolio/refreshPortfolio",
  async (
    { publicKey, token }: { publicKey: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${REFRESH_PORTFOLIO_URL}?publicKey=${publicKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(refreshPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default portfolioSlice.reducer;
