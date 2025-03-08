import React from "react";
import { IoChevronBackSharp } from "react-icons/io5";

interface ReviewTransactionProps {
  setIsReviewTransactionOpen: (open: boolean) => void;
  amount: string;
  amountInSol: string;
  walletAddress: string;
}

export const ReviewTransaction = ({
  setIsReviewTransactionOpen,
  amount,
  amountInSol,
  walletAddress,
}: ReviewTransactionProps) => {
  return (
    <div className="flex flex-col items-center justify-start h-full overflow-y-auto relative md:pt-2">
      <div
        className="w-full flex flex-col"
        onClick={() => setIsReviewTransactionOpen(false)}
      >
        <IoChevronBackSharp className="text-primary-purple text-[50px]" />
      </div>

      <div className="w-full flex flex-col">
        <label className="text-[30px] font-semibold text-primary-white text-center md:pt-6 pt-4 md:mb-12 mb-8">
          Review Transaction
        </label>

        <div className="w-full flex flex-col px-6">
          <div className="w-full flex justify-between mb-2">
            <label className="text-[20px] font-semibold text-primary-white text-center">
              Amount
            </label>

            <label className="text-[20px] font-semibold text-primary-white text-center">
              {amount}
            </label>
          </div>
          <div className="w-full flex justify-between mb-2">
            <label className="text-[20px] font-semibold text-primary-white text-center">
              Converted sol
            </label>

            <label className="text-[20px] font-semibold text-primary-white text-center">
              {amountInSol}
            </label>
          </div>
          <div className="w-full flex justify-between mb-2">
            <label className="text-[20px] font-semibold text-primary-white text-center">
              Recipient
            </label>

            <label className="text-[20px] font-semibold text-primary-white text-center">
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </label>
          </div>
          <div className="w-full flex justify-between mb-2">
            <label className="text-[20px] font-semibold text-primary-white text-center">
              Transaction Fee
            </label>

            <label className="text-[20px] font-semibold text-primary-white text-center">
              $0.50
            </label>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="w-full">
                <button
                  className="w-full mb-1 rounded-xl bg-primary-green px-[20px] py-[15px]"
                //   onClick={() => setOpenDumpSliderSheet(true)}
                >
                  Confirm Send
                </button>
              </div>
            </div>
    </div>
  );
};
