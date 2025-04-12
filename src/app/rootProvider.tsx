"use client";

import { useEffect, useState } from "react";
import { Onboarding } from "./onboarding/onboarding";
import LoginScreen from "./login/page";
import { usePathname } from "next/navigation";
import HomePage from "./home/page";
import { useTelegramWebApp } from "@/lib/customHooks/useTelegramWebApp";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [hasAuthToken, setHasAuthToken] = useState<boolean | null>(null);
  const pathname = usePathname();
  
  // Initialize Telegram WebApp with more aggressive settings
  const { 
    isInTelegram, 
    expand, 
    setReady, 
    tg,
    setupButton,
    hideMainButton
  } = useTelegramWebApp({
    expandOnMount: true,
    readyOnMount: true,
    setupBackButton: pathname !== "/",
  });

  // Load auth state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      const storedAuthToken = localStorage.getItem("hasAuthToken");

      setIsFirstTime(!hasSeenOnboarding);
      setHasAuthToken(storedAuthToken ? JSON.parse(storedAuthToken) : false);
    }
  }, [pathname]);

  // Force expand on route change and handle Telegram UI
  useEffect(() => {
    if (!isInTelegram) return;

    // Make sure document body is properly sized
    if (typeof document !== 'undefined') {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
    }
    
    // Aggressively expand multiple times
    expand();
    
    // Hide any Telegram Main Button
    hideMainButton();
    
    // Create a recurring interval to keep trying to expand
    // This is especially important for mobile devices
    const expandInterval = setInterval(() => {
      expand();
    }, 500);
    
    // Clean up interval on unmount
    return () => {
      clearInterval(expandInterval);
    };
  }, [pathname, isInTelegram, expand, hideMainButton]);

  // Initial render
  if (isFirstTime === null || hasAuthToken === null) {
    return null;
  }

  if (isFirstTime) {
    return <Onboarding />;
  }

  if (hasAuthToken) {
    return <HomePage />;
  }
  
  if (!hasAuthToken) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
