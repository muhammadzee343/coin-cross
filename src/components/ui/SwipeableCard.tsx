"use client";

import React, { useState } from "react";
import { useSwipeable, SwipeEventData } from "react-swipeable";
import Image from "next/image";

interface SwipeableCardProps {
  imageUrl: string;
  title: string;
  description: string;
  marketCapValue: string;
  marketCapChange_24h: string;
  coinCreated: string;
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
}

export const SwipeableCard = ({
  imageUrl,
  title,
  description,
  marketCapValue,
  marketCapChange_24h,
  coinCreated,
  onSwipe,
}: SwipeableCardProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (event: SwipeEventData) => {
      setIsDragging(true);
      setPosition({
        x: event.deltaX,
        y: event.deltaY,
      });
    },
    onSwiped: (event: SwipeEventData) => {
      setIsDragging(false);
      const threshold = 100;

      if (
        Math.abs(event.deltaX) > threshold ||
        Math.abs(event.deltaY) > threshold
      ) {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          onSwipe?.(event.deltaX > 0 ? "right" : "left");
        } else {
          onSwipe?.(event.deltaY > 0 ? "down" : "up");
        }
      } else {
        setPosition({ x: 0, y: 0 });
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <div
      {...handlers}
      className="w-full border-[5px] border-primary-black rounded-[32px] shadow-lg overflow-hidden"
      style={{
        transform: isDragging
          ? `translate(${position.x}px, ${position.y}px) rotate(${
              position.x * 0.1
            }deg)`
          : "none",
        transition: isDragging ? "none" : "transform 0.5s ease",
        cursor: isDragging ? "grabbing" : "grab",
        position: "relative",
      }}
    >
      <div className="relative md:min-h-72 sm:min-h-56 min-h-48 h-auto w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-[32px] "
          priority
        />
      </div>

      <div className="px-4 py-6 bg-background-card text-primary-white">
        <h3 className="text-center lg:text-[32px] md:text-[30px] sm:text-[26px] leading-none mb-3">
          {title}
        </h3>
        <p className={`md:text-[17px] sm:text-[15px] font-inter font-normal text-primary-light leading-tight md:pb-8 pb-4 h-[100px] overflow-y-auto`}>
          {description}
        </p>
        <div className="flex flex-row justify-between pb-[5px] mt-[10px]">
          <h4
            className={`md:text-[16px] sm:text-[15px] font-amalta font-normal text-primary-light leading-none`}
          >
            {"market cap"}
          </h4>
          <p className="md:text-[16px] sm:text-[15px] font-inter font-normal text-primary-light leading-tight">
            {marketCapValue}
          </p>
        </div>
        <div className="flex flex-row justify-between pb-[5px]">
          <h4
            className={`md:text-[16px] sm:text-[15px] font-amalta font-normal text-primary-light leading-none`}
          >
            {"change 24h"}
          </h4>
          <p className="md:text-[16px] sm:text-[15px] font-inter font-normal text-primary-light leading-tight">
            {marketCapChange_24h}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <h4
            className={`md:text-[16px] sm:text-[15px] font-amalta font-normal text-primary-light leading-none`}
          >
            {"created"}
          </h4>
          <p className="md:text-[16px] sm:text-[15px] font-inter font-normal text-primary-light leading-tight">
            {coinCreated}
          </p>
        </div>
      </div>
    </div>
  );
};
