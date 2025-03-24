// "use client"

// import { initializeWeb3Auth } from "@/utils/web3auth";
// import { logoutUser } from "../features/authSlice";
// import { useAppDispatch, useAppSelector } from "../hooks";
// import { RootState } from "../store";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { PublicKey } from "@solana/web3.js";

// export const useAuth = () => {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const { isAuthenticated, isLoading, error } = useAppSelector((state: RootState) => state.auth);

//   const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedPublicKey = sessionStorage.getItem("publicKey");
//       const storedToken = sessionStorage.getItem("jwtToken");

//       if (storedPublicKey) {
//         setPublicKey(new PublicKey(storedPublicKey));
//       }
//       if (storedToken) {
//         setToken(storedToken);
//       }
//     }
//   }, []);

//   const logout = async () => {
//     dispatch(logoutUser());
//     await initializeWeb3Auth();
//     router.replace("/login");
//   };

//   useEffect(() => {
//     if (!isAuthenticated) {
//       initializeWeb3Auth();
//     }
//   }, [isAuthenticated]);

//   return { isAuthenticated, isLoading, error, logout, publicKey, token };
// };

// src/hooks/useAuth.ts
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  logoutSuccess,
  updateWallets,
} from "../features/authSlice";
import { MouseEvent } from "react";

export const useAuth = () => {
  const { login, logout, user, linkWallet, unlinkWallet, ready: privyReady } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const dispatch = useDispatch();
  
  // Check if wallet is already linked
  const isWalletLinked = (address: string) => {
    return user?.linkedAccounts?.some(
      (account: any) => account.address.toLowerCase() === address.toLowerCase()
    );
  };

  const handleLogin = async () => {
    try {
      await login();
      if (user) {
        dispatch(loginSuccess(user));
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutSuccess());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLinkWallet = async (e?: MouseEvent) => {
    try {
      await linkWallet();
      
      if (user) {
        dispatch(loginSuccess(user));
      }
    } catch (error) {
      console.error("Link wallet error:", error);
    }
  };

  const handleUnlinkWallet = async (walletAddress: string) => {
    try {
      await unlinkWallet(walletAddress);
      if (user) {
        dispatch(loginSuccess(user));
      }
    } catch (error) {
      console.error("Unlink wallet error:", error);
    }
  };

  const getAllWallets = () => {
    if (!wallets || wallets.length === 0) {
      return {
        embeddedWallets: [],
        externalWallets: [],
        allWallets: []
      };
    }

    const embeddedWallets = wallets.filter(wallet => wallet.walletClientType === 'privy');
    const externalWallets = wallets.filter(wallet => wallet.walletClientType !== 'privy');
    
    const formattedWallets = [...embeddedWallets, ...externalWallets].map(wallet => ({
      address: wallet.address,
      chainName: wallet.chainId as string,
      walletType: wallet.walletClientType === 'privy' ? 'embedded' as const : 'external' as const
    }));
    
    dispatch(updateWallets(formattedWallets));
    
    return {
      embeddedWallets,
      externalWallets,
      allWallets: wallets
    };
  };

  return {
    user,
    wallets,
    isReady: privyReady && walletsReady,
    handleLogin,
    handleLogout,
    handleLinkWallet,
    handleUnlinkWallet,
    isWalletLinked,
    getAllWallets,
  };
};