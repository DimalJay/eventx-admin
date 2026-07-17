"use client";

import React from "react";
import { Search, Filter, MoreVertical, Edit, Ban, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const USERS = [
  { id: "U001", name: "Pramod Jay", email: "pramod@uni.edu", role: "Organizer", status: "Active", date: "2026-06-15" },
  { id: "U002", name: "Kasun Silva", email: "kasun@uni.edu", role: "Participant", status: "Active", date: "2026-06-20" },
  { id: "U003", name: "Nimal Perera", email: "nimal@uni.edu", role: "Organizer", status: "Suspended", date: "2026-05-10" },
  { id: "U004", name: "Amali Perera", email: "amali@uni.edu", role: "Coordinator", status: "Active", date: "2026-06-22" },
  { id: "U005", name: "John Doe", email: "john@uni.edu", role: "Participant", status: "Banned", date: "2026-01-11" },
];

export default function UserManagementPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">User Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage and monitor all system users.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black/90 transition shadow-xs">
            Add New User
          </button>
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
              placeholder="Search by name or email..." 
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {USERS.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-900">{user.name}</td>
                  <td className="px-6 py-4 text-zinc-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 
                      user.status === 'Suspended' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{user.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"><Edit size={16}/></button>
                      <button className="p-1.5 text-zinc-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"><Ban size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-zinc-200/60 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
          <span>Showing 1 to 5 of 150 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-100 bg-white">Prev</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-lg bg-zinc-950 text-white">1</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-100 bg-white">2</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-100 bg-white">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
