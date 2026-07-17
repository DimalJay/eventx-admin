"use client";

import React from "react";
import { Search, Filter, Eye, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const EVENTS = [
  { id: "E001", name: "Tech Symposium 2026", organizer: "CS Union", date: "2026-08-15", capacity: "120/150", status: "Scheduled" },
  { id: "E002", name: "Annual Hackathon", organizer: "IEEE Branch", date: "2026-08-20", capacity: "200/200", status: "Ongoing" },
  { id: "E003", name: "Design Workshop", organizer: "Art Club", date: "2026-07-10", capacity: "45/50", status: "Completed" },
  { id: "E004", name: "Career Fair", organizer: "University", date: "2026-09-01", capacity: "500/1000", status: "Scheduled" },
  { id: "E005", name: "Music Night", organizer: "Music Club", date: "2026-08-05", capacity: "0/300", status: "Cancelled" },
];

export default function EventManagementPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">Event Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Monitor and control all events across the platform.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs overflow-hidden"
      >
        <div className="p-4 border-b border-zinc-200/60 flex flex-col sm:flex-row gap-4 justify-between bg-zinc-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search events..." 
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
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Organizer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Reg/Cap</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-900">{event.name}</td>
                  <td className="px-6 py-4 text-zinc-500">{event.organizer}</td>
                  <td className="px-6 py-4 text-zinc-500">{event.date}</td>
                  <td className="px-6 py-4 text-zinc-500">{event.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      event.status === 'Scheduled' ? 'bg-blue-50 text-blue-700' : 
                      event.status === 'Ongoing' ? 'bg-amber-50 text-amber-700' :
                      event.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100" title="View"><Eye size={16}/></button>
                      <button className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Cancel"><XCircle size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
