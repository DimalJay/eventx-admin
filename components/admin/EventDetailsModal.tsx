"use client";

import { X, Calendar, Tag, Users, Info, Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  eventStatus: string;
  organizerName: string;
  formatDate: (date: string) => string;
  attendees: any[];
  isAttendeesLoading: boolean;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  selectedEvent,
  activeTab,
  onTabChange,
  eventStatus,
  organizerName,
  formatDate,
  attendees,
  isAttendeesLoading,
}: EventDetailsModalProps) {
  if (!isOpen || !selectedEvent) return null;

  const tabs = [
    { id: "info", label: "General Info", icon: Info },
    { id: "attendees", label: `Registered Attendees (${attendees.length})`, icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm cursor-pointer"
      />

      <div
        className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-zinc-100 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center border border-indigo-100/50 shadow-sm">
              <Calendar className="text-indigo-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">{selectedEvent.title}</h2>
              <p className="text-sm text-zinc-500 font-medium">{eventStatus} Event</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto bg-zinc-50/30">
          {/* Tabs */}
          <div className="px-6 pt-6 pb-2 border-b border-zinc-100 flex items-center gap-6 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`pb-4 flex items-center gap-2 text-sm font-semibold transition-colors relative cursor-pointer ${
                    isActive ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-indigo-600" : ""} />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="w-full h-48 bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden flex items-center justify-center relative">
                  {selectedEvent.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getImageUrl(selectedEvent.coverImage)} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
                      <Tag size={32} />
                      <span className="text-sm font-medium">No Cover Image</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-zinc-200/60 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Date & Time</p>
                    <p className="text-sm font-semibold text-zinc-900">{formatDate(selectedEvent.startDate)}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">To {formatDate(selectedEvent.endDate)}</p>
                  </div>
                  <div className="p-4 bg-white border border-zinc-200/60 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm font-semibold text-zinc-900">{selectedEvent.location || "TBA"}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 capitalize">{selectedEvent.eventType}</p>
                  </div>
                  <div className="p-4 bg-white border border-zinc-200/60 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Ticket Info</p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {selectedEvent.ticketPrice > 0 ? `$${selectedEvent.ticketPrice}` : "Free"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Capacity: {selectedEvent.capacity > 0 ? selectedEvent.capacity : "Unlimited"}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-zinc-200/60 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Organizer</p>
                    <p className="text-sm font-semibold text-zinc-900">{organizerName}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{selectedEvent.isPublic ? "Public Event" : "Private Event"}</p>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="p-4 bg-white border border-zinc-200/60 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</p>
                    <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "attendees" && (
              <div className="space-y-2">
                {isAttendeesLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-zinc-900" size={24} />
                  </div>
                ) : attendees.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 bg-white border border-zinc-100 rounded-2xl">
                    <p className="text-sm font-medium">No registrations yet.</p>
                  </div>
                ) : (
                  attendees.map((reg: any) => (
                    <div key={reg.id} className="p-3.5 bg-white border border-zinc-200/60 shadow-sm rounded-2xl flex items-center justify-between hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {reg.profilePicture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={getImageUrl(reg.profilePicture)} alt={reg.firstName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-zinc-500">{reg.firstName?.charAt(0)}{reg.lastName?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-900">{reg.firstName} {reg.lastName}</h4>
                          <p className="text-xs text-zinc-500 mt-0.5">{reg.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          reg.status === 'confirmed' || reg.status === 'active' || reg.status === 'PENDING' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {reg.status}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {reg.ticketCode}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
