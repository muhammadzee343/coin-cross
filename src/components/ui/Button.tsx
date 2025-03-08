'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/utils';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'add';
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = true,
  className, 
  ...props 
}: ButtonProps) => {
  const baseStyles = "px-4 py-3 text-sm font-medium transition-all active:scale-98 touch-manipulation";
  
  const variants = {
    primary: "bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]",
    secondary: `bg-secondary-greenButton font-bold`,
    add: `bg-secondary-addButton font-bold`,
    outline: "border border-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-color)] bg-transparent"
  };

  return (
    <button 
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};