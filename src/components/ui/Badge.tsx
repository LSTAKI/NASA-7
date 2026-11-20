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
    forest: 'bg-[#18392b] text-[#eaf3ee] border-transparent',
    sage: 'bg-[#eaf3ee] text-[#18392b] border-[#c5dfcc]',
    amber: 'bg-[#fef9ee] text-[#8c5e14] border-[#f5deb3]',
    blue: 'bg-[#f0f7ff] text-[#0a58ca] border-[#bae0fd]',
    charcoal: 'bg-[#f3efe9] text-[#333c36] border-[#dcd8ce]',
    outline: 'bg-transparent text-[#333c36] border-[#dcd8ce]',
    danger: 'bg-[#fff3eb] text-[#a63c14] border-[#fed7c3]'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium tracking-tight',
    md: 'text-xs px-3 py-1 rounded-full font-medium tracking-tight'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border transition-colors select-none',
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
