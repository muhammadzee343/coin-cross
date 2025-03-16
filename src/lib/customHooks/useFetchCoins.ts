"use client";

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchCoins, clearCoins } from '../features/coinsSlice';
import { useCallback } from 'react';

export const useFetchCoins = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coins, loading, error, hasMore, page } = useSelector((state: RootState) => state.coins);

  const fetchNewCoins = useCallback(
    (userId: string, swipedCoinIds: string[], limit: number, token: string) => {
      dispatch(clearCoins()); // Reset before fetching new coins
      dispatch(fetchCoins({ userId, swipedCoinIds, limit, token, page: 1 })); 
    },
    [dispatch]
  );

  const fetchNextCoins = useCallback(
    (userId: string, swipedCoinIds: string[], limit: number, token: string) => {
      if (hasMore) { 
        dispatch(fetchCoins({ userId, swipedCoinIds, limit, token, page }));
      }
    },
    [dispatch, page, hasMore]
  );

  const resetCoins = () => {
    dispatch(clearCoins());
  };

  return { coins, loading, error, hasMore, fetchNewCoins, fetchNextCoins, resetCoins };
};