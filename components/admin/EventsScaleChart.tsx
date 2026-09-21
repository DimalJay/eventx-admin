"use client";

import React from "react";
import { useQueries } from "@tanstack/react-query";
import { getEventRegistrationsRequest } from "@/service/eventService";

interface EventsScaleChartProps {
  events: any[];
}

export default function EventsScaleChart({ events }: EventsScaleChartProps) {
  if (!events || !Array.isArray(events)) return null;

  // 1. Sort events by date closest to today (upcoming/recent) and select top 5
  const sortedEvents = [...events]
    .sort((a, b) => {
      const dateA = new Date(a.startDate || a.date || 0).getTime();
      const dateB = new Date(b.startDate || b.date || 0).getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  // 2. Fetch registrations for all 5 events concurrently
  const queryResults = useQueries({
    queries: sortedEvents.map((e) => ({
      queryKey: ["event-registrations", e.id],
      queryFn: () => getEventRegistrationsRequest(e.id),
      enabled: !!e.id,
    })),
  });

  // Extract registration counts
  const regCounts = queryResults.map((res) => res.data?.data?.length || 0);

  // 3. Find the maximum registrations among these 5 events (minimum scale 1 to avoid division by zero)
  const maxRegCount = Math.max(...regCounts, 1);

  return (
    <>
      {sortedEvents.map((e: any, i: number) => {
        const count = regCounts[i];
        // Calculate dynamic height percentage relative to the max registration count
        const heightVal = count > 0 ? (count / maxRegCount) * 100 : 0;

        return (
          <div key={e.id || i} className="w-full h-full flex flex-col justify-end items-center gap-1 group relative max-w-12 mx-auto">
            <div className="w-full bg-zinc-100 rounded-t-lg relative flex items-end" style={{ height: "100%" }}>
              {count > 0 && (
                <div
                  className="w-full bg-indigo-600 rounded-t-lg opacity-85 hover:opacity-100 transition-all duration-300"
                  style={{ height: `${heightVal}%` }}
                />
              )}
            </div>
            <span className="text-[9px] font-semibold text-zinc-400 truncate max-w-full uppercase mt-1 text-center" title={e.title}>
              {e.title || "Unknown"}
            </span>
            <span className="text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-zinc-900 px-1.5 py-0.5 rounded font-mono z-10 whitespace-nowrap">
              Reg: {count}
            </span>
          </div>
        );
      })}
    </>
  );
}

