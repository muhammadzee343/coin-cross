"use client"; // Ensure this runs on the client-side

import { Input } from "@/components/ui/Input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeWeb3Auth, loginWithEmail } from "../../../utils/web3auth";
import PuffLoader from "react-spinners/PuffLoader";
import Cookies from "js-cookie";

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
  const [email, setEmail] = useState("");
  const [web3authReady, setWeb3authReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleHashParams = async () => {
      const url = new URL(window.location.href);
      const hashParams = url.hash.substring(1);

      if (hashParams.startsWith("b64Params=")) {
        try {
          const base64String = hashParams.replace("b64Params=", "");
          const decodedString = atob(base64String);
          const parsedParams = JSON.parse(decodedString);

          if (parsedParams.sessionId) {
            // Store session ID in cookies
            Cookies.set("sessionId", parsedParams.sessionId, {
              expires: 1,
              secure: true,
              sameSite: "Strict",
            });

            const jwtResponse = await loginWithEmail(email);


            // Store additional data in cookies
            if(jwtResponse) {
              Cookies.set("jwtToken", jwtResponse.jwt, { expires: 1, secure: true });
          Cookies.set("hasAuthToken", "true", { expires: 1, secure: true });
          Cookies.set("walletAddress", jwtResponse.walletAddress, { expires: 1, secure: true });
          Cookies.set("privateKey", jwtResponse.privateKey, { expires: 1, secure: true });
          Cookies.set("publicKey", jwtResponse.publicKey, { expires: 1, secure: true });
          Cookies.set("userId", jwtResponse.userId || "", { expires: 1, secure: true });
            }

            window.history.replaceState({}, document.title, "/login");
            router.replace("/home");
          }
        } catch (error) {
          console.error("Error handling Telegram redirect:", error);
        }
      }
    };

    if (typeof window !== "undefined") {
      handleHashParams();
    }
  }, [router]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const url = new URL(window.location.href);
  //     const hashParams = url.hash.substring(1); 

  //     if (hashParams.startsWith("b64Params=")) {
  //       try {
  //         const base64String = hashParams.replace("b64Params=", "");
  //         const decodedString = atob(base64String);
  //         const parsedParams = JSON.parse(decodedString);

  //         if (parsedParams.sessionId) {
  //           sessionStorage.setItem("jwtToken", parsedParams.sessionId);
  //           sessionStorage.setItem("hasAuthToken", "true");

  //           window.history.replaceState({}, document.title, "/login");
  //           router.replace("/home");
  //         }
  //       } catch (error) {
  //         console.error("Error parsing b64Params:", error);
  //       }
  //     }
  //   }
  // }, []);

  useEffect(() => {
    let isMounted = true;

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

    // const initializeTelegram = () => {
    //   setTimeout(() => {
    //     if (typeof window !== "undefined" && window.Telegram?.WebApp?.init) {
    //       try {
    //         window.Telegram.WebApp.init();
    //         console.log("Telegram Mini App initialized");
    //       } catch (error) {
    //         console.error("Error initializing Telegram Mini App:", error);
    //       }
    //     } else {
    //       console.warn("Telegram WebApp is not available or init() is missing");
    //     }
    //   }, 500); // Delay initialization by 500ms
    // };

    // initializeTelegram();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // ✅ Function to handle OTP login
  const sendOtp = async () => {
    try {
      if (!web3authReady) {
        console.error("Web3Auth not initialized yet");
        return;
      }

      setIsLoading(true);

      const jwtResponse = await loginWithEmail(email);

      if (jwtResponse && jwtResponse.jwt) {
        // if (typeof window !== "undefined") {
        //   Cookies.set("jwtToken", jwtResponse.jwt, { expires: 1, secure: true });
        //   Cookies.set("hasAuthToken", "true", { expires: 1, secure: true });
        //   Cookies.set("walletAddress", jwtResponse.walletAddress, { expires: 1, secure: true });
        //   Cookies.set("privateKey", jwtResponse.privateKey, { expires: 1, secure: true });
        //   Cookies.set("publicKey", jwtResponse.publicKey, { expires: 1, secure: true });
        //   Cookies.set("userId", jwtResponse.userId || "", { expires: 1, secure: true });
        // }

        router.replace("/home");

        setIsLoading(false);
      } else {
        throw new Error("Failed to get JWT token");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Input
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={sendOtp}
        className="bg-primary-purple p-4 rounded-md mt-4"
      >
        Sign in
      </button>
      {isLoading && <PuffLoader color="#fff" />}
    </div>
  );
}
