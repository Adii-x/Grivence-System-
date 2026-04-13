import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const StatCardSkeleton = () => (
  <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
    <Skeleton className="h-7 w-16" />
    <Skeleton className="h-3 w-24" />
  </div>
);

export const RowSkeleton = () => (
  <div className="flex items-center gap-4 py-3 border-b border-[hsl(var(--border-subtle))]">
    <Skeleton className="h-4 w-48" />
    <Skeleton className="h-5 w-16" />
    <Skeleton className="h-5 w-16" />
    <Skeleton className="h-4 w-20" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-surface border border-border rounded-lg p-5">
    <Skeleton className="h-4 w-40 mb-4" />
    <Skeleton className="h-48 w-full" />
  </div>
);
