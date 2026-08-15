"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllActivitiesRequest, ActivityItem } from "@/service/dashboardService";
import {
  Users,
  Calendar,
  Search,
  ArrowLeft,
  Activity,
  X,
  ExternalLink,
  Mail,
  MapPin,
  DollarSign
} from "lucide-react";
import Link from "next/link";

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "user" | "event">("all");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ["all-activities"],
    queryFn: getAllActivitiesRequest,
  });

  const activities = activitiesData?.data || [];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
            <Link href="/" className="hover:text-zinc-950 flex items-center gap-1">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-800">Recent Activities</span>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">Recent Activities</h1>
          <p className="text-zinc-500 text-sm mt-1">Track and monitor all registrations and event creations across the platform.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl text-sm outline-none focus:border-zinc-400 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-fit bg-zinc-100 p-0.5 rounded-xl">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filterType === "all"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("user")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filterType === "user"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setFilterType("event")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filterType === "event"
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Events
            </button>
          </div>
        </div>

        {/* Timeline/List Content */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-950"></div>
              <p className="text-sm">Loading recent activities...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 text-sm">
              <Activity className="mx-auto mb-3 text-zinc-300" size={36} />
              No activities found matching your criteria.
            </div>
          ) : (
            <div className="relative pl-6 border-l border-zinc-100 space-y-8 py-2 ml-4">
              {filteredActivities.map((activity) => {
                const Icon = activity.type === "user" ? Users : Calendar;
                return (
                  <div
                    key={activity.id}
                    onClick={() => setSelectedActivity(activity)}
                    className="relative group cursor-pointer hover:bg-zinc-50/70 p-3 rounded-2xl -ml-3 transition-all duration-200"
                  >
                    {/* Circle timeline indicator */}
                    <div className="absolute -left-[25px] top-4 z-10 w-6 h-6 rounded-full flex items-center justify-center text-zinc-600 bg-white border border-zinc-200 group-hover:scale-110 group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-xs">
                      <Icon size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-800 leading-tight group-hover:text-zinc-950">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {activity.time}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                        <span className="text-[10px] font-bold text-zinc-400 tracking-wider">
                          {new Date(activity.date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Details Popup Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-2xl p-6 w-full max-w-sm relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-950 p-1.5 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-zinc-100 text-zinc-800">
                {selectedActivity.type === "user" ? <Users size={18} /> : <Calendar size={18} />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {selectedActivity.type === "user" ? "User Activity" : "Event Activity"}
                </h3>
                <p className="text-xs text-zinc-500 font-semibold">{selectedActivity.time}</p>
              </div>
            </div>

            {/* Modal Title */}
            <h2 className="text-base font-semibold text-zinc-900 leading-snug mb-4">
              {selectedActivity.title}
            </h2>

            {/* Divider */}
            <div className="h-px bg-zinc-100 w-full mb-4"></div>

            {/* Content fields depending on type */}
            <div className="space-y-3.5 mb-6 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Date & Time</span>
                <span className="text-zinc-700 font-medium">
                  {new Date(selectedActivity.date).toLocaleString()}
                </span>
              </div>

              {selectedActivity.type === "user" ? (
                <>
                  {selectedActivity.email && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <Mail size={10} /> Email Address
                      </span>
                      <span className="text-zinc-700 font-medium break-all">{selectedActivity.email}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Account Status</span>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${
                        selectedActivity.accountStatus === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                          : "bg-amber-50 text-amber-700 border border-amber-200/50"
                      }`}>
                        {selectedActivity.accountStatus || "Active"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {selectedActivity.location && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={10} /> Location
                      </span>
                      <span className="text-zinc-700 font-medium">{selectedActivity.location}</span>
                    </div>
                  )}
                  {selectedActivity.ticketPrice !== undefined && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign size={10} /> Ticket Price
                      </span>
                      <span className="text-zinc-700 font-medium">
                        {selectedActivity.ticketPrice === 0 ? "Free" : `$${selectedActivity.ticketPrice.toFixed(2)}`}
                      </span>
                    </div>
                  )}
                  {selectedActivity.description && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</span>
                      <p className="text-zinc-600 leading-relaxed line-clamp-3 text-xs">
                        {selectedActivity.description}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action Link (Opens in new tab) */}
            {selectedActivity.type === "event" && (
              <a
                href={`/events?search=${encodeURIComponent(selectedActivity.title.replace("New Event Created: ", ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
              >
                View Event Details
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
