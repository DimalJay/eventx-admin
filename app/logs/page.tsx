"use client";

import React from "react";
import { Search, Filter, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const LOGS = [
  { id: "L001", admin: "System Admin (super)", action: "User Ban", entity: "U005 (John Doe)", time: "2026-07-17 14:30:22", status: "Success", ip: "192.168.1.5" },
  { id: "L002", admin: "System Admin (super)", action: "Settings Update", entity: "Session Timeout", time: "2026-07-17 12:15:00", status: "Success", ip: "192.168.1.5" },
  { id: "L003", admin: "Moderator_A", action: "Event Cancel", entity: "E005 (Music Night)", time: "2026-07-16 09:45:11", status: "Success", ip: "10.0.0.12" },
  { id: "L004", admin: "Moderator_B", action: "User Edit", entity: "U002 (Kasun Silva)", time: "2026-07-15 16:20:05", status: "Failed", ip: "10.0.0.18" },
];

export default function AuditLogsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">Audit Logs</h1>
          <p className="text-zinc-500 text-sm mt-1">Track and monitor all administrative actions across the platform.</p>
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
              placeholder="Search logs..." 
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
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono text-xs">
              {LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4 text-zinc-500">{log.time}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{log.admin}</td>
                  <td className="px-6 py-4 text-zinc-700">{log.action}</td>
                  <td className="px-6 py-4 text-zinc-500">{log.entity}</td>
                  <td className="px-6 py-4 text-zinc-400">{log.ip}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      log.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {log.status}
                    </span>
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
