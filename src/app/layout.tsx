import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import StoreProvider from "./StoreProvider";
import RootProvider from "./rootProvider";

export const isTelegramWebView = () => {
  return typeof window !== "undefined" && 
    (window.navigator.userAgent.includes("Telegram") || 
     window.Telegram?.WebApp?.initData);
};

export const metadata: Metadata = {
  title: "Coin Crush",
  description:
    "Coin crush is a platform for trading and investing in cryptocurrencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        /> */}
        <meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
/>
      </head>

        <body className="antialiased bg-background-default mx-auto">
        <StoreProvider>
          <RootProvider>
            {children}
          </RootProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
