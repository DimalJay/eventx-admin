import React from 'react';
import { Loader2 } from 'lucide-react';

interface BarChartCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconTextClass: string;
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}

export function BarChartCard({
  title,
  subtitle,
  icon,
  iconBgClass,
  iconTextClass,
  isLoading,
  isEmpty,
  emptyMessage,
  children
}: BarChartCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${iconBgClass} ${iconTextClass}`}>
            {icon}
          </div>
          <h2 className="font-semibold text-zinc-950">{title}</h2>
        </div>
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{subtitle}</span>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <Loader2 className="animate-spin text-zinc-400" size={24} />
        </div>
      ) : isEmpty ? (
        <div className="h-48 flex items-center justify-center text-xs text-zinc-450">
          {emptyMessage}
        </div>
      ) : (
        <div className="h-48 flex items-end justify-between gap-2 w-full">
          {children}
        </div>
      )}
    </div>
  );
}
