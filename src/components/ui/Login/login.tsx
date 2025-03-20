"use client";
import { Input } from "@/components/ui/Input";
import React, { useEffect, useState } from "react";
import { FaLessThan } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { initializeWeb3Auth, loginWithEmail } from "../../../utils/web3auth";
import PuffLoader from "react-spinners/PuffLoader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [web3authReady, setWeb3authReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const initWeb3Auth = async () => {
      try {
        await initializeWeb3Auth();
        if (isMounted) setWeb3authReady(true);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    initWeb3Auth();

    if (typeof window !== "undefined") {
      setJwtToken(sessionStorage.getItem("jwtToken"));
    }
    if (jwtToken) router.replace("/home");

    return () => { isMounted = false };
  }, [router]);

  const sendOtp = async () => {
    try {
      if (!web3authReady) {
        console.error("Web3Auth not initialized yet");
        return;
      }

      setIsLoading(true);

      const jwtResponse = await loginWithEmail(email);

      if (jwtResponse && jwtResponse.jwt) {
        sessionStorage.setItem("jwtToken", jwtResponse.jwt);
        sessionStorage.setItem("hasAuthToken", "true");
        setIsLoading(false);
        router.replace("/home");
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
      <Input placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={sendOtp} className="bg-primary-purple p-4 rounded-md mt-4">Sign in</button>
      {isLoading && <PuffLoader color="#fff" />}
    </div>
  );
}
