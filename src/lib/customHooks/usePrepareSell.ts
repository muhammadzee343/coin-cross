"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { prepareSell } from "../features/purchaseSlice";

export const usePrepareSell = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data, error } = useSelector((state: RootState) => state.purchase);

  const initiateSell = (publicKey: string, mints: string[], sellPercentage: number, token: string) => {
    return dispatch(prepareSell({ publicKey, mints, sellPercentage, token })).unwrap(); 
  };

  return { loading, data, error, initiateSell };
};
