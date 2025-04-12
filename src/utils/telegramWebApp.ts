/**
 * Telegram WebApp SDK utilities for Coin Crush
 */

// Declare Telegram WebApp interface
interface TelegramWebApp {
  expand: () => void;
  close: () => void;
  ready: () => void;
  isExpanded: boolean;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  initData: string;
  initDataUnsafe: any;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
}

// Augment the Window interface to include Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

/**
 * Initialize the Telegram WebApp
 */
export const initTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

/**
 * Request full screen mode in Telegram WebApp
 * @returns boolean indicating if the expansion was successful
 */
export const expandTelegramWebApp = (): boolean => {
  const tg = initTelegramWebApp();
  if (!tg) return false;

  try {
    // Set viewport and body styles to ensure full height
    if (typeof document !== 'undefined') {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
    }
    
    // Call expand regardless of isExpanded status
    // Some platforms need repeated calls to work properly
    tg.expand();
    
    return true;
  } catch (error) {
    console.error('Error expanding Telegram WebApp:', error);
    return false;
  }
};

/**
 * Signal to Telegram that the WebApp is ready
 */
export const setTelegramWebAppReady = (): void => {
  const tg = initTelegramWebApp();
  if (tg) {
    tg.ready();
  }
};

/**
 * Set up a main button in the Telegram WebApp
 * @param text Button text
 * @param callback Click handler
 * @param options Additional button configuration
 */
export const setupMainButton = (
  text: string, 
  callback: () => void,
  options?: { 
    color?: string; 
    textColor?: string;
    isActive?: boolean;
  }
): void => {
  const tg = initTelegramWebApp();
  if (!tg) return;

  const { MainButton } = tg;
  MainButton.setText(text);
  
  if (options?.color) {
    MainButton.color = options.color;
  }
  
  if (options?.textColor) {
    MainButton.textColor = options.textColor;
  }
  
  if (options?.isActive === false) {
    MainButton.disable();
  } else {
    MainButton.enable();
  }
  
  MainButton.onClick(callback);
  MainButton.show();
};

/**
 * Enable back button and set up callback
 * @param callback Function to execute when back button is clicked
 */
export const setupBackButton = (callback: () => void): void => {
  const tg = initTelegramWebApp();
  if (!tg) return;

  const { BackButton } = tg;
  BackButton.onClick(callback);
  BackButton.show();
};

/**
 * Hide back button
 */
export const hideBackButton = (): void => {
  const tg = initTelegramWebApp();
  if (tg) {
    tg.BackButton.hide();
  }
};

/**
 * Get Telegram theme colors
 */
export const getTelegramTheme = () => {
  const tg = initTelegramWebApp();
  if (!tg) return null;
  
  return {
    colorScheme: tg.colorScheme,
    themeParams: tg.themeParams
  };
};

/**
 * Close the Telegram WebApp
 */
export const closeTelegramWebApp = (): void => {
  const tg = initTelegramWebApp();
  if (tg) {
    tg.close();
  }
};

/**
 * Get initialization data (can be used for authentication)
 */
export const getTelegramInitData = (): string | null => {
  const tg = initTelegramWebApp();
  return tg ? tg.initData : null;
};

/**
 * Check if app is running inside Telegram
 */
export const isRunningInTelegram = (): boolean => {
  // Check environment variable (useful for testing and ensuring Telegram mode is enabled in production)
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_IS_TELEGRAM_APP === 'true') {
    return true;
  }
  
  // Check if Telegram WebApp is available in window
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
};

/**
 * Hide the main button in the Telegram WebApp
 */
export const hideMainButton = (): void => {
  const tg = initTelegramWebApp();
  if (tg && tg.MainButton) {
    tg.MainButton.hide();
  }
}; 