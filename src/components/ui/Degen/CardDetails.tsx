"use client";

import Image from "next/image";
import React from "react";
import { CoinDetailCard } from "../CoinDetail/CoinDetailCard";
import { Button } from "../Button";
import { Typography } from "../Typography";
import { CoinTypes } from "@/types/coins";
import { BottomSheet } from "../BottomSheet";
import { ApeItAllSheet } from "../Likes/ApeItAllSheet";

interface CardDetailsProps {
  card: CoinTypes;
  setIsOpen: (isOpen: boolean) => void;
}

export const CardDetails = ({ card, setIsOpen }: CardDetailsProps) => {
  const [apeItAllOpen, setApeItAllOpen] = React.useState(false);
  return (
    <div className="relative max-h-[82vh] overflow-y-auto">
      <div className="w-full h-[150px]">
        <div className="relative w-full h-full">
          <Image
            src={card?.metadata?.image}
            alt="Background"
            fill
            className="object-cover"
          />

          <div className="absolute top-0 left-0 right-0 h-[10px] backdrop-blur-xl backdrop-saturate-100" />
          <div className="absolute bottom-0 left-0 right-0 h-[10px] backdrop-blur-xl backdrop-saturate-100" />
          <div className="absolute top-0 bottom-0 left-0 w-[40px] backdrop-blur-xl backdrop-saturate-100" />
          <div className="absolute top-0 bottom-0 right-0 w-[40px] backdrop-blur-xl backdrop-saturate-100" />
        </div>
      </div>
      <div className="flex flex-col mt-[10px]">
        <div className="h-[350px] bg-primary-black p-2 border-[1px] border-primary-lightGray rounded-2xl mb-[10px] flex items-center justify-center">
          <div id="dexscreener-embed" className="w-full h-full">
            <iframe
              src={`https://dexscreener.com/solana/${card?.metadata?.mintAddress}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=1&chartType=price&interval=5`}
              className="w-full h-[330px] border-0"
            ></iframe>
          </div>
        </div>

        <Button
          variant="secondary"
          className="mb-[10px] rounded-xl"
          onClick={() => setApeItAllOpen(true)}
        >
          Pump it
        </Button>

        <CoinDetailCard coin={card} />

        <Typography
          variant="body1"
          className={`text-[10px] text-secondary-gray`}
        >
          {
            "Coin cross is not a cryptocurrency. It is a community-driven project that allows users to create and manage their own tokens on the TON blockchain."
          }
        </Typography>
      </div>

      <BottomSheet
        className="bg-background-default rounded-t-[20px] border-t border-x border-gray-700"
        backdropBlur={true}
        isOpen={apeItAllOpen}
        showCloseButton={false}
        small={true}
        onClose={() => setApeItAllOpen(false)}
      >
        <ApeItAllSheet mints={[card?.metadata?.mintAddress]}/>
      </BottomSheet>
    </div>
  );
};
