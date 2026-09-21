"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminEventRegistrationCountsRequest } from "@/service/eventService";

interface EventsScaleChartProps {
  events: any[];
}

export default function EventsScaleChart({ events }: EventsScaleChartProps) {
  // Single admin-level API call — fetches all events' registration counts at once
  // No per-event 403 access issues (admin has full access)
  const { data: countsData, isLoading } = useQuery({
    queryKey: ["admin-event-registration-counts"],
    queryFn: getAdminEventRegistrationCountsRequest,
    retry: false,
    staleTime: 30_000,
  });

  // Build a map: eventId => count
  const countMap: Record<number, number> = {};
  if (Array.isArray(countsData?.data)) {
    for (const item of countsData.data) {
      countMap[item.eventId] = item.count;
    }
  }

  // Sort events by most recent startDate first, take top 6
  const safeEvents = Array.isArray(events) ? events : [];
  const sortedEvents = [...safeEvents]
    .sort((a, b) => {
      const dateA = new Date(a.startDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.startDate || b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 6);

  if (sortedEvents.length === 0) return null;

  const regCounts = sortedEvents.map((e) => countMap[e.id] ?? 0);
  const maxRegCount = Math.max(...regCounts, 1);

  return (
    <>
      {sortedEvents.map((e: any, i: number) => {
        const count = regCounts[i];
        const heightPercent = count > 0 ? Math.max((count / maxRegCount) * 100, 15) : 4;

        return (
          <div key={e.id || i} className="w-full h-full flex flex-col justify-end items-center gap-1 group relative max-w-14 mx-auto">
            {/* Registration Count Badge */}
            <div
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center mb-1 shadow-2xs ${
                count > 0 ? "text-emerald-700 bg-emerald-50" : "text-zinc-500 bg-zinc-100"
              }`}
            >
              {isLoading ? "..." : count}
            </div>

            {/* Bar */}
            <div className="w-full bg-zinc-50 rounded-t-lg relative flex items-end h-32 overflow-hidden border border-zinc-100">
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  count > 0 ? "bg-emerald-500 opacity-90 hover:opacity-100" : "bg-zinc-200"
                }`}
                style={{ height: `${heightPercent}%` }}
              />
            </div>

            {/* Event Title */}
            <span
              className="text-[9px] font-semibold text-zinc-500 truncate max-w-full uppercase mt-1 text-center"
              title={e.title}
            >
              {e.title || "Unknown"}
            </span>
          </div>
        );
      })}
    </>
  );
}
