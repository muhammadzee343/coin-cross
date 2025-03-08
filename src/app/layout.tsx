import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import StoreProvider from "./StoreProvider";

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className="antialiased bg-background-default mx-auto px-0">
        <StoreProvider>
          <div className="max-w-[620px] overflow-hidden mx-auto w-full min-h-screen md:px-4 px-3">
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
