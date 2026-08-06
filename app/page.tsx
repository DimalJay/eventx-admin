"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsRequest } from "@/service/dashboardService";
import {
  Users,
  Calendar,
  Ticket,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown
} from "lucide-react";

export default function AdminDashboard() {
  const [range, setRange] = useState("week");
  const [activeTab, setActiveTab] = useState<"registrations" | "revenue">("registrations");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const ranges = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];
  const currentRangeLabel = ranges.find(r => r.value === range)?.label || "This Week";

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats", range],
    queryFn: () => getDashboardStatsRequest(range),
  });

  const defaultChartData = [
    { label: "Mon", registrations: 0, regPercentage: 0, revenue: 0, revPercentage: 0 },
    { label: "Tue", registrations: 0, regPercentage: 0, revenue: 0, revPercentage: 0 },
    { label: "Wed", registrations: 0, regPercentage: 0, revenue: 0, revPercentage: 0 },
    { label: "Thu", registrations: 0, regPercentage: 0, revenue: 0, revPercentage: 0 },
    { label: "Fri", registrations: 0, regPercentage: 0, revenue: 0, revPercentage: 0 },
    { label: "Sat", registrations: 0, regPercentage: 0, revenue: 0, revPercentage: 0 },
    { label: "Sun", registrations: 0, regPercentage: 0, revenue: 0, revPercentage: 0 }
  ];
  const chartData = statsData?.data?.chartData || defaultChartData;

  const maxValue = chartData.reduce((max, item) => {
    const val = activeTab === "registrations" ? item.registrations : item.revenue;
    return val > max ? val : max;
  }, 0) || 10;

  const yAxisSteps = [
    maxValue,
    Math.round(maxValue * 0.75),
    Math.round(maxValue * 0.5),
    Math.round(maxValue * 0.25),
    0
  ];

  const formatYValue = (value: number) => {
    if (activeTab === "revenue") {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}k`;
      }
      return `$${value}`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  const stats = [
    {
      title: "Total Active Users",
      value: isLoading ? "..." : statsData?.data?.activeUsers?.value ?? "0",
      change: statsData?.data?.activeUsers?.change ?? "+0.0%",
      isPositive: statsData?.data?.activeUsers?.isPositive ?? true,
      icon: Users,
      color: "bg-zinc-100 text-zinc-900"
    },
    {
      title: "Total Events Created",
      value: isLoading ? "..." : statsData?.data?.eventsCreated?.value ?? "0",
      change: statsData?.data?.eventsCreated?.change ?? "+0.0%",
      isPositive: statsData?.data?.eventsCreated?.isPositive ?? true,
      icon: Calendar,
      color: "bg-zinc-100 text-zinc-900"
    },
    {
      title: "Total Registrations",
      value: isLoading ? "..." : statsData?.data?.registrations?.value ?? "0",
      change: statsData?.data?.registrations?.change ?? "0.00%",
      isPositive: statsData?.data?.registrations?.isPositive ?? true,
      icon: Ticket,
      color: "bg-zinc-100 text-zinc-900"
    },
    {
      title: "System Uptime",
      value: isLoading ? "..." : statsData?.data?.uptime?.value ?? "99.99%",
      change: statsData?.data?.uptime?.change ?? "0.00%",
      isPositive: statsData?.data?.uptime?.isPositive ?? true,
      icon: Activity,
      color: "bg-zinc-100 text-zinc-900"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-zinc-200/80 text-zinc-700 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-zinc-50 transition shadow-xs">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black/90 transition shadow-xs">
            View Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-zinc-200/60 shadow-xs hover:shadow-md transition relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                {stat.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {stat.change}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-semibold text-zinc-950 mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Chart Placeholder) */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-zinc-950">Overview Metrics</h2>
              
              {/* Tab Toggles */}
              <div className="flex bg-zinc-100 p-0.5 rounded-xl w-fit">
                <button
                  onClick={() => setActiveTab("registrations")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "registrations"
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Registrations
                </button>
                <button
                  onClick={() => setActiveTab("revenue")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "revenue"
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Revenue
                </button>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between gap-3 bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold rounded-2xl px-4 py-2.5 w-36 outline-none hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs"
              >
                <span>{currentRangeLabel}</span>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
                  
                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-zinc-200/60 rounded-2xl shadow-lg z-30 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {ranges.map((r) => (
                      <div
                        key={r.value}
                        onClick={() => {
                          setRange(r.value);
                          setDropdownOpen(false);
                        }}
                        className={`px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors ${
                          range === r.value
                            ? "bg-zinc-950 text-white"
                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                        }`}
                      >
                        {r.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[10px] font-bold text-zinc-400 h-64 pb-8 w-12 text-right select-none">
              {yAxisSteps.map((step, idx) => (
                <span key={idx}>{formatYValue(step)}</span>
              ))}
            </div>

            {/* Chart Area */}
            <div className="flex-1 relative h-64">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 h-full">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-b border-zinc-100/80 w-full h-0"></div>
                ))}
              </div>

              {/* Bars and X-Axis Labels */}
              <div className="absolute inset-0 flex items-end justify-between px-2 pb-8 h-full">
                {chartData.map((day, i) => {
                  const percentage = activeTab === "registrations" ? day.regPercentage : day.revPercentage;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                      {/* Tooltip */}
                      <div className="absolute -top-10 bg-zinc-950 text-white text-[10px] font-semibold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg flex flex-col gap-0.5 pointer-events-none">
                        {activeTab === "registrations" ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            <span>{day.registrations} Regs</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>${day.revenue.toLocaleString()} Revenue</span>
                          </div>
                        )}
                      </div>

                      {/* Single bar display based on activeTab */}
                      <div className="w-full flex items-end justify-center h-full pb-1 relative z-10">
                        {activeTab === "registrations" ? (
                          <div
                            className="w-full max-w-[24px] bg-zinc-900 rounded-t-md hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
                            style={{ height: `${percentage}%` }}
                          />
                        ) : (
                          <div
                            className="w-full max-w-[24px] bg-emerald-600 rounded-t-md hover:bg-emerald-500 transition-all duration-200 cursor-pointer"
                            style={{ height: `${percentage}%` }}
                          />
                        )}
                      </div>

                      {/* X-Axis Label */}
                      <span className="absolute -bottom-6 text-[10px] text-zinc-400 font-bold uppercase tracking-wider select-none">
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-950">Recent Activity</h2>
            <button className="text-xs text-zinc-900 font-semibold uppercase tracking-wider hover:text-zinc-600 transition">View All</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {isLoading ? (
              <div className="text-center py-10 text-xs text-zinc-400">Loading activities...</div>
            ) : !statsData?.data?.recentActivities || statsData.data.recentActivities.length === 0 ? (
              <div className="text-center py-10 text-xs text-zinc-400">No recent activities.</div>
            ) : (
              statsData.data.recentActivities.map((activity) => {
                const Icon = activity.type === "user" ? Users : Calendar;
                return (
                  <div key={activity.id} className="relative flex items-start gap-4 group">
                    <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-zinc-900 bg-zinc-100 ring-4 ring-white group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </div>
                    <div className="pt-1 flex-1">
                      <p className="text-sm font-semibold text-zinc-800 leading-tight">{activity.title}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
