"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { executeSell } from "../features/purchaseSlice";

export const useExecuteSell = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data, error } = useSelector((state: RootState) => state.purchase);

  const completeSell = (signedTransactions: Record<string, string>, userId: string, publicKey: string, token: string) => {
    return dispatch(executeSell({ signedTransactions, userId, publicKey, token })).unwrap();
  };

  return { loading, data, error, completeSell };
};
