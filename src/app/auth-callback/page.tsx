"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleRedirect } from "@/utils/web3auth";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { exchangeTokenForJWT } from "@/utils/web3auth";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const processLogin = async () => {
      try {
        const result = await handleRedirect();
        if (result?.privateKey && result.idToken) {
          const keyPair = nacl.sign.keyPair.fromSecretKey(
            Buffer.from(result.privateKey, "hex")
          );
          const wallet_address = bs58.encode(keyPair.publicKey);

          const jwtResponse = await exchangeTokenForJWT(
            result.idToken,
            wallet_address,
            result.email || ""
          );

          localStorage.setItem("walletAddress", wallet_address);
          localStorage.setItem("privateKey", result.privateKey);
          localStorage.setItem("jwtToken", jwtResponse.token);
          
          router.push("/home");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/login");
      }
    };

    processLogin();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Processing authentication...</p>
    </div>
  );
}