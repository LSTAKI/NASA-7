import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Badge } from './Badge';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  sourceTag?: string;
  status?: 'optimal' | 'moderate' | 'warning' | 'neutral';
  isLive?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  subtext,
  icon,
  trend,
  sourceTag,
  status = 'neutral',
  isLive = false,
  className
}: MetricCardProps) {
  const statusColor = {
    optimal: 'border-l-4 border-l-[#2e7d32]',
    moderate: 'border-l-4 border-l-[#d4973b]',
    warning: 'border-l-4 border-l-[#d96b27]',
    neutral: 'border-l-4 border-l-[#dcd8ce]'
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-[#e8e5dc] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_14px_rgba(46,125,50,0.06)] hover:border-[#dcd8ce] transition-all flex flex-col justify-between',
        statusColor[status],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#616d64] uppercase tracking-wider">{label}</span>
          {sourceTag && (
            <span className="text-[10px] text-[#8d9890] font-medium tracking-tight mt-0.5">
              {sourceTag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isLive ? (
            <Badge variant="sage" size="sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32] animate-pulse"></span>
              Live
            </Badge>
          ) : (
            <Badge variant="charcoal" size="sm">
              Model
            </Badge>
          )}
          {icon && <div className="text-[#2e7d32] p-1.5 bg-[#f4f1ea] rounded-xl border border-[#e8e5dc]/60">{icon}</div>}
        </div>
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold tracking-tight text-[#1e2420]">
            {value}
          </span>
          {unit && <span className="text-sm font-semibold text-[#616d64]">{unit}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#616d64] pt-2.5 border-t border-[#f3efe9] mt-1">
        {subtext ? (
          <span className="truncate">{subtext}</span>
        ) : (
          <span className="text-[#8d9890]">30-day observational window</span>
        )}
        {trend && (
          <span
            className={cn(
              'font-semibold inline-flex items-center gap-0.5',
              trend.direction === 'up' ? 'text-[#2e7d32]' : trend.direction === 'down' ? 'text-[#d96b27]' : 'text-[#616d64]'
            )}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
