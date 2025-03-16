"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the auth callback
    if (window.opener) {
      window.opener.postMessage({ type: "web3auth_callback", url: window.location.href }, "*");
      window.close();
    } else {
      // If no opener, redirect back to the main app
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Completing authentication...</p>
    </div>
  );
}