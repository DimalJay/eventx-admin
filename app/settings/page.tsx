"use client";

import React, { useState } from "react";
import { 
  User, 
  Lock, 
  Save, 
  Check, 
  Eye, 
  EyeOff, 
  Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "profile" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile State
  const [profile, setProfile] = useState({
    name: "System Admin",
    email: "admin@eventx.com",
    role: "Super Admin",
    phone: "+94 77 123 4567"
  });

  // Password State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);

    // Simulate API request saving settings
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Settings updated successfully!");
      
      // Clear password fields on successful save
      if (activeTab === "security") {
        setPasswords({ current: "", new: "", confirm: "" });
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }, 1200);
  };

  const tabs = [
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "security", label: "Security & Password", icon: Lock }
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">System Settings</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage your personal profile and account security settings.
          </p>
        </div>

        {/* Global Save Indicator */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <Check size={14} />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="border-b border-zinc-200 flex gap-6 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSuccessMessage(null);
              }}
              data-selected={isActive}
              className="tab-item flex items-center gap-2 pb-3 text-sm font-semibold border-zinc-950 cursor-pointer transition-all duration-200 relative"
            >
              <Icon size={16} className={isActive ? "text-black" : "text-zinc-400"} />
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTabBorder"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-950"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Settings Form Card */}
      <div className="mt-4">
        <form onSubmit={handleSave} className="bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden flex flex-col min-h-[400px]">
          
          {/* Header of Active Tab */}
          <div className="px-6 py-5 border-b border-zinc-200/80 bg-zinc-50/50 flex items-center gap-3">
            {activeTab === "profile" && <User className="text-zinc-500" size={18} />}
            {activeTab === "security" && <Lock className="text-zinc-500" size={18} />}
            <h2 className="font-semibold text-zinc-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>

          {/* Inner Content Area */}
          <div className="p-6 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* --- PROFILE TAB --- */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-zinc-100">
                      {/* Styled Avatar initials in black background */}
                      <div className="w-20 h-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold uppercase ring-4 ring-zinc-100 shadow-inner">
                        {profile.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                        <h3 className="text-md font-semibold text-zinc-900">{profile.name}</h3>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{profile.role}</p>
                        <p className="text-xs text-zinc-400">Avatar initials generated automatically.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Display Name</label>
                        <input 
                          type="text" 
                          value={profile.name} 
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-zinc-900 focus:outline-none transition-all" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Admin Email</label>
                        <input 
                          type="email" 
                          value={profile.email} 
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-zinc-900 focus:outline-none transition-all" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Phone Number</label>
                        <input 
                          type="text" 
                          value={profile.phone} 
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-zinc-900 focus:outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">System Role</label>
                        <input 
                          type="text" 
                          value={profile.role} 
                          disabled
                          className="w-full bg-zinc-100 border border-zinc-200 text-zinc-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- SECURITY TAB --- */}
                {activeTab === "security" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-start gap-3">
                      <Lock className="text-zinc-500 shrink-0 mt-0.5" size={16} />
                      <p className="text-xs text-zinc-500 leading-normal">
                        For security, please make sure your password is at least 8 characters long and contains letters, numbers, and symbols.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Current Password</label>
                        <div className="relative">
                          <input 
                            type={showCurrent ? "text" : "password"} 
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            placeholder="••••••••"
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

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">New Password</label>
                        <div className="relative">
                          <input 
                            type={showNew ? "text" : "password"} 
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            placeholder="••••••••"
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

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                        <div className="relative">
                          <input 
                            type={showConfirm ? "text" : "password"} 
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            placeholder="••••••••"
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
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Form Action Panel */}
          <div className="px-6 py-4 border-t border-zinc-200/80 bg-zinc-50/50 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
