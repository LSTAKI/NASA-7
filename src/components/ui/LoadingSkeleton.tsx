import React from 'react';
import { cn } from '@/lib/utils/cn';

export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-[#eae6dd]/70', className)}
      {...props}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e5dc] p-5 shadow-2xs space-y-4">
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="h-5 w-12 rounded-full" />
      </div>
      <LoadingSkeleton className="h-8 w-20" />
      <div className="pt-2.5 border-t border-[#f3efe9] flex justify-between">
        <LoadingSkeleton className="h-3 w-32" />
        <LoadingSkeleton className="h-3 w-10" />
      </div>
    </div>
  );
}
