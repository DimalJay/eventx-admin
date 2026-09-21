"use client";

import React from "react";

interface DailyRegistrationsChartProps {
  chartData?: Array<any>;
}

export default function DailyRegistrationsChart({ chartData }: DailyRegistrationsChartProps) {
  const maxRegs = Math.max(...(chartData?.map((d) => d.registrations || 0) || [1]), 1);

  return (
    <>
      {chartData?.map((d: any, i: number) => {
        const count = d.registrations || 0;
        const heightPercent = count > 0 ? Math.max((count / maxRegs) * 100, 15) : 0;
        
        return (
          <div key={i} className="w-full h-full flex flex-col justify-end items-center gap-1 group relative max-w-14 mx-auto">
            {/* Registration Count Badge */}
            <div className="text-[10px] font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded-md min-w-[20px] text-center mb-1 shadow-2xs">
              {count}
            </div>

            <div className="w-full bg-zinc-100 rounded-t-lg relative flex items-end h-32 overflow-hidden">
              {count > 0 && (
                <div
                  className="w-full bg-indigo-600 rounded-t-lg opacity-90 hover:opacity-100 transition-all duration-500"
                  style={{ height: `${heightPercent}%` }}
                />
              )}
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">{d.label}</span>
          </div>
        );
      })}
    </>
  );
}

