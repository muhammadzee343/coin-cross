import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Connection, PublicKey, Keypair, clusterApiUrl,LAMPORTS_PER_SOL } from "@solana/web3.js";

const clientId =
  "BMN2ub_-ZvBIyDnqrw4U8vVRatEjWHYv8rmqSmxhcM-PJ2852Mp_GdqKlvUTh3kp6QVFjRokRCzfPipn1DKpjsY";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3",
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Devnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
  logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
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
    loginConfig: {
      email_passwordless: {
        verifierIdField: "email_passwordless",
        subverifierID: "email_passwordless",
        verifier: "coincrush_agg_verifier",
        verifierSubIdentifier: "email_passwordless",
        typeOfLogin: "email_passwordless",
        clientId,
      },
    },
  },
  privateKeyProvider,
});

web3auth.configureAdapter(authAdapter);

let isInitialized = false;

const getWeb3AuthToken = async () => {
  try {
    const user = await web3auth.authenticateUser();
    return user.idToken;
  } catch (error) {
    console.error("Failed to get Web3Auth token:", error);
  }
};

export const initializeWeb3Auth = async () => {
  if (isInitialized) {
    return;
  }

  try {
    await web3auth.init();
    isInitialized = true;
  } catch (error) {
    console.error("Web3Auth Init Error:", error);
    throw error;
  }
};

async function exchangeTokenForJWT(web3AuthToken, wallet_address, email) {
  const response = await fetch("https://api.coin-crush.com/v1/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      walletAddress: wallet_address,
      web3AuthToken: web3AuthToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }

  const jsonResponse = await response.json();

  return jsonResponse;
}

export const getSolBalance = async () => {
  if (typeof window === "undefined") return 0; 

  try {
    const publicKeyString = localStorage.getItem("publicKey"); 
    if (!publicKeyString) {
      console.warn("Public key not found in local storage");
      return 0;
    }
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const wallet = new PublicKey(publicKeyString);
    const balance = await connection.getBalance(wallet);

    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
};

// export const getSolBalance = async () => {
//   const [publicKeyString, setPublicKeyString] = useState("");
//   try {
//     const connection = new Connection(
//       "https://api.devnet.solana.com",
//       "confirmed"
//     );
//     if (typeof window !== "undefined") {
//       setPublicKeyString(localStorage.getItem("publicKey"));
//     }
//     if (!publicKeyString) {
//       throw new Error("Public key not found in local storage");
//     }
//     const publicKey = new PublicKey(publicKeyString);
//     const balance = await connection.getBalance(publicKey);
//     console.log(balance);
//     return balance / 1e9; // Convert lamports to SOL
//     console.log(balance);
//   } catch (error) {
//     console.error("Failed to fetch SOL balance:", error);
//     throw error;
//   }
// };

export const loginWithEmail = async (email) => {
  try {
    if (!isInitialized) {
      await initializeWeb3Auth();
    }
    
    if (web3auth.status === "connected") {
      console.warn("Web3Auth is already connected. Returning existing session.");
      return;
    }
    console.log("called sent")
    const web3authProvider = await web3auth.connectTo("auth", {
      loginProvider: "email_passwordless",
      extraLoginOptions: {
        login_hint: email.trim(),
      },
    });
    
    const privateKeyHex = await web3authProvider.request({
      method: "solanaPrivateKey",
    });

    if (!privateKeyHex) {
      throw new Error("Failed to retrieve private key");
    }

    const privateKeyBuffer = Uint8Array.from(Buffer.from(privateKeyHex, "hex"));

    const keypair = Keypair.fromSecretKey(privateKeyBuffer);
    const web3AuthToken = await getWeb3AuthToken();

    const wallet_address = keypair.publicKey.toBase58();

    const publicKey = new PublicKey(wallet_address);
    if (typeof window !== "undefined") {
      localStorage.setItem("publicKey", publicKey);
    }

    const jwtResponse = await exchangeTokenForJWT(web3AuthToken, wallet_address, email);

    if (jwtResponse && jwtResponse.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("walletAddress", wallet_address);
        localStorage.setItem("userId", web3AuthToken);
        localStorage.setItem("hasAuthToken", "true");
      }
    } else {
      console.error("JWT token missing in response:", jwtResponse);
    }

    return { walletAddress: wallet_address, jwt: jwtResponse.token };
  } catch (error) {
    console.error("Login Failed", error);
    throw error;
  }
};

export const logout = async () => {
  const [jwtToken, setJwtToken] = (useState < string) | (null > null);
  try {
    if (typeof window !== "undefined") {
      setJwtToken(localStorage.getItem("jwtToken"));
    }

    if (!jwtToken) {
      console.error("No JWT token found");
      return;
    }

    const response = await fetch("https://api.coin-crush.com/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }

    // Clear tokens from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("hasAuthToken");
    }

    console.log("Successfully logged out");
  } catch (error) {
    console.error("Logout Failed", error);
  }
};

export default web3auth;