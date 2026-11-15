import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'forest' | 'sage' | 'amber' | 'blue' | 'charcoal' | 'outline' | 'danger';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'sage',
  size = 'sm',
  className,
  ...props
}: BadgeProps) {
  const variantStyles = {
    forest: 'bg-[#1b4332] text-white border-transparent',
    sage: 'bg-[#eaf7ee] text-[#1b4332] border-[#c7e9d2]',
    amber: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
    blue: 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]',
    charcoal: 'bg-[#f4f5f1] text-[#2a2f35] border-[#d4d7cf]',
    outline: 'bg-transparent text-[#2a2f35] border-[#d4d7cf]',
    danger: 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 rounded-md font-medium tracking-tight'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
