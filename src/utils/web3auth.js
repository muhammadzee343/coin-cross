import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES, UX_MODE } from "@web3auth/base";
import nacl from "tweetnacl";
import bs58 from "bs58";

const clientId = "BMN2ub_-ZvBIyDnqrw4U8vVRatEjWHYv8rmqSmxhcM-PJ2852Mp_GdqKlvUTh3kp6QVFjRokRCzfPipn1DKpjsY";
const verifierName = "coincrush_agg_verifier";
const isTelegramWebView = typeof window !== "undefined" && window?.Telegram?.WebApp !== undefined;

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
});

const authAdapter = new AuthAdapter({
  adapterSettings: {
    uxMode: isTelegramWebView ? UX_MODE.REDIRECT : UX_MODE.POPUP, 
    // uxMode: UX_MODE.POPUP,
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

const getWeb3AuthToken = async () => {
  try {
    const user = await web3auth.authenticateUser();
    return user.idToken;
  } catch (error) {
    console.error("Failed to get Web3Auth token:", error);
  }
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

    const web3authProvider = await web3auth.connectTo("auth", {
      loginProvider: "email_passwordless",
      extraLoginOptions: {
        login_hint: email.trim(),
        verifierIdField: "email",
        redirectUrl: isTelegramWebView ? window.Telegram.WebApp.initDataUnsafe?.start_param || window.location.origin : window.location.origin + "/auth-callback",
      },
    });
 
    if (!web3authProvider) throw new Error("OTP verification failed - no provider returned");

    const ed25519PrivKeyHex = await web3authProvider.request({
      method: "private_key",
    });

    if (!ed25519PrivKeyHex) throw new Error("Failed to retrieve private key");

    const keyPair = nacl.sign.keyPair.fromSecretKey(Buffer.from(ed25519PrivKeyHex, "hex"));
    const wallet_address = bs58.encode(keyPair.publicKey);
    const web3AuthToken = await getWeb3AuthToken();
    
    const jwtResponse = await exchangeTokenForJWT(web3AuthToken, wallet_address, email);
console.log(jwtResponse, "jwtResponse")
    if (typeof window !== "undefined") {
      sessionStorage.setItem("walletAddress", wallet_address);
      sessionStorage.setItem("privateKey", ed25519PrivKeyHex);
      sessionStorage.setItem("publicKey", wallet_address);
      sessionStorage.setItem("userId", web3AuthToken);
      sessionStorage.setItem("hasAuthToken", "true");
    }

    return { walletAddress: wallet_address, jwt: jwtResponse.token };
  } catch (error) {
    console.error("Login Failed", error);
    throw error;
  }
};
