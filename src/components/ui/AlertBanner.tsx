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
      container: 'bg-[#f0f9ff] border-[#bae6fd] text-[#0369a1]',
      icon: <Info className="w-5 h-5 text-[#0284c7] shrink-0" />
    },
    warning: {
      container: 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]',
      icon: <AlertTriangle className="w-5 h-5 text-[#d97706] shrink-0" />
    },
    success: {
      container: 'bg-[#eaf7ee] border-[#c7e9d2] text-[#1b4332]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0" />
    },
    danger: {
      container: 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]',
      icon: <AlertCircle className="w-5 h-5 text-[#dc2626] shrink-0" />
    }
  };

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 p-3.5 rounded-lg border text-sm transition-all',
        styles[type].container,
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        {styles[type].icon}
        <div>
          {title && <div className="font-semibold text-xs uppercase tracking-wider mb-0.5">{title}</div>}
          <div className="text-xs leading-relaxed opacity-90">{message}</div>
        </div>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 shrink-0 ml-2"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
