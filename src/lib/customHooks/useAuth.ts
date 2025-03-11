"use client"

import { initializeWeb3Auth } from "@/utils/web3auth";
import { logoutUser } from "../features/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, isLoading, error } = useAppSelector((state: RootState) => state.auth);

  const logout = async () => {
    dispatch(logoutUser());
    await initializeWeb3Auth(); 
    router.replace("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      initializeWeb3Auth();
    }
  }, [isAuthenticated]);

  return { isAuthenticated, isLoading, error, logout };
};
