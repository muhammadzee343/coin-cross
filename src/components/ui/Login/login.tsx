"use client";
import { Input } from "@/components/ui/Input";
import React, { useEffect, useState, useRef } from "react";
import { FaLessThan } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { initializeWeb3Auth, loginWithEmail } from "../../../utils/web3auth";
import PuffLoader from "react-spinners/PuffLoader";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        platform: string;
        close: () => void;
        version: string;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        ready: () => void;
        enableClosingConfirmation: () => void;
        onEvent: (event: string, callback: () => void) => void;
        expand: () => void;
        offEvent: (event: string) => void;
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

  const MiniAppHandler = () => {
    const router = useRouter();
  
    useEffect(() => {
      if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        // Clear mini app state on initial load
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.setHeaderColor('#your_color');
        window.Telegram.WebApp.enableClosingConfirmation();
  
        // Add viewport change handler
        window.Telegram.WebApp.onEvent('viewportChanged', () => {
          // Force reload when viewport changes (simulates restart)
          router.replace('/?cache=' + Date.now());
        });
  
        // Check for fresh start
        if (!sessionStorage.getItem('miniAppRestarted')) {
          sessionStorage.setItem('miniAppRestarted', 'true');
          window.Telegram.WebApp.expand();
        }
      }
  
      return () => {
        if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
          window.Telegram.WebApp.offEvent('viewportChanged');
        }
      };
    }, [router]);
  
    return null;
  };

  useEffect(() => {
    let isMounted = true;

    // const initWeb3Auth = async () => {
    //   if (!isInitialized.current && isMounted) {
    //     try {
    //       await initializeWeb3Auth();
    //       setWeb3authReady(true);
    //       isInitialized.current = true;
    //     } catch (error) {
    //       console.error("Error initializing Web3Auth:", error);
    //     }
    //   }
    // };

    const initWeb3Auth = async () => {
      try {
        await initializeWeb3Auth();
        if (isMounted) {
          setWeb3authReady(true);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    initWeb3Auth();

    // Check if user is already authenticated
    if (typeof window !== "undefined") {
      setJwtToken(localStorage.getItem("jwtToken"));
    }
    if (jwtToken) {
      router.replace("/home");
    }

    return () => {
      isMounted = false;
    };
  }, [router]);

  const isPopupBlocked = (error: unknown): boolean => {
    return (
      error instanceof Error && 
      /(popup closed|blocked)/i.test(error.message)
    );
  };

  const sendOtp = async () => {
    try {
      setIsLoading(true);

      const jwtResponse = await loginWithEmail(email);

      if (jwtResponse && jwtResponse.jwt) {
        if (typeof window !== "undefined") {
          localStorage.setItem("jwtToken", jwtResponse.jwt);
          localStorage.setItem("hasAuthToken", "true");
        }

        setIsLoading(false);

        router.replace("/home");
      } else {
        throw new Error("Failed to get JWT token");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setIsLoading(false);
      if (isPopupBlocked(error)) {
        alert("Please disable popup blockers for this site");
      }
    }
  };

  return (
    <div className="flex flex-col justify-between h-full flex-1 mt-[25px]">
      <MiniAppHandler />
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
