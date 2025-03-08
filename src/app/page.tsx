"use client";

import { useEffect, useState } from "react";
import { Onboarding } from "./onboarding/onboarding";
import LoginScreen from "./login/page";
import { usePathname } from "next/navigation";
import HomePage from "./home/page";

export default function Home() {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAuthToken, setHasAuthToken] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      const hasAuthToken = localStorage.getItem("hasAuthToken");
      
      setHasAuthToken(hasAuthToken !== null ? JSON.parse(hasAuthToken) : false);
      setIsFirstTime(!hasSeenOnboarding);
    }
    setIsLoading(false);
  }, [pathname]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return isFirstTime ? <Onboarding /> : hasAuthToken ? <HomePage /> : <LoginScreen />;
}
