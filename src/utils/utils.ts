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
