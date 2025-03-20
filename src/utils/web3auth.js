import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Connection, PublicKey } from "@solana/web3.js";
import { lamportsToSol } from "./lamportsToSol";
const clientId =
  "BMN2ub_-ZvBIyDnqrw4U8vVRatEjWHYv8rmqSmxhcM-PJ2852Mp_GdqKlvUTh3kp6QVFjRokRCzfPipn1DKpjsY";
const verifierName = "coincrush_agg_verifier";

export const isTelegramWebApp = () => {
  return typeof window !== "undefined" && window?.Telegram?.WebApp?.initData;
};

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3",
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Devnet",
  blockExplorerUrl: "https://explorer.solana.com",
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
  uxMode: isTelegramWebApp() ? "redirect" : "popup",
});

const authAdapter = new AuthAdapter({
  adapterSettings: {
    loginConfig: {
      [verifierName]: {
        verifier: verifierName,
        typeOfLogin: "email_passwordless",
        clientId,
        verifierIdField: "email",
        uxMode: isTelegramWebApp() ? "redirect" : "popup",
        jwtParams: {
          domain: "https://coin-cross.vercel.app/",
          verifierIdField: "email",
        }
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

let web3AuthInitPromise = null;

export const initializeWeb3Auth = async () => {
  if (isInitialized) return web3auth;

  if (typeof window !== 'undefined' && window.location.href.includes('/redirect')) {
    await web3auth.handleRedirect();
  }
  if (!web3AuthInitPromise) {
    web3AuthInitPromise = (async () => {
      try {
        await web3auth.init();
        isInitialized = true;
      } catch (error) {
        console.error("Web3Auth Init Error:", error);
        throw error;
      }
      return web3auth;
    })();
  }

  return web3AuthInitPromise;
};

async function exchangeTokenForJWT(web3AuthToken, wallet_address, email) {
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
  try {

    if (!isInitialized) await initializeWeb3Auth();
    if (web3auth.status === "connected") return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    const baseUrl = isTelegramWebApp() 
      ? "https://coin-cross.vercel.app/" 
      : window.location.origin;

    const loginConfig = {
      loginProvider: "email_passwordless",
      verifier: verifierName,
      clientId,
      redirectUrl: isTelegramWebApp() 
        ? `${baseUrl}/api/telegram-callback`
        : `${baseUrl}/redirect`
    };

    if (isTelegramWebApp()) {
      // Telegram-specific flow
      const authParams = {
        ...loginConfig,
        loginProvider: "email_passwordless", // Explicitly set provider
        typeOfLogin: "email_passwordless",
        login_hint: email,
        uxMode: "redirect",
        extraLoginOptions: {
          domain: "https://your-app-domain.com" // Add if using custom domain
        }
      };

      await web3auth.connectTo("email_passwordless", { // Match provider name
        loginProvider: "email_passwordless",
        extraLoginOptions: authParams
      });

      const authUrl = `https://auth.web3auth.io/v9/start#${btoa(JSON.stringify(authParams))}`;
      window.Telegram.WebApp.openLink(authUrl);
      return;
    }
    

    const web3authProvider = await web3auth
      .connectTo("auth", {
        loginProvider: "email_passwordless",
        extraLoginOptions: {
          ...loginConfig,
          login_hint: email,
        }
        // extraLoginOptions: {
        //   login_hint: email.trim(),
        //   verifierIdField: "email",
        //   redirectUrl: "https://coin-cross.vercel.app/",
        //   appState: {
        //     returnTo: window.location.href,
        //     customState: { action: "otp-verification" },
        //   },
        // },
      })
      .catch((error) => {
        console.error("OTP Flow Error:", error);
        throw new Error("Failed to initialize OTP verification");
      });

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

    if (isTelegramWebApp()) {
      const authUrl = `https://auth.web3auth.io/v9/start#${btoa(JSON.stringify({
        ...loginConfig,
        login_hint: email,
        typeOfLogin: "email_passwordless",
        uxMode: "redirect"
      }))}`;

      window.Telegram.WebApp.openLink(authUrl);
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
