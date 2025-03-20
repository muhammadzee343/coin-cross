"use client"; // Ensure this runs on the client-side

import { Input } from "@/components/ui/Input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeWeb3Auth, loginWithEmail } from "../../../utils/web3auth";
import PuffLoader from "react-spinners/PuffLoader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [web3authReady, setWeb3authReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // ✅ Check sessionStorage for JWT and redirect if user is already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("jwtToken");
      if (storedToken) {
        router.replace("/home"); // Redirect to home if token exists
      }
    }
  }, [router]);

  // ✅ Initialize Web3Auth only once when the component mounts
  useEffect(() => {
    let isMounted = true;
    if (typeof window !== "undefined") {
      const initWeb3Auth = async () => {
        try {
          await initializeWeb3Auth();
          if (isMounted) setWeb3authReady(true);
        } catch (error) {
          console.error("Error initializing Web3Auth:", error);
        }
      };
      initWeb3Auth();
    }

    return () => { isMounted = false }; // Cleanup
  }, []);

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
        sessionStorage.setItem("jwtToken", jwtResponse.jwt);
        sessionStorage.setItem("hasAuthToken", "true");
        setIsLoading(false);

        // ✅ Force the page to reload after successful login
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
