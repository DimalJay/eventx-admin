"use client";

import React, { useState } from "react";
import { Edit, Ban, Loader2, X, User as UserIcon, Phone, Calendar, Shield, Globe, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersRequest, getUserRegistrationsRequest } from "@/service/userService";
import { getPublicEventsRequest } from "@/service/eventService";
import CustomSelect from "@/components/CustomSelect";
import { getImageUrl } from "@/lib/utils";
import TableCard from "@/components/admin/TableCard";
import TableToolbar from "@/components/admin/TableToolbar";
import TablePagination from "@/components/admin/TablePagination";

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal details states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const ITEMS_PER_PAGE = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersRequest,
  });

  const { data: eventsData } = useQuery({
    queryKey: ["public-events"],
    queryFn: getPublicEventsRequest,
  });

  const { data: userRegsData, isLoading: isUserRegsLoading } = useQuery({
    queryKey: ["user-registrations", selectedUser?.id],
    queryFn: () => getUserRegistrationsRequest(selectedUser.id),
    enabled: !!selectedUser,
  });

  const rawUsers = data?.data || [];
  const rawEvents = eventsData?.data || [];
  const userRegistrations = userRegsData?.data || [];

  // Filter users based on search query and status filter, then sort by Joined Date
  const filteredUsers = rawUsers
    .filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = fullName.includes(query) || email.includes(query);

      const matchesStatus = statusFilter === "all" || (user.accountStatus && user.accountStatus.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortBy === "asc" ? dateA - dateB : dateB - dateA;
    });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const hasActiveFilters = statusFilter !== "all" || sortBy !== "desc";

  const clearFilters = () => {
    setStatusFilter("all");
    setSortBy("desc");
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">User Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage and monitor all system users.</p>
        </div>
      </div>

      <TableCard>
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search by name or email..."
          isFilterOpen={isFilterOpen}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          onFilterClose={() => setIsFilterOpen(false)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          filterContent={
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Sort by Joined Date</label>
                <CustomSelect
                  value={sortBy}
                  onChange={handleSortByChange}
                  options={[
                    { value: "desc", label: "Newest First" },
                    { value: "asc", label: "Oldest First" },
                  ]}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Account Status</label>
                <CustomSelect
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "suspended", label: "Suspended" },
                  ]}
                />
              </div>
            </>
          }
        />

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
                  {paginatedUsers.map((user) => {
                    const formattedStatus = formatStatus(user.accountStatus);
                    return (
                      <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td 
                          onClick={() => {
                            setSelectedUser(user);
                            setActiveTab("info");
                            setIsDetailsModalOpen(true);
                          }}
                          className="px-6 py-4 font-semibold text-zinc-900 cursor-pointer hover:text-black hover:underline transition-all"
                        >
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
            
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={ITEMS_PER_PAGE}
              startIndex={startIndex}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </TableCard>

      {isDetailsModalOpen && selectedUser && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsDetailsModalOpen(false)}
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
                    <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 font-bold text-lg">
                      {selectedUser.profilePicture ? (
                        <img src={getImageUrl(selectedUser.profilePicture)} alt="" className="w-full h-full rounded-full object-cover" />
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
                    onClick={() => setIsDetailsModalOpen(false)}
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
                        onClick={() => setActiveTab(tab.id)}
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
      )}
    </div>
  );
}
