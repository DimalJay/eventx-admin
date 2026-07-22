"use client";

import React, { useState } from "react";
import { Search, Filter, Eye, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getPublicEventsRequest } from "@/service/eventService";

export default function EventManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-events"],
    queryFn: getPublicEventsRequest,
  });

  const rawEvents = data?.data || [];

  // Filter events based on search query
  const filteredEvents = rawEvents.filter((event) => {
    const title = event.title.toLowerCase();
    const location = (event.location || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || location.includes(query);
  });

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

  // Helper to determine status based on dates
  const getEventStatus = (event: typeof rawEvents[0]) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Scheduled";
    }

    if (now < start) {
      return "Scheduled";
    } else if (now >= start && now <= end) {
      return "Ongoing";
    } else {
      return "Completed";
    }
  };

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
            <p className="text-sm font-medium">Loading platform events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">
            <p className="font-semibold">Failed to load events</p>
            <p className="text-xs mt-1 text-zinc-500">{(error as any)?.message || "An error occurred"}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="font-semibold">No events found</p>
            <p className="text-xs mt-1">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 text-zinc-500 font-semibold border-b border-zinc-200/60">
                <tr>
                  <th className="px-6 py-4">Event Name</th>
                  <th className="px-6 py-4">Organizer ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredEvents.map((event) => {
                  const status = getEventStatus(event);
                  return (
                    <tr key={event.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-zinc-900">{event.title}</td>
                      <td className="px-6 py-4 text-zinc-500">Organizer #{event.organizerId}</td>
                      <td className="px-6 py-4 text-zinc-500">{formatDate(event.startDate)}</td>
                      <td className="px-6 py-4 text-zinc-500">{event.capacity > 0 ? `0 / ${event.capacity}` : "Unlimited"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          status === 'Scheduled' ? 'bg-blue-50 text-blue-700' : 
                          status === 'Ongoing' ? 'bg-amber-50 text-amber-700' :
                          status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100" title="View"><Eye size={16}/></button>
                          <button className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Cancel"><XCircle size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
