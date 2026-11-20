import React from 'react';
import { cn } from '@/lib/utils/cn';
import { AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AlertBannerProps {
  type?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function AlertBanner({
  type = 'info',
  title,
  message,
  actionText,
  onAction,
  className
}: AlertBannerProps) {
  const styles = {
    info: {
      container: 'bg-[#f0f7ff] border-[#bae0fd] text-[#0a58ca]',
      icon: <Info className="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5" />
    },
    warning: {
      container: 'bg-[#fef9ee] border-[#f5deb3] text-[#8c5e14]',
      icon: <AlertTriangle className="w-5 h-5 text-[#d4973b] shrink-0 mt-0.5" />
    },
    success: {
      container: 'bg-[#eaf3ee] border-[#c5dfcc] text-[#18392b]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#2e7d32] shrink-0 mt-0.5" />
    },
    danger: {
      container: 'bg-[#fff3eb] border-[#fed7c3] text-[#a63c14]',
      icon: <AlertCircle className="w-5 h-5 text-[#d96b27] shrink-0 mt-0.5" />
    }
  };

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 p-4 rounded-xl border text-sm transition-all shadow-2xs',
        styles[type].container,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {styles[type].icon}
        <div>
          {title && <div className="font-bold text-xs uppercase tracking-wider mb-0.5">{title}</div>}
          <div className="text-xs leading-relaxed font-normal">{message}</div>
        </div>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-bold underline underline-offset-4 hover:opacity-80 shrink-0 ml-2 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
