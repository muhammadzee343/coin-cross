"use client";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

const API_URL = 'https://api.coin-crush.com/v1/coins/fresh';

interface CoinsState {
  coins: any[];
  loading: boolean;
  error: string | null;
  page: number; 
  hasMore: boolean; 
}

const initialState: CoinsState = {
  coins: [],
  loading: false,
  error: null,
  page: 1, 
  hasMore: true,
};


export const fetchCoins = createAsyncThunk(
  'coins/fetchCoins',
  async (
    { userId, swipedCoinIds, limit, token, page }: { userId: string; swipedCoinIds: string[]; limit: number; token: string; page: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, swipedCoinIds, limit, page }),
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

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    clearCoins: (state) => {
      state.coins = [];
      state.page = 1; 
      state.hasMore = true; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.coins = action.payload;
        } else {
          state.coins = [...state.coins, ...action.payload];
        }
        
        state.hasMore = action.payload.length >= action.meta.arg.limit;
        state.page = action.meta.arg.page + 1;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Something went wrong';
      });
  },
});

export const { clearCoins } = coinsSlice.actions;
export const selectCoins = (state: RootState) => state.coins.coins;
export const selectHasMore = (state: RootState) => state.coins.hasMore;
export default coinsSlice.reducer;