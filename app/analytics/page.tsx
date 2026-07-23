"use client";

import React from "react";
import { Download, Users, Ticket } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">Analytics & Reports</h1>
          <p className="text-zinc-500 text-sm mt-1">Deep dive into platform statistics and generate custom reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black/90 transition shadow-xs">
            <Download size={14} /> Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Users size={18}/></div>
              <h2 className="font-semibold text-zinc-950">User Growth</h2>
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">This Year</span>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {[30, 45, 40, 60, 55, 75, 80, 95].map((h, i) => (
              <div key={i} className="w-full bg-zinc-100 rounded-t-lg relative" style={{ height: `${h}%` }}>
                <div className="absolute bottom-0 w-full bg-zinc-900 rounded-t-lg h-full opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        <div 
          className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Ticket size={18}/></div>
              <h2 className="font-semibold text-zinc-950">Ticket Sales</h2>
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">This Year</span>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {[20, 35, 50, 40, 70, 65, 85, 90].map((h, i) => (
              <div key={i} className="w-full bg-zinc-100 rounded-t-lg relative" style={{ height: `${h}%` }}>
                <div className="absolute bottom-0 w-full bg-emerald-600 rounded-t-lg h-full opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div 
        className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6"
      >
        <h2 className="text-lg font-semibold text-zinc-950 mb-4">Custom Report Generation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Report Type</label>
            <select className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-950/20">
              <option>User Activity Report</option>
              <option>Event Performance Report</option>
              <option>Financial Report</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Date Range</label>
            <select className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-950/20">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-5 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition shadow-xs">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
