"use client";
import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";

export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;

declare module "@privy-io/react-auth" {
  interface PrivyClientConfig {
    walletConnectors?: Array<{ name: string }>;
  }
}

export const PrivyWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (!PRIVY_APP_ID) {
    console.error(
      "Privy App ID is missing. Please set NEXT_PUBLIC_PRIVY_APP_ID in .env.local."
    );
    return null;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        walletConnectors: [
          { name: "phantom" },
          { name: "solflare" },
          { name: "backpack" },
        ],
        appearance: {
          theme: "dark",
          accentColor: "#8A63D2",
          showWalletLoginFirst: false,
        },
      }}
      // config={{
      //     supportedChains: [{
      //         id: 1399811149,
      //         name: 'Solana',
      //         nativeCurrency: {
      //             name: 'Solana',
      //             symbol: 'SOL',
      //             decimals: 9
      //         },
      //         rpcUrls: {
      //             default: { http: ['https://api.devnet.solana.com'] }
      //         }
      //     }],
      //     defaultChain: {
      //         id: 1399811149,
      //         name: 'Solana',
      //         nativeCurrency: {
      //             name: 'Solana',
      //             symbol: 'SOL',
      //             decimals: 9
      //         },
      //         rpcUrls: {
      //             default: { http: ['https://api.devnet.solana.com'] }
      //         }
      //     },
      //     embeddedWallets: {
      //         createOnLogin: "off"
      //     },
      //     externalWallets: {
      //         solana: {
      //             connectors: {
      //                 onMount: () => {},
      //                 onUnmount: () => {},
      //                 get: () => {
      //                     try {
      //                         if (typeof window !== "undefined") {
      //                             const solana = (window as any).phantom?.solana;
      //                             if (solana) {
      //                                 return [solana];
      //                             }
      //                         }
      //                     } catch (error) {
      //                         console.error("Error detecting Solana wallets:", error);
      //                     }
      //                     return [];
      //                 },
      //             },
      //         },
      //     },
      //     loginMethods: ['email', 'wallet'],
      //     appearance: {
      //         accentColor: '#6F3FF5',
      //         logo: '/your-logo.png',
      //     }
      // }}
      // config={{
      //       supportedChains: [{
      //         id: 1399811149,
      //         name: 'Solana Devnet',
      //         nativeCurrency: {
      //             name: 'Solana',
      //             symbol: 'SOL',
      //             decimals: 9
      //         },
      //         rpcUrls: {
      //             default: { http: ['https://api.devnet.solana.com'] }
      //         },
      //     }],
      //     defaultChain: {
      //         id: 1399811149,
      //         name: 'Solana',
      //         nativeCurrency: {
      //             name: 'Solana',
      //             symbol: 'SOL',
      //             decimals: 9
      //         },
      //         rpcUrls: {
      //             default: { http: ['https://api.devnet.solana.com'] }
      //         }
      //     },
      //     embeddedWallets: {
      //         createOnLogin: "off"
      //     },
      //     externalWallets: {
      //         solana: {
      //             connectors: [
      //                 { id: "phantom" },
      //                 { id: "solflare" },
      //                 { id: "backpack" }
      //             ] as any, // Use 'as any' to bypass TypeScript errors if needed
      //         }
      //     },

      //     walletConnectCloudProjectId: WALLET_CONNECT_ID,
      //   loginMethods: ['email', 'wallet'],
      //   appearance: {
      //     accentColor: '#6F3ff5',
      //     logo: '/your-logo.png',
      //     walletList: ['coinbase_wallet']
      //   }
      // }}
      // config={{
      //     embeddedWallets: { createOnLogin: "off" },
      //     externalWallets: {
      //         solana: {
      //             connectors: {
      //                 onMount: () => {},
      //                 onUnmount: () => {},
      //                 get: () => {
      //                     if (typeof window !== "undefined" && (window as any).phantom?.solana) {
      //                         return [(window as any).phantom.solana]; // Ensure this is a valid SolanaWalletConnector
      //                     }
      //                     return [];
      //                 },
      //             },
      //         },
      //     },
      // }}
    >
      {children}
    </PrivyProvider>
  );
};
