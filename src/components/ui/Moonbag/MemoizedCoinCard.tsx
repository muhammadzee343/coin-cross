import { PortfolioData, TokenAccount, CoinTypes } from '@/types/coins';
import { calculateCurrentValue, formatBalance, calculatePnL } from '@/utils/utils';
import React from 'react';
import { CoinCard } from './CoinCard';
export const MemoizedCoinCard = React.memo(({ 
    coin, 
    tokenAccounts, 
    data, 
    onClick 
  }: { 
    coin: CoinTypes; 
    tokenAccounts: TokenAccount[]; 
    data: PortfolioData; 
    onClick: () => void; 
  }) => {
    const tokenAccount = tokenAccounts.find(ta => ta.mint === coin.metadata.mintAddress);
    const poolData = coin.coinGeckoData.coinGeckoPoolData[0];
    
    if (!tokenAccount || !data) return null;
  
    const currentValue = calculateCurrentValue(
      tokenAccount.uiAmount,
      parseFloat(poolData.baseTokenPriceNativeCurrency),
      data.solPriceUSD
    );
  
    const pnl = calculatePnL(
      (data.costBasisMap?.[coin.metadata.mintAddress]?.costBasisInLamports || 0) / 1e9,
      tokenAccount.uiAmount,
      parseFloat(poolData.baseTokenPriceNativeCurrency),
      data.solPriceUSD
    );
  
    const solValue = (tokenAccount.uiAmount * parseFloat(poolData.baseTokenPriceNativeCurrency))
      .toFixed(8)
      .replace(/\.?0+$/, "");
  
    return (
      <CoinCard
        imageUrl={coin.metadata.image}
        title={coin.metadata.name}
        symbol={coin.metadata.symbol}
        balance={formatBalance(tokenAccount.uiAmount)}
        currentValue={currentValue}
        pnl={pnl.formatted}
        pnlValue={pnl.value}
        solValue={solValue}
        onClick={onClick}
      />
    );
  }, (prevProps, nextProps) => {
    return (
      prevProps.coin.coinId === nextProps.coin.coinId &&
      prevProps.tokenAccounts === nextProps.tokenAccounts &&
      prevProps.data === nextProps.data
    );
  });