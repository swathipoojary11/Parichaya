'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Component A spec for primary variant:
  // bg-orange-500 hover:bg-orange-600 text-zinc-950 font-semibold px-5 py-2.5 rounded-lg transition-all duration-150 shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
  
  let baseVariantStyles = 'bg-orange-500 hover:bg-orange-600 text-zinc-950 shadow-md shadow-orange-500/20';

  if (variant === 'secondary') {
    baseVariantStyles = 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60 shadow-sm';
  } else if (variant === 'outline') {
    baseVariantStyles = 'bg-transparent hover:bg-orange-500/10 text-orange-400 border border-orange-500/40 hover:border-orange-500';
  } else if (variant === 'ghost') {
    baseVariantStyles = 'bg-transparent hover:bg-zinc-800/60 text-zinc-300 hover:text-white';
  } else if (variant === 'emerald') {
    baseVariantStyles = 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 shadow-md shadow-emerald-500/20';
  }

  let sizeStyles = 'px-5 py-2.5 text-sm';
  if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-xs';
  if (size === 'lg') sizeStyles = 'px-6 py-3 text-base font-bold';

  return (
    <button
      disabled={disabled || isLoading}
      className={`font-semibold rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${baseVariantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
