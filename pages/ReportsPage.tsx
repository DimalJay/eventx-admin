"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

const REPORTS = [
  { id: "R001", reporter: "user@uni.edu", type: "Harassment", status: "New", priority: "High", date: "2026-07-16" },
  { id: "R002", reporter: "kasun@uni.edu", type: "Fake Event", status: "Under Review", priority: "Medium", date: "2026-07-15" },
  { id: "R003", reporter: "admin@uni.edu", type: "Spam", status: "Resolved", priority: "Low", date: "2026-07-10" },
];

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">Complaints & Reports</h1>
          <p className="text-zinc-500 text-sm mt-1">Review and resolve user complaints and reported issues.</p>
        </div>
      </div>

      <div 
        className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs overflow-hidden"
      >
        <div className="p-4 border-b border-zinc-200/60 flex flex-col sm:flex-row gap-4 justify-between bg-zinc-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-sm focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors bg-white">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 text-zinc-500 font-semibold border-b border-zinc-200/60">
              <tr>
                <th className="px-6 py-4">Report ID</th>
                <th className="px-6 py-4">Reported By</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-900">{report.id}</td>
                  <td className="px-6 py-4 text-zinc-500">{report.reporter}</td>
                  <td className="px-6 py-4 text-zinc-700">{report.type}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      report.priority === 'High' ? 'bg-red-50 text-red-700' : 
                      report.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-4 py-1.5 bg-zinc-900 text-white rounded-full text-xs font-semibold hover:bg-zinc-800 transition">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
