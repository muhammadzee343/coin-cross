import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import StoreProvider from "./StoreProvider";
import RootProvider from "./rootProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const metadata: Metadata = {
  title: "Coin Crush",
  description:
    "Coin crush is a platform for trading and investing in cryptocurrencies.",
};

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        platform: string;
        close: () => void;
        version: string;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        ready: () => void;
        enableClosingConfirmation: () => void;
        onEvent: (event: string, callback: () => void) => void;
        expand: () => void;
        offEvent: (event: string) => void;
      };
    };
  }
}

const MiniAppHandler = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
      // Clear mini app state on initial load
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.setHeaderColor('#your_color');
      window.Telegram.WebApp.enableClosingConfirmation();

      // Add viewport change handler
      window.Telegram.WebApp.onEvent('viewportChanged', () => {
        // Force reload when viewport changes (simulates restart)
        router.replace('/?cache=' + Date.now());
      });

      // Check for fresh start
      if (!sessionStorage.getItem('miniAppRestarted')) {
        sessionStorage.setItem('miniAppRestarted', 'true');
        window.Telegram.WebApp.expand();
      }
    }

    return () => {
      if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        window.Telegram.WebApp.offEvent('viewportChanged');
      }
    };
  }, [router]);

  return null;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" /> */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>

        <body className="antialiased bg-background-default mx-auto">
        <StoreProvider>
          <RootProvider>
          <MiniAppHandler />
            {children}
          </RootProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
