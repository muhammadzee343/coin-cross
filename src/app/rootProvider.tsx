"use client";

import { useEffect, useState } from "react";
import { Onboarding } from "./onboarding/onboarding";
import LoginScreen from "./login/page";
import { usePathname } from "next/navigation";
import HomePage from "./home/page";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [hasAuthToken, setHasAuthToken] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      const storedAuthToken = localStorage.getItem("hasAuthToken");

      setIsFirstTime(!hasSeenOnboarding);
      setHasAuthToken(storedAuthToken ? JSON.parse(storedAuthToken) : false);
    }
  }, [pathname]);

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
