"use client";

import React from "react";
import { X, User as UserIcon, Phone, Calendar, Shield, Globe, Award, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  rawEvents: any[];
  userRegistrations: any[];
  isUserRegsLoading: boolean;
  formatDate: (dateString: string) => string;
  formatRole: (role: string) => string;
  formatStatus: (status: string) => string;
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  selectedUser,
  activeTab,
  onTabChange,
  rawEvents,
  userRegistrations,
  isUserRegsLoading,
  formatDate,
  formatRole,
  formatStatus,
}: UserDetailsModalProps) {
  if (!isOpen || !selectedUser) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      >
        {/* Modal Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl border border-zinc-200/80 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="p-6 pb-4 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 font-bold text-lg overflow-hidden">
                {selectedUser.profilePicture ? (
                  <img src={getImageUrl(selectedUser.profilePicture)} alt="" className="w-full h-full object-cover" />
                ) : (
                  `${selectedUser.firstName[0]}${selectedUser.lastName[0]}`.toUpperCase()
                )}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-950 text-base leading-none">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">{selectedUser.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-zinc-100 px-6 bg-zinc-50/20">
            {[
              { id: "info", label: "General Info", icon: UserIcon },
              { id: "organized", label: `Organized Events (${rawEvents.filter((e: any) => e.organizerId === selectedUser.id).length})`, icon: Calendar },
              { id: "registered", label: `Registered Events (${userRegistrations.length})`, icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 py-3 px-4 border-b-2 text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                    isActive
                      ? "border-zinc-950 text-zinc-950 font-bold"
                      : "border-transparent text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {activeTab === "info" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 bg-zinc-50/50 border border-zinc-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Joined Date</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <Calendar size={14} className="text-zinc-400" />
                    {formatDate(selectedUser.createdAt)}
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-50/50 border border-zinc-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Phone Number</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <Phone size={14} className="text-zinc-400" />
                    {selectedUser.phoneNumber || "Not Provided"}
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-50/50 border border-zinc-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Account Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      formatStatus(selectedUser.accountStatus) === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {formatStatus(selectedUser.accountStatus)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-50/50 border border-zinc-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Role</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">
                      {formatRole(selectedUser.role)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-50/50 border border-zinc-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Login Provider</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <Globe size={14} className="text-zinc-400" />
                    <span className="capitalize">{selectedUser.loginType || "standard"}</span>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-50/50 border border-zinc-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email Verification</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 mt-0.5">
                    {selectedUser.isVerified ? (
                      <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 size={14} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-bold uppercase tracking-wider">
                        <AlertCircle size={14} /> Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1 bg-zinc-50/50 border border-zinc-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Last Login Time</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <Shield size={14} className="text-zinc-400" />
                    {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : "Never logged in"}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "organized" && (
              <div className="space-y-2">
                {rawEvents.filter((e: any) => e.organizerId === selectedUser.id).length === 0 ? (
                  <div className="text-center py-10 text-zinc-500">
                    <p className="text-sm font-medium">No events organized by this user.</p>
                  </div>
                ) : (
                  rawEvents
                    .filter((e: any) => e.organizerId === selectedUser.id)
                    .map((event: any) => (
                      <div key={event.id} className="p-3.5 bg-zinc-50/60 border border-zinc-100 rounded-2xl flex items-center justify-between hover:bg-zinc-50 transition-colors">
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-900">{event.title}</h4>
                          <p className="text-xs text-zinc-500 mt-0.5">{formatDate(event.startDate)}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 capitalize">
                          {event.eventType}
                        </span>
                      </div>
                    ))
                )}
              </div>
            )}

            {activeTab === "registered" && (
              <div className="space-y-2">
                {isUserRegsLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-zinc-900" size={24} />
                  </div>
                ) : userRegistrations.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500">
                    <p className="text-sm font-medium">No registrations found for this user.</p>
                  </div>
                ) : (
                  userRegistrations.map((reg: any) => (
                    <div key={reg.id} className="p-3.5 bg-zinc-50/60 border border-zinc-100 rounded-2xl flex items-center justify-between hover:bg-zinc-50 transition-colors">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-900">{reg.eventTitle}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">{formatDate(reg.startDate)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 capitalize">
                          {reg.eventType}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          reg.status === 'confirmed' || reg.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {reg.status}
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
    </>
  );
}
