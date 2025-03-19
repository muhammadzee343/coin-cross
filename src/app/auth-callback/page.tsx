// app/auth-callback/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Send authentication result back to main window
        window.opener.postMessage(
          {
            type: "WEB3AUTH_REDIRECT",
            data: {
              url: window.location.href,
            },
          },
          window.location.origin
        );
      } catch (error) {
        console.error("Callback handling failed:", error);
      } finally {
        window.close();
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center h-screen">
      Processing authentication...
    </div>
  );
}