"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/customHooks/useAuth";
import { FaWallet, FaTrash } from "react-icons/fa";

const WalletManagement = () => {
  const { getAllWallets, handleLinkWallet, handleUnlinkWallet, isReady } = useAuth();
  const [unlinkLoading, setUnlinkLoading] = useState<string | null>(null);
  
  if (!isReady) {
    return (
      <div className="p-4">
        <p className="text-primary-white">Loading wallets...</p>
      </div>
    );
  }
  
  const { embeddedWallets, externalWallets } = getAllWallets();
  
  const onUnlinkWallet = async (address: string) => {
    setUnlinkLoading(address);
    try {
      await handleUnlinkWallet(address);
    } finally {
      setUnlinkLoading(null);
    }
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className="p-4 mt-4">
      <h2 className="text-xl font-bold text-primary-white mb-4">Your Wallets</h2>
      
      {/* Embedded Wallets Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary-purple mb-2">Embedded Wallets</h3>
        {embeddedWallets.length === 0 ? (
          <p className="text-gray-400">No embedded wallets connected</p>
        ) : (
          <div className="space-y-2">
            {embeddedWallets.map((wallet) => (
              <div key={wallet.address} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center">
                  <FaWallet className="text-primary-purple mr-2" />
                  <span className="text-primary-white">{formatAddress(wallet.address)}</span>
                  <span className="ml-2 text-xs bg-primary-purple px-2 py-1 rounded-full">Embedded</span>
                </div>
                <button
                  onClick={() => onUnlinkWallet(wallet.address)}
                  disabled={unlinkLoading === wallet.address}
                  className="text-red-400 hover:text-red-300"
                >
                  {unlinkLoading === wallet.address ? (
                    <span className="text-sm">Unlinking...</span>
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* External Wallets Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary-blue mb-2">External Wallets</h3>
        {externalWallets.length === 0 ? (
          <p className="text-gray-400">No external wallets connected</p>
        ) : (
          <div className="space-y-2">
            {externalWallets.map((wallet) => (
              <div key={wallet.address} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center">
                  <FaWallet className="text-primary-blue mr-2" />
                  <span className="text-primary-white">{formatAddress(wallet.address)}</span>
                  <span className="ml-2 text-xs bg-primary-blue px-2 py-1 rounded-full">External</span>
                </div>
                <button
                  onClick={() => onUnlinkWallet(wallet.address)}
                  disabled={unlinkLoading === wallet.address}
                  className="text-red-400 hover:text-red-300"
                >
                  {unlinkLoading === wallet.address ? (
                    <span className="text-sm">Unlinking...</span>
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Connect New Wallet Button */}
      <button
        onClick={handleLinkWallet}
        className="bg-primary-blue w-full font-normal text-md py-4 rounded-md mt-4"
      >
        Connect Solana Wallet
      </button>
    </div>
  );
};

export default WalletManagement;