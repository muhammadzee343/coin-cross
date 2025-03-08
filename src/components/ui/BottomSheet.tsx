"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
  hideHandle?: boolean;
  backdropBlur?: boolean;
  showCloseButton?: boolean;
  small?: boolean
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  className,
  hideHandle = false,
  backdropBlur = false,
  showCloseButton = true,
  small=false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-background-default">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bottom-[10%] z-40 ${
              backdropBlur ? "backdrop-blur-xl backdrop-saturate-100" : ""
            }`}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-0 top-[50%] bg-black/70 z-40"
            onClick={onClose}
          />

          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 50, stiffness: 500 }}
              className={`w-full max-w-[620px] shadow-lg ${
                !hideHandle
                  ? "rounded-t-[10px] border-t border-x border-gray-600"
                  : ""
              } ${className}`}
              style={{
                paddingBottom: "calc(var(--safe-area-bottom) + 0.3rem)",
                // height: "90vh",
                // maxHeight: "90vh",
              }}
            >
              <div className={`px-2 pt-2 ${!small && 'h-[90vh]'}`}>
                <div className="flex justify-between items-center">
                  {!hideHandle && (
                    <div className="w-12 h-1.5 bg-[var(--tg-theme-hint-color)] rounded-full mx-auto opacity-60" />
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none z-[100] absolute top-2 right-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="space-y-4 pb-2 h-[calc(100%-1rem)] overflow-y-auto">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
