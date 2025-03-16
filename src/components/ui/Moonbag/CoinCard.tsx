"use client";

import React from "react";
import Image from "next/image";

interface CoinCardProps {
  imageUrl: string;
  title: string;
  symbol: string;
  balance: string;
  currentValue: string;
  pnl: string;
  pnlValue: number;
  solValue?: string;
  onClick?: () => void;
}

export const CoinCard: React.FC<CoinCardProps> = ({
  imageUrl,
  title,
  symbol,
  balance,
  currentValue,
  pnl,
  pnlValue,
  solValue,
  onClick,
}: CoinCardProps) => {
  return (
    <>
      <div className="flex items-center p-2 bg-primary-dark rounded-[24px] shadow mb-2 w-full" onClick={onClick}>
        <Image
          src={imageUrl}
          alt={"test"}
          width={100}
          height={100}
          className="rounded-full object-cover h-[50px] w-[50px]"
        />

        <div className="flex flex-1 justify-between items-center ml-[10px]">
          <div>
            <label className="text-primary-white text-[12px]">{title}</label>
            <p className="font-futura text-[11px] text-primary-gray">
              {balance} {symbol}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <label className="text-primary-white">{currentValue}</label>
            <label
              className={`font-futura text-[10px] ${
                pnlValue > 0
                  ? "text-primary-green"
                  : pnlValue < 0
                  ? "text-primary-red"
                  : "text-primary-gray"
              }`}
            >
              {pnl || "0"}%
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
