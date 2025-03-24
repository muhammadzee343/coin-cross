"use client";
import { Input } from "@/components/ui/Input";
import React, { useEffect, useState, useRef } from "react";
import { FaLessThan } from "react-icons/fa";
import { useRouter } from "next/navigation";
import PuffLoader from "react-spinners/PuffLoader";
import { useAuth } from "@/lib/customHooks/useAuth";
import { usePrivy } from "@privy-io/react-auth";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        init: () => void;
      };
    };
  }
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { user, handleLogin, handleLogout } = useAuth();
  const { authenticated, getAccessToken } = usePrivy();

  const router = useRouter();

  async function exchangeTokenForJWT(privyToken: string) {
    const response = await fetch("https://api.coin-crush.com/v1/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: user?.wallet?.address,
        email: user?.email?.address,
        web3AuthToken: privyToken,
        isDemoUser: "isDemoUser",
        privyToken: privyToken,
      }),
    });

    if (!response.ok) throw new Error("Token exchange failed");

    const authResponse = await response.json();
    if (authResponse?.token && user) {
      localStorage.setItem("jwtToken", authResponse.token);
      localStorage.setItem("hasAuthToken", "true");
      localStorage.setItem("userId", user?.id || "");
      localStorage.setItem("walletAddress", user?.wallet?.address || "");
      localStorage.setItem("publicKey", user?.wallet?.address || "");
      router.push("/home");
    }
  }

  useEffect(() => {
    const fetchToken = async () => {
      if (authenticated) {
        try {
          const token = await getAccessToken();
          if (token && user) {
            exchangeTokenForJWT(token);
          }
        } catch (error) {
          console.error("Error fetching Privy access token:", error);
        }
      }
    };

    fetchToken();
  }, [authenticated, user]);

  const onLoginClick = async () => {
    setLoading(true);
    try {
      await handleLogin();
    } finally {
      setLoading(false);
    }
  };

  const onLogoutClick = async () => {
    setLoading(true);
    try {
      await handleLogout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full flex-1 mt-[25px]">
      <div className="flex flex-row gap-2">
        <FaLessThan className="text-primary-purple" />
        <p
          className="md:text-[17px] sm:text-[15px] font-inter font-normal text-primary-purple leading-tight md:pb-8 pb-4"
          onClick={() => router.replace("/")}
        >
          Back
        </p>
      </div>
      <div className="w-full flex justify-center mt-20">
        <div className="w-[70%]">
          <h1 className="text-center text-[40px] leading-none text-primary-white">
            Welcome to Coin Crush
          </h1>
        </div>
      </div>

      <button
        onClick={onLoginClick}
        className="bg-primary-purple font-normal text-md py-4 rounded-md mt-6 mx-4"
        disabled={loading}
      >
        {"Sign in with Email"}
      </button>
      <button
        onClick={onLogoutClick}
        className="bg-primary-purple font-normal text-md py-4 rounded-md mt-6 mx-4"
        disabled={loading}
      >
        {"Logout with Email"}
      </button>

      {loading && (
        <div className="mt-10 flex justify-center">
          <PuffLoader color="#fff" />
        </div>
      )}
    </div>
  );
}
