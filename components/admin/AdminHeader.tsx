"use client";

import React from "react";
import { Bell, Menu, User } from "lucide-react";


export function AdminHeader({ 
  setSidebarOpen 
}: { 
  setSidebarOpen: (val: boolean) => void 
}) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-zinc-200/80 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-md text-zinc-500 hover:bg-zinc-100 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        
        <div className="h-8 w-[1px] bg-zinc-200 hidden md:block" />
        
        <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 hover:bg-zinc-50 rounded-full transition-colors border border-transparent hover:border-zinc-200">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-zinc-700 leading-none">System Admin</span>
            <span className="text-xs text-zinc-500 mt-0.5">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
