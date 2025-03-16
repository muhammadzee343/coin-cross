"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleRedirect } from "../../utils/web3auth";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        platform: string;
        close: () => void;
        version: string;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const processAuth = async () => {
      try {
        const result = await handleRedirect();
        
        if (result?.privateKey) {
          // Store credentials
          localStorage.setItem("privateKey", result.privateKey);
          localStorage.setItem("jwt", result.idToken);

          // Desktop-specific closure
          if (window.Telegram?.WebApp?.platform === "tdesktop") {
            // Delay for WebView to register auth completion
            setTimeout(() => {
              window.Telegram.WebApp.close();
              // Force refresh parent window
              window.opener?.location.reload();
            }, 500);
          } else {
            window.Telegram?.WebApp?.close();
          }
        }
      } catch (error) {
        console.error("Auth failed:", error);
        router.push("/login?error=auth_failed");
      }
    };

    processAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-300">Completing authentication...</p>
        
        {/* Desktop fallback close button */}
        {typeof window !== "undefined" && 
          window.Telegram?.WebApp?.platform === "tdesktop" && (
            <button
              onClick={() => window.Telegram.WebApp.close()}
              className="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 text-white"
            >
              Close Window
            </button>
          )}
      </div>
    </div>
  );
}