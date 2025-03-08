"use client";

import React from "react";
import Image from "next/image";

interface CoinCardProps {
  imageUrl: string;
  title: string;
  children?: React.ReactNode;
}
export const CoinCard: React.FC<CoinCardProps> = ({
  imageUrl,
  title,
}: CoinCardProps) => {
  return (
    <>
      <div className="flex items-center p-2 bg-primary-dark rounded-[24px] shadow mb-2">
        <Image
          src={imageUrl}
          alt={"test"}
          width={100}
          height={100}
          className="rounded-full object-cover h-[50px] w-[50px]"
        />

        <div className="flex flex-1 justify-between items-center ml-[10px]">
          <div>
            <label className="text-primary-white text-[12px]">
              {title}
            </label>
            <p className="font-futura text-[11px] text-primary-gray">
              {"8707.877 ACE"}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <label className="text-primary-white">{"$15.57"}</label>
            <label className="font-futura text-[10px] text-primary-green">
              {"+$15.37"}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
