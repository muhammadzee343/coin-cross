"use client";

import React from "react";
import SkipCoinIcon from "../../../public/assets/svg/SkipIcon";

interface SkipCoinButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

export const SkipCoinButton = ({
  size = "md",
  className = "",
  ...props
}: SkipCoinButtonProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="rounded-xl border-[5px] border-black p-[2px] overflow-hidden bg-primary-dark shadow-inner">
      <div className="relative bg-green-500" />
      <button
        className={`
          relative
          ${sizeClasses[size]}
          bg-redish-brown-gradient
          shadow-inner
          transition-colors
          flex
          items-center
          justify-center
          
          ${className}
        `}
        {...props}
      >
        <SkipCoinIcon />
      </button>
    </div>
  );
};

