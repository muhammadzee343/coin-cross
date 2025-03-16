'use client';

import React, { useState } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import DegenScreen from '../degen/page';
import MoonbagScreen from '../moonbag/page';
import { LikesContent } from '@/components/ui/Likes/LikesContent';


const tabs = [
    { id: 'degen', label: 'Degen' },
    { id: 'likes', label: 'Likes'},
    { id: 'moonbag', label: 'Moonbag'},
  ];

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState('Degen');

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
    <main className="flex flex-col min-h-screen px-3 max-w-[480px] overflow-hidden mx-auto">
    <Tabs
        tabs={tabs} 
        defaultTab="degen" 
        onChange={setCurrentTab}
      />
      <div className="flex-1 overflow-hidden flex flex-col justify-between h-full">
        {renderScreen()}
      </div>
    </main>
  );
}