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
    optimal: 'border-l-4 border-l-[#2d6a4f]',
    moderate: 'border-l-4 border-l-[#d97706]',
    warning: 'border-l-4 border-l-[#dc2626]',
    neutral: 'border-l-4 border-l-[#d4d7cf]'
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#e6e8e2] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_3px_8px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between',
        statusColor[status],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#5a626a] uppercase tracking-wider">{label}</span>
          {sourceTag && (
            <span className="text-[10px] text-[#88929c] font-medium tracking-tight mt-0.5">
              {sourceTag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isLive ? (
            <Badge variant="sage" size="sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] animate-pulse"></span>
              Live
            </Badge>
          ) : (
            <Badge variant="charcoal" size="sm">
              Model
            </Badge>
          )}
          {icon && <div className="text-[#2d6a4f] p-1.5 bg-[#f4f5f1] rounded-lg">{icon}</div>}
        </div>
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold tracking-tight text-[#191c1f]">
            {value}
          </span>
          {unit && <span className="text-sm font-medium text-[#5a626a]">{unit}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#5a626a] pt-2 border-t border-[#f4f5f1] mt-1">
        {subtext ? (
          <span className="truncate">{subtext}</span>
        ) : (
          <span className="text-[#88929c]">30-day observational window</span>
        )}
        {trend && (
          <span
            className={cn(
              'font-medium inline-flex items-center gap-0.5',
              trend.direction === 'up' ? 'text-[#2d6a4f]' : trend.direction === 'down' ? 'text-[#dc2626]' : 'text-[#5a626a]'
            )}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
