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
            width={100}
            height={100}
            className="rounded-lg object-cover h-[30px] w-[30px]"
          />

          <div className="flex flex-1 justify-between items-center ml-4">
            <div>
              <Typography variant="caption1" className="text-primary-white">
                {title}
              </Typography>
              <Typography variant="caption1" className="text-primary-white">
                ${parseFloat(priceUSD).toFixed(2)}
              </Typography>
            </div>

            <button
              onClick={(e) => handleRemove(e, id)}
              className="text-[var(--tg-theme-hint-color)]"
            >
              <IoMdClose size={20} color="#0a8d" />
            </button>
          </div>
        </div>
      {/* ))} */}
    </>
  );
};
