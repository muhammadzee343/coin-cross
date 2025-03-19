import { useRouter } from "next/navigation";
import HomePage from "./home/page";
import { useEffect } from "react";

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

export default function Home() {

  
  
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

  return  (
    <>
    <MiniAppHandler />
  <HomePage />
  </>) ;
}
