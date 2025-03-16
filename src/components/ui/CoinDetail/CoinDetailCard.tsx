import React from "react";
import { Typography } from "../Typography";
import { Card } from "../Card";
import { Abril_Fatface } from "next/font/google";
import { CoinTypes } from "@/types/coins";

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
});

interface CoinDetailProps {
  coin: CoinTypes
}

export const CoinDetailCard: React.FC<CoinDetailProps> = ({ coin }) => {
  const coinDetails = [
    { label: "Market Cap", value: coin?.coinGeckoData?.marketCapUsd },
    { label: "5m", value: coin?.coinGeckoData?.coinGeckoPoolData[0]?.priceChangeM5},
    { label: "1h", value: coin?.coinGeckoData?.coinGeckoPoolData[0]?.priceChangeH1},
    { label: "24h", value: coin?.coinGeckoData?.coinGeckoPoolData[0]?.priceChangeH24},
    { label: "Volume (1h)", value: coin?.coinGeckoData?.coinGeckoPoolData[0]?.volumeH1Usd },
    { label: "Liquidity", value: coin?.coinGeckoData?.totalReserveUsd },
    { label: "Buyer/Seller (1h)", value: `${coin?.coinGeckoData?.coinGeckoPoolData[0]?.transactionsH1Buyers}/${coin?.coinGeckoData?.coinGeckoPoolData[0]?.transactionsH1Sellers}` },
    { label: "Pool Created", value: coin?.coinGeckoData?.coinGeckoPoolData[0]?.poolCreatedAt},
  ];

  return (
    <div className="flex flex-col pb-4 text-primary-light">
      <Card className="bg-primary-black p-2 border-[1px] border-primary-lightGray rounded-2xl">
        <div>
          <Typography variant="h3" className="text-primary-white">
            {coin?.metadata?.name}
          </Typography>
          <Typography variant="body2" className="pt-[5px]">
            {coin?.metadata?.name}
          </Typography>
        </div>
        {coinDetails.map(({ label, value }, index) => (
          <div
            key={label}
            className={`${index === 0 ? "pt-[15px]" : "pt-[10px]"} ${
              index === coinDetails.length - 1 ? "pb-[5px]" : ""
            }`}
          >
            {label === "5m" && (
              <Typography
                variant="caption1"
                className={`text-sm ${abrilFatface.className}`}
              >
                {"Change"}
              </Typography>
            )}
            <div
              className={`flex flex-row justify-between ${
                index === 1 || index === 2 || index === 3 ? "pl-[10px]" : ""
              }`}
            >
              <Typography
                variant="caption1"
                className={`text-sm ${abrilFatface.className}`}
              >
                {label}
              </Typography>
              <Typography
                variant="caption1"
                className={`text-sm ${
                  index === 1 || index === 2 || index === 3
                    ? "text-text-green"
                    : ""
                } ${abrilFatface.className}`}
              >
                {value}
              </Typography>
            </div>
          </div>
        ))}

        <div className={`flex flex-row justify-between`}>
          <Typography
            variant="caption1"
            className={`text-sm ${abrilFatface.className}`}
          >
            {"Contract"}
          </Typography>
          <div className="flex items-center gap-1 max-w-[70%]">
            <a
              href={`https://solscan.io/token/${coin?.metadata?.mintAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm truncate underline ${abrilFatface.className}"
            >
              {coin?.metadata?.mintAddress.length > 30
                ?`https://solscan.io/token/${coin?.metadata?.mintAddress.slice(0, 30)}` + "..."
                : `https://solscan.io/token/${coin?.metadata?.mintAddress}`}
            </a>
          </div>
        </div>
        <div className={`flex flex-row justify-between`}>
          <Typography
            variant="caption1"
            className={`text-sm ${abrilFatface.className}`}
          >
            {"More info"}
          </Typography>
          <div className="flex items-center gap-1 max-w-[70%]">
            <a
              href={`https://dexscreener.com/solana/${coin?.metadata?.mintAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm truncate underline ${abrilFatface.className}"
            >
               {"Dexxeresxd"}
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};
