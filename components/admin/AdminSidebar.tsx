"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutRequest } from "@/service/authService";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  AlertOctagon,
  BarChart3,
  Settings,
  FileText,
  X,
  LogOut,
  Activity
} from "lucide-react";
import Logo from "@/components/widgets/Logo";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { logoutRequest } from "@/service/authService";

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "User Management", icon: Users, path: "/users" },
  { name: "Event Management", icon: CalendarDays, path: "/events" },
  { name: "Recent Activities", icon: Activity, path: "/activities" },
  { name: "Complaints & Reports", icon: AlertOctagon, path: "/reports" },
  { name: "Analytics & Reports", icon: BarChart3, path: "/analytics" },
  { name: "System Settings", icon: Settings, path: "/settings" },
];

export function AdminSidebar({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutRequest();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-zinc-950 to-zinc-900 text-white flex flex-col border-r border-zinc-900 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-900">
          <Link href="/" className="flex items-center gap-3 font-semibold text-lg tracking-tight">
            <Logo className="h-8 w-8" />
            <span>EventX <span className="text-zinc-400 font-medium text-sm">Admin</span></span>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5">
          <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Main Menu
          </div>
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path || (pathname?.startsWith(item.path) && item.path !== "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-250 group relative text-sm font-medium border border-transparent",
                  isActive
                    ? "bg-white/20 text-white border-white/10 backdrop-blur-md shadow-xs font-semibold"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} className={cn(
                  isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                )} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-zinc-900">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-zinc-400 hover:bg-red-950/30 hover:text-red-400 transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
