'use client';

import React, { useState, useEffect } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import DegenScreen from '../degen/page';
import MoonbagScreen from '../moonbag/page';
import { LikesContent } from '@/components/ui/Likes/LikesContent';
import { expandTelegramWebApp, isRunningInTelegram } from '@/utils/telegramWebApp';

const tabs = [
    { id: 'degen', label: 'Degen' },
    { id: 'likes', label: 'Likes'},
    { id: 'moonbag', label: 'Moonbag'},
  ];

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState('Degen');

  // Handle fullscreen behavior directly in the page component
  useEffect(() => {
    if (isRunningInTelegram()) {
      // Force fullscreen expansion on component mount
      expandTelegramWebApp();
      
      // Also set body styles for fullscreen
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const renderScreen = () => {
    switch (currentTab) {
      case 'degen':
        return <DegenScreen   />;
        case 'likes':
          return <LikesContent setCurrentTab={setCurrentTab}/>;
          case 'moonbag':
            return <MoonbagScreen />;
      default:
        return <DegenScreen />;
    }
  };

  return (
    <main className="flex flex-col h-screen w-full max-w-[480px] overflow-hidden mx-auto">
      <Tabs
          tabs={tabs} 
          defaultTab="degen" 
          onChange={setCurrentTab}
        />
      <div className="flex-1 overflow-hidden flex flex-col justify-between py-[12px] px-[10px]">
        {renderScreen()}
      </div>
    </main>
  );
}