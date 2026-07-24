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
import UserDetailsModal from "@/components/admin/UserDetailsModal";

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

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        selectedUser={selectedUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rawEvents={rawEvents}
        userRegistrations={userRegistrations}
        isUserRegsLoading={isUserRegsLoading}
        formatDate={formatDate}
        formatStatus={formatStatus}
        formatRole={formatRole}
      />
    </div>
  );
}
