'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        ready: () => void;
        expand: () => void;
        close: () => void;
        showAlert: (message: string) => void;
        openLink: (url: string) => void;
        sendData: (data: string) => void;
        onEvent: (eventType: string, handler: Function) => void;
        offEvent: (eventType: string, handler: Function) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
      };
    };
  }
}

export default function TelegramProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Initialize Telegram WebApp
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();

      // Handle authentication messages
      tg.onEvent('webAppDataReceived', (eventData: string) => {
        try {
          const data = JSON.parse(eventData);
          if (data.token && data.email) {
            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("userEmail", data.email);
            router.push('/home');
          }
        } catch (error) {
          console.error("Token processing failed:", error);
          tg.showAlert("Authentication failed. Please try again.");
        }
      });

      // Cleanup
      return () => {
        tg.offEvent('webAppDataReceived', () => {});
      };
    }
  }, [router]);

  return <>{children}</>;
}