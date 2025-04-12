"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegramWebApp } from "@/lib/customHooks/useTelegramWebApp";

interface TelegramControlsProps {
  mainButtonText?: string;
  mainButtonCallback?: () => void;
  showBackButton?: boolean;
  backButtonCallback?: () => void;
  expandToFullscreen?: boolean;
}

/**
 * Component to manage Telegram Mini App UI controls
 */
export default function TelegramControls({
  mainButtonText,
  mainButtonCallback,
  showBackButton = false,
  backButtonCallback,
  expandToFullscreen = true,
}: TelegramControlsProps) {
  const router = useRouter();
  const {
    isInTelegram,
    expand,
    setupButton,
    setupBackButton,
    hideBackButton
  } = useTelegramWebApp({
    expandOnMount: expandToFullscreen,
    readyOnMount: true,
  });

  useEffect(() => {
    if (!isInTelegram) return;

    // Setup main button if text and callback provided
    if (mainButtonText && mainButtonCallback) {
      setupButton(mainButtonText, mainButtonCallback, {
        color: "#7F56D9", // Match your primary purple color
        textColor: "#FFFFFF",
      });
    }

    // Setup back button if needed
    if (showBackButton) {
      setupBackButton(backButtonCallback || (() => router.back()));
    } else {
      hideBackButton();
    }
  }, [
    isInTelegram,
    mainButtonText,
    mainButtonCallback,
    showBackButton,
    backButtonCallback,
    setupButton,
    setupBackButton,
    hideBackButton,
    router
  ]);

  // This is a utility component that doesn't render anything visible
  return null;
} 