"use client";

import React from "react";

interface DailyRegistrationsChartProps {
  chartData?: Array<any>;
}

export default function DailyRegistrationsChart({ chartData }: DailyRegistrationsChartProps) {
  return (
    <>
      {chartData?.map((d: any, i: number) => (
        <div key={i} className="w-full flex flex-col items-center gap-1 group">
          <div className="w-full bg-zinc-100 rounded-t-lg relative" style={{ height: `${d.percentage || 15}%` }}>
            <div className="absolute bottom-0 w-full bg-zinc-900 rounded-t-lg h-full opacity-85 hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[10px] font-bold text-zinc-450 uppercase mt-1">{d.label}</span>
          <span className="text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">
            {d.value}
          </span>
        </div>
      ))}
    </>
  );
}
