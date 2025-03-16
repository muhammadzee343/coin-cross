import { CoinTypes } from "../coins";

export interface CardDetailsProps {
  card: CoinTypes;
  setDetailsOpen: (isOpen: boolean) => void;
  isCoinDump?: boolean;
}
