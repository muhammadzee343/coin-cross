"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "../Slider";
import { Typography } from "../Typography";
import { Inter } from "next/font/google";
import { PublicKey } from "@solana/web3.js";
import { BottomSheet } from "../BottomSheet";
import { AddSolanaQR } from "../AddSolanaQR";
import { useRefreshPortfolio } from "@/lib/customHooks/useProfolio";
import { lamportsToSol } from "@/utils/lamportsToSol";
import { usePurchase } from "@/lib/customHooks/useTradeCoin";
import { ApeItSheetProps } from "@/types/likes/apeItSheetProps";

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
  const { data, fetchPortfolio } = useRefreshPortfolio();
  const [sliderValue, setSliderValue] = useState<number>(5);
  const [amount, setAmount] = useState<number>(sliderValue * mints.length);
  const [sellPercentage, setSellPercentage] = useState<number>(
    sliderValue * mints.length
  );
  const [solBalance, setSolBalance] = useState<number>(0);
  const [USDPrice, setUSDPrice] = useState<number>(0);
  const [amountInUSD, setAmountInUSD] = useState<number>(0);
  const [showSolanaWalletQR, setShowSolanaWalletQR] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [purchaseInProgress, setPurchaseInProgress] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPublicKey(new PublicKey(localStorage.getItem("publicKey") || ""));
      setToken(localStorage.getItem("jwtToken"));
    }
  }, []);

  useEffect(() => {
    setAmount(sliderValue * mints.length);
    setSellPercentage(sliderValue * mints.length);
  }, [sliderValue, mints.length]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  const handlePurchase = async () => {
    try {
      if (!publicKey || !token) throw new Error("Connect wallet first");
      setPurchaseInProgress(true);
      await initiatePurchase(mints, amount, publicKey.toBase58(), token);
      const storedMints = JSON.parse(
        localStorage.getItem("likedCoins") || "[]"
      );
      const updatedMints = storedMints.filter(
        (mint: { mintAddress: string }) =>
          !mints.some((m) => m.mintAddress === mint.mintAddress)
      );
      localStorage.setItem("purchasedMints", JSON.stringify(updatedMints));
      if (setCurrentTab) {
        setCurrentTab("moonbag");
      }
    } catch (err: any) {
      showError(err.message);
    } finally {
      setPurchaseInProgress(false);
      if (setIsTradeObserved) {
        setIsTradeObserved(true);
      }
      if (setDetailsOpen) {
        setDetailsOpen(false);
      }
    }
  };

  const handleSell = async () => {
    try {
      if (!publicKey || !token) throw new Error("Connect wallet first");
      await initiateSell(publicKey.toBase58(), mints, sellPercentage, token);
    } catch (err: any) {
      showError(err.message);
    } finally {
      if (setIsTradeObserved) {
        setIsTradeObserved(true);
      }
      if (setApeItAllOpen) {
        setApeItAllOpen(false);
      }
      if (setDetailsOpen) {
        setDetailsOpen(false);
      }
    }
  };

  const handleAddSolana = () => {
    setShowSolanaWalletQR(true);
  };

  useEffect(() => {
    if (publicKey && token) {
      fetchPortfolio(publicKey.toBase58(), token);
    }
  }, []);
  
  useEffect(() => {
    if (
      data?.solBalanceInLamports !== undefined &&
      data?.solPriceUSD !== undefined
    ) {
      setSolBalance(lamportsToSol(data.solBalanceInLamports));
      setUSDPrice(data.solPriceUSD);
    }
  }, [data]);

  useEffect(() => {
    setAmountInUSD(Number((solBalance * USDPrice).toFixed(2)));
  }, [solBalance, USDPrice]);
 
  return (
    <div className="relative">
      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center p-3 z-50">
          {errorMessage}
        </div>
      )}
      {purchaseInProgress && (
        <div className="fixed top-0 left-0 w-full bg-secondary-greenButton text-white text-center p-3 z-50">
          Your moonbag is preparing...
        </div>
      )}

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
              ? handleSell
              : amountInUSD > 0
              ? handlePurchase
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
