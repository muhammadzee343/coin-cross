'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', fullWidth = true, className, ...props }, ref) => {
    const baseStyles =
      "px-4 py-4 text-sm font-medium transition-all focus:outline-none rounded-lg focus:ring-2 bg-white text-gray-900 placeholder-gray-500";

    const variants = {
      default: "placeholder-primary-gray font-futura",
      error: "placeholder-red-400 font-futura",
    };

    return (
      <input
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
