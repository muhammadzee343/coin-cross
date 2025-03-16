"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Slider } from "../Slider";
import { Typography } from "../Typography";
import { Inter } from "next/font/google";
import { BottomSheet } from "../BottomSheet";
import { AddSolanaQR } from "../AddSolanaQR";
import { useRefreshPortfolio } from "@/lib/customHooks/useProfolio";
import { lamportsToSol } from "@/utils/lamportsToSol";
import { usePurchase } from "@/lib/customHooks/useTradeCoin";
import { ApeItSheetProps } from "@/types/likes/apeItSheetProps";
import FadeLoader from "react-spinners/FadeLoader";
import { useAuth } from "@/lib/customHooks/useAuth";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
});

export const ApeItAllSheet = ({
  mints,
  isCoinDump,
  setCurrentTab,
  setDetailsOpen,
  setApeItAllOpen,
  setIsTradeObserved,
}: ApeItSheetProps) => {
  const { initiatePurchase, initiateSell } = usePurchase();
  const { publicKey, token } = useAuth();
  const { data } = useRefreshPortfolio();
  const [sliderValue, setSliderValue] = useState<number>(5);
  const [sellPercentage, setSellPercentage] = useState<number>(5);
  const [showSolanaWalletQR, setShowSolanaWalletQR] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionState, setTransactionState] = useState<{
    loading: boolean;
    type: "purchase" | "sell" | null;
  }>({ loading: false, type: null });

  const { solBalance, USDPrice } = useMemo(
    () => ({
      solBalance: lamportsToSol(data?.solBalanceInLamports || 0),
      USDPrice: data?.solPriceUSD || 0,
    }),
    [data]
  );

  const amount = useMemo(
    () => sliderValue * mints.length,
    [sliderValue, mints.length]
  );

  const amountInUSD = useMemo(
    () => Number((solBalance * USDPrice).toFixed(2)),
    [solBalance, USDPrice]
  );

  useEffect(() => {
    setSellPercentage(sliderValue * mints.length);
  }, [sliderValue, mints.length]);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  const updateLocalStorageMints = useCallback(
    (mints: { mintAddress: string }[]) => {
      const storedMints = JSON.parse(
        localStorage.getItem("likedCoins") || "[]"
      );
      const updatedMints = storedMints.filter(
        (mint: { mintAddress: string }) =>
          !mints.some((m) => m.mintAddress === mint.mintAddress)
      );
      localStorage.setItem("purchasedMints", JSON.stringify(updatedMints));
    },
    []
  );

  const handleTradeCompletion = useCallback(() => {
    setIsTradeObserved?.(true);
    setDetailsOpen?.(false);
    setApeItAllOpen?.(false);
  }, [setIsTradeObserved, setDetailsOpen, setApeItAllOpen]);

  const handleTransaction = useCallback(
    async (type: "purchase" | "sell") => {
      try {
        if (!publicKey || !token) throw new Error("Connect wallet first");

        setTransactionState({ loading: true, type });

        if (type === "purchase") {
          await initiatePurchase(mints, amount, publicKey.toBase58(), token);
          updateLocalStorageMints(mints);
          setCurrentTab?.("moonbag");
        } else {
          await initiateSell(
            publicKey.toBase58(),
            mints,
            sellPercentage,
            token
          );
        }

        handleTradeCompletion();
      } catch (err: any) {
        showError(err.message);
      } finally {
        setTransactionState({ loading: false, type: null });
      }
    },
    [
      publicKey,
      token,
      mints,
      amount,
      sellPercentage,
      updateLocalStorageMints,
      handleTradeCompletion,
      showError,
      setCurrentTab,
    ]
  );

  const handleAddSolana = useCallback(() => {
    setShowSolanaWalletQR(true);
  }, []);

  const errorDisplay = useMemo(
    () =>
      errorMessage && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-3 z-50">
          {errorMessage}
        </div>
      ),
    [errorMessage]
  );

  const loadingOverlay = useMemo(() => {
    if (!transactionState.loading) return null;

    const text =
      transactionState.type === "purchase"
        ? "Your moonbag is preparing..."
        : "Dumping...";

    return (
      <div className="fixed top-0 left-0 w-full bg-secondary-greenButton text-white text-center p-3 z-50 flex gap-4 items-center justify-center">
        {text}
        <FadeLoader color="#fff" height={10} width={3} radius={1} margin={0} />
      </div>
    );
  }, [transactionState]);

  return (
    <div className="relative">
      {errorDisplay}
      {loadingOverlay}

      <div className="flex justify-between mt-8">
        <div className="flex items-center gap-2">
          <Typography variant="caption1" className="text-primary-white">
            {isCoinDump ? "~ Sell percentage" : "Amount per coin"}
          </Typography>
        </div>
        <Typography variant="caption1" className="text-primary-white">
          {isCoinDump ? `${sellPercentage}%` : `$${sliderValue}`}
        </Typography>
      </div>

      <div className="flex-1 flex flex-col gap-6 py-6 px-4">
        <div className="space-y-2">
          <Slider
            value={[isCoinDump ? sellPercentage : sliderValue]}
            onValueChange={(vals: number[]) =>
              isCoinDump ? setSellPercentage(vals[0]) : setSliderValue(vals[0])
            }
            min={isCoinDump ? 0.1 : 1}
            max={100}
            step={isCoinDump ? 0.1 : 1}
          />
        </div>
      </div>

      <div className="mt-auto pb-6">
        <button
          className={`w-full mb-1 rounded-xl px-[20px] py-[10px] ${
            amountInUSD > 0 && amountInUSD > amount
              ? "bg-primary-green"
              : "bg-[#cc7204]"
          }`}
          onClick={
            isCoinDump
              ? () => handleTransaction("sell")
              : amountInUSD > 0
              ? () => handleTransaction("purchase")
              : handleAddSolana
          }
        >
          {isCoinDump
            ? `Sell ~$${sellPercentage}`
            : amountInUSD > 0 && amountInUSD > amount
            ? `Purchase ~$${amount}`
            : "Add Solana"}
        </button>
      </div>

      <Typography
        variant="caption1"
        className={`text-[10px] text-secondary-gray mt-4 ${inter.className}`}
      >
        {"Additional refundable rent -$0.35. this amount will be deducted from your balance.".slice(
          0,
          51
        ) + "..."}
      </Typography>

      <div className="fixed bottom-0 z-10 bg-background-default">
        <BottomSheet
          className="bg-background-default border-t border-x border-gray-600 rounded-t-[12px]"
          hideHandle={true}
          isOpen={showSolanaWalletQR}
          showCloseButton={false}
          onClose={() => setShowSolanaWalletQR(false)}
        >
          <AddSolanaQR setIsQRLoginOpen={setShowSolanaWalletQR} />
        </BottomSheet>
      </div>
    </div>
  );
};
