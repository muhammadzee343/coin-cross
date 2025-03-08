'use client';

import React, { ReactNode } from "react";
import { Inter, Abril_Fatface } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
});

type TypographyVariant = "h1" | "h2" | "h3" | "body1" | "body2" | "caption1" | "caption2";

interface TypographyProps {
  variant?: TypographyVariant;
  children: ReactNode;
  className?: string;
}

export const Typography = ({ 
  variant = "body1", 
  children, 
  className = "" 
}: TypographyProps) => {
  const getVariantStyles = (variant: TypographyVariant): string => {
    switch (variant) {
      case "h1":
        return `text-4xl font-black font-amalta`;
      case "h2":
        return `text-[24px] font-amalta font-normal`;
      case "h3":
        return `text-2xl font-normal`;
      case "body1":
        return `text-base ${inter.className}`;
      case "body2":
        return `text-sm ${inter.className}`;
      case "caption1":
        return `text-xs font-amalta font-bold`;
      case "caption2":
        return `text-xs ${abrilFatface.className}`;
      default:
        return `text-base ${inter.className}`;
    }
  };

  // const Tag = variant?.startsWith('h') ? variant : 'p';
  const variantStyles = getVariantStyles(variant);

  return (
    <div className={`${variantStyles} ${className}`}>
      {children}
    </div>
  );
};