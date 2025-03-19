"use client"
import { useEffect } from "react";
import { isTelegramWebApp } from "@/utils/web3auth";
import HomePage from "./home/page";

export default function Home() {

  useEffect(() => {
    if (isTelegramWebApp()) {
      // Disable browser-like scrolling
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, []);

  return  <HomePage /> ;
}
