"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllActivitiesRequest } from "@/service/dashboardService";
import {
  Users,
  Calendar,
  Search,
  Filter,
  ArrowLeft,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "user" | "event">("all");

  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ["all-activities"],
    queryFn: getAllActivitiesRequest,
  });

  const activities = activitiesData?.data || [];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
            <Link href="/" className="hover:text-zinc-950 flex items-center gap-1">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-800">Recent Activities</span>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">Recent Activities</h1>
          <p className="text-zinc-500 text-sm mt-1">Track and monitor all registrations and event creations across the platform.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl text-sm outline-none focus:border-zinc-400 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-fit bg-zinc-100 p-0.5 rounded-xl">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filterType === "all"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("user")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filterType === "user"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setFilterType("event")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filterType === "event"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Events
            </button>
          </div>
        </div>

        {/* Timeline/List Content */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-950"></div>
              <p className="text-sm">Loading recent activities...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 text-sm">
              <Activity className="mx-auto mb-3 text-zinc-300" size={36} />
              No activities found matching your criteria.
            </div>
          ) : (
            <div className="relative pl-6 border-l border-zinc-100 space-y-8 py-2 ml-4">
              {filteredActivities.map((activity) => {
                const Icon = activity.type === "user" ? Users : Calendar;
                return (
                  <div key={activity.id} className="relative group">
                    {/* Circle timeline indicator */}
                    <div className="absolute -left-[37px] top-1 z-10 w-6 h-6 rounded-full flex items-center justify-center text-zinc-600 bg-white border border-zinc-200 group-hover:scale-110 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-xs">
                      <Icon size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-800 leading-tight">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {activity.time}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                        <span className="text-[10px] font-bold text-zinc-400 tracking-wider">
                          {new Date(activity.date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
