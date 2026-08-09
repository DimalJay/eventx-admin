"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import ChangePasswordModal from "@/components/admin/ChangePasswordModal";

export default function SettingsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // Profile Info
  const [profile] = useState({
    name: "System Admin",
    email: "admin@eventx.com",
    role: "Super Admin"
  });

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">System Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Manage your administrative profile and security configurations.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6 space-y-6">
        <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-zinc-100">
          {/* Initials Avatar */}
          <div className="w-20 h-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold uppercase ring-4 ring-zinc-100 shadow-inner select-none">
            {profile.name.split(" ").map(w => w[0]).join("")}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-semibold text-zinc-900">{profile.name}</h3>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{profile.role}</p>
            <p className="text-xs text-zinc-400">Manage account properties and password.</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-4 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100/50">
            <span className="font-semibold text-zinc-500">Email Address</span>
            <span className="text-zinc-800 font-medium">{profile.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100/50">
            <span className="font-semibold text-zinc-500">System Role</span>
            <span className="text-zinc-800 font-medium">{profile.role}</span>
          </div>
        </div>

        {/* Change Password Trigger Button */}
        <div className="pt-2">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
          >
            <Lock size={14} /> Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
