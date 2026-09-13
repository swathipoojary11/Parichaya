'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glow' | 'accent';
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  noPadding = false,
  className = '',
  ...props
}) => {
  // Component B spec: bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-colors
  let variantStyles = 'bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700';

  if (variant === 'glow') {
    variantStyles = 'bg-zinc-900/90 border border-orange-500/30 hover:border-orange-500/60 shadow-lg shadow-orange-500/5';
  } else if (variant === 'accent') {
    variantStyles = 'bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-zinc-700';
  }

  const paddingStyle = noPadding ? '' : 'p-5';

  return (
    <div
      className={`rounded-xl shadow-sm transition-colors ${variantStyles} ${paddingStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
