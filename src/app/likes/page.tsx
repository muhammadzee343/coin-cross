"use client";

import React, { useEffect, useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { ApeItAllSheet } from "@/components/ui/Likes/ApeItAllSheet";
import { LikesCard } from "@/components/ui/Likes/LikesCard";
import { CardDetails } from "@/components/ui/Degen/CardDetails";
import { CoinTypes } from "@/types/coins";

const LikesScreen = () => {
  const [selectedCard, setSelectedCard] = useState<CoinTypes | null>(null);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [apeItAllOpen, setApeItAllOpen] = useState(false);
  const [likes, setLikes] = useState<CoinTypes[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLikes = JSON.parse(
        localStorage.getItem("likedCoins") || "[]"
      );
      setLikes(storedLikes);
    }
  }, []);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updatedLikes = likes.filter((item: CoinTypes) => item.coinId !== id);
    setLikes(updatedLikes);
    if (typeof window !== "undefined") {
      localStorage.setItem("likedCoins", JSON.stringify(updatedLikes));
    }
  };

  const openDetails = (card: CoinTypes) => {
    setSelectedCard(card);
    setDetailsOpen(true);
  };

  return (
    <div className="flex flex-col justify-between flex-1">
      <div className="flex flex-col items-center justify-center mt-[25px]">
        <div className="w-full">
          {likes.length > 0 ? (
            likes.map((card) => (
              <div key={card.coinId} onClick={() => openDetails(card)}>
                <LikesCard
                  id={card.coinId}
                  imageUrl={card?.metadata?.image}
                  title={card?.metadata?.name}
                  isDetailsOpen={isDetailsOpen}
                  setDetailsOpen={setDetailsOpen}
                  handleRemove={(e: React.MouseEvent) =>
                    handleRemove(e, card.coinId)
                  }
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-primary-white">No likes yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet for Details */}
      <BottomSheet
        className="bg-background-card"
        isOpen={isDetailsOpen}
        onClose={() => setDetailsOpen(false)}
      >
        {selectedCard && (
          <CardDetails card={selectedCard} setIsOpen={setDetailsOpen} />
        )}
      </BottomSheet>

      {/* Bottom Sheet for Ape It All */}
      <BottomSheet
        className="bg-background-default rounded-t-[20px] border-t border-x border-gray-700"
        backdropBlur={true}
        isOpen={apeItAllOpen}
        showCloseButton={false}
        small={true}
        onClose={() => setApeItAllOpen(false)}
      >
        <ApeItAllSheet
          mints={likes.map((coin) => coin.metadata?.mintAddress)}
        />
      </BottomSheet>

      {likes.length > 0 && (
        <div className="fixed bottom-2 left-0 right-0 flex justify-center">
          <div className="w-full mx-4">
            <Button
              variant="secondary"
              className="w-full mb-1 rounded-xl"
              onClick={() => setApeItAllOpen(true)}
            >
              Ape it all...
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikesScreen;
