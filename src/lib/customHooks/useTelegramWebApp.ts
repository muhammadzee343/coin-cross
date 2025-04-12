import { useEffect, useState } from 'react';
import {
  initTelegramWebApp,
  expandTelegramWebApp,
  setTelegramWebAppReady,
  isRunningInTelegram,
  getTelegramTheme,
  setupMainButton,
  setupBackButton,
  hideBackButton,
  closeTelegramWebApp,
  hideMainButton as hideMainButtonUtil
} from '@/utils/telegramWebApp';
import { useRouter } from 'next/navigation';

export interface UseTelegramWebAppOptions {
  expandOnMount?: boolean;
  readyOnMount?: boolean;
  setupBackButton?: boolean;
}

export function useTelegramWebApp(options: UseTelegramWebAppOptions = {}) {
  const {
    expandOnMount = true,
    readyOnMount = true,
    setupBackButton: shouldSetupBackButton = false
  } = options;

  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [themeParams, setThemeParams] = useState<any>(null);
  const router = useRouter();

  // Initialize on mount
  useEffect(() => {
    const inTelegram = isRunningInTelegram();
    setIsInTelegram(inTelegram);

    if (!inTelegram) return;

    // Get theme information
    const theme = getTelegramTheme();
    setThemeParams(theme);

    // More aggressive expansion approach:
    // 1. Set body and html to full height
    if (typeof document !== 'undefined') {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
    }

    // 2. Expand immediately if needed
    if (expandOnMount) {
      const expanded = expandTelegramWebApp();
      setIsExpanded(expanded);
      
      // Try again in sequence with small delays
      const timers = [100, 500, 1000].map(delay => 
        setTimeout(() => {
          expandTelegramWebApp();
        }, delay)
      );
      
      // Clean up timers
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }

    // 3. Set ready if needed
    if (readyOnMount) {
      setTelegramWebAppReady();
    }

    // 4. Setup back button if needed
    if (shouldSetupBackButton) {
      setupBackButton(() => {
        router.back();
      });
    }

    // Cleanup
    return () => {
      if (shouldSetupBackButton) {
        hideBackButton();
      }
    };
  }, [expandOnMount, readyOnMount, shouldSetupBackButton, router]);

  // Helper functions to be exposed
  const expand = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
    }
    
    const expanded = expandTelegramWebApp();
    setIsExpanded(expanded);
    return expanded;
  };

  const setReady = () => {
    setTelegramWebAppReady();
  };

  const setupButton = (
    text: string,
    callback: () => void,
    options?: {
      color?: string;
      textColor?: string;
      isActive?: boolean;
    }
  ) => {
    setupMainButton(text, callback, options);
  };

  const setupBackButtonWithCallback = (callback: () => void) => {
    setupBackButton(callback);
  };

  const closeWebApp = () => {
    closeTelegramWebApp();
  };

  // Hide main button function
  const hideMainButton = () => {
    hideMainButtonUtil();
  };

  return {
    isInTelegram,
    isExpanded,
    themeParams,
    expand,
    setReady,
    setupButton,
    setupBackButton: setupBackButtonWithCallback,
    hideBackButton,
    hideMainButton,
    closeWebApp,
    tg: initTelegramWebApp()
  };
} 