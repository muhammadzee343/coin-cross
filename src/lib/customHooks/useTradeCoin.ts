import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { prepareBuy, executeBuy, prepareSell, executeSell, setSignedTransactions } from "../features/tradeCoinSlice";
import { signTransactionClientSide } from "@/utils/signSolanaTransaction";

export const usePurchase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, signedTransactions, results, isPurchaseLoading, isSellLoading, tradeError } = useSelector(
    (state: RootState) => state.purchase
  );

  const initiatePurchase = async (coins: { mintAddress: string }[], amount: number, publicKey: string, jwtToken: string) => {
    if (!publicKey) throw new Error("Wallet not connected");
  
    try {
      const preparedTransactions = await dispatch(
        prepareBuy({
          publicKey: publicKey.toString(),
          mints: coins.map((c) => c.mintAddress),
          amountPerPurchaseUsdc: amount,
          jwtToken
        })
      ).unwrap();

      const signedTxs: Record<string, string> = {};
      for (const [mint, unsignedTx] of Object.entries(preparedTransactions)) {
        signedTxs[mint] = await signTransactionClientSide(unsignedTx as string);
      }
  
      dispatch(setSignedTransactions(signedTxs));
  
      const userId = sessionStorage.getItem("userId") || "default_user";
      const resultBuy = await dispatch(
        executeBuy({
          signedTransactions: signedTxs,
          userId,
          publicKey: publicKey.toString(),
          jwtToken
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
    if (!publicKey) throw new Error("Wallet not connected");

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
      for (const [mint, unsignedTx] of Object.entries(preparedTransactions)) {
        signedTxs[mint] = await signTransactionClientSide(unsignedTx as string);
      }

      dispatch(setSignedTransactions(signedTxs));

      const userId = sessionStorage.getItem("userId") || "default_user";
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
