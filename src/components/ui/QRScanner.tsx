'use client';

import { FaTimes } from "react-icons/fa";
import { cn } from "@/utils/utils";
import SalonaIcon from "../../../public/assets/svg/SalonaIcon";
import { Scanner } from '@yudiel/react-qr-scanner';

interface QRScannerProps {
  isOpen: boolean;
  onScan: (result: string) => void;
  onClose: () => void;
  className?: string;
}

export const QRScanner = ({ onScan, onClose, className }: QRScannerProps) => {
  return (
    <div className={cn("fixed inset-0 flex flex-col items-center justify-center h-[80vh] bg-black bg-opacity-90", className)}>
      {/* Close Button */}
      <div
        onClick={onClose}
        className="absolute top-14 right-4 z-50 bg-primary-gray bg-opacity-50 p-1 rounded-full flex items-center justify-center cursor-pointer"
      >
        <FaTimes className="text-primary-black text-md" />
      </div>

      {/* QR Scanner */}
      <div className="relative w-full h-[47vh] flex items-center justify-center overflow-hidden">
        <Scanner onScan={(result) => onScan(result[0].rawValue)} />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-10 flex flex-col items-center">
        <SalonaIcon />
        <p className="text-white text-sm font-normal">Get Sol address to send funds</p>
      </div>
    </div>
  );
};
