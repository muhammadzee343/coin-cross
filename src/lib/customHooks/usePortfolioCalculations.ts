import { lamportsToSol } from "@/utils/lamportsToSol";
import { useMemo } from "react";
import { CoinTypes, PortfolioData, TokenAccount } from "@/types/coins";

export const usePortfolioCalculations = (
  data: PortfolioData | undefined,
  moongbagCoins: CoinTypes[],
  tokenAccounts: TokenAccount[] | undefined
) => {
  return useMemo(() => {
    let solUSDValue = 0;
    let totalTokenValue = 0;
    let totalUnrealizedPnL = 0;
    let totalCostBasis = 0;

    if (data) {
      solUSDValue = lamportsToSol(data.solBalanceInLamports) * data.solPriceUSD;

      moongbagCoins.forEach((coin) => {
        const tokenAccount = tokenAccounts?.find(
          (ta) => ta.mint === coin.metadata.mintAddress
        );
        if (!tokenAccount) return;

        const poolData = coin.coinGeckoData.coinGeckoPoolData[0];
        const currentPrice = parseFloat(poolData.baseTokenPriceNativeCurrency) * data.solPriceUSD;
        const currentValue = tokenAccount.uiAmount * currentPrice;

        const costBasis = (data.costBasisMap?.[coin.metadata.mintAddress]?.costBasisInLamports || 0) / 1e9;
        const tokenPnL = currentValue - costBasis;

        totalTokenValue += currentValue;
        totalUnrealizedPnL += tokenPnL;
        totalCostBasis += costBasis;
      });
    }

    const totalBalance = solUSDValue + totalTokenValue;
    const percentageChange = totalCostBasis > 0 ? (totalUnrealizedPnL / totalCostBasis) * 100 : 0;

    return {
      totalBalanceUSD: totalBalance,
      solUSD: solUSDValue,
      totalChangeUSD: totalUnrealizedPnL,
      totalChangePercentage: percentageChange,
    };
  }, [data, moongbagCoins, tokenAccounts]);
};