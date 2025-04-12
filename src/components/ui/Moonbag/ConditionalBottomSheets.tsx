import { BottomSheet } from "@/components/ui/BottomSheet";
import { CardDetails } from "@/components/ui/Degen/CardDetails";
import { ApeItAllSheet } from "@/components/ui/Likes/ApeItAllSheet";
import { CoinTypes } from "@/types/coins";
import React from "react";

interface ConditionalBottomSheetsProps {
  state: {
    isDetailsOpen: boolean;
    openDumpSliderSheet: boolean;
    selectedCard: CoinTypes | null;
  };
  setState: React.Dispatch<React.SetStateAction<any>>;
  moongbagCoins: any
}

export const ConditionalBottomSheets = ({ state, setState, moongbagCoins }: ConditionalBottomSheetsProps) => {
  return (
    <>
      <BottomSheet
        className="bg-background-card"
        isOpen={state.isDetailsOpen}
        onClose={() => setState((prev: any) => ({ ...prev, isDetailsOpen: false }))}
      >
        {state.selectedCard && (
          <CardDetails
            card={state.selectedCard}
            setDetailsOpen={(value: boolean) => setState((prev: any) => ({ ...prev, isDetailsOpen: value }))}
            isCoinDump={true}
          />
        )}
      </BottomSheet>

      <BottomSheet
        className="bg-background-default rounded-t-[20px] border-t border-x border-gray-700"
        backdropBlur={true}
        isOpen={state.openDumpSliderSheet}
        showCloseButton={false}
        small={true}
        onClose={() => setState((prev: any) => ({ ...prev, openDumpSliderSheet: false }))}
      >
        <ApeItAllSheet
         mints={moongbagCoins.map((coin: any) => ({ 
          mintAddress: coin.metadata.mintAddress || ""
        }))}
          isCoinDump={true}
          setApeItAllOpen={(value) => setState((prev: any) => ({ ...prev, openDumpSliderSheet: value }))}
        />
      </BottomSheet>
    </>
  );
};