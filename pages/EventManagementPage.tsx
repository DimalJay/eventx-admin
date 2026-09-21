"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPublicEventsRequest, getEventRegistrationsRequest, updateAdminEventStatusRequest } from "@/service/eventService";
import { getAllUsersRequest } from "@/service/userService";
import CustomSelect from "@/components/CustomSelect";
import { getImageUrl } from "@/lib/utils";
import TableCard from "@/components/admin/TableCard";
import TableToolbar from "@/components/admin/TableToolbar";
import TablePagination from "@/components/admin/TablePagination";
import EventDetailsModal from "@/components/admin/EventDetailsModal";
import EventsTable from "@/components/admin/EventsTable";
import { AlertCircle } from "lucide-react";

export default function EventManagementPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Confirmation modal states
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    eventId: number;
    eventName: string;
    currentStatus: string;
  } | null>(null);

  const ITEMS_PER_PAGE = 10;

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ eventId, currentStatus }: { eventId: number; currentStatus: string }) => {
      const newStatus = currentStatus === "Suspended" ? "active" : "suspended";
      return updateAdminEventStatusRequest(eventId, newStatus);
    },
    onSuccess: (data, variables) => {
      const action = variables.currentStatus === "Suspended" ? "activated" : "suspended";
      toast.success(`Event successfully ${action}.`);
      queryClient.invalidateQueries({ queryKey: ["public-events"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to update event status.";
      toast.error(errorMessage);
    },
  });

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

  const { data: eventRegsData, isLoading: isEventRegsLoading } = useQuery({
    queryKey: ["event-registrations", selectedEvent?.id],
    queryFn: () => getEventRegistrationsRequest(selectedEvent.id),
    enabled: !!selectedEvent,
  });

  const eventAttendees = eventRegsData?.data || [];

  const handleRowClick = (event: any) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
    setActiveTab("info");
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

  // Helper to determine status based on dates
  const getEventStatus = (event: typeof rawEvents[0]) => {
    if (event.status && event.status.toLowerCase() === 'suspended') {
      return "Suspended";
    }

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

      <TableCard>
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search events..."
          isFilterOpen={isFilterOpen}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          onFilterClose={() => setIsFilterOpen(false)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          filterContent={
            <>
              <div className="space-y-1 z-50">
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
                {timeframeFilter === "custom_month" && (
                  <div className="grid grid-cols-4 gap-1.5 mt-2 p-1 bg-zinc-50 rounded-xl border border-zinc-200/50">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, idx) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => { setSelectedMonth(idx); setCurrentPage(1); }}
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
            </>
          }
        />

        {isEventsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
            <Loader2 className="animate-spin text-zinc-900" size={32} />
            <p className="text-sm font-medium">Loading platform events...</p>
          </div>
        ) : eventsError ? (
          <div className="text-center py-20 text-red-650">
            <p className="font-semibold">Failed to load events</p>
            <p className="text-xs mt-1 text-zinc-550">{(eventsError as any)?.message || "An error occurred"}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="font-semibold">No events found</p>
            <p className="text-xs mt-1">Try adjusting your search query.</p>
          </div>
        ) : (
          <>
            <EventsTable
              paginatedEvents={paginatedEvents}
              onRowClick={handleRowClick}
              getOrganizerName={getOrganizerName}
              formatDate={formatDate}
              getEventStatus={getEventStatus}
              onStatusToggle={(event) => {
                setConfirmStatusChange({
                  eventId: event.id,
                  eventName: event.title,
                  currentStatus: getEventStatus(event),
                });
              }}
            />

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEvents.length}
              itemsPerPage={ITEMS_PER_PAGE}
              startIndex={startIndex}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </TableCard>

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        selectedEvent={selectedEvent}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        eventStatus={selectedEvent ? getEventStatus(selectedEvent) : ""}
        organizerName={selectedEvent ? getOrganizerName(selectedEvent.organizerId) : ""}
        formatDate={formatDate}
        attendees={eventAttendees}
        isAttendeesLoading={isEventRegsLoading}
      />

      {/* Confirmation Modal for Suspend/Activate Event */}
      {confirmStatusChange && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-100 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 bg-amber-50 rounded-xl">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">
                {confirmStatusChange.currentStatus !== "Suspended" ? "Suspend Event" : "Activate Event"}
              </h3>
            </div>
            
            <p className="text-sm text-zinc-600">
              Are you sure you want to {confirmStatusChange.currentStatus !== "Suspended" ? "suspend" : "activate"} event{" "}
              <strong className="text-zinc-900">{confirmStatusChange.eventName}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmStatusChange(null)}
                disabled={toggleStatusMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleStatusMutation.mutate(
                    {
                      eventId: confirmStatusChange.eventId,
                      currentStatus: confirmStatusChange.currentStatus,
                    },
                    {
                      onSettled: () => setConfirmStatusChange(null),
                    }
                  );
                }}
                disabled={toggleStatusMutation.isPending}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors flex items-center gap-2 ${
                  confirmStatusChange.currentStatus !== "Suspended"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } disabled:opacity-50`}
              >
                {toggleStatusMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                {confirmStatusChange.currentStatus !== "Suspended" ? "Suspend Event" : "Activate Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
