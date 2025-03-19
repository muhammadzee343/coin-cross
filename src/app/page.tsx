"use client"
import React, {useEffect} from "react";
import HomePage from "./home/page";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.opener) {
      window.addEventListener("beforeunload", () => {
        window.opener.postMessage({ type: "WEB3AUTH_WINDOW_CLOSED" });
      });
    }
  }, []);

  return  <HomePage /> ;
}
