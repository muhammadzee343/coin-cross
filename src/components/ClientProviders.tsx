// src/components/ClientProviders.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TelegramProvider = dynamic(
  () => import("@/components/TelegramProvider"),
  { 
    ssr: false,
    loading: () => <div className="h-screen w-screen bg-background-default" />
  }
);

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Add any global client-side effects here
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize any global client-side logic
    }
  }, []);

  return (
    <>
      <TelegramProvider>
        {children}
      </TelegramProvider>
    </>
  );
}