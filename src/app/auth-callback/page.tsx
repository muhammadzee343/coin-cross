"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { web3auth, initializeWeb3Auth } from "@/utils/web3auth";
import { WALLET_ADAPTERS } from "@web3auth/base";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const web3auth = await initializeWeb3Auth();
        const user = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
          loginProvider: "email_passwordless",
          extraLoginOptions: {
            redirectUrl: window.location.origin + "/auth-callback"
          }
        });
        
        if (user) {
          // Handle user data storage here
          if (window.Telegram?.WebApp?.close) {
            window.Telegram.WebApp.close();
          } else {
            router.replace("/home");
          }
        }
      } catch (error) {
        console.error("Callback handling error:", error);
        router.replace("/login");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-white">Processing authentication...</p>
    </div>
  );
}