"use client"; // Ensure this runs on the client-side

import { Input } from "@/components/ui/Input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { exchangeTokenForJWT, getWeb3AuthToken, initializeWeb3Auth, loginWithEmail } from "../../../utils/web3auth";
import PuffLoader from "react-spinners/PuffLoader";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES } from "@web3auth/base";

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

  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
  
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
  }, []);

  useEffect(() => {
    let isMounted = true;
  
    const initWeb3Auth = async () => {
      try {
        const web3authInstance = await initializeWeb3Auth();
        if (!isMounted) return;
  
        setWeb3authReady(true);

        const clientId =
          "BMN2ub_-ZvBIyDnqrw4U8vVRatEjWHYv8rmqSmxhcM-PJ2852Mp_GdqKlvUTh3kp6QVFjRokRCzfPipn1DKpjsY";
        
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3",
          rpcTarget: "https://api.devnet.solana.com",
          displayName: "Solana Devnet",
          blockExplorerUrl: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana",
        };
        
        const privateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig },
        });
        
        const web3auth = new Web3AuthNoModal({
          clientId,
          web3AuthNetwork: "sapphire_devnet",
          privateKeyProvider,
        });
  
        if (web3authInstance.status === 'connected') {
          const provider = await web3auth.connectTo("auth", {
            loginProvider: "email_passwordless",
            extraLoginOptions: {
              login_hint: email.trim(),
              verifierIdField: "email",
              // redirectUrl: isTelegramWebView ? window.Telegram.WebApp.initDataUnsafe?.start_param || window.location.origin : window.location.origin + "/auth-callback",
            },
          });;
  
          if(provider !== null) {
          const ed25519PrivKeyHex = await provider.request({
            method: "private_key",
          });
        
          const keyPair = nacl.sign.keyPair.fromSecretKey(
            Buffer.from(ed25519PrivKeyHex as string, "hex")
          );
        
          const wallet_address = bs58.encode(keyPair.publicKey);
          const web3AuthToken = await getWeb3AuthToken();
  
          const jwtResponse = await exchangeTokenForJWT(
            web3AuthToken,
            wallet_address,
            email
          );
  
          sessionStorage.setItem("jwtToken", jwtResponse.token);
          sessionStorage.setItem("hasAuthToken", "true");
          sessionStorage.setItem("walletAddress", wallet_address);
          sessionStorage.setItem("privateKey", ed25519PrivKeyHex as string);
          sessionStorage.setItem("publicKey", wallet_address);
          sessionStorage.setItem("userId", jwtResponse.userId || "");
  
          router.replace("/home");
        }
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };
  
    initWeb3Auth();
  
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
        if (typeof window !== "undefined") {
          sessionStorage.setItem("jwtToken", jwtResponse.jwt);
          sessionStorage.setItem("hasAuthToken", "true");
          sessionStorage.setItem("walletAddress", jwtResponse.walletAddress);
          sessionStorage.setItem("privateKey", jwtResponse.privateKey);
          sessionStorage.setItem("publicKey", jwtResponse.publicKey);
          sessionStorage.setItem("userId", jwtResponse.userId || "");
        }

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
