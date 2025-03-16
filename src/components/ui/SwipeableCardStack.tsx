"use client";
import React from "react";
import { SwipeableCard } from "./SwipeableCard";
import { BottomSheet } from "./BottomSheet";
import { CardDetails } from "./Degen/CardDetails";
import { CoinTypes } from "@/types/coins";

interface SwipeableCardStackProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  cards: CoinTypes[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  removedCards: string[];
  handleSwipe: (direction: "left" | "right" | "up" | "down") => void;
}

export const SwipeableCardStack = ({
  cards,
  isOpen,
  setIsOpen,
  currentIndex,
  removedCards,
  handleSwipe,
}: SwipeableCardStackProps) => {
  return (
    <div className="relative mt-[25px]">
      {/* card container */}
      <div className="relative w-full">
        {cards
          .slice()
          .reverse()
          .map((card, reversedIndex) => {
            const index = cards.length - 1 - reversedIndex;

            if (removedCards.includes(card.coinId)) return null;

            if (index < currentIndex || index > currentIndex + 2) return null;

            const isTop = index === currentIndex;

            if (!cards || cards.length === 0) {
              return <p>Loading cards...</p>;
            }

            return (
              <div key={card.coinId}>
                <div
                  key={card.coinId}
                  className="absolute top-0 left-0 right-0 w-full"
                  style={{
                    transform: `scale(${1 - (index - currentIndex) * 0.05})`,
                    zIndex: isTop ? 10 : 1,
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setIsOpen(true)}
                >
                  <SwipeableCard
                    imageUrl={card?.metadata?.image}
                    title={card?.metadata?.name}
                    description={card?.metadata?.description}
                    marketCapValue={card?.coinGeckoData?.marketCapUsd}
                    marketCapChange_24h={
                      card?.coinGeckoData?.coinGeckoPoolData?.[0]
                        ?.priceChangeH24 ?? "N/A"
                    }
                    coinCreated={card?.coinGeckoData?.createdAt}
                    onSwipe={isTop ? handleSwipe : undefined}
                  />
                </div>

                <div className="fixed bottom-0 z-10">
                  <BottomSheet
                    className="bg-background-card"
                    // hideHandle={true}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                  >
                    <CardDetails card={card} setDetailsOpen={setIsOpen} />
                  </BottomSheet>
                </div>
              </div>
            );
          })}
      </div>

      {/* No cards left */}
      {cards.length < 0 && (
        <div className="flex items-center justify-center">
          <p className="text-[var(--tg-theme-hint-color)] text-lg">
            No more cards!
          </p>
        </div>
      )}
    </div>
  );
};
