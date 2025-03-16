import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, type IProvider } from "@web3auth/base";
import nacl from "tweetnacl";
import bs58 from "bs58";

// Type declarations
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        openLink: (url: string) => void;
        close: () => void;
        platform: string;
      };
    };
  }
}

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

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig },
});

export const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: "sapphire_devnet",
  privateKeyProvider,
  chainConfig
  // uxMode: "redirect",
  // authMode: "REDIRECT",
  // redirectUrl: typeof window !== "undefined" 
  // ? `${window.location.origin}/auth-callback`
  // : "https://coin-cross.vercel.app/auth-callback",
});

const authAdapter = new AuthAdapter({
  adapterSettings: {
    loginConfig: {
      [verifierName]: {
        verifier: verifierName,
        typeOfLogin: "email_passwordless",
        clientId,
        // verifierIdField: "email",
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

const getWeb3AuthToken = async (): Promise<string | undefined> => {
  try {
    const user = await web3auth.authenticateUser();
    return user.idToken;
  } catch (error) {
    console.error("Failed to get Web3Auth token:", error);
  }
};

export const initializeWeb3Auth = async (): Promise<typeof web3auth> => {
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

interface LoginResponse {
  walletAddress: string;
  jwt: string;
}

async function exchangeTokenForJWT(
  web3AuthToken: string | undefined,
  wallet_address: string,
  email: string
): Promise<LoginResponse> {
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
  return response.json();
}

interface LoginResponse {
  walletAddress: string;
  jwt: string;
}

export const loginWithEmail = async (email: string): Promise<LoginResponse | string> => {
  try {
    if (!isInitialized) await initializeWeb3Auth();
    if (web3auth.status === "connected") return { walletAddress: "", jwt: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const loginParams = {
      loginProvider: "email_passwordless",
      extraLoginOptions: {
        login_hint: email.trim(),
        redirectUrl: typeof window !== "undefined" 
          ? `${window.location.origin}/auth-callback`
          : "https://coin-cross.vercel.app/auth-callback",
        appState: {
          returnTo: window.location.href,
          customState: { action: "otp-verification" },
        },
      },
    };

    if (window.Telegram?.WebApp?.platform) {
      await web3auth.connectTo(WALLET_ADAPTERS.AUTH, loginParams);
      return loginParams.extraLoginOptions.redirectUrl;
    }

    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, loginParams);

    if (!web3authProvider) throw new Error("Failed to connect to web3auth provider");
    const ed25519PrivKeyHex = await web3authProvider.request({
      method: "private_key",
    });
    
    if (!ed25519PrivKeyHex) throw new Error("Failed to retrieve private key");
    
    const keyPair = nacl.sign.keyPair.fromSecretKey(
      Buffer.from(ed25519PrivKeyHex as string, "hex")
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
      localStorage.setItem("privateKey", ed25519PrivKeyHex as string);
      localStorage.setItem("publicKey", wallet_address);
      localStorage.setItem("userId", web3AuthToken || "");
      localStorage.setItem("hasAuthToken", "true");
    }

    return { walletAddress: wallet_address, jwt: jwtResponse.jwt };
  } catch (error) {
    console.error("Login Failed", error);
    throw error;
  }
};

export const getPrivateKey = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("privateKey");
};