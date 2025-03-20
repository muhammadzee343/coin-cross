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
      
      const handleEvent = (eventData: string) => {
        try {
          const data = JSON.parse(eventData);
          if (data.token && data.email) {
            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("userEmail", data.email);
            router.push('/home');
            tg.close(); // Ensure WebApp closes after handling
          }
        } catch (error) {
          console.error("Token processing failed:", error);
          tg.showAlert("Authentication failed. Please try again.");
          tg.close();
        }
      };
  
      tg.onEvent('webAppDataReceived', handleEvent);
  
      return () => {
        tg.offEvent('webAppDataReceived', handleEvent);
      };
    }
  }, [router]);

  return <>{children}</>;
}