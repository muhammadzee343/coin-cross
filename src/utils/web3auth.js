import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import nacl from "tweetnacl";
import bs58 from "bs58";

const clientId =
  "BMN2ub_-ZvBIyDnqrw4U8vVRatEjWHYv8rmqSmxhcM-PJ2852Mp_GdqKlvUTh3kp6QVFjRokRCzfPipn1DKpjsY";
const verifierName = "coincrush_agg_verifier";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3",
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Devnet",
  blockExplorerUrl: "https://explorer.solana.com/?cluster=devnet",
  ticker: "SOL",
  tickerName: "Solana",
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: "sapphire_devnet",
  privateKeyProvider,
  uxMode: typeof window !== "undefined" && window.Telegram?.WebApp?.isDesktop ? "redirect" : "popup",  // ✅ Important for Telegram WebView
  sessionTime: 86400 * 7,
  whiteLabel: {
    name: "Coin Crush",
    defaultLanguage: "en",
    theme: {
      primary: "#6C4DEA", // Match Telegram's color scheme
    }
  },
});

const authAdapter = new AuthAdapter({
  adapterSettings: {
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

let isInitialized = false;

export const resetWeb3AuthInitialization = () => {
  isInitialized = false;
};

const getWeb3AuthToken = async () => {
  try {
    const user = await web3auth.authenticateUser();
    return user.idToken;
  } catch (error) {
    console.error("Failed to get Web3Auth token:", error);
  }
};

export const initializeWeb3Auth = async () => {
  if (isInitialized) return web3auth;

  try {
    await web3auth.init();
    isInitialized = true;
    return web3auth;
  } catch (error) {
    console.error("Web3Auth Init Error:", error);
    throw error;
  }
};

export const exchangeTokenForJWT = async (web3AuthToken, wallet_address, email) => {
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

export const handleRedirect = async () => {
  if (typeof window === "undefined") return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("token")) {
    try {
      const privateKey = await web3auth.provider?.request({ method: "private_key" });
      const user = await web3auth.authenticateUser();
      
      return {
        privateKey,
        idToken: user.idToken,
        email: user.email,
      };
    } catch (error) {
      console.error("Redirect handling error:", error);
      return null;
    }
  }
  return null;
};

export const initTelegramWebApp = () => {
  if (typeof window === "undefined") return;
  
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Critical for Desktop WebView
    tg.expand();
    tg.enableClosingConfirmation();
    tg.MainButton.hide();
    
    // Add version logging
    console.log('Telegram WebApp version:', tg.version);
    console.log('Platform:', tg.platform);
    
    // Force dark theme
    tg.setHeaderColor('#6C4DEA');
    tg.setBackgroundColor('#1A1C22');
  }
};

export const loginWithEmail = async (email) => {
  try {
    if (!isInitialized) await initializeWeb3Auth();
    if (web3auth.status === "connected") return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    console.log(window.Telegram?.WebApp?.platform, "platform");
    const isTelegram = typeof window !== "undefined" && window.Telegram?.WebApp;
    const isDesktop = window.Telegram?.WebApp?.platform === "tdesktop";
    const redirectUrl = isDesktop
    ? `https://t.me/DevCon19Bot/coins/auth-callback`
    : window.location.href;

    const web3authProvider = await web3auth
      .connectTo("auth", {
        loginProvider: "email_passwordless",
        extraLoginOptions: {
          login_hint: email,
      redirectUrl: redirectUrl,
      verifierIdField: "email",
      mfaLevel: "none",
      sessionTime: 86400
          // login_hint: email.trim(),
          // verifierIdField: "email",
          // redirectUrl: isDesktop 
          //   ? window.location.origin + "/auth-callback"
          //   : window.location.href,
          // appState: {
          //   returnTo: window.location.href,
          // },
          // mfaLevel: "none",
          // sessionTime: 86400
        },
      })
      .catch((error) => {
        console.error("OTP Flow Error:", error);
        throw new Error("Failed to initialize OTP verification");
      });

      if (isDesktop) {
        window.location.href = redirectUrl;
      }

    // Handle OTP verification result
    if (!web3authProvider) {
      throw new Error("OTP verification failed - no provider returned");
    }

    const ed25519PrivKeyHex = await web3authProvider.request({
      method: "private_key",
    });
    if (!ed25519PrivKeyHex) throw new Error("Failed to retrieve private key");

    const keyPair = nacl.sign.keyPair.fromSecretKey(
      Buffer.from(ed25519PrivKeyHex, "hex")
    );
    const wallet_address = bs58.encode(keyPair.publicKey);
    const web3AuthToken = await getWeb3AuthToken();

    const jwtResponse = await exchangeTokenForJWT(
      web3AuthToken,
      wallet_address,
      email
    );

    if (typeof window !== "undefined") {
      localStorage.setItem("walletAddress", wallet_address);
      localStorage.setItem("privateKey", ed25519PrivKeyHex);
      localStorage.setItem("publicKey", wallet_address);
      localStorage.setItem("userId", web3AuthToken);
      localStorage.setItem("hasAuthToken", "true");
    }

    return { walletAddress: wallet_address, jwt: jwtResponse.token };
  } catch (error) {
    console.error("Login Failed", error);
    throw error;
  }
};

export const getPrivateKey = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("privateKey");
};

export default web3auth;
