"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsRequest } from "@/service/dashboardService";
import {
  Users,
  Calendar,
  Ticket,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdminDashboard() {
  const [chartRange, setChartRange] = useState("week");

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats", chartRange],
    queryFn: () => getDashboardStatsRequest(chartRange),
  });

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
          <Link href="/analytics" className="px-5 py-2.5 bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black/90 transition shadow-xs">
            Analytics & Reports
          </Link>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-950">Revenue & Registrations</h2>
            <select 
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-zinc-950/20"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="h-[300px] w-full flex items-stretch gap-2 justify-between px-4 pb-4 mt-8">
            {(Array.isArray(statsData?.data?.chartData) && statsData.data.chartData.length > 0 ? statsData.data.chartData : [
              { label: "Mon", registrations: 0, regPercentage: 0 },
              { label: "Tue", registrations: 0, regPercentage: 0 },
              { label: "Wed", registrations: 0, regPercentage: 0 },
              { label: "Thu", registrations: 0, regPercentage: 0 },
              { label: "Fri", registrations: 0, regPercentage: 0 },
              { label: "Sat", registrations: 0, regPercentage: 0 },
              { label: "Sun", registrations: 0, regPercentage: 0 }
            ]).map((day: any, i: number) => {
              // Ensure we have a valid number for height, fallback to 5% minimum
              const heightValue = Math.max(Number(day.regPercentage) || Number(day.percentage) || 0, 5);
              
              return (
                <div key={i} className="w-full max-w-[40px] flex flex-col justify-end items-center gap-2 group relative">
                  <div className="absolute -top-8 bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {day.registrations || day.value || 0} Regs
                  </div>
                  <div
                    className="w-full bg-zinc-100 rounded-t-lg relative overflow-hidden group-hover:bg-zinc-200 transition-colors"
                    style={{ height: `${heightValue}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-zinc-950 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightValue}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider shrink-0">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-950">Recent Activity</h2>
            <Link href="/activities" className="text-xs text-zinc-900 font-semibold uppercase tracking-wider hover:text-zinc-600 transition">View All</Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {isLoading ? (
              <div className="text-center py-10 text-xs text-zinc-400">Loading activities...</div>
            ) : !statsData?.data?.recentActivities || statsData.data.recentActivities.length === 0 ? (
              <div className="text-center py-10 text-xs text-zinc-400">No recent activities.</div>
            ) : (
              statsData.data.recentActivities.map((activity: any) => {
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
