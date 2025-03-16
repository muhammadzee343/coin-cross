"use client"

import { initializeWeb3Auth } from "@/utils/web3auth";
import { logoutUser } from "../features/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, isLoading, error } = useAppSelector((state: RootState) => state.auth);

  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPublicKey = localStorage.getItem("publicKey");
      const storedToken = localStorage.getItem("jwtToken");
      
      if (storedPublicKey) {
        setPublicKey(new PublicKey(storedPublicKey));
      }
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

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

  return { isAuthenticated, isLoading, error, logout, publicKey, token };
};
