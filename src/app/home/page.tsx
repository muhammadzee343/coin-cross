'use client';

import React, { useState } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import LikesScreen from '../likes/page';
import DegenScreen from '../degen/page';
import MoonbagScreen from '../moonbag/page';


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
          return <LikesScreen />;
          case 'moonbag':
            return <MoonbagScreen/>;
      default:
        return <DegenScreen />;
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
    <Tabs
        tabs={tabs} 
        defaultTab="degen" 
        onChange={setCurrentTab}
      />
      <div className="flex-1 overflow-auto flex flex-col justify-between h-full">
        {renderScreen()}
      </div>
    </main>
  );
}