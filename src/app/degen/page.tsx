"use client";

import { useEffect, useState, useRef } from "react";
import HeartIcon from "../../../public/assets/svg/HeartIcon";
import { SwipeableCardStack } from "@/components/ui/SwipeableCardStack";
import SkipCoinIcon from "../../../public/assets/svg/SkipIcon";
import DetailIcon from "../../../public/assets/svg/DetailIcon";
import { useFetchCoins } from "@/lib/customHooks/useFetchCoins";

const DegenScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [removedCards, setRemovedCards] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAllDataFetched, setIsAllDataFetched] = useState(false);
  const currentIndexRef = useRef(currentIndex);

  const {
    coins,
    loading,
    error,
    hasMore,
    fetchNewCoins,
    fetchNextCoins,
    resetCoins,
  } = useFetchCoins();

  // Track index changes
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Detect end of list
  useEffect(() => {
    if (!hasMore && coins.length > 0 && currentIndex >= coins.length - 1) {
      setIsAllDataFetched(true);
    }
  }, [currentIndex, coins.length, hasMore]);

  // Initial fetch
  useEffect(() => {
    const fetchInitial = () => {
      const userId = sessionStorage.getItem("userId");
      const userToken = sessionStorage.getItem("jwtToken");
      if (userId && userToken) {
        fetchNewCoins(userId, [], 5, userToken);
      }
    };

    if (typeof window !== "undefined") fetchInitial();
  }, [fetchNewCoins]);

  const handleSwipe = (direction: "left" | "right" | "up" | "down") => {
    const currentCoinId = coins[currentIndexRef.current].coinId;
    const updatedRemoved = [...removedCards, currentCoinId];

    setRemovedCards(updatedRemoved);
    setCurrentIndex((prev) => Math.min(prev + 1, coins.length - 1));

    // Check if we need to fetch more
    if (currentIndexRef.current >= coins.length - 2 && hasMore && !loading) {
      const userId = sessionStorage.getItem("userId");
      const userToken = sessionStorage.getItem("jwtToken");
      if (userId && userToken) {
        fetchNextCoins(userId, updatedRemoved, 5, userToken);
      }
    }

    // Handle like
    if (direction === "right") {
      const storedCoins = JSON.parse(
        localStorage.getItem("likedCoins") || "[]"
      );
      if (!storedCoins.some((c: any) => c.coinId === currentCoinId)) {
        localStorage.setItem(
          "likedCoins",
          JSON.stringify([...storedCoins, coins[currentIndexRef.current]])
        );
      }
    }
  };

  const handleRestart = () => {
    const userId = sessionStorage.getItem("userId");
    const userToken = sessionStorage.getItem("jwtToken");

    setCurrentIndex(0);
    setRemovedCards([]);
    setIsAllDataFetched(false);
    resetCoins();

    if (userId && userToken) {
      fetchNewCoins(userId, [], 5, userToken);
    }
  };

  return isAllDataFetched ? (
    <div className="text-center mt-4">
      <p className="text-lg font-bold">All coins fetched!</p>
      <button
        onClick={handleRestart}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Start Over
      </button>
    </div>
  ) : (
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
