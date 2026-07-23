"use client";

import React, { useState } from "react";
import { Search, Filter, Eye, XCircle, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getPublicEventsRequest } from "@/service/eventService";
import { getAllUsersRequest } from "@/service/userService";
import CustomSelect from "@/components/CustomSelect";

export default function EventManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const { data: eventsData, isLoading: isEventsLoading, error: eventsError } = useQuery({
    queryKey: ["public-events"],
    queryFn: getPublicEventsRequest,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersRequest,
  });

  const rawEvents = eventsData?.data || [];
  const users = usersData?.data || [];

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

  const getOrganizerName = (organizerId: number) => {
    const org = users.find((u) => u.id === organizerId);
    return org ? `${org.firstName} ${org.lastName}` : `Organizer #${organizerId}`;
  };

  // Filter events based on search query, date filter, capacity filter, and status filter
  const filteredEvents = rawEvents.filter((event) => {
    const title = event.title.toLowerCase();
    const location = (event.location || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query) || location.includes(query);

    const matchesStatus = statusFilter === "all" || getEventStatus(event).toLowerCase() === statusFilter.toLowerCase();
    
    // Relative Date Filter Logic
    const matchesDate = (() => {
      if (timeframeFilter === "all") return true;
      const eventDate = new Date(event.startDate);
      if (isNaN(eventDate.getTime())) return false;

      const now = new Date();
      
      if (timeframeFilter === "today") {
        return eventDate.toDateString() === now.toDateString();
      }

      if (timeframeFilter === "this_week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0,0,0,0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);

        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }

      if (timeframeFilter === "this_month") {
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      }

      if (timeframeFilter === "custom_month") {
        if (selectedMonth === null) return true;
        return eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === now.getFullYear();
      }

      return true;
    })();

    // Capacity range logic
    const matchesCapacity = (() => {
      if (capacityFilter === "all") return true;
      if (capacityFilter === "under_100") return event.capacity < 100;
      if (capacityFilter === "100_plus") return event.capacity >= 100;
      if (capacityFilter === "500_plus") return event.capacity >= 500;
      return true;
    })();

    return matchesSearch && matchesStatus && matchesDate && matchesCapacity;
  });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasActiveFilters = statusFilter !== "all" || timeframeFilter !== "all" || selectedMonth !== null || capacityFilter !== "all";

  const clearFilters = () => {
    setStatusFilter("all");
    setTimeframeFilter("all");
    setSelectedMonth(null);
    setCapacityFilter("all");
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTimeframeFilterChange = (value: string) => {
    setTimeframeFilter(value);
    setSelectedMonth(null);
    setCurrentPage(1);
  };

  const handleCapacityFilterChange = (value: string) => {
    setCapacityFilter(value);
    setCurrentPage(1);
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
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-sm focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-colors cursor-pointer ${
                hasActiveFilters 
                  ? "bg-black text-white border-black" 
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <Filter size={14} /> Filter
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {/* Filter Menu Popover */}
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-zinc-200/80 shadow-xl p-4 z-20 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <span className="font-semibold text-zinc-950 text-sm">Filters & Sorting</span>
                      <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                        <button 
                          onClick={() => setIsFilterOpen(false)}
                          className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Start Date</label>
                        <CustomSelect
                          value={timeframeFilter}
                          onChange={handleTimeframeFilterChange}
                          options={[
                            { value: "all", label: "Any Time" },
                            { value: "today", label: "Today" },
                            { value: "this_week", label: "This Week" },
                            { value: "this_month", label: "This Month" },
                            { value: "custom_month", label: "Specific Month" },
                          ]}
                        />

                        {/* Month selection grid */}
                        {timeframeFilter === "custom_month" && (
                          <div className="grid grid-cols-4 gap-1.5 mt-2 p-1 bg-zinc-50 rounded-xl border border-zinc-200/50">
                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, idx) => (
                              <button
                                key={month}
                                type="button"
                                onClick={() => {
                                  setSelectedMonth(idx);
                                  setCurrentPage(1);
                                }}
                                className={`text-[10px] font-semibold py-1 rounded-lg transition-colors cursor-pointer text-center ${
                                  selectedMonth === idx
                                    ? "bg-zinc-950 text-white"
                                    : "bg-white text-zinc-600 border border-zinc-200/60 hover:bg-zinc-50"
                                }`}
                              >
                                {month}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Capacity</label>
                        <CustomSelect
                          value={capacityFilter}
                          onChange={handleCapacityFilterChange}
                          options={[
                            { value: "all", label: "Any Capacity" },
                            { value: "under_100", label: "Less than 100" },
                            { value: "100_plus", label: "100+" },
                            { value: "500_plus", label: "500+" },
                          ]}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Event Status</label>
                        <CustomSelect
                          value={statusFilter}
                          onChange={handleStatusFilterChange}
                          options={[
                            { value: "all", label: "All Statuses" },
                            { value: "scheduled", label: "Scheduled" },
                            { value: "ongoing", label: "Ongoing" },
                            { value: "completed", label: "Completed" },
                          ]}
                        />
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isEventsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
            <Loader2 className="animate-spin text-zinc-900" size={32} />
            <p className="text-sm font-medium">Loading platform events...</p>
          </div>
        ) : eventsError ? (
          <div className="text-center py-20 text-red-600">
            <p className="font-semibold">Failed to load events</p>
            <p className="text-xs mt-1 text-zinc-500">{(eventsError as any)?.message || "An error occurred"}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="font-semibold">No events found</p>
            <p className="text-xs mt-1">Try adjusting your search query.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 text-zinc-500 font-semibold border-b border-zinc-200/60">
                  <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Organizer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Capacity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {paginatedEvents.map((event) => {
                    const status = getEventStatus(event);
                    return (
                      <tr key={event.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-zinc-900">{event.title}</td>
                        <td className="px-6 py-4 text-zinc-500">{getOrganizerName(event.organizerId)}</td>
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

            <div className="p-4 border-t border-zinc-200/60 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
              <span>
                Showing {filteredEvents.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredEvents.length)} of{" "}
                {filteredEvents.length} entries
              </span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-100 bg-white disabled:opacity-50 disabled:hover:bg-white transition-colors cursor-pointer"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border border-zinc-200 rounded-lg transition-colors cursor-pointer ${
                      currentPage === page 
                        ? "bg-zinc-950 text-white" 
                        : "bg-white hover:bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-100 bg-white disabled:opacity-50 disabled:hover:bg-white transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
