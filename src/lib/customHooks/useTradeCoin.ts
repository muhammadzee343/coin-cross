import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  prepareBuy,
  executeBuy,
  prepareSell,
  executeSell,
  setSignedTransactions,
} from "../features/tradeCoinSlice";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { useAuth } from "./useAuth";

export const usePurchase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { results, isPurchaseLoading, isSellLoading, tradeError } = useSelector(
    (state: RootState) => state.purchase
  );
  const { useExtendedPrivy, user } = useAuth();
  const { ready, wallet } = useExtendedPrivy();

  const connection = new Connection(clusterApiUrl("devnet"));

  const initiatePurchase = async (
    coins: { mintAddress: string }[],
    amount: number,
    publicKey: string,
    jwtToken: string
  ) => {
    if (!publicKey || !jwtToken || !wallet) {
      throw new Error("Wallet not connected or missing JWT Token");
    }

    try {
      const preparedTransactions = await dispatch(
        prepareBuy({
          publicKey: publicKey.toString(),
          mints: coins.map((c) => c.mintAddress),
          amountPerPurchaseUsdc: amount,
          jwtToken,
        })
      ).unwrap();

      const signedTxs: Record<string, string> = {};
      for (const [mint, unsignedTx] of Object.entries(preparedTransactions)) {
        const decodedBuffer = Buffer.from(unsignedTx as string, "base64");
        let transaction: Transaction | VersionedTransaction;

        try {
          transaction = VersionedTransaction.deserialize(decodedBuffer);
        } catch (e) {
          transaction = Transaction.from(decodedBuffer);
        }

        if (transaction instanceof Transaction) {
          const { blockhash } = await connection.getRecentBlockhash();
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = new PublicKey(publicKey);
        }

        const signedTransaction = await wallet.signTransaction(transaction);
        const serializedTx = signedTransaction.serialize();

        const txBuffer = Buffer.from(serializedTx);
        signedTxs[mint] = txBuffer.toString("base64");
      }

      dispatch(setSignedTransactions(signedTxs));

      const userId = localStorage.getItem("userId") || "default_user";
      const resultBuy = await dispatch(
        executeBuy({
          signedTransactions: signedTxs,
          userId,
          publicKey: publicKey.toString(),
          jwtToken,
        })
      ).unwrap();

      return resultBuy;
    } catch (err) {
      console.error("Purchase Error:", err);
      throw err;
    }
  };

  const initiateSell = async (
    publicKey: string,
    coins: { mintAddress: string }[],
    sellPercentage: number,
    jwtToken: string
  ) => {
    if (!publicKey || !jwtToken || !wallet) {
      throw new Error("Wallet not connected or missing JWT Token");
    }

    try {
      const preparedTransactions = await dispatch(
        prepareSell({
          publicKey: publicKey.toString(),
          mints: coins.map((c) => c.mintAddress),
          sellPercentage: sellPercentage,
          jwtToken,
        })
      ).unwrap();

      const signedTxs: Record<string, string> = {};

      for (const [mint, txData] of Object.entries(preparedTransactions)) {
        let transactionString: string;

        if (typeof txData === "object" && txData !== null) {
          transactionString =
            (txData as any).transaction || (txData as any).data;
        } else if (typeof txData === "string") {
          transactionString = txData;
        } else {
          console.error("Invalid transaction format:", txData);
          throw new Error(
            "Invalid transaction data format received from server"
          );
        }

        if (!transactionString) {
          console.error("Missing transaction data for mint:", mint);
          continue;
        }

        const decodedBuffer = Buffer.from(transactionString, "base64");
        let transaction: Transaction | VersionedTransaction;

        try {
          transaction = VersionedTransaction.deserialize(decodedBuffer);
        } catch (e) {
          transaction = Transaction.from(decodedBuffer);
        }

        if (transaction instanceof Transaction) {
          const { blockhash } = await connection.getRecentBlockhash();
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = new PublicKey(publicKey);
        }

        const signedTransaction = await wallet.signTransaction(transaction);
        const serializedTx = signedTransaction.serialize();

        signedTxs[mint] = Buffer.from(serializedTx).toString("base64");
      }

      if (Object.keys(signedTxs).length === 0) {
        throw new Error("No valid transactions to process");
      }

      dispatch(setSignedTransactions(signedTxs));

      const userId = localStorage.getItem("userId") || "default_user";
      const resultSell = await dispatch(
        executeSell({
          signedTransactions: signedTxs,
          userId,
          publicKey: publicKey.toString(),
          jwtToken,
        })
      ).unwrap();

      return resultSell;
    } catch (err) {
      console.error("Sell Error:", err);
      throw err;
    }
  };

  return {
    initiatePurchase,
    initiateSell,
    results,
    isPurchaseLoading,
    isSellLoading,
    tradeError,
  };
};
