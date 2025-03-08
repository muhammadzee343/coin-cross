"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { executeBuy } from "../features/purchaseSlice";

export const useExecuteBuy = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data, error } = useSelector((state: RootState) => state.purchase);

  const completePurchase = (signedTransactions: Record<string, string>, userId: string, publicKey: string, token: string) => {
    return dispatch(executeBuy({ signedTransactions, userId, publicKey, token })).unwrap();
  };

  return { loading, data, error, completePurchase };
};
