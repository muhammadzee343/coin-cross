"use client";
import { Input } from "@/components/ui/Input";
import React, { useEffect, useState, useRef } from "react";
import { FaLessThan } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { initializeWeb3Auth, loginWithEmail, web3auth } from "../../../utils/web3auth";
import PuffLoader from "react-spinners/PuffLoader";
import { WALLET_ADAPTERS } from "@web3auth/base";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        openLink: (url: string) => void;
        close: () => void;
        platform: string;
      };
    };
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [web3authReady, setWeb3authReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const router = useRouter();

  // Add handlePostLogin function
  const handlePostLogin = async (user: any) => {
    try {
      if (user?.jwt) {
        localStorage.setItem("jwtToken", user.jwt);
        localStorage.setItem("hasAuthToken", "true");
        
        // Close WebView if in Telegram
        if (window.Telegram?.WebApp?.close) {
          window.Telegram.WebApp.close();
        } else {
          router.replace("/home");
        }
      }
    } catch (error) {
      console.error("Post-login error:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initWeb3Auth = async () => {
      try {
        await initializeWeb3Auth();
        if (isMounted) {
          setWeb3authReady(true);
        }

        // Handle callback after redirect
        if (window.location.pathname === "/auth-callback") {
          const user = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
            loginProvider: "email_passwordless",
            extraLoginOptions: {
              redirectUrl: window.location.origin + "/auth-callback"
            }
          });
          handlePostLogin(user);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    initWeb3Auth();

    if (typeof window !== "undefined") {
      setJwtToken(localStorage.getItem("jwtToken"));
    }
    if (jwtToken) {
      router.replace("/home");
    }

    return () => {
      isMounted = false;
    };
  }, [router, jwtToken]);

  const sendOtp = async () => {
    try {
      if (!web3authReady) return;
      setIsLoading(true);

      if (window.Telegram?.WebApp?.openLink) {
        const authUrl = await loginWithEmail(email);
        window.Telegram.WebApp.openLink(authUrl as string);
      } else {
        const jwtResponse = await loginWithEmail(email);
        if (typeof jwtResponse !== 'string' && jwtResponse.jwt) {
          localStorage.setItem("jwtToken", jwtResponse.jwt);
          localStorage.setItem("hasAuthToken", "true");
          router.replace("/home");
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setIsLoading(false);
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
            Welcome to Coin
          </h1>
        </div>
      </div>

      <div className="w-full flex justify-center mt-20 px-4">
        <Input
          variant="default"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        onClick={sendOtp}
        className="bg-primary-purple font-normal text-md py-4 rounded-md mt-6 mx-4"
      >
        Sign in with Email Passwordless
      </button>
      {isLoading && (
        <div className="mt-10 flex justify-center">
          <PuffLoader color="#fff" />
        </div>
      )}
    </div>
  );
}
