"use client";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/Button";

export const AddSolanaQR = ({
  setIsQRLoginOpen,
}: {
  setIsQRLoginOpen: (open: boolean) => void;
}) => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWalletAddress(localStorage.getItem("walletAddress") || "");
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    });
  };

  const handleShare = async () => {
    if (!navigator.share) {
      alert("Web Share API not supported on this browser.");
      return;
    }
  
    try {
      const qrSize = 300;
      const padding = 20;
      const fontSize = 20;
      const maxWidth = qrSize; 
  
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      if (!ctx) return;
  
      const wrapText = (
        context: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
      ) => {
        const words = text.split(""); 
        let line = "";
        const lines: string[] = [];
  
        for (const char of words) {
          const testLine = line + char;
          const testWidth = context.measureText(testLine).width;
  
          if (testWidth > maxWidth) {
            lines.push(line);
            line = char;
          } else {
            line = testLine;
          }
        }
        lines.push(line);
  
        lines.forEach((l, index) => {
          context.fillText(l, x, y + index * lineHeight);
        });
  
        return lines.length * lineHeight;
      };
  
      const qrImage = new Image();
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${walletAddress}`;
      qrImage.crossOrigin = "anonymous";
  
      qrImage.onload = async () => {
        ctx.font = `${fontSize}px Arial`;
        const textHeight = wrapText(ctx, walletAddress, padding, 0, maxWidth, fontSize * 1.5);
  
        const totalHeight = qrSize + padding * 3 + textHeight;
        canvas.width = qrSize + padding * 2;
        canvas.height = totalHeight;
  
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        ctx.drawImage(qrImage, padding, padding, qrSize, qrSize);
  
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.font = `${fontSize}px Arial`;
  
        wrapText(ctx, walletAddress, canvas.width / 2, qrSize + padding * 2, maxWidth, fontSize * 1.5);
  
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], "solana_wallet_qr.png", { type: "image/png" });
  
          await navigator.share({
            title: "My Solana Wallet",
            text: `Here is my Solana wallet address: ${walletAddress}`,
            files: [file],
          });
        }, "image/png");
      };
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full overflow-y-auto relative z-20 md:pt-12 pt-10">
      <div className="bg-white p-3 rounded-lg shadow-lg md:mb-16 mb-12">
        <QRCode value={walletAddress} size={180} />
      </div>

      <div className="w-full flex items-center justify-center border-[1px] border-primary-white rounded-[12px] p-[12px] max-w-[90%] gap-4">
        <div className="w-[60%] overflow-hidden">
          <p className="md:text-[14px] sm:text-[12px] font-amalta font-normal text-primary-light leading-tight">
            Your solana Address:
          </p>
          <p className="md:text-[14px] sm:text-[12px] font-amalta font-normal text-primary-white leading-tight whitespace-pre-wrap">
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
          </p>
        </div>
        <div className="w-[35%] text-right">
          <Button
            variant="secondary"
            className="rounded-lg font-amalta px-1 leading-snug"
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <p className="md:text-[14px] sm:text-[12px] font-amalta font-normal text-primary-white leading-tight mt-[15px] text-center p-[10px]">
        Use this address to receive SOL tokens or Solana-based memecoins.
        Transactions may take a few seconds to confirm.
      </p>

      <div className="w-full flex items-center justify-center absolute bottom-4  p-[10px]">
        <Button
          variant="secondary"
          className="w-full rounded-xl font-amalta md:py-7 py-5 md:text-[22px] text-[20px]"
          onClick={handleShare}
        >
          Share
        </Button>
      </div>
    </div>
  );
};
