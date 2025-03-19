"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initializeWeb3Auth, loginWithEmail } from "../../utils/web3auth";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await initializeWeb3Auth();
        
        if (typeof window !== "undefined" && window.opener) {
          // Send success message to opener window and close
          window.opener.postMessage({ type: "WEB3AUTH_REDIRECT_SUCCESS" });
          window.close();
        } else {
          // Fallback for browsers that block window closing
          router.push("/home");
        }
      } catch (error) {
        console.error("Redirect handling failed:", error);
        window.opener?.postMessage({ type: "WEB3AUTH_REDIRECT_ERROR", error });
        window.close();
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Completing authentication...</p>
    </div>
  );
}