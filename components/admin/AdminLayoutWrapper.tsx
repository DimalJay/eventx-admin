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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn && !isLoginPage) {
      router.push("/login");
    }
  }, [pathname, isLoginPage, router]);

  const isLoggedIn = typeof window !== "undefined" ? localStorage.getItem("adminLoggedIn") : null;

  if (isLoginPage) {
    return (
      <div className="relative z-10 flex min-h-screen text-zinc-900 font-sans selection:bg-zinc-200">
        <main className="flex-1 min-w-0 flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
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
