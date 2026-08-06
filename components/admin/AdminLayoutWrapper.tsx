"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn && !isLoginPage) {
      router.replace("/login");
    } else if (isLoggedIn && isLoginPage) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [isLoginPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          <p className="text-zinc-400 text-sm">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <div className="relative z-10 flex min-h-screen text-zinc-900 font-sans selection:bg-zinc-200">
        <main className="flex-1 min-w-0 flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
