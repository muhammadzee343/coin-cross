"use client";

import { useEffect, useState } from "react";
import HeartIcon from "../../../public/assets/svg/HeartIcon";
import { SwipeableCardStack } from "@/components/ui/SwipeableCardStack";
import SkipCoinIcon from "../../../public/assets/svg/SkipIcon";
import DetailIcon from "../../../public/assets/svg/DetailIcon";
import { useFetchCoins } from "@/lib/customHooks/useFetchCoins";

const DegenScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [removedCards, setRemovedCards] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const {
    coins,
    loading,
    error,
    hasMore,
    fetchNewCoins,
    fetchNextCoins,
    resetCoins,
  } = useFetchCoins();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      const userToken = localStorage.getItem("jwtToken");
      if (userId !== null && userToken != null) {
        fetchNewCoins(userId, [], 5, userToken);
      }
    }
  }, [fetchNewCoins]);

  const handleSwipe = (direction: "left" | "right" | "up" | "down") => {
    setRemovedCards([...removedCards, coins[currentIndex].coinId]);
  
    if (direction === "right") {
      if (typeof window !== "undefined") {
        const storedCoins = JSON.parse(localStorage.getItem("likedCoins") || "[]");
  
        const isAlreadyLiked = storedCoins.some(
          (coin: any) => coin.coinId === coins[currentIndex].coinId
        );
  
        if (!isAlreadyLiked) {
          const updatedCoins = [...storedCoins, coins[currentIndex]];
          localStorage.setItem("likedCoins", JSON.stringify(updatedCoins));
        }
      }
    }
  
    if (currentIndex < coins.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  
    if (currentIndex >= coins.length - 2 && hasMore) {
      if (typeof window !== "undefined") {
        const userId = localStorage.getItem("userId");
        const userToken = localStorage.getItem("jwtToken");
        if (userId !== null && userToken != null) {
          fetchNextCoins(userId, removedCards, 5, userToken);
        }
      }
    }
  };
  
  return (
    <div className="flex flex-col justify-between h-full flex-1">
      <div className="min-h-[50vh]">
        {coins.length > 0 && (
          <SwipeableCardStack
            cards={coins}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            removedCards={removedCards}
            handleSwipe={handleSwipe}
          />
        )}
      </div>
      <div className="md:pb-4 pb-2 flex justify-center">
        <div className="w-full md:p-[22px] p-[16px] flex justify-between items-center md:border-[5px] border-[4px] shadow-[0_0px_3px_rgba(0,0,0,1)] border-primary-black md:rounded-[32px] rounded-[24px]">
          <button
            onClick={() => handleSwipe("left")}
            className={`relative shadow-[0_0_0_0px_rgba(0,0,0,1),inset_0_3px_5px_0px_rgba(255,255,255,0.3),inset_0_-2px_5px_0px_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.4)] 
              flex items-center justify-center bg-redish-brown-gradient md:w-24 w-20 md:h-[72px] h-[60px] md:rounded-2xl rounded-xl border-4 border-black`}
          >
            <SkipCoinIcon className="text-[#9a2d2e]" />
          </button>

          <button
            className={`relative shadow-[0_0_0_0px_rgba(0,0,0,1),inset_0_3px_5px_0px_rgba(255,255,255,0.3),inset_0_-2px_5px_0px_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.4)]
              flex items-center justify-center bg-copper-gradient w-16 h-12 rounded-xl border-[3px] border-black`}
            onClick={() => setIsOpen(true)}
          >
            <DetailIcon />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className={`relative shadow-[0_0_0_0px_rgba(0,0,0,1),inset_0_3px_5px_0px_rgba(255,255,255,0.3),inset_0_-2px_5px_0px_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.4)]
               flex items-center justify-center bg-green-gradient md:w-24 w-20 md:h-[72px] h-[60px] md:rounded-2xl rounded-xl border-4 border-black`}
          >
            <HeartIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DegenScreen;
