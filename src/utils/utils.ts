import { type ClassValue, clsx } from "clsx";

const LAMPORTS_PER_SOL = 1_000_000_000;

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const formatBalance = (uiAmount: number) => {
  return uiAmount % 1 === 0
    ? uiAmount.toFixed(0)
    : uiAmount.toFixed(8).replace(/\.?0+$/, "");
};

export const calculateCurrentValue = (
  uiAmount: number,
  baseTokenPriceSOL: number,
  solPriceUSD: number
) => {
  const valueSOL = uiAmount * baseTokenPriceSOL;
  const valueUSD = valueSOL * solPriceUSD;
  return valueUSD.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const calculatePnL = (
  costBasisInLamports: number,
  uiAmount: number,
  baseTokenPriceSOL: number,
  solPriceUSD: number
) => {
  const costBasisLamports = uiAmount * costBasisInLamports;
  const currentValueLamports = uiAmount * baseTokenPriceSOL * LAMPORTS_PER_SOL;
  const pnlLamports = currentValueLamports - costBasisLamports;
  const pnlUSD = (pnlLamports / LAMPORTS_PER_SOL) * solPriceUSD;

  return {
    value: pnlUSD,
    formatted: pnlUSD.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      signDisplay: "exceptZero",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };
};


export const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + "K";
  }
  return num.toFixed(2);
};

export const formatDateTime = (dateString: string) => {
  const now = new Date();
  const createdDate = new Date(dateString);

  if (isNaN(createdDate.getTime())) {
    return "Invalid date"; 
  }

  const diffMs = now.getTime() - createdDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return "just now";
};