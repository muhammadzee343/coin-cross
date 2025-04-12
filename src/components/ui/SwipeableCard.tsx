"use client";

import React, { useState } from "react";
import { useSwipeable, SwipeEventData } from "react-swipeable";
import Image from "next/image";
import { formatDateTime, formatNumber } from "@/utils/utils";

interface SwipeableCardProps {
  imageUrl: string;
  title: string;
  description?: string; // Made optional since some cards might not have descriptions
  fdvUsd: string;
  topTenHolders: string;
  marketCapChange_24h: string;
  coinCreated: string;
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void;
}

export const SwipeableCard = ({
  imageUrl,
  title,
  description,
  fdvUsd,
  topTenHolders,
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
      className="w-full border-4 md:border-5 border-primary-black rounded-3xl md:rounded-4xl shadow-lg overflow-hidden bg-background-card"
      style={{
        transform: isDragging
          ? `translate(${position.x}px, ${position.y}px) rotate(${
              position.x * 0.1
            }deg)`
          : "none",
        transition: isDragging ? "none" : "transform 0.5s ease",
        cursor: isDragging ? "grabbing" : "grab",
        position: "relative",
        height: "calc(100vh - 230px)", 
        maxHeight: "700px",
      }}
    >
      <div className="relative w-full h-1/2">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        
        {title === "POV" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-7xl md:text-8xl font-bold">POV</h1>
          </div>
        )}
      </div>

      <div className="px-4 py-5 text-primary-white flex flex-col h-1/2">
        <h3 className="block w-full font-amalta font-normal text-3xl md:text-4xl text-center mb-4">
          {title === "POV" ? "You Held" : title}
        </h3>
        
        {description && (
          <div className="flex-grow overflow-y-auto mb-4">
            <p className="font-inter font-normal text-base leading-snug">
              {description}
            </p>
          </div>
        )}
        
        <div className="mt-auto">
          <div className="flex flex-row justify-between">
            <h4 className="text-base md:text-lg font-amalta font-normal text-primary-light leading-none">
              market cap
            </h4>
            <p className="text-base md:text-lg font-sf font-normal text-primary-light">
              {formatNumber(Number(fdvUsd))}
            </p>
          </div>
          
          <div className="flex flex-row justify-between">
            <h4 className="text-base md:text-lg font-amalta font-normal text-primary-light leading-none">
              change 24h
            </h4>
            <p className={`text-base md:text-lg font-sf font-normal leading-tight ${
              Number(marketCapChange_24h) >= 0 ? 'text-text-green' : 'text-text-negative'
            }`}>
              {formatNumber(Number(marketCapChange_24h))}%
            </p>
          </div>
          
          <div className="flex flex-row justify-between">
            <h4 className="text-base md:text-lg font-amalta font-normal text-primary-light leading-none">
              top ten holders
            </h4>
            <p className={`text-base md:text-lg font-sf font-normal leading-tight ${
              Number(topTenHolders) >= 0 ? 'text-text-green' : 'text-text-negative'
            }`}>
              {formatNumber(Number(topTenHolders))}%
            </p>
          </div>

          <div className="flex flex-row justify-between">
            <h4 className="text-base md:text-lg font-amalta font-normal text-primary-light leading-none">
              created
            </h4>
            <p className="text-base md:text-lg font-sf font-normal text-primary-light">
              {formatDateTime(coinCreated)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 