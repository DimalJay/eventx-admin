"use client";

import React from "react";

interface EventsScaleChartProps {
  events: any[];
}

export default function EventsScaleChart({ events }: EventsScaleChartProps) {
  return (
    <>
      {events.slice(0, 8).map((e: any, i: number) => {
        const heightVal = Math.min(Math.max((e.capacity / 500) * 100, 15), 100);
        return (
          <div key={i} className="w-full flex flex-col items-center gap-1 group">
            <div className="w-full bg-zinc-100 rounded-t-lg relative" style={{ height: `${heightVal}%` }}>
              <div className="absolute bottom-0 w-full bg-emerald-600 rounded-t-lg h-full opacity-85 hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-[9px] font-semibold text-zinc-400 truncate max-w-10 uppercase mt-1">
              {e.title}
            </span>
            <span className="text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">
              Cap: {e.capacity || "N/A"}
            </span>
          </div>
        );
      })}
    </>
  );
}
