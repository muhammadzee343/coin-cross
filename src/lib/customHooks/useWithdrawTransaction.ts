
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { prepareTransaction, sendSignedTransaction } from "../features/withdrawTransactionSlice";

export const usePrepareTransaction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { preparedData, 
    txResult,
    isPrepareLoading, 
    isSending,
    isConfirming,
    error  } = useSelector((state: RootState) => state.transaction);

  const prepareTx = (senderPublicKey: string, recipientPublicKey: string, amountInLamports: number, jwtToken: string) => {
    dispatch(prepareTransaction({ senderPublicKey, recipientPublicKey, amountInLamports, jwtToken }));
  };

  const sendSignedTx = (signedTx: string, jwtToken: string) => {
    dispatch(sendSignedTransaction({ signedTx, jwtToken }));
  };

  return { prepareTx, sendSignedTx, preparedData, txResult, isPrepareLoading, isSending, isConfirming, error };
};
