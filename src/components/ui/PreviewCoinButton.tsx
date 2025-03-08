'use client';

import React from 'react';
import DetailIcon from '../../../public/assets/svg/DetailIcon';
interface SkipCoinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const PreviewCoinButton = ({ 
  size = 'md', 
  className = '',
  ...props 
}: SkipCoinButtonProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="rounded p-[2px] bg-primary-dark shadow-inner">
        <div className='relative bg-green-500'/>
      <button
        className={`
          relative
          rounded
          ${sizeClasses[size]}
          bg-copper-gradient
          shadow-inner
          transition-colors
          flex
          items-center
          justify-center
          ${className}
        `}
        {...props}
      >
        <DetailIcon />
      </button>
    </div>
  );
};