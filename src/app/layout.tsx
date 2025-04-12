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
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body, #__next, main {
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
          }
        `}} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.style.height = '100%';
                document.body.style.height = '100%';
                document.body.style.margin = '0';
                document.body.style.padding = '0';
                
                function initTelegramApp() {
                  if (window.Telegram && window.Telegram.WebApp) {
                    var webApp = window.Telegram.WebApp;
                    
                    document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.themeParams.bg_color || '#ffffff');
                    document.documentElement.style.setProperty('--tg-theme-text-color', webApp.themeParams.text_color || '#000000');
                    document.documentElement.style.setProperty('--tg-theme-button-color', webApp.themeParams.button_color || '#40a7e3');
                    document.documentElement.style.setProperty('--tg-theme-button-text-color', webApp.themeParams.button_text_color || '#ffffff');
                    
                    webApp.expand();
                    
                    if (webApp.MainButton && webApp.MainButton.isVisible) {
                      webApp.MainButton.hide();
                    }
                    
                    webApp.ready();
                  }
                }
                
                initTelegramApp();
                
                document.addEventListener('DOMContentLoaded', initTelegramApp);
                
                setTimeout(initTelegramApp, 100);
                setTimeout(initTelegramApp, 500);
              })();
            `,
          }}
        />
      </head>

      <body className="antialiased bg-background-default mx-auto h-full">
        <StoreProvider>
          <PrivyWrapper>
          <RootProvider>{children}</RootProvider>
          </PrivyWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
