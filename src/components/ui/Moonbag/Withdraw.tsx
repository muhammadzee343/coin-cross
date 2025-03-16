"use client";

import React, { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { BottomSheet } from "../BottomSheet";
import { ScanQR } from "./ScanQR";
import { usdToSol } from "@/utils/UsdToLamports";
interface WithdrawProps {
  solPriceUSD: number;
  solBalance: number;
  setIsWithdrawQROpen: (isOpen: boolean) => void;
}
export const Withdraw = ({
  solPriceUSD,
  solBalance,
  setIsWithdrawQROpen,
}: WithdrawProps) => {
  const [amount, setAmount] = useState("");
  const [isScanQROpen, setIsScanQROpen] = useState(false);

  const handleInput = (value: string | number) => {
    if (value === "backspace") {
      setAmount(amount.slice(0, -1));
    } else if (value === ".") {
      setAmount(amount + value);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setAmount(amount + numValue.toString());
      }
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        setAmount(amount.slice(0, -1));
      } else if (e.key === "." && !amount.includes(".")) {
        setAmount(amount + e.key);
      } else if (!isNaN(Number(e.key))) {
        setAmount(amount + e.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [amount]);

  return (
    <div className="flex flex-col items-center justify-start h-full overflow-y-auto relative md:pt-8 pt-6">
      <div className="w-full px-6 py-2 flex flex-col">
        <h2 className="text-2xl font-semibold text-primary-white md:mb-12 mb-8">
          Send SOL
        </h2>
        <div className="mb-4 flex flex-col items-center justify-center">
          <p className="text-3xl text-center text-primary-white mb-3">
            {amount || "0"} <span className="text-primary-gray">USD</span>
          </p>
          <FaArrowDown className="text-xl text-center text-primary-purple text-[14px] mb-1.5" />
          <p className="text-lg text-center text-primary-purple">
            {usdToSol(Number(amount), solPriceUSD).toFixed(4) || "0"} SOL
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-auto">
          <div className="flex justify-between w-full mb-8">
            <p className="text-lg text-center text-primary-purple">MAX</p>
            <p className="text-md text-center text-primary-gray">
              Available SOL {solBalance.toFixed(4)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-4 text-center w-full justify-center">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "←"].map(
              (key) => (
                <button
                  key={key}
                  onClick={() => handleInput(key === "←" ? "backspace" : key)}
                  className="w-14 h-14 rounded-full text-xl font-medium text-white bg-primary-lightGray justify-self-center focus:bg-primary-light active:bg-opacity-75"
                >
                  {key}
                </button>
              )
            )}
          </div>
          <button
            onClick={() => {
              if (amount) {
                setIsScanQROpen(true);
              }
            }}
            className={`w-full py-3 text-white text-lg font-normal rounded mt-4 ${
              amount ? "bg-primary-green" : "bg-primary-gray"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 z-10 bg-background-default">
        <BottomSheet
          className="bg-background-default"
          hideHandle={true}
          isOpen={isScanQROpen}
          showCloseButton={false}
          onClose={() => setIsScanQROpen(false)}
        >
          <ScanQR
            amount={amount}
            amountInSol={usdToSol(Number(amount), solPriceUSD).toFixed(4)}
            setIsWithdrawQROpen={setIsWithdrawQROpen}
            setIsScanQROpen={setIsScanQROpen}
          />
        </BottomSheet>
      </div>
    </div>
  );
};
