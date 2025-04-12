"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "../Typography";
import { IoMdClose } from "react-icons/io";


interface LikesCardProps {
  id: string;
  imageUrl: string;
  title: string;
  priceUSD: string;
  isDetailsOpen: boolean;
  setDetailsOpen: (open: boolean) => void;
  handleRemove: (e: React.MouseEvent, id: string) => void;
  children?: React.ReactNode;
}
export const LikesCard: React.FC<LikesCardProps> = ({
  id,
  imageUrl,
  title,
  priceUSD,
  handleRemove,
}: LikesCardProps) => {

  return (
    <>
      {/* {likesData.map((item: LikesData) => ( */}
        <div
          className="flex items-center p-4 bg-primary-black rounded-lg shadow mb-2"
        >
          <Image
            src={imageUrl}
            alt={"test"}
            width={44}
            height={44}
            className="rounded-[10px] object-cover h-[44px] w-[44px]"
          />

          <div className="flex flex-1 justify-between items-center ml-4">
            <div className="flex flex-col">
              <label className="font-amalta font-normal text-[16px] text-primary-white">
                {title}
              </label>
              <label className="font-amalta font-normal text-[16px] text-primary-light">
                ${parseFloat(priceUSD).toFixed(2)}
              </label>
            </div>

            <button
              onClick={(e) => handleRemove(e, id)}
              className="text-[var(--tg-theme-hint-color)]"
            >
              <IoMdClose size={20} color="#FF2D55" className="font-black"/>
            </button>
          </div>
        </div>
      {/* ))} */}
    </>
  );
};
