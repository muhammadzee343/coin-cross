"use client";

import { useState } from "react";
import { cn } from "@/utils/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs = ({ tabs, defaultTab, onChange }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="bg-background-default w-full h-[40px] z-20">
      <div className="flex justify-between items-center mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex py-3 px-0",
              "transition-colors duration-200 justify-center"
            )}
          >
            <div className="relative">
              <span
                className={`lg:text-[24px] md:text-[22px] sm:text-[20px] font-amalta font-normal ${
                  activeTab === tab.id
                    ? "text-primary-white"
                    : "text-primary-light"
                }`}
              >
                {tab.label}
              </span>
              <div
                className={`absolute -bottom-[3px] left-0 right-0 h-1 rounded ${
                  activeTab === tab.id
                    ? "bg-secondary-dark"
                    : "bg-primary-black"
                }`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
