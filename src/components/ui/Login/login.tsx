"use client";

import { Input } from "@/components/ui/Input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { exchangeTokenForJWT, getWeb3AuthToken, initializeWeb3Auth, loginWithEmail } from "../../../utils/web3auth";
import PuffLoader from "react-spinners/PuffLoader";
import nacl from "tweetnacl";
import bs58 from "bs58";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [web3authReady, setWeb3authReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleHashParams = () => {
      const url = new URL(window.location.href);
      const hashParams = url.hash.substring(1);
      
      if (hashParams.startsWith("b64Params=") && !sessionStorage.getItem("hasAuthToken")) {
        try {
          const base64String = hashParams.replace("b64Params=", "");
          const decodedString = atob(base64String);
          const parsedParams = JSON.parse(decodedString);

          if (parsedParams.sessionId) {
            sessionStorage.setItem("hasAuthToken", "true");
            window.history.replaceState({}, document.title, "/login");
            router.replace("/home");
          }
        } catch (error) {
          console.error("Error parsing b64Params:", error);
        }
      }
    };

    if (typeof window !== "undefined") {
      handleHashParams();
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    const initWeb3Auth = async () => {
      try {
        const web3authInstance = await initializeWeb3Auth();
        if (!isMounted || !web3authInstance) return;

        setWeb3authReady(true);

        // Modified connection handling
        if (web3authInstance.status === 'connected') {
          // Get the existing provider instead of reconnecting
          const provider = web3authInstance.provider;
          
          if (!provider) {
            console.error("No provider available");
            return;
          }

          // Rest of your existing connection handling code
          const userInfo = await web3authInstance.getUserInfo();
          const userEmail = userInfo.email || email;

          const ed25519PrivKeyHex = await provider.request({ 
            method: "private_key" 
          }) as string;
          
          const keyPair = nacl.sign.keyPair.fromSecretKey(
            Buffer.from(ed25519PrivKeyHex, "hex")
          );
          const wallet_address = bs58.encode(keyPair.publicKey);
          const web3AuthToken = await getWeb3AuthToken();

          if (web3AuthToken) {
            const jwtResponse = await exchangeTokenForJWT(
              web3AuthToken, 
              wallet_address, 
              userEmail
            );

            // Session storage operations
            sessionStorage.setItem("jwtToken", jwtResponse.token);
            sessionStorage.setItem("hasAuthToken", "true");
            sessionStorage.setItem("walletAddress", wallet_address);
            sessionStorage.setItem("privateKey", ed25519PrivKeyHex);
            sessionStorage.setItem("publicKey", wallet_address);
            sessionStorage.setItem("userId", jwtResponse.userId || "");
            
            router.replace("/home");
          }
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
      }
    };

    if (typeof window !== "undefined") {
      initWeb3Auth();
    }

    return () => {
      isMounted = false;
    };
  }, [router, email]);

  const sendOtp = async () => {
    try {
      if (!web3authReady) {
        console.error("Web3Auth not initialized");
        return;
      }

      setIsLoading(true);
      const jwtResponse = await loginWithEmail(email);

      if (jwtResponse?.jwt && jwtResponse.userId) {
        sessionStorage.setItem("jwtToken", jwtResponse.jwt);
        sessionStorage.setItem("hasAuthToken", "true");
        sessionStorage.setItem("walletAddress", jwtResponse.walletAddress);
        sessionStorage.setItem("privateKey", jwtResponse.privateKey);
        sessionStorage.setItem("publicKey", jwtResponse.publicKey);
        sessionStorage.setItem("userId", jwtResponse.userId);
        router.replace("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Input
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-64"
      />
      <button
        onClick={sendOtp}
        disabled={isLoading}
        className="bg-primary-purple p-4 rounded-md mt-4 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Sign in"}
      </button>
      {isLoading && <PuffLoader color="#fff" size={40} className="mt-4" />}
    </div>
  );
}