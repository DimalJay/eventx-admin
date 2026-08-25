"use client";

import React from "react";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  phone: string;
}

interface ProfileSettingsFormProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
}

export default function ProfileSettingsForm({ profile, onProfileChange }: ProfileSettingsFormProps) {
  const handleChange = (field: keyof ProfileData, value: string) => {
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-zinc-100">
        {/* Styled Avatar initials in black background */}
        <div className="w-20 h-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold uppercase ring-4 ring-zinc-100 shadow-inner">
          {profile.name ? profile.name.split(" ").map(w => w[0]).join("") : "SA"}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-md font-semibold text-zinc-900">{profile.name}</h3>
          <p className="text-xs font-bold text-zinc-550 uppercase tracking-wider">{profile.role}</p>
          <p className="text-xs text-zinc-400">Avatar initials generated automatically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Display Name</label>
          <input 
            type="text" 
            value={profile.name} 
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-zinc-900 focus:outline-none transition-all" 
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Admin Email</label>
          <input 
            type="email" 
            value={profile.email} 
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-zinc-900 focus:outline-none transition-all" 
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Phone Number</label>
          <input 
            type="text" 
            value={profile.phone} 
            onChange={(e) => handleChange("phone", e.target.value)}
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
  );
}
