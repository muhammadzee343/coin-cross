"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTokenAccounts, clearTokenAccounts } from "../features/solanaSlice";
import { useCallback } from "react";

export const useSolana = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tokenAccounts, loading, error } = useSelector((state: RootState) => state.solana);

  const fetchAccounts = useCallback(
    (publicKey: string, jwtToken: string) => {
      dispatch(fetchTokenAccounts({ publicKey, jwtToken }));
    },
    [dispatch]
  );

  const resetAccounts = () => {
    dispatch(clearTokenAccounts());
  };

  return { tokenAccounts, loading, error, fetchAccounts, resetAccounts };
};
