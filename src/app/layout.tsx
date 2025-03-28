import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import StoreProvider from "./StoreProvider";
import RootProvider from "./rootProvider";
import { PrivyWrapper } from "@/utils/privy-config";

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
        <script
          async
          src="https://telegram.org/js/telegram-web-app.js"
        ></script>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>

      <body className="antialiased bg-background-default mx-auto">
        <StoreProvider>
          <PrivyWrapper>
          <RootProvider>{children}</RootProvider>
          </PrivyWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
