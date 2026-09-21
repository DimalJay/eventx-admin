"use client";

import React, { useState } from "react";
import { 
  User, 
  Lock, 
  Save, 
  Loader2 
} from "lucide-react";
import ProfileSettingsForm from "@/components/admin/ProfileSettingsForm";
import SecuritySettingsForm from "@/components/admin/SecuritySettingsForm";
import { updateAdminPasswordRequest } from "@/service/authService";
import { useAdminProfile } from "@/providers/AdminProfileProvider";
import { toast } from "sonner";

type TabType = "profile" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(false);

  // Profile State
  const { profile: adminProfile, updateProfile } = useAdminProfile();
  const [profile, setProfile] = useState({
    name: adminProfile.name,
    role: adminProfile.role,
    phone: adminProfile.phone
  });

  // Password State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (activeTab === "security") {
      if (passwords.new !== passwords.confirm) {
        toast.error("New passwords do not match!");
        setLoading(false);
        return;
      }
      try {
        const res = await updateAdminPasswordRequest({
          currentPassword: passwords.current,
          newPassword: passwords.new
        });
        
        if (res.success) {
          toast.success("Password updated successfully!");
          setPasswords({ current: "", new: "", confirm: "" });
        } else {
          toast.error(res.message || "Failed to update password.");
        }
      } catch (err) {
        toast.error(
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to update password."
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Simulate API request saving profile settings
      updateProfile({ name: profile.name, role: profile.role, phone: profile.phone });
      setTimeout(() => {
        setLoading(false);
        toast.success("Profile settings updated successfully!");
      }, 1200);
    }
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
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="border-b border-zinc-200 flex gap-6 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-selected={isActive}
              className="tab-item flex items-center gap-2 pb-3 text-sm font-semibold border-zinc-950 cursor-pointer transition-all duration-200 relative"
            >
              <Icon size={16} className={isActive ? "text-black" : "text-zinc-400"} />
              {tab.label}
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-950"
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
            <div className="space-y-6">
              {/* --- PROFILE TAB --- */}
              {activeTab === "profile" && (
                <ProfileSettingsForm 
                  profile={profile} 
                  onProfileChange={setProfile} 
                />
              )}

              {/* --- SECURITY TAB --- */}
              {activeTab === "security" && (
                <SecuritySettingsForm 
                  passwords={passwords} 
                  onPasswordsChange={setPasswords} 
                />
              )}
            </div>
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
