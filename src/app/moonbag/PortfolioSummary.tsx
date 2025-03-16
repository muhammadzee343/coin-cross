import React from "react";
import Image from "next/image";
import { lamportsToSol } from "@/utils/lamportsToSol";

interface PortfolioSummaryProps {
  totalBalanceUSD: number;
  solBalance: number;
  solPriceUSD: number;
  totalChangeUSD: number;
  totalChangePercentage: number;
}

export const PortfolioSummary = ({
  totalBalanceUSD,
  solBalance,
  solPriceUSD,
  totalChangeUSD,
  totalChangePercentage,
}: PortfolioSummaryProps) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-5">
        <label className="text-primary-white md:text-[40px] text-[32px]">
          ${totalBalanceUSD.toFixed(2)}
        </label>
        <div className="flex items-baseline gap-2">
          <label
            className={
              totalChangeUSD >= 0 ? "text-primary-green" : "text-primary-red"
            }
          >
            {`${totalChangeUSD >= 0 ? "+" : ""}$${Math.abs(
              totalChangeUSD
            ).toFixed(2)} `}
          </label>
          <label
            className={`rounded-[5px] px-[5px] ${
              totalChangeUSD >= 0 ? "bg-primary-green" : "bg-primary-red"
            }`}
          >
            {`${totalChangePercentage >= 0 ? "+" : ""}${(
              Math.abs(totalChangePercentage) / 100000000000
            ).toFixed(2)}%`}
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/solana-logo.webp"
            alt="stream"
            width={20}
            height={20}
          />
          <label className="font-amalta text-primary-white">
            ${solBalance}
          </label>
        </div>
        <label className="text-primary-white">
          $
          {((solBalance || 0) * (solPriceUSD || 0)).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </label>
      </div>
    </div>
  );
};
