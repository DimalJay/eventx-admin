"use client";

import React, { useState } from "react";
import { Search, Filter, Edit, Ban, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersRequest } from "@/service/userService";

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersRequest,
  });

  const rawUsers = data?.data || [];

  // Filter users based on search query
  const filteredUsers = rawUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  // Helper to format role name
  const formatRole = (role: string) => {
    if (!role) return "User";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Helper to format status name
  const formatStatus = (status: string) => {
    if (!status) return "Active";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toISOString().split("T")[0];
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">User Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage and monitor all system users.</p>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-sm focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors bg-white">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
            <Loader2 className="animate-spin text-zinc-900" size={32} />
            <p className="text-sm font-medium">Loading system users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">
            <p className="font-semibold">Failed to load users</p>
            <p className="text-xs mt-1 text-zinc-500">{(error as any)?.message || "An error occurred"}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="font-semibold">No users found</p>
            <p className="text-xs mt-1">Try adjusting your search query.</p>
          </div>
        ) : (
          <>
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
                  {filteredUsers.map((user) => {
                    const formattedStatus = formatStatus(user.accountStatus);
                    return (
                      <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-zinc-900">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 text-zinc-500">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            formattedStatus === 'Active' ? 'bg-emerald-50 text-emerald-700' : 
                            formattedStatus === 'Suspended' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {formattedStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-500">{formatDate(user.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"><Edit size={16}/></button>
                            <button className="p-1.5 text-zinc-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"><Ban size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-zinc-200/60 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
              <span>Showing {filteredUsers.length} entries</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-100 bg-white">Prev</button>
                <button className="px-3 py-1 border border-zinc-200 rounded-lg bg-zinc-950 text-white">1</button>
                <button className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-100 bg-white">Next</button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

