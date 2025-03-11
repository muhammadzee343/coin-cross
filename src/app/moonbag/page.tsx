"use client";

import React, { useState, useEffect } from "react";
import { ActionTabs } from "@/components/ui/Moonbag/ActionTabs";
import { CoinCard } from "@/components/ui/Moonbag/CoinCard";
import Image from "next/image";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ApeItAllSheet } from "@/components/ui/Likes/ApeItAllSheet";
import { CoinTypes } from "@/types/coins";
import { PublicKey } from "@solana/web3.js";
import { useRefreshPortfolio } from "@/lib/customHooks/useProfolio";
import PuffLoader from "react-spinners/PuffLoader";
import { lamportsToSol } from "@/utils/lamportsToSol";
import { CardDetails } from "@/components/ui/Degen/CardDetails";

const MoonbagScreen = () => {
  const [USDPrice, setUSDPrice] = useState<number>(0);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CoinTypes | null>(null);
  const [openDumpSliderSheet, setOpenDumpSliderSheet] = useState(false);
  const [moongbagCoins, setmoongbagCoins] = useState<CoinTypes[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isTradeObserved, setIsTradeObserved] = useState<boolean>(false);

  const { loading, data, error, fetchPortfolio } = useRefreshPortfolio();

  console.log(data , "data");
  const handleRefresh = async () => {
    if (!publicKey) return;
    try {
      await fetchPortfolio(publicKey.toBase58(), token || "");
    } catch (err) {
      console.error("Error refreshing portfolio:", err);
    }
  };

  const openDetails = (card: CoinTypes) => {
    setSelectedCard(card);
    setDetailsOpen(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPublicKey(new PublicKey(localStorage.getItem("publicKey") || ""));
      setToken(localStorage.getItem("jwtToken") || "");
    }
  }, []);

  useEffect(() => {
    if (publicKey) {
      handleRefresh();
    }
  }, [publicKey, isTradeObserved]);

  useEffect(() => {
    if (
      data?.solBalanceInLamports !== undefined &&
      data?.solPriceUSD !== undefined
    ) {
      setSolBalance(lamportsToSol(data.solBalanceInLamports));
      setUSDPrice(data.solPriceUSD);
    }
    if (data?.coins !== undefined) {
      setmoongbagCoins(data.coins);
    }
  }, [data]);

  return (
    <div className="flex flex-col justify-between h-full flex-1 relative">
      {loading ? (
        <div className="mt-10 flex justify-center">
          <PuffLoader />
        </div>
      ) : (
        <div>
          <div className="mt-[40px]">
            <div className="w-full">
              <div className="flex flex-col items-center justify-center mb-5">
                <label className="text-primary-white md:text-[40px] text-[32px]">
                  ${(solBalance * USDPrice).toFixed(2)}
                </label>
                <div className="flex items-baseline gap-2">
                  <label className="text-primary-green">
                    {`+$34.97 `} {` `}
                  </label>
                  <label className="bg-primary-green rounded-[5px] px-[5px]">
                    {`$34.60%`}
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
                    {solBalance.toFixed(4)}
                  </label>
                </div>
                <label className="text-primary-white">
                  ${(solBalance * USDPrice).toFixed(2)}
                </label>
              </div>

              <ActionTabs solPriceUSD={USDPrice} solBalance={solBalance} />

              <div className="flex flex-col items-center justify-center mt-[15px]">
                <div className="w-full">
                  {moongbagCoins.length > 0 ? (
                    moongbagCoins.map((card) => (
                      <div key={card.coinId} onClick={() => openDetails(card)}>
                        <CoinCard
                          card={card}
                          imageUrl={card.metadata.image}
                          title={card.metadata.name}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-primary-white">No coins yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {moongbagCoins.length > 0 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="w-full">
                <button
                  className="w-full mb-1 rounded-xl bg-primary-main px-[20px] py-[10px]"
                  onClick={() => setOpenDumpSliderSheet(true)}
                >
                  Dump it all...
                </button>
              </div>
            </div>
          )}

          <BottomSheet
            className="bg-background-card"
            isOpen={isDetailsOpen}
            onClose={() => setDetailsOpen(false)}
          >
            {selectedCard && (
              <CardDetails
                card={selectedCard}
                setDetailsOpen={setDetailsOpen}
                isCoinDump={true}
              />
            )}
          </BottomSheet>
          <BottomSheet
            className="bg-background-default rounded-t-[20px] border-t border-x border-gray-700"
            backdropBlur={true}
            isOpen={openDumpSliderSheet}
            showCloseButton={false}
            small={true}
            onClose={() => setOpenDumpSliderSheet(false)}
          >
            <ApeItAllSheet
              mints={moongbagCoins.map((coin) => ({
                mintAddress: coin.metadata?.mintAddress,
              }))}
              isCoinDump={true}
              setApeItAllOpen={setOpenDumpSliderSheet}
              setIsTradeObserved={setIsTradeObserved}
            />
          </BottomSheet>
        </div>
      )}
    </div>
  );
};

export default function Page() {
  return <MoonbagScreen />;
}
