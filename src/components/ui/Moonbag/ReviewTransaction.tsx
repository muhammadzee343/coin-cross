import { usePrepareTransaction } from "@/lib/customHooks/useWithdrawTransaction";
import { lamportsToSol } from "@/utils/lamportsToSol";
import { solToLamports } from "@/utils/solToLamports";
import React, { useEffect, useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import PuffLoader from "react-spinners/PuffLoader";
import {
  PublicKey,
  Transaction,
  Connection,
  SystemProgram,
  clusterApiUrl,
  VersionedTransaction,
} from "@solana/web3.js";
import { useAuth } from "@/lib/customHooks/useAuth";

interface ReviewTransactionProps {
  setIsReviewTransactionOpen: (open: boolean) => void;
  amount: string;
  amountInSol: string;
  walletAddress: string;
  setIsWithdrawQROpen: (open: boolean) => void;
  setIsScanQROpen: (open: boolean) => void;
}

export const ReviewTransaction = ({
  setIsReviewTransactionOpen,
  amount,
  amountInSol,
  walletAddress,
  setIsWithdrawQROpen,
  setIsScanQROpen,
}: ReviewTransactionProps) => {
  const { useExtendedPrivy } = useAuth();
  const { ready, wallet } = useExtendedPrivy();
  const {
    prepareTx,
    sendSignedTx,
    preparedData,
    isPrepareLoading,
    isSending,
    isConfirming,
    error,
  } = usePrepareTransaction();

  const [currentError, setCurrentError] = useState<string | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      setJwtToken(jwtToken);
      const senderPublicKey = localStorage.getItem("publicKey");
      const recipientPublicKey = walletAddress;
      const amountInLamports = solToLamports(Number(amountInSol));
      if (senderPublicKey && recipientPublicKey && amountInLamports) {
        prepareTx(
          senderPublicKey,
          recipientPublicKey,
          amountInLamports,
          jwtToken
        );
      }
    }
  }, []);

  const handleConfirmTransaction = async () => {
    try {
      setCurrentError(null);

      if (!preparedData?.transactionBase64 || !jwtToken) {
        throw new Error("Missing transaction data or authentication");
      }

      const decodedTx = Buffer.from(preparedData.transactionBase64, "base64");
      const connection = new Connection(clusterApiUrl("devnet"));

      let transaction: Transaction | VersionedTransaction;
      try {
        transaction = VersionedTransaction.deserialize(decodedTx);
      } catch (e) {
        transaction = Transaction.from(decodedTx);
      }

      if (transaction instanceof Transaction) {
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new PublicKey(
          localStorage.getItem("publicKey")!
        );
      }

      const signedTransaction = await wallet.signTransaction(transaction);

      const serializedTx = signedTransaction.serialize();
      const txBuffer = Buffer.from(serializedTx);

      await sendSignedTx(txBuffer.toString("base64"), jwtToken);

      setIsReviewTransactionOpen(false);
      setIsWithdrawQROpen(false);
      setIsScanQROpen(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Transaction failed";
      setCurrentError(errorMessage);
      console.error("Transaction Error:", error);
    }
  };

  useEffect(() => {
    if (error) {
      setCurrentError(error);
    }
  }, [error]);

  const isLoading = isPrepareLoading || isSending || isConfirming;

  return isLoading ? (
    <div className="mt-10 flex justify-center">
      <PuffLoader color="#fff" />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-start h-full overflow-y-auto relative md:pt-2">
      <div
        className="w-full flex flex-col"
        onClick={() => setIsReviewTransactionOpen(false)}
      >
        <IoChevronBackSharp className="text-primary-purple text-[50px]" />
      </div>

      <div className="w-full flex flex-col">
        <label className="text-[30px] font-semibold text-primary-white text-center md:pt-6 pt-4 md:mb-12 mb-8">
          Review Transaction
        </label>

        <div className="w-full flex flex-col px-6">
          <div className="w-full flex justify-between mb-2">
            <label className="text-[20px] font-semibold text-primary-white text-center">
              Amount
            </label>

            <label className="text-[20px] font-semibold text-primary-white text-center">
              {amount}
            </label>
          </div>
          <div className="w-full flex justify-between mb-2">
            <label className="text-[20px] font-semibold text-primary-white text-center">
              Converted sol
            </label>

            <label className="text-[20px] font-semibold text-primary-white text-center">
              {amountInSol}
            </label>
          </div>
          <div className="w-full flex justify-between mb-2">
            <label className="text-[20px] font-semibold text-primary-white text-center">
              Recipient
            </label>

            <label className="text-[20px] font-semibold text-primary-white text-center">
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </label>
          </div>
          <div className="w-full flex justify-between mb-2">
            <label className="text-[20px] font-semibold text-primary-white text-center">
              Transaction Fee
            </label>

            <label className="text-[20px] font-semibold text-primary-white text-center">
              {lamportsToSol(preparedData?.feeInLamports)} SOL
            </label>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <div className="w-full">
          <button
            className="w-full mb-1 rounded-xl bg-primary-green px-[20px] py-[15px]"
            onClick={handleConfirmTransaction}
          >
            Confirm Send
          </button>
        </div>
      </div>
    </div>
  );
};
