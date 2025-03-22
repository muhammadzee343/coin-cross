"use client";

import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES, UX_MODE } from "@web3auth/base";
import nacl from "tweetnacl";
import bs58 from "bs58";

const clientId = "BMN2ub_-ZvBIyDnqrw4U8vVRatEjWHYv8rmqSmxhcM-PJ2852Mp_GdqKlvUTh3kp6QVFjRokRCzfPipn1DKpjsY";
const verifierName = "coincrush_agg_verifier";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3",
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Devnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
};

let web3auth = null;
let authAdapter = null;
let isInitialized = false;

export const initializeWeb3Auth = async () => {
  if (typeof window === "undefined") return null;

  if (!web3auth) {
    const privateKeyProvider = new SolanaPrivateKeyProvider({ config: chainConfig });
    
    web3auth = new Web3AuthNoModal({
      clientId,
      web3AuthNetwork: "sapphire_devnet",
      privateKeyProvider,
    });

    const isTelegramWebView = window?.Telegram?.WebApp !== undefined;
    
    authAdapter = new AuthAdapter({
      adapterSettings: {
        uxMode: isTelegramWebView ? UX_MODE.REDIRECT : UX_MODE.POPUP,
        redirectUrl: isTelegramWebView 
          ? window.Telegram?.WebApp?.initDataUnsafe?.start_param || window.location.origin 
          : `${window.location.origin}/auth-callback`,
        loginConfig: {
          [verifierName]: {
            verifier: verifierName,
            typeOfLogin: "email_passwordless",
            clientId,
            verifierIdField: "email",
          },
        },
      },
      privateKeyProvider,
    });

    web3auth.configureAdapter(authAdapter);
  }

  if (!isInitialized) {
    await web3auth.init();
    isInitialized = true;
  }
  
  return web3auth;
};

export const resetWeb3AuthInitialization = () => {
  isInitialized = false;
};

export const getWeb3AuthToken = async () => {
  if (!web3auth) throw new Error("Web3Auth not initialized");
  try {
    const user = await web3auth.authenticateUser();
    return user.idToken;
  } catch (error) {
    console.error("Failed to get Web3Auth token:", error);
    return null;
  }
};

export async function exchangeTokenForJWT(web3AuthToken, wallet_address, email) {
  const response = await fetch("https://api.coin-crush.com/v1/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress: wallet_address,
      email,
      web3AuthToken,
    }),
  });

  if (!response.ok) throw new Error("Token exchange failed");
  return await response.json();
}

export const loginWithEmail = async (email) => {
  if (typeof window === "undefined") throw new Error("Cannot execute on server side");
  if (!web3auth) await initializeWeb3Auth();
  if (web3auth?.status === "connected") return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw new Error("Invalid email format");

  const web3authProvider = await web3auth?.connectTo("auth", {
    loginProvider: "email_passwordless",
    extraLoginOptions: {
      login_hint: email.trim(),
      verifierIdField: "email",
    },
  });

  if (!web3authProvider) throw new Error("OTP verification failed");

  const ed25519PrivKeyHex = await web3authProvider.request({ method: "private_key" });
  if (!ed25519PrivKeyHex) throw new Error("Failed to retrieve private key");

  const keyPair = nacl.sign.keyPair.fromSecretKey(Buffer.from(ed25519PrivKeyHex, "hex"));
  const wallet_address = bs58.encode(keyPair.publicKey);
  const web3AuthToken = await getWeb3AuthToken();

  if (!web3AuthToken) throw new Error("Failed to get Web3Auth token");

  const jwtResponse = await exchangeTokenForJWT(web3AuthToken, wallet_address, email);

  return {
    walletAddress: wallet_address,
    jwt: jwtResponse.token,
    privateKey: ed25519PrivKeyHex,
    publicKey: wallet_address,
    userId: jwtResponse.userId || "",
  };
};