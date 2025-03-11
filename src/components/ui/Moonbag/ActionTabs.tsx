"use client";
import React, { useEffect, useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Withdraw } from "./Withdraw";
import { HiArrowUpRight } from "react-icons/hi2";
import { IoQrCodeOutline } from "react-icons/io5";
import { IoList } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { Settings } from "./settings";
import { AddSolanaQR } from "../AddSolanaQR";

interface ActionTabsProps {
  solPriceUSD: number;
  solBalance: number;
}
export const ActionTabs = ({ solPriceUSD, solBalance }: ActionTabsProps) => {
  const [showSolanaWalletQR, setShowSolanaWalletQR] = useState<boolean>(false);
  const [isWithdrawQROpen, setIsWithdrawQROpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAddress = localStorage.getItem("walletAddress");
      setWalletAddress(storedAddress);
    }
  }, []);

  return (
    <div>
      <div className="w-full flex flex-nowrap justify-between gap-[12px] mt-[5px]">
        <button
          className="flex-1 flex flex-col items-center moonbag-action-tab rounded-[12px] active:bg-opacity-75"
          onClick={() => setShowSolanaWalletQR(true)}
        >
          <IoQrCodeOutline className="text-primary-purple text-2xl" />
          <label className="text-primary-white text-[12px]">Deposit</label>
        </button>
        <button
          className="flex-1 flex flex-col items-center moonbag-action-tab rounded-[12px] active:bg-opacity-75"
          onClick={() => setIsWithdrawQROpen(true)}
        >
          <HiArrowUpRight className="text-primary-purple text-2xl" />
          <label className="text-primary-white text-[12px]">Withdraw</label>
        </button>
        <button className="flex-1 flex flex-col items-center moonbag-action-tab rounded-[12px] active:bg-opacity-75">
          <IoList className="text-primary-purple text-2xl" />
          <a
            href={
              walletAddress
                ? `https://solscan.io/account/${walletAddress}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-white text-[12px]"
          >
            {"Txns"}
          </a>
        </button>
        <button
          className="flex-1 flex flex-col items-center moonbag-action-tab rounded-[12px] active:bg-opacity-75"
          onClick={() => setIsPrefsOpen(true)}
        >
          <FiSettings className="text-primary-purple text-2xl" />
          <label className="text-primary-white text-[12px]">Prefs</label>
        </button>
      </div>

      <div className="fixed bottom-0 z-10 bg-background-default ">
        <BottomSheet
          className="bg-background-default border-t border-x border-gray-600 rounded-t-[12px]"
          hideHandle={true}
          isOpen={showSolanaWalletQR}
          onClose={() => setShowSolanaWalletQR(false)}
        >
          <AddSolanaQR setIsQRLoginOpen={setShowSolanaWalletQR} />
        </BottomSheet>
      </div>

      <div className="fixed bottom-0 z-10 bg-background-default">
        <BottomSheet
          className="bg-background-default border-t border-x border-gray-600 rounded-t-[12px]"
          hideHandle={true}
          isOpen={isWithdrawQROpen}
          showCloseButton={false}
          onClose={() => setIsWithdrawQROpen(false)}
        >
          <Withdraw solPriceUSD={solPriceUSD} solBalance={solBalance} setIsWithdrawQROpen={setIsWithdrawQROpen}/>
        </BottomSheet>
      </div>

      <div className="fixed bottom-0 z-10 bg-background-default">
        <BottomSheet
          className="bg-background-default border-t border-x border-gray-600 rounded-t-[12px]"
          hideHandle={true}
          isOpen={isPrefsOpen}
          onClose={() => setIsPrefsOpen(false)}
        >
          <Settings />
        </BottomSheet>
      </div>
    </div>
  );
};
