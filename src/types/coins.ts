export interface Metadata {
    metadataId: string;
    coinId: string;
    mintAddress: string;
    name: string;
    symbol: string;
    description: string;
    image: string;
    externalUrl: string;
    decimals: number;
    supplyInBasisPoints: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CoinGeckoPoolData {
    coinGeckoPoolDataId: string;
    coinGeckoDataId: string;
    poolAddress: string;
    name: string;
    poolCreatedAt: string;
    baseTokenPriceUsd: string;
    quoteTokenPriceUsd: string;
    fdvUsd: string;
    reserveInUsd: string;
    volumeH1Usd: string;
    volumeH24Usd: string;
    transactionsH1Buyers: number;
    transactionsH1Sellers: number;
    transactionsH24Buyers: number;
    transactionsH24Sellers: number;
    priceChangeM5: string;
    priceChangeH1: string;
    priceChangeH24: string;
    baseTokenPriceNativeCurrency: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CoinGeckoData {
    coinGeckoDataId: string;
    coinId: string;
    address: string;
    priceUsd: string;
    fdvUsd: string;
    totalReserveUsd: number;
    volumeUsd: string;
    marketCapUsd: string;
    createdAt: string;
    updatedAt: string;
    coinGeckoPoolData: CoinGeckoPoolData[];
  }
  
  export interface CoinTypes {
    coinId: string;
    mintAddress: string;
    status: string;
    nextPriceUpdateAt: string;
    createdAt: string;
    updatedAt: string;
    metadata: Metadata;
    coinGeckoData: CoinGeckoData;
    account?: any
  }

  export interface PortfolioData {
    solBalanceInLamports: number;
    solPriceUSD: number;
    costBasisMap: Record<string, { costBasisInLamports: number }>;
  }

  export interface TokenAccount {
    mint: string;
    uiAmount: number;
  }
  