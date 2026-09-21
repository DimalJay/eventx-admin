"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AdminProfile {
  name: string;
  role: string;
  phone: string;
}

interface AdminProfileContextValue {
  profile: AdminProfile;
  updateProfile: (patch: Partial<AdminProfile>) => void;
}

const DEFAULT_PROFILE: AdminProfile = {
  name: "System Admin",
  role: "Super Admin",
  phone: "+94 77 123 4567",
};

const STORAGE_KEY = "adminProfile";

const AdminProfileContext = createContext<AdminProfileContextValue | null>(null);

export function AdminProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile>(() => {
    if (typeof window === "undefined") return DEFAULT_PROFILE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (patch: Partial<AdminProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  return (
    <AdminProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </AdminProfileContext.Provider>
  );
}

export function useAdminProfile() {
  const ctx = useContext(AdminProfileContext);
  if (!ctx) {
    throw new Error("useAdminProfile must be used within an AdminProfileProvider");
  }
  return ctx;
}