import { calculateCurrentValue, calculatePnL, formatBalance } from '@/utils/utils';
import React from 'react';

const CoinList = ({ coins }: { coins: React.ReactNode[] }) => {
  return (
        <div className="flex flex-col items-center justify-center mt-[15px]">
        {coins.length > 0 ? coins : <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-primary-white">No coins yet</p>
                    </div>}
                {/* <div className="w-full md:max-h-[50vh] max-h-[40vh] overflow-auto">
                  {moongbagCoins.length > 0 ? (
                    moongbagCoins.map((coin) => {
                      const tokenAccount = tokenAccounts?.find(
                        (ta) => ta.mint === coin.metadata.mintAddress
                      );

                      if (!tokenAccount) return null;

                      const costBasis =
                        data?.costBasisMap?.[coin.metadata.mintAddress]
                          ?.costBasisInLamports || 0;
                      const poolData = coin.coinGeckoData.coinGeckoPoolData[0];

                      const currentValue = calculateCurrentValue(
                        tokenAccount.uiAmount,
                        parseFloat(poolData.baseTokenPriceNativeCurrency),
                        data?.solPriceUSD || 0
                      );

                      const pnl = calculatePnL(
                        costBasis,
                        tokenAccount.uiAmount,
                        parseFloat(poolData.baseTokenPriceNativeCurrency),
                        data?.solPriceUSD || 0
                      );

                      const solValue = (
                        tokenAccount.uiAmount *
                        parseFloat(poolData.baseTokenPriceNativeCurrency)
                      )
                        .toFixed(8)
                        .replace(/\.?0+$/, "");

                      return (
                        <div
                          key={coin.coinId}
                          onClick={() => openDetails(coin)}
                        >
                          <CoinCard
                            imageUrl={coin.metadata.image}
                            title={coin.metadata.name}
                            symbol={coin.metadata.symbol}
                            balance={formatBalance(tokenAccount.uiAmount)}
                            currentValue={currentValue}
                            pnl={pnl.formatted}
                            pnlValue={pnl.value}
                            solValue={solValue}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-primary-white">No coins yet</p>
                    </div>
                  )}
                </div> */}
              </div>
  );
};

export default CoinList