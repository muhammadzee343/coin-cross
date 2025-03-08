"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "../Slider";
import { Typography } from "../Typography";
import { Inter } from "next/font/google";
import { usePrepareBuy } from "@/lib/customHooks/usePrepareBuy";
import { PublicKey } from "@solana/web3.js";
import { useExecuteBuy } from "@/lib/customHooks/useExecuteBuy";
import { BottomSheet } from "../BottomSheet";
import { AddSolanaQR } from "../AddSolanaQR";
import { usePrepareSell } from "@/lib/customHooks/usePrepareSell";
import { useExecuteSell } from "@/lib/customHooks/useExecuteSell";
import { useRefreshPortfolio } from "@/lib/customHooks/useProfolio";
import { lamportsToSol } from "@/utils/lamportsToSol";


const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
});

interface ApeItAllSheetProps {
  mints: string[];
  isCoinDump?: boolean;
}

export const ApeItAllSheet = ({ mints, isCoinDump }: ApeItAllSheetProps) => {
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
  const [userId, setUserId] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  const { initiatePurchase } = usePrepareBuy();
  const { completePurchase } = useExecuteBuy();
  const { initiateSell } = usePrepareSell();
  const { completeSell } = useExecuteSell();
  const { loading, data, error, fetchPortfolio } = useRefreshPortfolio();
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPublicKey(new PublicKey(localStorage.getItem("publicKey") || ""));
      setUserId(localStorage.getItem("userId") || "");
      setToken(localStorage.getItem("jwtToken"));
    }
  }, []);

  useEffect(() => {
    setAmount(sliderValue * mints.length);
    setSellPercentage(sliderValue * mints.length);
  }, [sliderValue, mints.length]);

  const handleBuy = async () => {
    if (!publicKey || !token) return;
    try {
      const prepareBuyResponse = await initiatePurchase(
        publicKey.toBase58(),
        mints,
        amount,
        token
      );

      if (prepareBuyResponse?.transactions) {
        const signedTransactions = prepareBuyResponse.transactions;
        await completePurchase(
          signedTransactions,
          userId,
          publicKey.toBase58(),
          token
        );
      }
    } catch (err) {
      console.error("Error during purchase:", err);
    }
  };

  const handleSell = async () => {
    if (!publicKey || !token) return;
    try {
      const prepareSellResponse = await initiateSell(
        publicKey.toBase58(),
        mints,
        sellPercentage,
        token
      );

      if (prepareSellResponse?.transactions) {
        const signedTransactions = prepareSellResponse.transactions;
        await completeSell(
          signedTransactions,
          userId,
          publicKey.toBase58(),
          token
        );
      }
    } catch (err) {
      console.error("Error during sell:", err);
    }
  };

  const handleAddSolana = () => {
    setShowSolanaWalletQR(true);
  };

  useEffect(() => {
    if (publicKey && token) {
      fetchPortfolio(publicKey.toBase58(), token);
    }
  }, [publicKey, token]);

  useEffect(() => {
    if (data?.solBalanceInLamports !== undefined && data?.solPriceUSD !== undefined) {
      setSolBalance(lamportsToSol(data.solBalanceInLamports));
      setUSDPrice(data.solPriceUSD)
    }
  }, [data]);

  useEffect(() => {
    setAmountInUSD(Number((solBalance * USDPrice).toFixed(2)));
  }, [solBalance, USDPrice]);

  return (
    <div>
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
            min={1}
            max={100}
            step={1}
          />
        </div>
      </div>

      <div className="mt-auto pb-6">
        <button
          className={`w-full mb-1 rounded-xl px-[20px] py-[10px] ${
            amountInUSD > 0 && amountInUSD > amount ? "bg-primary-green" : "bg-[#cc7204]"
          }`}
          onClick={
            isCoinDump
              ? handleSell
              : amountInUSD > 0
              ? handleBuy
              : handleAddSolana
          }
        >
          {isCoinDump ? `Sell ~$${sellPercentage}` : (amountInUSD > 0 && amountInUSD > amount) ? `Purchase ~$${amount}` : "Add Solana"}
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
