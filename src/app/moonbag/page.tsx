"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { useSolana } from "@/lib/customHooks/useSolana";
import { calculatePnL } from "@/utils/utils";
import { calculateCurrentValue } from "@/utils/utils";
import { formatBalance } from "@/utils/utils";
import { PortfolioSummary } from "./PortfolioSummary";
import CoinList from "./CoinList";
import { useAuth } from "@/lib/customHooks/useAuth";
import { ConditionalBottomSheets } from "@/components/ui/Moonbag/ConditionalBottomSheets";
import { usePortfolioCalculations } from "@/lib/customHooks/usePortfolioCalculations";
import { MemoizedCoinCard } from "@/components/ui/Moonbag/MemoizedCoinCard";

const MoonbagScreen = () => {
  const [moongbagCoins, setmoongbagCoins] = useState<CoinTypes[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);

  const { loading, data, fetchPortfolio } = useRefreshPortfolio();
  const { publicKey, token } = useAuth();

  const [state, setState] = useState({
    isDetailsOpen: false,
    openDumpSliderSheet: false,
    selectedCard: null as CoinTypes | null,
    isPullDown: false,
    pullStartY: 0,
  });

  const {
    tokenAccounts,
    loading: tokenAccountsLoading,
    fetchAccounts,
  } = useSolana();
  const { totalBalanceUSD, solUSD, totalChangeUSD, totalChangePercentage } =
    usePortfolioCalculations(data, moongbagCoins, tokenAccounts);

  const handleRefresh = async () => {
    if (!publicKey) return;
    try {
      await fetchPortfolio(publicKey.toBase58(), token || "");
    } catch (err) {
      console.error("Error refreshing portfolio:", err);
    }
  };

  const handleTouch = useCallback(
    (type: "start" | "move" | "end", e: React.TouchEvent) => {
      if (type === "start") {
        const touchY = e.touches[0].clientY;
        const container = e.currentTarget;
        if (container.scrollTop === 0) {
          setState((prev) => ({
            ...prev,
            pullStartY: touchY,
            isPullDown: true,
          }));
        } else {
          setState((prev) => ({ ...prev, isPullDown: false }));
        }
      } else if (type === "move") {
        if (!state.isPullDown) return;
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - state.pullStartY;
        if (deltaY > 0) {
          e.preventDefault();
        }
      } else if (type === "end") {
        if (!state.isPullDown) return;
        const touchY = e.changedTouches[0].clientY;
        const deltaY = touchY - state.pullStartY;
        if (deltaY > 100) {
          handleRefresh();
        }
        setState((prev) => ({ ...prev, isPullDown: false, pullStartY: 0 }));
      }
    },
    [state.pullStartY, state.isPullDown]
  );

  const coinList = useMemo(
    () =>
      moongbagCoins.map((coin) => (
        <MemoizedCoinCard
          key={coin.coinId}
          coin={coin}
          tokenAccounts={tokenAccounts}
          data={data}
          onClick={() =>
            setState((prev) => ({
              ...prev,
              selectedCard: coin,
              isDetailsOpen: true,
            }))
          }
        />
      )),
    [moongbagCoins, tokenAccounts, data]
  );

  useEffect(() => {
    if (publicKey) {
      handleRefresh();
    }
  }, [publicKey]);

  useEffect(() => {
    if (data?.solBalanceInLamports !== undefined) {
      setSolBalance(lamportsToSol(data.solBalanceInLamports));
    }
    if (data?.coins !== undefined) {
      setmoongbagCoins(data.coins);
    }
  }, [data]);

  useEffect(() => {
    if (publicKey) {
      fetchAccounts(publicKey.toBase58(), token || "");
    }
  }, [publicKey, token]);

  const isLoading = loading || tokenAccountsLoading;

  return (
    <div className="flex flex-col justify-between h-full flex-1 relative py-2">
      {isLoading ? (
        <div className="mt-10 flex justify-center">
          <PuffLoader color="#fff" />
        </div>
      ) : (
        <div
          onTouchStart={(e) => handleTouch("start", e)}
          onTouchMove={(e) => handleTouch("move", e)}
          onTouchEnd={(e) => handleTouch("end", e)}
        >
          <div className="mt-[40px]">
            <div className="w-full">
              <PortfolioSummary
                totalBalanceUSD={totalBalanceUSD}
                solBalance={solBalance}
                solPriceUSD={data?.solPriceUSD}
                totalChangeUSD={totalChangeUSD}
                totalChangePercentage={totalChangePercentage}
              />

              <ActionTabs
                solPriceUSD={data?.solPriceUSD}
                solBalance={solBalance}
              />

              <CoinList coins={coinList} />
            </div>
          </div>

          {moongbagCoins.length > 0 && (
            <DumpButton
              onClick={() =>
                setState((prev) => ({ ...prev, openDumpSliderSheet: true }))
              }
            />
          )}

          <ConditionalBottomSheets state={state} setState={setState} />
        </div>
      )}
    </div>
  );
};

export default function Page() {
  return <MoonbagScreen />;
}

const DumpButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
      <div className="w-full">
        <button
          className="w-full mb-1 rounded-2xl bg-primary-main px-[20px] py-4 text-2xl"
          onClick={onClick}
        >
          Dump it all..
        </button>
      </div>
    </div>
  );
};
