"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { prepareBuy } from "../features/purchaseSlice";

export const usePrepareBuy = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data, error } = useSelector((state: RootState) => state.purchase);

  const initiatePurchase = (publicKey: string, mints: string[], amountPerPurchaseUsdc: number, token: string) => {
    return dispatch(prepareBuy({ publicKey, mints, amountPerPurchaseUsdc, token })).unwrap(); 
  };

  return { loading, data, error, initiatePurchase };
};
