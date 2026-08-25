"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}

interface SecuritySettingsFormProps {
  passwords: PasswordData;
  onPasswordsChange: (passwords: PasswordData) => void;
}

export default function SecuritySettingsForm({ passwords, onPasswordsChange }: SecuritySettingsFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field: keyof PasswordData, value: string) => {
    onPasswordsChange({
      ...passwords,
      [field]: value,
    });
  };

  return (
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
              onChange={(e) => handleChange("current", e.target.value)}
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
              onChange={(e) => handleChange("new", e.target.value)}
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
              onChange={(e) => handleChange("confirm", e.target.value)}
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
  );
}
