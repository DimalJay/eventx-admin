"use client";

import React, { useState } from "react";
import { Lock, Save, Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { updateAdminPasswordRequest } from "@/service/authService";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Current password is required.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await updateAdminPasswordRequest({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => !loading && onClose()} />

      {/* Modal Content */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-150 flex items-center justify-between bg-zinc-50/50">
          <h2 className="font-semibold text-zinc-900 flex items-center gap-2">
            <Lock size={16} className="text-zinc-500" /> Change Password
          </h2>
          <button
            disabled={loading}
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handlePasswordChangeSubmit}>
          <div className="p-6 space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-800 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:bg-white focus:border-zinc-900 focus:outline-none transition-all"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-650"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 chars)"
                  className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-800 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:bg-white focus:border-zinc-900 focus:outline-none transition-all"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-650"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-800 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:bg-white focus:border-zinc-900 focus:outline-none transition-all"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-650"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-zinc-150 bg-zinc-50/50 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-zinc-55 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed min-w-[130px]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
