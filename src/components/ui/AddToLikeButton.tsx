'use client';

import React from 'react';
import HeartIcon from '../../../public/assets/svg/HeartIcon';

interface SkipCoinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const AddToLikeButton = ({ 
  size = 'md', 
  className = '',
  ...props 
}: SkipCoinButtonProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="rounded p-[2px] bg-primary-dark shadow-inner">
        <div className='relative bg-green-500'/>
      <button
        className={`
          relative
          rounded
          ${sizeClasses[size]}
          bg-green-gradient
          shadow-inner
          transition-colors
          flex
          items-center
          justify-center
          ${className}
        `}
        {...props}
      >
        <HeartIcon />
      </button>
    </div>
  );
};