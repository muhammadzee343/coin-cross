export interface ApeItSheetProps {
  mints: { mintAddress: string }[];
  isCoinDump?: boolean;
  setCurrentTab?: (tab: string) => void;
  setDetailsOpen?: (isOpen: boolean) => void;
  setApeItAllOpen?: (isOpen: boolean) => void;
  setIsTradeObserved?: (isOpen: boolean) => void;
}
