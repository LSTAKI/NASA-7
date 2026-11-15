import React from 'react';
import { cn } from '@/lib/utils/cn';

export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[#e6e8e2]/60', className)}
      {...props}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#e6e8e2] p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="h-5 w-12 rounded-full" />
      </div>
      <LoadingSkeleton className="h-8 w-20" />
      <div className="pt-2 border-t border-[#f4f5f1] flex justify-between">
        <LoadingSkeleton className="h-3 w-32" />
        <LoadingSkeleton className="h-3 w-10" />
      </div>
    </div>
  );
}
