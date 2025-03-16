"use client";

import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { QRScanner } from "../QRScanner";
import { BottomSheet } from "../BottomSheet";
import { ReviewTransaction } from "./ReviewTransaction";

interface ScanQRProps {
  amount: string;
  amountInSol: string;
  setIsWithdrawQROpen: (isOpen: boolean) => void;
  setIsScanQROpen: (isOpen: boolean) => void;
}
export const ScanQR = ({ amount, amountInSol, setIsWithdrawQROpen, setIsScanQROpen }: ScanQRProps) => {
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isReviewTransactionOpen, setIsReviewTransactionOpen] = useState(false);

  const handleScan = (result: string) => {
    setWalletAddress(result);
    setIsQRScannerOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center h-[85vh]">
      {/* Input Field */}
      <Input
        type="text"
        value={walletAddress}
        onChange={handleInputChange}
        className="w-full px-4 py-3 rounded-lg border border-primary-gray  bg-primary-dark"
      />

      {/* Scan QR Button */}
      <Button
        className="w-full mt-4 py-3 bg-primary-blue text-white rounded-lg"
        onClick={() => setIsQRScannerOpen(true)}
      >
        Scan QR
      </Button>

      <div className="fixed bottom-8 w-full px-[12px]">
        <button
          onClick={() => setIsReviewTransactionOpen(true)}
          className={`w-full py-2 text-white text-md font-normal rounded mt-4 bg-primary-green`}
        >
          Next
        </button>
      </div>

      {/* QR Scanner Modal */}
      {isQRScannerOpen && (
        <div className="relative">
          <QRScanner
            isOpen={isQRScannerOpen}
            onScan={handleScan}
            onClose={() => setIsQRScannerOpen(false)}
          />
        </div>
      )}

      {isReviewTransactionOpen && (
        <div className="fixed bottom-0 z-10 bg-background-default">
          <BottomSheet
            className="bg-background-default border-t border-x border-gray-600 rounded-t-[12px]"
            hideHandle={true}
            isOpen={isReviewTransactionOpen}
            showCloseButton={false}
            onClose={() => setIsReviewTransactionOpen(false)}
          >
            <ReviewTransaction
              setIsReviewTransactionOpen={setIsReviewTransactionOpen}
              amount={amount}
              amountInSol={amountInSol}
              walletAddress={walletAddress}
              setIsWithdrawQROpen={setIsWithdrawQROpen}
              setIsScanQROpen={setIsScanQROpen}
            />
          </BottomSheet>
        </div>
      )}
    </div>
  );
};
